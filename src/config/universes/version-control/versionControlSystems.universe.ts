import { Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * Version control systems — james-gibson/local-time#7.
 *
 * A documentary collection modelling the major advances in source control,
 * from the first file-based revision systems to the distributed systems that
 * dominate modern software development. Each system is a `TECHNOLOGY` universe
 * with the canonical `technology:<slug>:<year>` id (matching the technology
 * universes in `historical/stem.ts`), so they resolve through the registry's
 * `ANY_YEAR_TERMINATED` id pattern.
 *
 * The systems form a single inheritance chain plus a distributed fork:
 *
 *   SCCS (1972) ──inspired──▶ RCS (1982) ──extended by──▶ CVS (1986)
 *                                                          │ superseded by
 *                                                          ▼
 *                                                    Subversion (2000)
 *
 *   BitKeeper (2000) ──withdrawn licence 2005──▶ Git      (2005)
 *                                              ▶ Mercurial(2005)
 *
 * Connection reference vocabulary (informational; stored under `connections`,
 * which is not yet a first-class `Universe` field — hence the cast):
 * - `INSPIRED_BY`            design influenced by an earlier system.
 * - `EXTENDS`                built directly on top of another system.
 * - `SUPERSEDES`             intended as a replacement for another system.
 * - `CREATED_IN_RESPONSE_TO` created because of an event or another system.
 * - `CONTEMPORARY_OF`        developed alongside another system.
 *
 * Reality relation: `documentary`, 0.0 fictionalization (all real software,
 * real people, and verifiable release milestones).
 *
 * Research sources (per system, below):
 * - Walter F. Tichy, "RCS — A System for Version Control" (1985)
 * - M. J. Rochkind, "The Source Code Control System" (IEEE TSE, 1975)
 * - Brian Berliner, "CVS II: Parallelizing Software Development" (USENIX, 1990)
 * - "Version Control with Subversion" (Fogel & Collins-Sussman, O'Reilly)
 * - LWN.net, "The kernel and BitKeeper part ways" (April 2005)
 * - Git project history (git-scm.com) and the Linux kernel mailing list
 * - Mercurial release notes (mercurial-scm.org)
 *
 * Hierarchical Context: VERSION_CONTROL -> SOFTWARE_ENGINEERING -> WORLD_HISTORY
 */

/** Milliseconds since epoch -> nanoseconds (bigint), matching the rest of the tree. */
const fromIso = (iso: string): bigint => BigInt(new Date(iso).getTime()) * 1_000_000n;

/**
 * Parent/context universes that apply to every version-control system. Uses the
 * real `CommonUniverseIds` members (now that local-time#11 is fixed) rather than
 * the literal shim the `us-history` collection still carries.
 */
const VCS_CONTEXT = [
  CommonUniverseIds.VERSION_CONTROL,
  CommonUniverseIds.SOFTWARE_ENGINEERING,
  CommonUniverseIds.WORLD_HISTORY,
];

/**
 * SCCS — Source Code Control System (1972).
 *
 * The first widely used version-control system, developed by Marc Rochkind at
 * Bell Labs. Introduced the concepts of storing a file's revision history,
 * reconstructing arbitrary revisions, and locking a file while it is edited.
 *
 * Cultural Significance: 0.7 — proved that automated source control was
 * practical and defined the vocabulary (check-out/check-in, revisions) the
 * whole field inherited.
 *
 * Reality Relation: documents, 0.0 fictionalization.
 *
 * Research Sources:
 * - M. J. Rochkind, "The Source Code Control System", IEEE TSE (1975)
 * - Wikipedia, "Source Code Control System"
 * - IEEE Annals of the History of Computing
 *
 * Hierarchical Context: VERSION_CONTROL -> SOFTWARE_ENGINEERING -> WORLD_HISTORY
 */
export const sccsUniverse: Universe = {
  universeId: 'technology:sccs:1972',
  type: UniverseType.TECHNOLOGY,
  identifiers: {
    primary: 'tech:vcs:sccs:1972',
    aliases: ['SCCS', 'Source Code Control System'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'technology:sccs:1972',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'M. J. Rochkind, "The Source Code Control System", IEEE Transactions on Software Engineering, 1975',
          'Bell Telephone Laboratories technical records',
        ],
      },
    ],
  },
  attribution: {
    public_domain: false,
    copyright: {
      holders: ['AT&T / Bell Telephone Laboratories (historical)'],
      year: 1972,
      status: 'expired',
    },
    sources: ['IEEE Annals of the History of Computing', 'Bell Labs records'],
    citations_required: true,
    usage_restrictions: ['Originally proprietary to AT&T; later shipped with commercial UNIX.'],
  },
  layers: [{ layerId: 'primary', type: 'primary', epochs: {} }],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'invention_at_bell_labs',
        start: fromIso('1972-01-01T00:00:00Z'),
        end: fromIso('1977-02-17T23:59:59Z'),
        type: 'phase',
        description:
          'Development of the first version-control system at Bell Labs, initially in SNOBOL4 for an IBM System/370 and then rewritten in C for UNIX.',
      },
      {
        id: 'public_release_and_adoption',
        start: fromIso('1977-02-18T00:00:00Z'),
        end: fromIso('1985-12-31T23:59:59Z'),
        type: 'phase',
        description:
          'Public release of SCCS version 4 and its spread as part of AT&T UNIX System III and System V.',
      },
    ],
    keyframes: [
      {
        id: 'developed_at_bell_labs',
        timestamp: fromIso('1972-01-01T00:00:00Z'),
        significance: 0.95,
        tags: ['origin', 'bell_labs', 'invention'],
        certainty: 0.7,
        description:
          'Marc Rochkind develops the first version of SCCS at Bell Labs for an IBM System/370.',
      },
      {
        id: 'sccs_v4_public_release',
        timestamp: fromIso('1977-02-18T00:00:00Z'),
        significance: 0.85,
        tags: ['release', 'publication'],
        certainty: 1.0,
        description: 'The first publicly released version, SCCS 4, ships with AT&T UNIX.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Source Code Control System (SCCS)',
    description:
      'The first widely used version-control system, developed at Bell Labs to track changes to source files.',
    creators: ['Marc J. Rochkind'],
    released: new Date('1972-01-01'),
    cultural_significance: 0.7,
    tags: ['version_control', 'software_engineering', 'bell_labs', '1970s', 'proprietary'],
    vcsArchitecture: 'centralized',
    license: 'Proprietary (AT&T)',
    keyFeatures: ['Single-file revision storage', 'Delta compression', 'File locking', 'Change history'],
    significance:
      'Introduced automated source-code version control and the check-out/check-in vocabulary the rest of the field inherited.',
  },
  connections: {
    natural: { parentUniverses: VCS_CONTEXT },
  },
} as unknown as Universe;

