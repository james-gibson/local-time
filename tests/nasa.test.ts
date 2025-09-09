import { ZeroReferenceAddressing } from '../src/addressing/zero-reference-addressing';
import { ZeroReferenceQueryService } from '../src/zero-reference-queries';
import {  apollo11Universe, } from '../src/zero-reference-examples';

import { ConfigLoader } from '../src';
import {ZeroReferenceEpoch} from '../src/core/types';
const configLoader = new ConfigLoader();
describe.skip('JFK-NASA Zero-Reference Temporal Systems', () => {
    let queryService: ZeroReferenceQueryService;

    beforeEach(async () => {

        queryService = new ZeroReferenceQueryService();
        await configLoader.loadConfigurations();
        // await queryService.registerUniverse(jfkUniverse);
        await queryService.registerUniverse(apollo11Universe as any);
        // await queryService.registerUniverse(apollo13Universe);
        // await queryService.registerUniverse(challengerUniverse);
    });

    describe('JFK Presidency Zero-Reference Addressing', () => {
        it('should generate addresses relative to JFK inauguration', () => {
            const address = ZeroReferenceAddressing.generateRelativeAddress(
                'usa:jfk:1917-1963', 'presidency', 'Day+', 121, 0, 0
            );
            expect(address).toBe('usa:jfk:1917-1963:presidency:Day+121:00:00');
        });

        it('should locate moon speech at Day+125 of presidency', () => {
            const moonSpeechAddress = ZeroReferenceAddressing.generateRelativeAddress(
                'usa:jfk:1917-1963', 'presidency', 'Day+', 125, 0, 0
            );
            expect(moonSpeechAddress).toBe('usa:jfk:1917-1963:presidency:Day+125:00:00');
        });

        it('should locate Bay of Pigs at Day+87 of presidency', () => {
            const bayOfPigsAddress = ZeroReferenceAddressing.generateRelativeAddress(
                'usa:jfk:1917-1963', 'presidency', 'Day+', 87, 0, 0
            );
            expect(bayOfPigsAddress).toBe('usa:jfk:1917-1963:presidency:Day+87:00:00');
        });

        it('should locate assassination at Day+1036 of presidency', () => {
            const assassinationAddress = ZeroReferenceAddressing.generateRelativeAddress(
                'usa:jfk:1917-1963', 'presidency', 'Day+', 1036, 0, 0
            );
            expect(assassinationAddress).toBe('usa:jfk:1917-1963:presidency:Day+1036:00:00');
        });
    });

    describe('Moon Speech as Zero Reference', () => {
        // it('should use JFK moon speech as T=0 for Apollo missions', async () => {
        //     const reality = await queryService.findUniversesAtRelativeTime("T-00:00:00");
        //     console.dir(reality)
        //     const moonSpeechEpoch = reality['moonSpeech'] as ZeroReferenceEpoch;
        //
        //     // Rice University speech at T+475 days
        //     const riceSpeechTime = { prefix: 'T+', hours: 0, minutes: 0, seconds: 0, days: 475 };
        //     const riceSpeechAbsolute = ZeroReferenceAddressing.relativeToAbsolute(riceSpeechTime, moonSpeechEpoch);
        //
        //     const expectedRice = BigInt(Date.UTC(1962, 8, 12)) * 1000000n;
        //     const daysDiff = Number((riceSpeechAbsolute - expectedRice) / (BigInt(24 * 60 * 60 * 1000) * 1000000n));
        //     expect(Math.abs(daysDiff)).toBeLessThan(2);
        // });

        // it('should calculate Apollo 11 at T+2978 days from moon speech', async () => {
        //     const reality = await queryService.findUniversesAtRelativeTime("T-00:00:00");
        //     const moonSpeechEpoch = reality['moonSpeech'] as ZeroReferenceEpoch;
        //     const apollo11Launch = BigInt(Date.UTC(1969, 6, 16, 13, 32, 0)) * 1000000n;
        //
        //     const relativeTime = ZeroReferenceAddressing.absoluteToRelative(apollo11Launch, moonSpeechEpoch);
        //
        //     expect(relativeTime.prefix).toBe('T+');
        //     const totalDays = (relativeTime.days || 0) + (relativeTime.hours || 0) / 24;
        //     expect(totalDays).toBeGreaterThan(2970);
        //     expect(totalDays).toBeLessThan(2980);
        // });
        //
        // it('should locate JFK assassination at T+911 days from moon speech', async () => {
        //     const reality = await queryService.findUniversesAtRelativeTime("T-00:00:00");
        //     const moonSpeechEpoch = reality['moonSpeech'] as ZeroReferenceEpoch;
        //     const assassinationTime = BigInt(Date.UTC(1963, 10, 22, 18, 30, 0)) * 1000000n;
        //
        //     const relativeTime = ZeroReferenceAddressing.absoluteToRelative(assassinationTime, moonSpeechEpoch);
        //
        //     expect(relativeTime.prefix).toBe('T+');
        //     const totalDays = (relativeTime.days || 0);
        //     expect(totalDays).toBeGreaterThan(910);
        //     expect(totalDays).toBeLessThan(912);
        // });
    });

    describe('Cross-Universe NASA Events Relative to JFK', () => {
        it('should find NASA events during JFK presidency', async () => {
            const events = await queryService.findEventsInRelativeRange(
                'usa:jfk:1917-1963',
                'presidency',
                { prefix: 'Day+', days: 0, hours: 0, minutes: 0, seconds: 0 },
                { prefix: 'Day+', days: 1036, hours: 0, minutes: 0, seconds: 0 }
            );

            const nasaEvents = events.filter((e:any) => e.tags?.some((t: any) =>
                t.includes('nasa') || t.includes('space') || t.includes('mercury')
            ));

            expect(nasaEvents.length).toBeGreaterThan(0);
            expect(nasaEvents.some(e => e.tags?.includes('space_race'))).toBe(true);
        });

        it.skip('should find Apollo missions after JFK death', async () => {
            const reality = await queryService.findUniversesAtRelativeTime("T-00:00:00");
            const jfkDeathTime = BigInt(Date.UTC(1963, 10, 22, 18, 30, 0)) * 1000000n;
            const apollo11Time = BigInt(Date.UTC(1969, 6, 16, 13, 32, 0)) * 1000000n;
            //         const missionTime = BigInt(Date.UTC(1970, 3, 11)) * 1000000n;
            //         const movieTime = BigInt(Date.UTC(1995, 5, 30)) * 1000000n;
            //
                    const apollo11MissionEpoch = apollo11Universe.epochs.mission as ZeroReferenceEpoch;

            const posthumousEvents = await queryService.findEventsInRelativeRange(
                jfkDeathTime.toString(),
                apollo11Time.toString(),
                ZeroReferenceAddressing.absoluteToRelative(jfkDeathTime, apollo11MissionEpoch),
                ZeroReferenceAddressing.absoluteToRelative(apollo11Time, apollo11MissionEpoch)
            );

            const apolloMissions = posthumousEvents.filter(e =>
                e.universeId?.includes('apollo')
            );

            expect(apolloMissions.length).toBeGreaterThan(5);
        });
    });

    // describe.skip('Cuban Missile Crisis Zero Reference', () => {
    //     it('should use Cuban Missile Crisis as T=0 for critical events', async () => {
    //         const crisisEpoch = jfkUniverse.epochs.cubanMissileCrisis as ZeroReferenceEpoch;
    //
    //         // Day 1: Soviet missiles discovered
    //         const day1Address = ZeroReferenceAddressing.generateRelativeAddress(
    //             'usa:jfk:1917-1963', 'cubanMissileCrisis', 'Day+', 1, 0, 0
    //         );
    //         expect(day1Address).toBe('usa:jfk:1917-1963:cubanMissileCrisis:Day+1:00:00');
    //
    //         // Day 13: Crisis resolved
    //         const resolutionAddress = ZeroReferenceAddressing.generateRelativeAddress(
    //             'usa:jfk:1917-1963', 'cubanMissileCrisis', 'Day+', 13, 0, 0
    //         );
    //         expect(resolutionAddress).toBe('usa:jfk:1917-1963:cubanMissileCrisis:Day+13:00:00');
    //     });
    //
    //     it('should calculate time from crisis to Test Ban Treaty', async () => {
    //         const crisisEpoch = jfkUniverse.epochs.cubanMissileCrisis as ZeroReferenceEpoch;
    //         const treatyTime = BigInt(Date.UTC(1963, 9, 7)) * 1000000n;
    //
    //         const relativeTime = ZeroReferenceAddressing.absoluteToRelative(treatyTime, crisisEpoch);
    //
    //         expect(relativeTime.prefix).toBe('Day+');
    //         const totalDays = relativeTime.days || 0;
    //         expect(totalDays).toBeGreaterThan(350);
    //         expect(totalDays).toBeLessThan(360);
    //     });
    // });
    //
    // describe.skip('Apollo 13 Emergency Timeline', () => {
    //     it('should track Apollo 13 explosion relative to launch', async () => {
    //         const launchEpoch = apollo13Universe.epochs.launch as ZeroReferenceEpoch;
    //         const explosionTime = BigInt(Date.UTC(1970, 3, 14, 3, 7, 53)) * 1000000n;
    //
    //         const relativeTime = ZeroReferenceAddressing.absoluteToRelative(explosionTime, launchEpoch);
    //
    //         expect(relativeTime.prefix).toBe('T+');
    //         const totalHours = (relativeTime.days || 0) * 24 + (relativeTime.hours || 0);
    //         expect(totalHours).toBeGreaterThan(55);
    //         expect(totalHours).toBeLessThan(57);
    //     });
    //
    //     it('should generate "Houston we have a problem" address', () => {
    //         // Approximately T+55:55:00 after launch
    //         const problemAddress = ZeroReferenceAddressing.generateRelativeAddress(
    //             'nasa:apollo13:1970', 'launch', 'T+', 55, 55, 0
    //         );
    //         expect(problemAddress).toBe('nasa:apollo13:1970:launch:T+55:55:00');
    //     });
    // });
    //
    // describe('Cross-System Conversions', () => {
    //     it('should convert JFK moon speech reference to Apollo 11 countdown', async () => {
    //         const jfkAddress = 'usa:jfk:1917-1963:moonSpeech:T+2978:00:00';
    //
    //         const apolloAddress = await queryService.convertBetweenZeroReferenceSystems(
    //             jfkAddress,
    //             'nasa:apollo11:1969',
    //             'launch'
    //         );
    //
    //         expect(apolloAddress).toContain('T+00:00:00'); // Should be at liftoff
    //     });
    //
    //     it('should align JFK assassination with NASA timeline', async () => {
    //         const assassinationAddress = 'usa:jfk:1917-1963:presidency:Day+1036:00:00';
    //
    //         const alignments = await queryService.findAlignedZeroReferenceWindows(
    //             assassinationAddress,
    //             'presidency'
    //         );
    //
    //         const nasaAlignments = alignments.filter(a =>
    //             a.universeId.includes('nasa')
    //         );
    //
    //         expect(nasaAlignments.length).toBeGreaterThan(0);
    //     });
    // });
    //
    // describe('Congressional Hearing Zero References', () => {
    //     it('should reference Rogers Commission from Challenger disaster', async () => {
    //         const challengerEpoch = challengerUniverse.epochs.disaster as ZeroReferenceEpoch;
    //
    //         // Rogers Commission started at T+6 days
    //         const commissionAddress = ZeroReferenceAddressing.generateRelativeAddress(
    //             'nasa:challenger:1986', 'disaster', 'T+', 144, 0, 0
    //         );
    //         expect(commissionAddress).toBe('nasa:challenger:1986:disaster:T+144:00:00');
    //     });
    //
    //     it('should track investigation duration', async () => {
    //         const events = await queryService.findEventsInRelativeRange('hearing:rogers_commission:1986', 'investigation', {
    //             prefix: 'Day+',
    //             days: 0,
    //             hours: 0,
    //             minutes: 0,
    //             seconds: 0
    //         }, {prefix: 'Day+', days: 120, hours: 0, minutes: 0, seconds: 0});
    //
    //         expect(events.some(e => e.tags?.includes('findings'))).toBe(true);
    //         expect(events.some(e => e.tags?.includes('recommendations'))).toBe(true);
    //     });
    // });
    //
    // describe('Cultural Impact Timeline', () => {
    //     it('should measure time from event to movie release', async () => {
    //         // Apollo 13 mission to movie
    //         const missionTime = BigInt(Date.UTC(1970, 3, 11)) * 1000000n;
    //         const movieTime = BigInt(Date.UTC(1995, 5, 30)) * 1000000n;
    //
    //         const apollo13MissionEpoch = apollo13Universe.epochs.mission as ZeroReferenceEpoch;
    //         const relativeToMovie = ZeroReferenceAddressing.absoluteToRelative(movieTime, apollo13MissionEpoch);
    //
    //         expect(relativeToMovie.prefix).toBe('T+');
    //         const years = (relativeToMovie.days || 0) / 365.25;
    //         expect(years).toBeGreaterThan(24);
    //         expect(years).toBeLessThan(26);
    //     });
    //
    //     it('should generate addresses for NASA movies', () => {
    //         const rightStuffAddress = ZeroReferenceAddressing.generateRelativeAddress(
    //             'movie:the_right_stuff:1983', 'theatrical', 'Day+', 0, 0, 0
    //         );
    //         expect(rightStuffAddress).toBe('movie:the_right_stuff:1983:theatrical:Day+0:00:00');
    //
    //         const hiddenFiguresAddress = ZeroReferenceAddressing.generateRelativeAddress(
    //             'movie:hidden_figures:2016', 'theatrical', 'Day+', 0, 0, 0
    //         );
    //         expect(hiddenFiguresAddress).toBe('movie:hidden_figures:2016:theatrical:Day+0:00:00');
    //     });
    // });
});
