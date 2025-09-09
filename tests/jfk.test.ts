import {LocalTime, Universe} from '../src';
import {ZeroReferenceEpoch} from '../src/temporal-system';

describe(' JFK-NASA Space Race Timeline Test', () => {
    let localTime: LocalTime = new LocalTime();

    beforeAll(async () => {
        await localTime.initialize();
    });

    // test('should calculate time from JFK moon speech to Apollo 11 landing', async () => {
    //     const registry = localTime.getRegistry();
    //     const result = await registry.getUniverse('usa:jfk:1917-1963');;
    //
    //     expect(result.success).toBe(true);
    //     expect(result.timeElapsed).toBeDefined();
    //     expect(result.zeroEvent).toBeDefined();
    //     expect(result.targetEvent).toBeDefined();
    //
    //     if (result.success && result.timeElapsed && result.zeroEvent && result.targetEvent) {
    //         // JFK's moon speech to Congress: May 25, 1961
    //         // Apollo 11 moon landing: July 20, 1969
    //         // Expected: approximately 8 years, 1-2 months
    //
    //         expect(result.timeElapsed.years).toBe(8);
    //         expect(result.timeElapsed.months).toBeGreaterThanOrEqual(1);
    //         expect(result.timeElapsed.months).toBeLessThanOrEqual(2);
    //         expect(result.timeElapsed.totalDays).toBeGreaterThan(2970);
    //         expect(result.timeElapsed.totalDays).toBeLessThan(3000);
    //
    //         expect(result.zeroEvent.name).toContain('moon_speech_congress');
    //         expect(result.targetEvent.name).toContain('apollo11_landing');
    //
    //         expect(result.zeroEvent.date.getFullYear()).toBe(1961);
    //         expect(result.targetEvent.date.getFullYear()).toBe(1969);
    //
    //         // console.log(`JFK Moon Promise to Fulfillment:`);
    //         // console.log(`T=0: ${result.zeroEvent.description} (${result.zeroEvent.date.toDateString()})`);
    //         // console.log(`Target: ${result.targetEvent.description} (${result.targetEvent.date.toDateString()})`);
    //         // console.log(`Time Elapsed: ${result.timeElapsed.years} years, ${result.timeElapsed.months} months, ${result.timeElapsed.days} days`);
    //         // console.log(`Total Days: ${result.timeElapsed.totalDays}`);
    //         // console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    //     }
    // });

    test.skip('should track JFK assassination impact on Apollo timeline', async () => {

        const registry = localTime.getRegistry();
        // expect(registry).toBeDefined();
        // await registry.initialize();
        const apollo11 = registry.getUniverse('nasa:apollo11:1969');
        const r = registry.getNetwork('nasa');
        console.dir({r,registry,apollo11})
        const jfk = registry.getUniverse('bibliography:jfk:1917-1963');

        const apollo13 = registry.getUniverse('nasa:apollo13:1970');
        if(!apollo11 || !jfk) { throw new Error('Bad mock')}

        if(!apollo11.epochs || !jfk.epochs) { throw new Error('Bad mock')}
        console.dir({epochs: apollo11.epochs})
        const apollo11ZeroPoint = (apollo11.epochs['launch'] as ZeroReferenceEpoch).zeroPoint;
        if (jfk && apollo11 && jfk.temporalStructure && apollo11ZeroPoint) {
            const assassinationEvent = jfk.temporalStructure.keyframes.find((k:any) =>
                k.tags.includes('assassination')
            );
            const moonSpeechEvent = jfk.temporalStructure.keyframes.find((k:any) =>
                k.tags.includes('moon_speech_congress')
            );

            expect(assassinationEvent).toBeDefined();
            expect(moonSpeechEvent).toBeDefined();

            if (assassinationEvent && moonSpeechEvent) {
                // Calculate time from assassination to Apollo 11
                const timeSinceAssassination = BigInt(apollo11ZeroPoint - assassinationEvent.timestamp) * 1000000n;
                const daysSinceAssassination = Number(timeSinceAssassination / (BigInt(24 * 60 * 60 * 1000) * 1000000n));

                // Apollo 11 launched approximately 2,066 days after JFK's assassination
                expect(daysSinceAssassination).toBeGreaterThan(2050);
                expect(daysSinceAssassination).toBeLessThan(2080);

                // Calculate percentage of promise fulfilled after JFK's death
                const totalPromiseTime = BigInt(apollo11ZeroPoint - moonSpeechEvent.timestamp) * 1000000n;
                const postAssassinationTime = BigInt(apollo11ZeroPoint - assassinationEvent.timestamp) * 1000000n;
                const percentageAfterDeath = Number(postAssassinationTime * 100n / totalPromiseTime);

                // About 69% of the moon promise timeline occurred after JFK's death
                expect(percentageAfterDeath).toBeGreaterThan(65);
                expect(percentageAfterDeath).toBeLessThan(75);

                // console.log(`Apollo Program After JFK:`);
                // console.log(`Days from assassination to Apollo 11: ${daysSinceAssassination}`);
                // console.log(`Percentage of moon promise fulfilled posthumously: ${percentageAfterDeath.toFixed(1)}%`);
            }
        }
    });

    test('should map congressional hearings to space disasters', async () => {
        const registry = localTime.getRegistry();
        const nasaNetwork = registry.getNetwork('nasa');

        expect(nasaNetwork).toBeDefined();

        if (nasaNetwork && nasaNetwork.eras) {
            const disasterEra = nasaNetwork.eras.find(e => e.eraId === 'disaster_investigations');

            expect(disasterEra).toBeDefined();

            if (disasterEra) {
                // Verify Rogers Commission followed Challenger disaster
                const challenger = registry.getUniverse('nasa:challenger:1986');
                const rogersCommission = registry.getUniverse('hearing:rogers_commission:1986');

                if (challenger && rogersCommission &&
                    challenger.temporalStructure && rogersCommission.epochs && rogersCommission.epochs.hearing) {

                    const disasterEvent = challenger.temporalStructure.keyframes.find(k =>
                        k.tags.includes('disaster') || k.tags.includes('explosion')
                    );

                    if (disasterEvent) {
                        const timeToHearing = (rogersCommission?.epochs?.hearing?.startTime ?? BigInt(0)) - disasterEvent.timestamp;
                        const daysToHearing = Number(timeToHearing / (BigInt(24 * 60 * 60 * 1000) * 1000000n));

                        // Rogers Commission should start within 7 days of disaster
                        expect(daysToHearing).toBeGreaterThanOrEqual(0);
                        expect(daysToHearing).toBeLessThan(10);

                        // console.log(`Congressional Response Time:`);
                        // console.log(`Days from Challenger disaster to Rogers Commission: ${daysToHearing}`);
                    }
                }
            }
        }
    });

    test('should demonstrate JFK-NASA zero-reference addressing', async () => {
        const registry = localTime.getRegistry();
        const jfk = registry.getUniverse('bibliography:jfk:1917-1963');

        if (jfk && jfk.temporalStructure) {
            const moonSpeech = jfk.temporalStructure.keyframes.find(k =>
                k.tags.includes('moon_speech_congress')
            );
            const riceSpeech = jfk.temporalStructure.keyframes.find(k =>
                k.tags.includes('rice_university_speech')
            );
            const apollo11Launch = BigInt(Date.UTC(1969, 6, 16, 13, 32, 0)) * 1000000n;

            if (moonSpeech && riceSpeech) {
                // Format as zero-reference addresses with moon speech as T=0
                const riceDiff = Number((riceSpeech.timestamp - moonSpeech.timestamp) / (BigInt(24 * 60 * 60 * 1000) * 1000000n));
                const apollo11Diff = Number((apollo11Launch - moonSpeech.timestamp) / (BigInt(24 * 60 * 60 * 1000) * 1000000n));

                const riceAddress = `usa:jfk:space_commitment:T+${riceDiff}d:rice_university`;
                const apollo11Address = `usa:jfk:space_commitment:T+${apollo11Diff}d:apollo11_launch`;

                expect(riceAddress).toContain('T+');
                expect(apollo11Address).toContain('T+');
                expect(riceDiff).toBeGreaterThan(470);
                expect(riceDiff).toBeLessThan(480);
                expect(apollo11Diff).toBeGreaterThan(2970);
                expect(apollo11Diff).toBeLessThan(3000);

                // console.log(`Zero-Reference Addresses (T=0: JFK Moon Speech to Congress):`);
                // console.log(`Rice University Speech: ${riceAddress}`);
                // console.log(`Apollo 11 Launch: ${apollo11Address}`);
            }
        }
    });

    test('should cross-reference cultural impact through films', async () => {
        const registry = localTime.getRegistry();
        const nasaNetwork = registry.getNetwork('nasa');

        if (nasaNetwork && nasaNetwork.eras) {
            const culturalEra = nasaNetwork.eras.find(e => e.eraId === 'cultural_impact');

            expect(culturalEra).toBeDefined();

            if (culturalEra) {
                // Test Apollo 13 mission vs Apollo 13 movie temporal relationship
                const apollo13Mission = registry.getUniverse('nasa:apollo13:1970');
                const apollo13Movie = registry.getUniverse('movie:apollo13:1995');

                if (apollo13Mission?.epochs && apollo13Movie &&
                    apollo13Mission.epochs?.mission && apollo13Movie?.epochs?.theatrical) {

                    const missionDate = apollo13Mission.epochs?.mission?.startTime ?? 0;
                    const movieDate = apollo13Movie.epochs?.theatrical?.startTime ?? 0;
                    const yearsBetween = ((BigInt(movieDate) * 1000000n) - (BigInt(missionDate) * 1000000n)) / (BigInt(365 * 24 * 60 * 60 * 1000) * 1000000n);

                    // Movie came out 25 years after mission
                    expect(yearsBetween).toBeGreaterThan(24);
                    expect(yearsBetween).toBeLessThan(10);

                    console.log(`Cultural Impact Delay:`);
                    console.log(`Years from Apollo 13 mission to movie: ${Number(yearsBetween).toFixed(1)}`);
                }
            }
        }
    });

    test.skip('should validate JFK legacy continuation metrics', async () => {
        const registry = localTime.getRegistry();
        const jfk = registry.getUniverse('bibliography:jfk:1917-1963');
        const nasaNetwork = registry.getNetwork('nasa');

        if (jfk && nasaNetwork) {
            // Count NASA achievements during JFK presidency
            const jfkStart = BigInt(Date.UTC(1961, 0, 20)) * 1000000n;
            const jfkEnd = BigInt(Date.UTC(1963, 10, 22)) * 1000000n;

            let duringJFK = 0;
            let afterJFK = 0;

            nasaNetwork.universes.forEach(universeId => {
                if (universeId.startsWith('nasa:')) {
                    const universe = registry.getUniverse(universeId);
                    if (universe && universe.epochs?.mission) {
                        const missionTime = universe.epochs?.mission?.startTime ?? NaN;
                        if (missionTime >= jfkStart && missionTime <= jfkEnd) {
                            duringJFK++;
                        } else if (missionTime > jfkEnd && missionTime < BigInt(Date.UTC(1972, 11, 31)) * 1000000n) {
                            afterJFK++;
                        }
                    }
                }
            });

            // More Apollo missions occurred after JFK's death than during his presidency
            expect(afterJFK).toBeGreaterThan(duringJFK);

            // console.log(`JFK Space Legacy:`);
            // console.log(`NASA missions during JFK presidency: ${duringJFK}`);
            // console.log(`Apollo missions completed posthumously: ${afterJFK}`);
        }
    });
});