/**
 * RCS — Revision Control System (1982).
 *
 * Walter Tichy's simpler, faster successor to SCCS, first released at Purdue
 * University. RCS popularised reverse deltas (storing the latest revision in
 * full and reconstructing older ones) and a clean, scriptable command set, and
 * became one of the most widely deployed tools on Unix systems.
 *
 * Cultural Significance: 0.8 — the practical workhorse of 1980s–1990s Unix
 * development and the storage engine that CVS was later built on.
 *
 * Reality Relation: documents, 0.0 fictionalization.
 *
 * Research Sources:
 * - Walter F. Tichy, "RCS — A System for Version Control", Software: Practice
 *   and Experience (1985)
 * - Wikipedia, "Revision Control System"
 *
 * Hierarchical Context: VERSION_CONTROL -> SOFTWARE_ENGINEERING -> WORLD_HISTORY
 */
export const rcsUniverse: Universe = {
  universeId: 'technology:rcs:1982',
  type: UniverseType.TECHNOLOGY,
  identifiers: {
    primary: 'tech:vcs:rcs:1982',
    aliases: ['RCS', 'Revision Control System', 'GNU RCS'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'technology:rcs:1982',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'W. F. Tichy, "RCS — A System for Version Control", 1985',
          'Purdue University Department of Computer Science records',
        ],
      },
    ],
  },
  attribution: {
    public_domain: false,
    sources: ['GNU Project', 'Purdue University'],
    citations_required: false,
    usage_restrictions: ['Distributed as free software; RCS is a GNU package.'],
  },
  layers: [{ layerId: 'primary', type: 'primary', epochs: {} }],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'development_at_purdue',
        start: fromIso('1980-01-01T00:00:00Z'),
        end: fromIso('1981-12-31T23:59:59Z'),
        type: 'phase',
        description: 'Design and implementation of RCS by Walter Tichy at Purdue University.',
      },
      {
        id: 'unix_adoption',
        start: fromIso('1982-01-01T00:00:00Z'),
        end: fromIso('1995-12-31T23:59:59Z'),
        type: 'phase',
        description:
          'RCS spreads across Unix systems and is adopted as a GNU package, becoming the default revision tool for a generation of developers.',
      },
    ],
    keyframes: [
      {
        id: 'first_release',
        timestamp: fromIso('1982-01-01T00:00:00Z'),
        significance: 0.95,
        tags: ['origin', 'release', 'purdue'],
        certainty: 0.8,
        description:
          'Walter Tichy releases the first version of RCS at Purdue University.',
      },
      {
        id: 'adopted_by_gnu_project',
        timestamp: fromIso('1985-01-01T00:00:00Z'),
        significance: 0.7,
        tags: ['adoption', 'gnu'],
        certainty: 0.6,
        description: 'RCS enters wide distribution through the GNU Project.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Revision Control System (RCS)',
    description:
      'A simpler, faster successor to SCCS that became the standard revision-control tool on Unix systems.',
    creators: ['Walter F. Tichy'],
    released: new Date('1982-01-01'),
    cultural_significance: 0.8,
    tags: ['version_control', 'software_engineering', 'purdue', 'gnu', '1980s'],
    vcsArchitecture: 'centralized',
    license: 'Free software (GNU package)',
    keyFeatures: ['Reverse deltas', 'File locking with optional merging', 'Scriptable command line', 'Per-file history'],
    significance:
      'The practical workhorse of Unix development and the storage engine that CVS was built on.',
  },
  connections: {
    natural: { parentUniverses: VCS_CONTEXT },
    references: [
      {
        type: 'INSPIRED_BY',
        targetUniverseId: 'technology:sccs:1972',
        description:
          "Tichy designed RCS as a cleaner, faster alternative to SCCS's locked-file model.",
        confidence: 1.0,
        evidence: ['W. F. Tichy, "RCS — A System for Version Control", 1985'],
      },
    ],
  },
} as unknown as Universe;

