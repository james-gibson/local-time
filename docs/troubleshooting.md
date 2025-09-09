# Local Time System Troubleshooting Guide

This guide helps resolve common issues when working with the Local Time System.

## Universe Creation Issues

### Invalid Universe ID Format

**Error**: `Invalid universe ID format: invalid_id`

**Cause**: Universe ID doesn't follow the required pattern.

**Solution**: Use branded type creation functions:

```typescript
// ❌ Wrong
const id = "mary_poppins_1964";

// ✅ Correct
import { createFilmUniverseId } from './core/universe-ids';
const id = createFilmUniverseId('disney', 'mary_poppins', 1964);
```

**Valid Patterns**:
- Films: `studio:title:year` (e.g., `disney:mary_poppins:1964`)
- History: `history:event:year` (e.g., `history:jfk_assassination:1963`)
- Books: `literature:author:title:year`
- Missions: `agency:mission:year` (e.g., `nasa:apollo11:1969`)

### Missing Attribution Information

**Error**: Universe registration fails silently or with attribution warnings.

**Cause**: Neither copyright information nor public domain flag is set.

**Solution**: Always include attribution:

```typescript
// For copyrighted works
attribution: {
  copyright: {
    holders: ["Walt Disney Productions"],
    year: 1964,
    status: 'active'
  },
  citations_required: true
}

// For public domain works
attribution: {
  public_domain: true,
  citations_required: false
}
```

### No Primary Temporal Layer

**Error**: Universe validation fails or temporal queries don't work.

**Cause**: All layers are marked as 'meta', 'recreation', or 'subjective'.

**Solution**: Ensure at least one layer is type 'primary':

```typescript
layers: [
  {
    layerId: "main_timeline",
    type: 'primary', // ✅ Required
    epochs: { /* ... */ }
  }
]
```

## Temporal Conversion Issues

### BigInt Date Calculation Errors

**Error**: Manual BigInt calculations produce incorrect timestamps.

**Cause**: Complex date arithmetic with timezone and precision issues.

**Solution**: Use temporal conversion utilities:

```typescript
// ❌ Error-prone manual calculation
const timestamp = BigInt(Date.UTC(1963, 10, 22, 12, 30, 0)) * 1000000n;

// ✅ Use utility function
import { dateToNanoseconds } from './utils/temporal-conversion';
const timestamp = dateToNanoseconds(1963, 11, 22, 12, 30, 0);
```

### Precision Mismatch

**Error**: Events don't align properly or queries return unexpected results.

**Cause**: Inconsistent precision across epochs and events.

**Solution**: Choose appropriate precision for content type:

```typescript
// Films - use millisecond precision
precision: TimePrecision.MILLISECOND

// Historical events - use second precision
precision: TimePrecision.SECOND

// Biographical periods - use day or year precision
precision: TimePrecision.DAY
```

### Epoch Time Range Issues

**Error**: Events fall outside epoch boundaries.

**Cause**: Keyframes or segments extend beyond epoch start/end times.

**Solution**: Ensure all events are within epoch bounds:

```typescript
const epoch = {
  startTime: dateToNanoseconds(1964, 1, 1),
  endTime: dateToNanoseconds(1964, 12, 31),
  precision: TimePrecision.DAY
};

// ✅ Keyframe within epoch
const keyframe = {
  timestamp: dateToNanoseconds(1964, 8, 27), // Within 1964
  // ...
};
```

## Registry and Loading Issues

### Universe Not Found

**Error**: `getUniverse()` returns `undefined` for valid ID.

**Cause**: Universe not registered or alias not set up.

**Solution**: Check registration and aliases:

```typescript
// Verify universe is registered
const registry = new UniverseRegistry(configLoader);
await registry.initialize();

// Check if universe exists
const universe = registry.getUniverse('disney:mary_poppins:1964');
if (!universe) {
  console.log('Universe not found - check registration');
}

// Try aliases
const byAlias = registry.getUniverse('mary_poppins');
```

### Import Resolution Errors

