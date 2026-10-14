import { CommonUniverseIds } from './common-universe-ids';
import { createUniverseId } from './universe-ids';

/**
 * james-gibson/local-time#106.
 *
 * `CommonUniverseIds` exposed a containment API (`contains`, `getChildren`,
 * `getAllDescendants`, `getParentChain`) but the registry behind it was closed:
 * `initializeHierarchies` is a private static block of hard-coded roots and
 * `addHierarchy` was private, so a universe could declare
 * `connections.natural.parentUniverses` and still not be a descendant of it.
 * Worse, even the hard-coded graph disagreed with itself: `NASA_OPERATIONS`
 * declares `parent: US_GOVERNMENT`, but `US_GOVERNMENT` had no entry of its own,
 * so `getChildren(US_GOVERNMENT)` was empty while
 * `contains(US_GOVERNMENT, NASA_OPERATIONS)` was true.
 *
 * These pin both halves of the fix: the asymmetry is closed, and
 * `registerUniverseLinks` (the public injection point the registry calls) really
 * does make a declared child a descendant.
 */

const asId = (value: string) => createUniverseId(value);

describe('CommonUniverseIds containment (james-gibson/local-time#106)', () => {
  test('parent and child queries agree about the same edge', () => {
    expect(
      CommonUniverseIds.contains(
        CommonUniverseIds.US_GOVERNMENT,
        CommonUniverseIds.NASA_OPERATIONS,
      ),
    ).toBe(true);
    expect(
      CommonUniverseIds.getChildren(CommonUniverseIds.US_GOVERNMENT).has(
        CommonUniverseIds.NASA_OPERATIONS,
      ),
    ).toBe(true);
  });

  test('an explicitly declared child is a descendant of its container', () => {
    const descendants = CommonUniverseIds.getAllDescendants(CommonUniverseIds.US_GOVERNMENT);
    expect(descendants.has(CommonUniverseIds.NASA_OPERATIONS)).toBe(true);
    // ...and its own child is transitive.
    expect(descendants.has(CommonUniverseIds.APOLLO_PROGRAM)).toBe(true);
  });

  test('registerUniverseLinks extends the graph from outside the module', () => {
    const container = asId('history:test_container:2025');
    const child = asId('history:test_container_child:2025');
    const grandchild = asId('history:test_container_grandchild:2025');

    CommonUniverseIds.registerUniverseLinks(child, [container]);
    CommonUniverseIds.registerUniverseLinks(grandchild, [child]);

    expect(CommonUniverseIds.contains(container, child)).toBe(true);
    expect(CommonUniverseIds.getChildren(container).has(child)).toBe(true);

    const descendants = CommonUniverseIds.getAllDescendants(container);
    expect(descendants.has(child)).toBe(true);
    expect(descendants.has(grandchild)).toBe(true);
  });

  test('is idempotent — re-registering the same edge does not duplicate it', () => {
    const container = asId('history:test_idem:2025');
    const child = asId('history:test_idem_child:2025');

    CommonUniverseIds.registerUniverseLinks(child, [container]);
    CommonUniverseIds.registerUniverseLinks(child, [container]);

    expect(CommonUniverseIds.getChildren(container).size).toBe(1);
  });

  test('a multi-parent child appears under every declared parent', () => {
    const container = asId('history:test_multi:2025');
    const docket = asId('history:test_multi_docket:2025');
    const child = asId('history:test_multi_child:2025');

    CommonUniverseIds.registerUniverseLinks(docket, [container]);
    CommonUniverseIds.registerUniverseLinks(child, [container, docket]);

    expect(CommonUniverseIds.getChildren(container).has(child)).toBe(true);
    expect(CommonUniverseIds.getChildren(docket).has(child)).toBe(true);
    expect(CommonUniverseIds.contains(docket, child)).toBe(true);
    expect(CommonUniverseIds.contains(container, child)).toBe(true);
  });
});