/**
 * CVS — Concurrent Versions System (1986).
 *
 * Begun by Dick Grune as a set of shell scripts layered over RCS, then rewritten
 * in C by Brian Berliner (1989) and released as CVS 1.0 in 1990. CVS added the
 * features that defined the next era: a shared client/server repository,
 * multi-file commits, and concurrent editing with merge-on-commit.
 *
 * Cultural Significance: 0.9 — the dominant version-control system of the open
 * source boom, used by GNU, FreeBSD, SourceForge and countless projects.
 *
 * Reality Relation: documents, 0.0 fictionalization.
 *
 * Research Sources:
 * - Brian Berliner, "CVS II: Parallelizing Software Development", USENIX (1990)
 * - Dick Grune's account of the original CVS (dickgrune.com)
 * - Wikipedia, "Concurrent Versions System"
 *
 * Hierarchical Context: VERSION_CONTROL -> SOFTWARE_ENGINEERING -> WORLD_HISTORY
 */
export const cvsUniverse: Universe = {
  universeId: 'technology:cvs:1986',
  type: UniverseType.TECHNOLOGY,
  identifiers: {
    primary: 'tech:vcs:cvs:1986',
    aliases: ['CVS', 'Concurrent Versions System'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'technology:cvs:1986',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Brian Berliner, "CVS II: Parallelizing Software Development", 1990',
          'Comp.sources.unix posting of the original CVS kit',
        ],
      },
    ],
  },
  attribution: {
    public_domain: false,
    sources: ['GNU Project', 'Free Software Foundation'],
    citations_required: false,
    usage_restrictions: ['Distributed under the GNU General Public License.'],
  },
  layers: [{ layerId: 'primary', type: 'primary', epochs: {} }],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'grune_shell_scripts',
        start: fromIso('1986-01-01T00:00:00Z'),
        end: fromIso('1989-03-31T23:59:59Z'),
        type: 'phase',
        description:
          'Dick Grune maintains the original CVS as a collection of shell scripts layered over RCS.',
      },
      {
        id: 'berliner_rewrite',
        start: fromIso('1989-04-01T00:00:00Z'),
        end: fromIso('1990-11-18T23:59:59Z'),
        type: 'phase',
        description:
          'Brian Berliner rewrites CVS in C, adding a client/server repository and concurrent editing.',
      },
      {
        id: 'open_source_dominance',
        start: fromIso('1990-11-19T00:00:00Z'),
        end: fromIso('2000-01-01T23:59:59Z'),
        type: 'phase',
        description:
          'CVS becomes the de facto standard for open-source projects until Subversion begins to displace it.',
      },
    ],
    keyframes: [
      {
        id: 'grune_publishes_cvs',
        timestamp: fromIso('1986-07-01T00:00:00Z'),
        significance: 0.8,
        tags: ['origin', 'shell_scripts'],
        certainty: 0.8,
        description: 'Dick Grune publishes the original shell-script CVS layered over RCS.',
      },
      {
        id: 'berliner_c_rewrite',
        timestamp: fromIso('1989-04-01T00:00:00Z'),
        significance: 0.9,
        tags: ['rewrite', 'concurrency'],
        certainty: 0.8,
        description: 'Brian Berliner designs and codes CVS in C.',
      },
      {
        id: 'cvs_1_0',
        timestamp: fromIso('1990-11-19T00:00:00Z'),
        significance: 0.95,
        tags: ['release', 'milestone'],
        certainty: 1.0,
        description: 'CVS 1.0 is submitted to the Free Software Foundation.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Concurrent Versions System (CVS)',
    description:
      'The first widely adopted version-control system for distributed teams, adding a shared repository and concurrent editing over RCS.',
    creators: ['Dick Grune', 'Brian Berliner', 'Jeff Polk'],
    released: new Date('1986-01-01'),
    cultural_significance: 0.9,
    tags: ['version_control', 'software_engineering', 'gnu', 'open_source', '1990s'],
    vcsArchitecture: 'centralized',
    license: 'GNU General Public License',
    keyFeatures: ['Client/server repository', 'Multi-file commits', 'Concurrent editing with merges', 'Revision tags and branches'],
    significance:
      'The dominant version-control system of the open-source boom and the model Subversion set out to improve on.',
  },
  connections: {
    natural: { parentUniverses: VCS_CONTEXT },
    references: [
      {
        type: 'EXTENDS',
        targetUniverseId: 'technology:rcs:1982',
        description:
          'CVS began as a front end to RCS, adding a shared repository and concurrent editing on top of RCS\'s per-file storage.',
        confidence: 1.0,
        evidence: ['Brian Berliner, "CVS II", 1990', "Dick Grune's account of the original CVS"],
      },
    ],
  },
} as unknown as Universe;

