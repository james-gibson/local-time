#!/usr/bin/env python3
"""Read a downloaded YouTube caption track (json3) as timestamped lines.

Part of the `lore-video-transcription` skill. Stdlib only, Python 3.9+.

    ./read_captions.py <dir-or-.json3> [--info] [--words]
                       [--from MM:SS] [--to MM:SS] [--gaps]

A json3 caption track is a list of *events*, not sentences. Most events carry a
few words; some carry nothing (the engine's line breaks); `[Music]` and
`[Applause]` arrive as events of their own. This prints one line per non-empty
event with the cue start, which is the value a keyframe offset should use.

The start is where the engine began a phrase, not where a word begins: treat it
as a measurement with a residual of about a third of a second. Do not reflow
paragraphs and then read the paragraph's start as the timestamp of a sentence
inside it -- that moves the offset by several seconds.
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import sys


def pick(pattern: str, explicit: str | None) -> str | None:
    if explicit:
        return explicit if os.path.exists(explicit) else None
    hits = sorted(glob.glob(pattern))
    return hits[0] if hits else None


def parse_offset(value: str) -> float:
    parts = value.split(":")
    total = 0.0
    for part in parts:
        total = total * 60 + float(part)
    return total


def fmt(seconds: float) -> str:
    return f"{int(seconds // 60)}:{seconds % 60:04.1f}"


def events(path: str) -> list[tuple[float, str]]:
    with open(path, encoding="utf-8") as handle:
        payload = json.load(handle)
    out: list[tuple[float, str]] = []
    for event in payload.get("events", []):
        segments = event.get("segs") or []
        text = "".join(seg.get("utf8", "") for seg in segments).strip()
        if text:
            out.append((event.get("tStartMs", 0) / 1000.0, text))
    return out


def print_info(path: str) -> None:
    with open(path, encoding="utf-8") as handle:
        info = json.load(handle)
    fields = [
        ("id", info.get("id")),
        ("title", info.get("title")),
        ("channel", info.get("channel")),
        ("handle", info.get("uploader_id")),
        ("uploadDate (UTC)", info.get("upload_date")),
        ("publish epoch", info.get("timestamp")),
        ("duration (videoDetails)", info.get("duration")),
        ("views", info.get("view_count")),
        ("likes", info.get("like_count")),
    ]
    for label, value in fields:
        print(f"{label:<24}{value}")
    chapters = info.get("chapters") or []
    if chapters:
        print("\nchapters (start -> end, seconds)")
        for chapter in chapters:
            print(f"  {chapter['start_time']:>6} -> {chapter['end_time']:>6}  {chapter['title']}")
    print()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", help="a .json3 file, or a directory holding one")
    parser.add_argument("--info", action="store_true", help="summarise the info.json beside the track")
    parser.add_argument("--info-json", dest="info_json", help="explicit info.json path")
    parser.add_argument("--words", action="store_true", help="print the word count instead of the lines")
    parser.add_argument("--from", dest="start", help="start offset, MM:SS")
    parser.add_argument("--to", dest="end", help="end offset, MM:SS")
    parser.add_argument("--gaps", action="store_true", help="list gaps longer than 3 s")
    args = parser.parse_args()

    track = args.path if os.path.isfile(args.path) else pick(os.path.join(args.path, "*.json3"), None)
    if not track:
        print(f"no .json3 caption track under {args.path}", file=sys.stderr)
        return 2

    if args.info or args.words:
        info = args.info_json or pick("*.info.json", None)
        if not info:
            info = pick(os.path.join(os.path.dirname(track), "*.info.json"), None)
        if info:
            print_info(info)
        else:
            print("(no info.json found -- metadata not summarised)\n", file=sys.stderr)

    lines = events(track)
    if args.words:
        words = sum(len(text.split()) for _, text in lines)
        print(f"track    {track}")
        print(f"events   {len(lines)} carrying text")
        print(f"words    {words}")
        print(f"first    {fmt(lines[0][0])}")
        print(f"last cue {fmt(lines[-1][0])}")
        return 0

    lo = parse_offset(args.start) if args.start else 0.0
    hi = parse_offset(args.end) if args.end else float("inf")
    previous = None
    for start, text in lines:
        if args.gaps:
            if previous is not None and start - previous > 3.0:
                print(f"{fmt(previous + 0.1)} -> {fmt(start)}  gap {start - previous:.1f}s")
            previous = start
            continue
        if lo <= start <= hi:
            print(f"{fmt(start)}\t{text}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