**Error**: Cannot resolve universe imports in `built-in-universes.ts`.

**Cause**: Missing universe definition files.

**Solution**: Create missing files or update imports:

```typescript
// Check that all imported files exist:
// - src/config/universes/films.ts
// - src/config/universes/apollo-eleven/missions.ts
// - src/config/universes/disney/networks.ts
// etc.

// Or comment out missing imports temporarily
```

### Circular Import Dependencies

**Error**: Module resolution fails with circular dependency warnings.

**Cause**: Universe files importing each other or registry.

**Solution**: Keep universe definitions independent:

```typescript
// ❌ Don't import registry in universe files
import { UniverseRegistry } from '../universe-registry';

// ✅ Keep universe files pure data
export const myUniverse: Universe = {
  // Pure universe definition
};
```

## Query and Search Issues

### Window Search Returns Empty Results

**Error**: `findUniversesInWindow()` returns empty array for valid window.

**Cause**: No temporal overlap or incorrect window definition.

**Solution**: Check window boundaries and universe epochs:

```typescript
// Verify window exists
const window = await windowSearch.getWindow('cal:1964');
console.log('Window:', window);

// Check universe temporal coverage
const universe = registry.getUniverse('disney:mary_poppins:1964');
console.log('Universe epochs:', universe?.epochs);

// Verify overlap
const hasOverlap = universe?.layers.some(layer => 
  Object.values(layer.epochs).some(epoch => {
    const start = epoch.startTime ?? epoch.start;
    const end = epoch.endTime ?? epoch.end;
    return start && end && start < window.endTime && end > window.startTime;
  })
);
```

### Zero-Reference Addressing Fails

**Error**: Cannot parse or generate zero-reference addresses.

**Cause**: Incorrect epoch configuration or addressing format.

**Solution**: Verify zero-reference epoch setup:

```typescript
// Ensure epoch is properly configured as ZeroReferenceEpoch
const zeroEpoch: ZeroReferenceEpoch = {
  epochId: "apollo11:launch",
  startTime: launchTime - (10n * 60n * 1000000000n), // T-10 minutes
  endTime: launchTime + (8n * 24n * 60n * 60n * 1000000000n), // T+8 days
  precision: TimePrecision.SECOND,
  zeroPoint: launchTime, // ✅ Critical: set zero point
  zeroEvent: "Liftoff",
  beforePrefix: "T-",
  afterPrefix: "T+",
  relativeFormat: 'HMS'
};
```

## Reference and Network Issues

### Reference Creation Fails

**Error**: Cannot create temporal references between universes.

**Cause**: Invalid universe IDs or missing anchor contexts.

**Solution**: Verify reference structure:

```typescript
import { generateReferenceId } from './utils/reference-helpers';

const reference: TemporalReference = {
  referenceId: generateReferenceId(),
  type: ReferenceType.VISUAL_HOMAGE,
  description: "Clear description of the reference",
  anchors: [
    {
      domainId: "disney:mary_poppins:1964", // ✅ Valid universe ID
      eventId: "umbrella_descent",
      context: {
        runtime_position: 87.25,
        scene_description: "Mary Poppins descends with umbrella"
      }
    }
    // Need at least 2 anchors for a reference
  ],
  metadata: {
    confidence: 0.9,
    cultural_context: ["visual_homage", "disney"]
  }
};
```

### Network Registration Issues

**Error**: Network universes not found or network appears empty.

**Cause**: Universe IDs in network don't match registered universes.

**Solution**: Verify universe IDs match exactly:

```typescript
const network: UniverseNetwork = {
  networkId: "disney",
  universes: new Set([
    "disney:mary_poppins:1964", // ✅ Must match exactly
    "disney:lion_king:1994"
  ]),
  eras: [/* ... */]
};

// Verify universes exist before adding to network
for (const universeId of network.universes) {
  const universe = registry.getUniverse(universeId);
  if (!universe) {
    console.warn(`Universe not found: ${universeId}`);
  }
}
```

## Performance Issues

### Slow Universe Loading

**Error**: Registry initialization takes too long.