/**
 * Subversion — SVN (2000).
 *
 * Started by CollabNet in 2000 as an explicit effort to fix CVS's shortcomings,
 * with Karl Fogel, Jim Blandy and Ben Collins-Sussman among the original
 * developers. Subversion 1.0 shipped in 2004 with atomic commits, versioned
 * directories and copy-based branching, and by the late 2000s had largely
 * displaced CVS.
 *
 * Cultural Significance: 0.9 — the bridge between file-based systems and modern
 * version control, and the default for many enterprises and foundations.
 *
 * Reality Relation: documents, 0.0 fictionalization.
 *
 * Research Sources:
 * - "Version Control with Subversion" (Fogel & Collins-Sussman, O'Reilly)
 * - Apache Subversion release history (subversion.apache.org)
 * - Wikipedia, "Apache Subversion"
 *
 * Hierarchical Context: VERSION_CONTROL -> SOFTWARE_ENGINEERING -> WORLD_HISTORY
 */
export const subversionUniverse: Universe = {
  universeId: 'technology:subversion:2000',
  type: UniverseType.TECHNOLOGY,
  identifiers: {
    primary: 'tech:vcs:subversion:2000',
    aliases: ['Subversion', 'SVN', 'Apache Subversion'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'technology:subversion:2000',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Apache Subversion release history: 1.0.0 released 2004-02-23',
          '"Version Control with Subversion" (O\'Reilly)',
        ],
      },
    ],
  },
  attribution: {
    public_domain: false,
    sources: ['Apache Software Foundation', 'CollabNet'],
    citations_required: false,
    usage_restrictions: ['Distributed under the Apache License 2.0.'],
  },
  layers: [{ layerId: 'primary', type: 'primary', epochs: {} }],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'project_inception',
        start: fromIso('2000-01-01T00:00:00Z'),
        end: fromIso('2004-02-22T23:59:59Z'),
        type: 'phase',
        description:
          'CollabNet funds the design and development of a CVS replacement; the project hosts its own source by 2001.',
      },
      {
        id: 'release_and_adoption',
        start: fromIso('2004-02-23T00:00:00Z'),
        end: fromIso('2010-12-31T23:59:59Z'),
        type: 'phase',
        description:
          'Subversion 1.0 ships, and the project displaces CVS across open-source and enterprise environments before distributed systems take over.',
      },
    ],
    keyframes: [
      {
        id: 'project_founded_at_collabnet',
        timestamp: fromIso('2000-01-01T00:00:00Z'),
        significance: 0.7,
        tags: ['origin', 'collabnet'],
        certainty: 0.6,
        description: 'CollabNet begins development of a CVS successor.',
      },
      {
        id: 'self_hosting',
        timestamp: fromIso('2001-01-01T00:00:00Z'),
        significance: 0.7,
        tags: ['milestone', 'self_hosting'],
        certainty: 0.7,
        description: 'Subversion becomes mature enough to host its own source code.',
      },
      {
        id: 'subversion_1_0',
        timestamp: fromIso('2004-02-23T00:00:00Z'),
        significance: 1.0,
        tags: ['release', 'milestone'],
        certainty: 1.0,
        description: 'Subversion 1.0 is released.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Apache Subversion (SVN)',
    description:
      'A centralized version-control system created as a more capable CVS, offering atomic commits and versioned directories.',
    creators: ['Karl Fogel', 'Jim Blandy', 'Ben Collins-Sussman', 'CollabNet'],
    released: new Date('2000-01-01'),
    cultural_significance: 0.9,
    tags: ['version_control', 'software_engineering', 'apache', 'collabnet', '2000s'],
    vcsArchitecture: 'centralized',
    license: 'Apache License 2.0',
    keyFeatures: ['Atomic commits', 'Versioned directories', 'Copy-based branching and tagging', 'CVS-compatible workflow'],
    significance:
      'The bridge from file-based systems to modern version control, and the default for many enterprises and foundations in the 2000s.',
  },
  connections: {
    natural: { parentUniverses: VCS_CONTEXT },
    references: [
      {
        type: 'SUPERSEDES',
        targetUniverseId: 'technology:cvs:1986',
        description:
          'Subversion was designed from the outset as a better CVS, fixing its non-atomic commits and lack of directory versioning.',
        confidence: 1.0,
        evidence: ['Apache Subversion project history', '"Version Control with Subversion"'],
      },
    ],
  },
} as unknown as Universe;

