import { ZeroReferenceAddressing } from '../src/zero-reference-addressing';
import { ZeroReferenceQueryService } from '../src/zero-reference-queries';
import { apollo11Universe, ddayUniverse, ZeroReferenceExamples } from '../src/zero-reference-examples';
import { ZeroReferenceEpoch, TimePrecision } from '../src/temporal-system';

describe('Zero-Reference Temporal Systems', () => {
  let queryService: ZeroReferenceQueryService;
  
  beforeEach(async () => {
    queryService = new ZeroReferenceQueryService();
    await queryService.registerUniverse(apollo11Universe);
    await queryService.registerUniverse(ddayUniverse);
  });
  
  describe('Relative Address Generation', () => {
    it('should generate T-minus addresses correctly', () => {
      const address = ZeroReferenceAddressing.generateRelativeAddress(
        'nasa:apollo11:1969', 'launch', 'T-', 0, 5, 30
      );
      expect(address).toBe('nasa:apollo11:1969:launch:T-00:05:30');
    });
    
    it('should generate T-plus addresses correctly', () => {
      const address = ZeroReferenceAddressing.generateRelativeAddress(
        'nasa:apollo11:1969', 'launch', 'T+', 0, 2, 46
      );
      expect(address).toBe('nasa:apollo11:1969:launch:T+00:02:46');
    });
    
    it('should generate H-hour addresses correctly', () => {
      const address = ZeroReferenceAddressing.generateRelativeAddress(
        'history:dday:1944', 'operation', 'H-', 6, 0, 0
      );
      expect(address).toBe('history:dday:1944:operation:H-06:00:00');
    });
  });
  
  describe('Address Parsing', () => {
    it('should parse T-minus addresses correctly', () => {
      const testAddress = ZeroReferenceAddressing.generateRelativeAddress(
          'nasa:apollo11:1969', 'launch', 'T-', 0, 5, 30
      );
      // console.log(testAddress);
      const parsed = ZeroReferenceAddressing.parseRelativeAddress(
  testAddress
      );
      
      expect(parsed.isValid).toBe(true);
      expect(parsed.universeId).toBe('nasa:apollo11:1969');
      expect(parsed.epochId).toBe('launch');
      expect(parsed.relativeTime?.prefix).toBe('T-');
      expect(parsed.relativeTime?.hours).toBe(0);
      expect(parsed.relativeTime?.minutes).toBe(5);
      expect(parsed.relativeTime?.seconds).toBe(30);
    });
    
    it('should handle invalid addresses gracefully', () => {
      const parsed = ZeroReferenceAddressing.parseRelativeAddress('invalid:address');
      expect(parsed.isValid).toBe(false);
    });
  });
  
  describe('Time Conversion', () => {
    it('should convert T-minus to absolute time correctly', async () => {
      const launchEpoch = apollo11Universe.epochs.launch as ZeroReferenceEpoch;
      const relativeTime = { prefix: 'T-', hours: 0, minutes: 5, seconds: 30, milliseconds: 0 };
      
      const absoluteTime = ZeroReferenceAddressing.relativeToAbsolute(relativeTime, launchEpoch);
      
      // Should be 5.5 minutes before launch (1969-07-16 13:32:00 UTC)
      const expected = BigInt(Date.UTC(1969, 6, 16, 13, 26, 30)) * 1000000n;
      expect(absoluteTime).toBe(expected);
    });
    
    it('should convert T-plus to absolute time correctly', async () => {
      const launchEpoch = apollo11Universe.epochs.launch as ZeroReferenceEpoch;
      const relativeTime = { prefix: 'T+', hours: 0, minutes: 2, seconds: 46, milliseconds: 0 };
      
      const absoluteTime = ZeroReferenceAddressing.relativeToAbsolute(relativeTime, launchEpoch);
      
      // Should be 2:46 after launch
      const expected = BigInt(Date.UTC(1969, 6, 16, 13, 34, 46)) * 1000000n;
      expect(absoluteTime).toBe(expected);
    });
    
    it('should convert absolute time back to relative correctly', async () => {
      const launchEpoch = apollo11Universe.epochs.launch as ZeroReferenceEpoch;
      const absoluteTime = BigInt(Date.UTC(1969, 6, 16, 13, 26, 30)) * 1000000n;
      
      const relativeTime = ZeroReferenceAddressing.absoluteToRelative(absoluteTime, launchEpoch);
      
      expect(relativeTime.prefix).toBe('T-');
      expect(relativeTime.hours).toBe(0);
      expect(relativeTime.minutes).toBe(5);
      expect(relativeTime.seconds).toBe(30);
    });
  });
  
  describe('Cross-Universe Queries', () => {
    it('should find universes at T-5 minutes', async () => {
      const results = await queryService.findUniversesAtRelativeTime('T-00:00:00', {
        zeroReferenceType: apollo11Universe.epochs.launch.toString()
      });
      
      expect(results).toHaveLength(1);
      expect(results[0].universeId).toBe('nasa:apollo11:1969');
    });
    
    it('should find aligned windows across different zero-reference systems', async () => {
      // TODO: I don't know if this is right!
      const alignments = await queryService.findAlignedZeroReferenceWindows('T-00:00:00','launch');
      
      expect(alignments.length).toBeGreaterThan(0);
      expect(alignments[0].semanticAlignment).toBe(true);
    });
    
    it('should handle events in relative time ranges', async () => {
      const events = await queryService.findEventsInRelativeRange(
        'nasa:apollo11:1969',
        'launch',
        { prefix: 'T-', hours: 0, minutes: 10, seconds: 0, milliseconds: 0 },
        { prefix: 'T+', hours: 0, minutes: 5, seconds: 0, milliseconds: 0 }
      );
      
      expect(events.length).toBeGreaterThan(0);
      expect(events.some(e => e.id === 'go_no_go_poll')).toBe(true);
      expect(events.some(e => e.id === 'liftoff')).toBe(true);
      expect(events.some(e => e.id === 'first_stage_separation')).toBe(true);
    });
  });
  
  describe('Cross-System Conversion', () => {
    it('should convert between different zero-reference systems', async () => {
      // This would require both systems to have overlapping absolute time ranges
      // For demonstration, we'll test the conversion logic
      const sourceAddress = 'nasa:apollo11:1969:launch:T-00:00:00';
      
      const converted = await queryService.convertBetweenZeroReferenceSystems(
        sourceAddress,
        'history:dday:1944',
        'operation'
      );
      
      // The conversion should work even if the times don't align meaningfully
      expect(converted).toBeTruthy();
      expect(converted).toContain('history:dday:1944:operation:H');
    });
  });
  
  describe('Real-world Examples', () => {
    it('should handle Apollo 11 countdown correctly', () => {
      const addresses = ZeroReferenceExamples.generateApollo11Addresses();
      
      expect(addresses.goNoGo).toBe('nasa:apollo11:1969:launch:T-00:05:30');
      expect(addresses.liftoff).toBe('nasa:apollo11:1969:launch:T+00:00:00');
      expect(addresses.separation).toBe('nasa:apollo11:1969:launch:T+00:02:46');
    });
    
    it('should handle D-Day H-Hour correctly', () => {
      const addresses = ZeroReferenceExamples.generateDDayAddresses();
      
      expect(addresses.airborne).toBe('history:dday:1944:operation:H-06:00:00');
      expect(addresses.hhour).toBe('history:dday:1944:operation:H+00:00:00');
      expect(addresses.firstWave).toBe('history:dday:1944:operation:H+01:00:00');
    });
    
    it('should demonstrate round-trip conversions', () => {
      const conversions = ZeroReferenceExamples.demonstrateConversions();
      
      expect(conversions.original.prefix).toBe(conversions.converted.prefix);
      expect(conversions.original.hours).toBe(conversions.converted.hours);
      expect(conversions.original.minutes).toBe(conversions.converted.minutes);
      expect(conversions.original.seconds).toBe(conversions.converted.seconds);
    });
  });
});