**Cause**: Large number of universes or complex temporal structures.

**Solution**: Optimize loading strategy:

```typescript
// Use lazy loading for large universe sets
const registry = new UniverseRegistry(configLoader);

// Load only essential universes initially
await registry.loadCoreUniverses();

// Load additional universes on demand
await registry.loadUniverseSet('disney');
```

### Memory Usage with Large Temporal Structures

**Error**: High memory usage with detailed temporal structures.

**Cause**: Too many keyframes or overly precise timestamps.

**Solution**: Optimize temporal granularity:

```typescript
// ❌ Too many keyframes
keyframes: Array.from({length: 1000}, (_, i) => ({
  id: `frame_${i}`,
  timestamp: BigInt(i) * 1000000n,
  significance: 0.1
}))

// ✅ Focus on significant moments
keyframes: [
  {
    id: "opening",
    timestamp: 0n,
    significance: 0.8,
    tags: ["opening", "significant"]
  },
  {
    id: "climax", 
    timestamp: 115n * 60n * 1000000000n,
    significance: 1.0,
    tags: ["climax", "peak_moment"]
  }
]
```

## Testing and Validation

### Unit Test Failures

**Error**: Tests fail with temporal calculation mismatches.

**Cause**: Inconsistent date handling or timezone issues.

**Solution**: Use consistent temporal utilities in tests:

```typescript
import { dateToNanoseconds } from '../utils/temporal-conversion';

describe('Universe temporal structure', () => {
  test('keyframes are in correct order', () => {
    const universe = registry.getUniverse('test:universe:2023');
    const keyframes = universe?.temporalStructure?.keyframes || [];
    
    // Sort by timestamp for comparison
    const sorted = [...keyframes].sort((a, b) => 
      Number(a.timestamp - b.timestamp)
    );
    
    expect(keyframes).toEqual(sorted);
  });
});
```

### Integration Test Issues

**Error**: Cross-universe queries fail in tests.

**Cause**: Test universes not properly registered or isolated.

**Solution**: Set up proper test environment:

```typescript
describe('Cross-universe references', () => {
  let registry: UniverseRegistry;
  
  beforeEach(async () => {
    // Create isolated registry for tests
    registry = new UniverseRegistry(new TestConfigLoader());
    await registry.initialize();
    
    // Register test universes
    registry.registerUniverse('test:source:2023', sourceUniverse);
    registry.registerUniverse('test:target:2023', targetUniverse);
  });
  
  afterEach(() => {
    // Clean up
    registry.clear();
  });
});
```

## Getting Help

### Debug Information

When reporting issues, include:

1. **Universe Definition**: The complete universe object
2. **Error Messages**: Full error text and stack traces
3. **Environment**: Node.js version, package versions
4. **Reproduction Steps**: Minimal code to reproduce the issue

### Common Debug Commands

```typescript
// Check universe registration
console.log('Registered universes:', registry.getAllUniverses().map(u => u.universeId));

// Verify temporal structure
const universe = registry.getUniverse('your:universe:id');
console.log('Epochs:', Object.keys(universe?.epochs || {}));
console.log('Layers:', universe?.layers.map(l => l.layerId));

// Test temporal queries
const window = await windowSearch.getWindow('cal:2023');
console.log('Window:', window);
const results = await windowSearch.findUniversesInWindow('cal:2023');
console.log('Results:', results.length);
```

### Validation Helpers

```typescript
import { validateUniverseReference } from './core/universe-ids';

// Validate universe ID format
const validation = validateUniverseReference('your:universe:id');
if (!validation.isValid) {
  console.error('Invalid universe ID:', validation.error);
}

// Check temporal consistency
function validateTemporalStructure(universe: Universe) {
  const issues = [];
  
  if (!universe.layers.some(l => l.type === 'primary')) {
    issues.push('No primary layer found');
  }
  
  // Add more validation checks...
  
  return issues;
}
```

For additional help, check the [Universe Creation Guide](./universe-creation-guide.md) or review the comprehensive examples in the codebase.