/**
 * BitKeeper (2000).
 *
 * Larry McVoy's BitMover shipped BitKeeper as a commercial distributed version
 * control system. From 2002 the Linux kernel used it under a free-of-charge
 * community licence — until BitMover withdrew that licence in April 2005,
 * triggering the creation of Git.
 *
 * Cultural Significance: 0.8 — the first distributed VCS to manage a
 * project as large as the Linux kernel, and the direct cause of Git.
 *
 * Reality Relation: documents, 0.0 fictionalization.
 *
 * Research Sources:
 * - LWN.net, "The kernel and BitKeeper part ways" (April 2005)
 * - Wikipedia, "BitKeeper"
 * - BitMover company history
 *
 * Hierarchical Context: VERSION_CONTROL -> SOFTWARE_ENGINEERING -> WORLD_HISTORY
 */
export const bitKeeperUniverse: Universe = {
  universeId: 'technology:bitkeeper:2000',
  type: UniverseType.TECHNOLOGY,
  identifiers: {
    primary: 'tech:vcs:bitkeeper:2000',
    aliases: ['BitKeeper', 'BitMover BitKeeper'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'technology:bitkeeper:2000',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'LWN.net, "The kernel and BitKeeper part ways", 2005',
          'Linux kernel mailing list, February 2002 and April 2005',
        ],
      },
    ],
  },
  attribution: {
    public_domain: false,
    copyright: {
      holders: ['BitMover, Inc.'],
      year: 2000,
      status: 'active',
    },
    sources: ['BitMover', 'LWN.net'],
    citations_required: true,
    usage_restrictions: [
      'Commercial product; a free community edition was later released and parts were open-sourced in 2016.',
    ],
  },
  layers: [{ layerId: 'primary', type: 'primary', epochs: {} }],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'commercial_development',
        start: fromIso('2000-01-01T00:00:00Z'),
        end: fromIso('2002-01-31T23:59:59Z'),
        type: 'phase',
        description: 'BitMover develops and markets BitKeeper as a distributed version-control system.',
      },
      {
        id: 'linux_kernel_era',
        start: fromIso('2002-02-01T00:00:00Z'),
        end: fromIso('2005-04-04T23:59:59Z'),
        type: 'phase',
        description:
          'The Linux kernel is developed using BitKeeper under a free community licence.',
      },
      {
        id: 'licence_withdrawal',
        start: fromIso('2005-04-05T00:00:00Z'),
        end: fromIso('2005-12-31T23:59:59Z'),
        type: 'phase',
        description:
          'BitMover withdraws the free licence; the kernel migrates to Git, and BitKeeper retreats to a commercial niche.',
      },
    ],
    keyframes: [
      {
        id: 'bitkeeper_released',
        timestamp: fromIso('2000-01-01T00:00:00Z'),
        significance: 0.7,
        tags: ['origin', 'release'],
        certainty: 0.6,
        description: 'Larry McVoy and BitMover release BitKeeper.',
      },
      {
        id: 'linux_kernel_adoption',
        timestamp: fromIso('2002-02-01T00:00:00Z'),
        significance: 0.85,
        tags: ['adoption', 'linux_kernel'],
        certainty: 0.8,
        description: 'The Linux kernel project begins using BitKeeper.',
      },
      {
        id: 'free_licence_withdrawn',
        timestamp: fromIso('2005-04-05T00:00:00Z'),
        significance: 0.9,
        tags: ['licensing', 'linux_kernel', 'turning_point'],
        certainty: 0.9,
        description:
          'BitMover announces it will stop providing BitKeeper free of charge to the community, prompting the creation of Git.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'BitKeeper',
    description:
      'A commercial distributed version-control system used by the Linux kernel from 2002 until its free community licence was withdrawn in 2005.',
    creators: ['Larry McVoy', 'BitMover, Inc.'],
    released: new Date('2000-01-01'),
    cultural_significance: 0.8,
    tags: ['version_control', 'software_engineering', 'distributed', 'linux_kernel', 'proprietary'],
    vcsArchitecture: 'distributed',
    license: 'Proprietary (free community edition)',
    keyFeatures: ['Distributed repositories', 'Change sets', 'Efficient handling of very large trees'],
    significance:
      'The first distributed VCS to manage a project as large as the Linux kernel, and the direct cause of Git.',
    notableUse: ['Linux kernel (2002–2005)'],
  },
  connections: {
    natural: { parentUniverses: VCS_CONTEXT },
    references: [
      {
        type: 'CONTEMPORARY_OF',
        targetUniverseId: 'technology:subversion:2000',
        description:
          'BitKeeper and Subversion launched the same year, representing the split between distributed and centralized architectures.',
        confidence: 0.9,
        evidence: ['BitMover history', 'Apache Subversion project history'],
      },
    ],
  },
} as unknown as Universe;

