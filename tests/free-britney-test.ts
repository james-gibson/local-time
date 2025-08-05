import { LocalTime, queryFreeBritneyTimeline } from '../src/index.js';

describe('Free Britney Timeline Test', () => {
  let localTime: LocalTime;

  beforeAll(async () => {
    localTime = new LocalTime();
    await localTime.initialize();
  });

  test('should calculate time from Free Britney meme to conservatorship termination', async () => {
    const result = await queryFreeBritneyTimeline(localTime.getRegistry());
    
    expect(result.success).toBe(true);
    expect(result.timeElapsed).toBeDefined();
    expect(result.zeroEvent).toBeDefined();
    expect(result.targetEvent).toBeDefined();
    
    if (result.success && result.timeElapsed && result.zeroEvent && result.targetEvent) {
      // Free Britney meme went viral around April 15, 2019
      // Conservatorship terminated November 12, 2021
      // Expected: approximately 2 years, 6-7 months
      
      expect(result.timeElapsed.years).toBe(2);
      expect(result.timeElapsed.months).toBeGreaterThanOrEqual(6);
      expect(result.timeElapsed.months).toBeLessThanOrEqual(8);
      expect(result.timeElapsed.totalDays).toBeGreaterThan(900);
      expect(result.timeElapsed.totalDays).toBeLessThan(1000);
      
      expect(result.zeroEvent.name).toContain('free britney meme viral');
      expect(result.targetEvent.name).toContain('conservatorship terminated');
      
      expect(result.zeroEvent.date.getFullYear()).toBe(2019);
      expect(result.targetEvent.date.getFullYear()).toBe(2021);
      
      console.log(`Free Britney Timeline Results:`);
      console.log(`T=0: ${result.zeroEvent.description} (${result.zeroEvent.date.toDateString()})`);
      console.log(`Target: ${result.targetEvent.description} (${result.targetEvent.date.toDateString()})`);
      console.log(`Time Elapsed: ${result.timeElapsed.years} years, ${result.timeElapsed.months} months, ${result.timeElapsed.days} days`);
      console.log(`Total Days: ${result.timeElapsed.totalDays}`);
      console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    }
  });

  test('should handle zero-reference temporal addressing', async () => {
    // Test that we can use the Free Britney meme as T=0 for other events
    const registry = localTime.getRegistry();
    const britney = registry.getUniverse('biography:britney_spears:1981-present');
    
    expect(britney).toBeDefined();
    
    if (britney && britney.temporalStructure) {
      const freeBritneyEvent = britney.temporalStructure.keyframes.find(k => 
        k.tags.includes('free_britney')
      );
      const conservatorshipEndEvent = britney.temporalStructure.keyframes.find(k => 
        k.tags.includes('conservatorship_end')
      );
      
      expect(freeBritneyEvent).toBeDefined();
      expect(conservatorshipEndEvent).toBeDefined();
      
      if (freeBritneyEvent && conservatorshipEndEvent) {
        // Calculate relative time with Free Britney as T=0
        const timeDiff = conservatorshipEndEvent.timestamp - freeBritneyEvent.timestamp;
        const daysDiff = Number(timeDiff / (BigInt(24 * 60 * 60 * 1000) * 1000000n));
        
        expect(daysDiff).toBeGreaterThan(900);
        expect(daysDiff).toBeLessThan(1000);
        
        console.log(`Using Free Britney meme as T=0:`);
        console.log(`Conservatorship termination occurred at T+${daysDiff} days`);
      }
    }
  });

  test('should demonstrate zero-reference addressing format', async () => {
    // Show how this could be addressed in zero-reference format
    const result = await queryFreeBritneyTimeline(localTime.getRegistry());
    
    if (result.success && result.timeElapsed) {
      // Format as zero-reference address
      const zeroRefAddress = `biography:britney_spears:1981-present:conservatorship_timeline:T+${result.timeElapsed.totalDays}d:conservatorship_terminated`;
      
      console.log(`Zero-Reference Address: ${zeroRefAddress}`);
      console.log(`This represents: Conservatorship termination at T+${result.timeElapsed.totalDays} days after Free Britney meme went viral`);
      
      expect(zeroRefAddress).toContain('T+');
      expect(zeroRefAddress).toContain('conservatorship_terminated');
    }
  });
});