/**
 * Git (2005).
 *
 * Created by Linus Torvalds in April 2005, days after the Linux kernel lost
 * access to BitKeeper, and handed to Junio Hamano as maintainer that July. Git's
 * emphasis on speed, cheap local branching, a staging area, and a
 * content-addressable object store made it the standard for software
 * development worldwide, with GitHub and later platforms built on top of it.
 *
 * Cultural Significance: 1.0 — the most widely used version-control system in
 * the world and a foundational tool of modern software engineering.
 *
 * Reality Relation: documents, 0.0 fictionalization.
 *
 * Research Sources:
 * - Git project history (git-scm.com)
 * - Linus Torvalds, "Meet the new maintainer..", LKML (July 2005)
 * - GitLab, "Journey through Git's 20-year history"
 *
 * Hierarchical Context: VERSION_CONTROL -> SOFTWARE_ENGINEERING -> WORLD_HISTORY
 */
export const gitUniverse: Universe = {
  universeId: 'technology:git:2005',
  type: UniverseType.TECHNOLOGY,
  identifiers: {
    primary: 'tech:vcs:git:2005',
    aliases: ['Git', 'git'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'technology:git:2005',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Git commit e83c5163316, "Initial revision of git", 2005-04-07',
          'Linus Torvalds, "Meet the new maintainer..", LKML, July 2005',
        ],
      },
    ],
  },
  attribution: {
    public_domain: false,
    copyright: {
      holders: ['Linus Torvalds', 'Junio C Hamano', 'Git contributors'],
      year: 2005,
      status: 'active',
    },
    sources: ['git-scm.com', 'Linux kernel mailing list'],
    citations_required: false,
    usage_restrictions: ['Distributed under the GNU General Public License v2.0.'],
  },
  layers: [{ layerId: 'primary', type: 'primary', epochs: {} }],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'creation_by_torvalds',
        start: fromIso('2005-04-07T00:00:00Z'),
        end: fromIso('2005-07-25T23:59:59Z'),
        type: 'phase',
        description:
          'Linus Torvalds writes the first version of Git in days and quickly brings it to self-hosting.',
      },
      {
        id: 'maintainership_and_1_0',
        start: fromIso('2005-07-26T00:00:00Z'),
        end: fromIso('2005-12-21T23:59:59Z'),
        type: 'phase',
        description:
          'Junio Hamano takes over maintenance and Git reaches its 1.0 release.',
      },
      {
        id: 'industry_standard',
        start: fromIso('2005-12-22T00:00:00Z'),
        end: fromIso('2010-12-31T23:59:59Z'),
        type: 'phase',
        description:
          'Git becomes the default version-control system for open source and, through GitHub (2008), the broader software industry.',
      },
    ],
    keyframes: [
      {
        id: 'initial_commit',
        timestamp: fromIso('2005-04-07T00:00:00Z'),
        significance: 1.0,
        tags: ['origin', 'initial_commit'],
        certainty: 1.0,
        description: 'Linus Torvalds makes the first commit of Git.',
      },
      {
        id: 'maintainership_to_hamano',
        timestamp: fromIso('2005-07-26T00:00:00Z'),
        significance: 0.9,
        tags: ['maintainership', 'handover'],
        certainty: 0.9,
        description: 'Torvalds hands Git maintainership to Junio Hamano.',
      },
      {
        id: 'git_1_0',
        timestamp: fromIso('2005-12-21T00:00:00Z'),
        significance: 1.0,
        tags: ['release', 'milestone'],
        certainty: 1.0,
        description: 'Git 1.0 is released.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Git',
    description:
      'A distributed version-control system created for the Linux kernel, now the standard for software development worldwide.',
    creators: ['Linus Torvalds', 'Junio C Hamano'],
    released: new Date('2005-04-07'),
    cultural_significance: 1.0,
    tags: ['version_control', 'software_engineering', 'distributed', 'open_source', 'linux_kernel'],
    vcsArchitecture: 'distributed',
    license: 'GNU General Public License v2.0',
    keyFeatures: ['Distributed repositories', 'Content-addressable object store', 'Cheap local branching', 'Staging area (index)'],
    significance:
      'The most widely used version-control system in the world and a foundational tool of modern software engineering.',
    notableUse: ['Linux kernel', 'GitHub', 'virtually all modern software'],
  },
  connections: {
    natural: { parentUniverses: VCS_CONTEXT },
    references: [
      {
        type: 'CREATED_IN_RESPONSE_TO',
        targetUniverseId: 'technology:bitkeeper:2000',
        description:
          'Torvalds wrote Git within days of BitMover withdrawing the Linux kernel\'s free BitKeeper licence.',
        confidence: 1.0,
        evidence: ['LWN.net, "The kernel and BitKeeper part ways", 2005', 'Linux kernel mailing list, April 2005'],
      },
      {
        type: 'CONTEMPORARY_OF',
        targetUniverseId: 'technology:mercurial:2005',
        description:
          'Git and Mercurial were created independently within weeks of each other in response to the same event.',
        confidence: 0.9,
        evidence: ['Mercurial announcement, April 2005', 'Git initial commit, April 2005'],
      },
    ],
  },
} as unknown as Universe;

/**
 * Mercurial (2005).
 *
 * Announced by Matt Mackall on 19 April 2005, days after Git, and also prompted
 * by the loss of BitKeeper. Mercurial pursued the same distributed model as Git
 * but with a simpler, more uniform command interface and fewer sharp edges, and
 * was adopted by Mozilla, Facebook and others.
 *
 * Cultural Significance: 0.85 — Git's principal contemporary and the most
 * widely used alternative distributed version-control system.
 *
 * Reality Relation: documents, 0.0 fictionalization.
 *
 * Research Sources:
 * - Mercurial release notes (mercurial-scm.org)
 * - Matt Mackall's announcement to the Linux kernel mailing list (April 2005)
 * - "The Architecture of Open Source Applications", Mercurial chapter
 *
 * Hierarchical Context: VERSION_CONTROL -> SOFTWARE_ENGINEERING -> WORLD_HISTORY
 */
export const mercurialUniverse: Universe = {
  universeId: 'technology:mercurial:2005',
  type: UniverseType.TECHNOLOGY,
  identifiers: {
    primary: 'tech:vcs:mercurial:2005',
    aliases: ['Mercurial', 'hg'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'technology:mercurial:2005',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Matt Mackall, Mercurial announcement, 2005-04-19',
          'Mercurial 1.0 release notes, 2008-03-24',
        ],
      },
    ],
  },
  attribution: {
    public_domain: false,
    sources: ['Mercurial project', 'Software Freedom Conservancy'],
    citations_required: false,
    usage_restrictions: ['Distributed under the GNU General Public License v2.0.'],
  },
  layers: [{ layerId: 'primary', type: 'primary', epochs: {} }],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'creation_by_mackall',
        start: fromIso('2005-04-19T00:00:00Z'),
        end: fromIso('2008-03-23T23:59:59Z'),
        type: 'phase',
        description:
          'Matt Mackall designs and builds Mercurial, growing it from an initial announcement into a stable distributed VCS.',
      },
      {
        id: 'mature_alternative',
        start: fromIso('2008-03-24T00:00:00Z'),
        end: fromIso('2019-12-31T23:59:59Z'),
        type: 'phase',
        description:
          'Mercurial reaches 1.0 and becomes the leading alternative to Git, adopted by Mozilla and Facebook.',
      },
    ],
    keyframes: [
      {
        id: 'announced_by_mackall',
        timestamp: fromIso('2005-04-19T00:00:00Z'),
        significance: 0.9,
        tags: ['origin', 'announcement'],
        certainty: 1.0,
        description: 'Matt Mackall announces Mercurial on the Linux kernel mailing list.',
      },
      {
        id: 'mercurial_1_0',
        timestamp: fromIso('2008-03-24T00:00:00Z'),
        significance: 0.9,
        tags: ['release', 'milestone'],
        certainty: 1.0,
        description: 'Mercurial 1.0 is released.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Mercurial',
    description:
      'A distributed version-control system released shortly after Git, emphasising a simpler and more uniform interface.',
    creators: ['Matt Mackall'],
    released: new Date('2005-04-19'),
    cultural_significance: 0.85,
    tags: ['version_control', 'software_engineering', 'distributed', 'open_source', 'linux_kernel'],
    vcsArchitecture: 'distributed',
    license: 'GNU General Public License v2.0',
    keyFeatures: ['Distributed repositories', 'Revlog delta storage', 'Consistent command set', 'Extensible'],
    significance:
      'Git\'s principal contemporary and the most widely used alternative distributed version-control system.',
    notableUse: ['Mozilla', 'Facebook', 'Python'],
  },
  connections: {
    natural: { parentUniverses: VCS_CONTEXT },
    references: [
      {
        type: 'CREATED_IN_RESPONSE_TO',
        targetUniverseId: 'technology:bitkeeper:2000',
        description:
          'Mercurial was created within days of Git, also in response to the Linux kernel losing free access to BitKeeper.',
        confidence: 1.0,
        evidence: ['Matt Mackall, Mercurial announcement, April 2005', 'LWN.net coverage of BitKeeper, 2005'],
      },
      {
        type: 'CONTEMPORARY_OF',
        targetUniverseId: 'technology:git:2005',
        description: 'Mercurial and Git were developed concurrently in 2005 as rival distributed systems.',
        confidence: 0.9,
        evidence: ['Mercurial announcement, April 2005', 'Git initial commit, April 2005'],
      },
    ],
  },
} as unknown as Universe;
