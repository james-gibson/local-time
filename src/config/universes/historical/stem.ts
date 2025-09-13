import {
    Universe,
    UniverseType,
    TimePrecision,
    createHistoricalUniverseId,
    createTechnologyUniverseId,
} from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * Invention of the Electric Telegraph - Revolution in Communication
 *
 * This universe documents the period of invention and early commercialization of the
 * electric telegraph, a technology that fundamentally altered long-distance communication.
 * It covers the initial conceptual work by various inventors and culminates in the
 * first major public demonstration and subsequent commercial network expansion.
 *
 * Cultural Significance: 0.98 - The telegraph was the foundational technology of the
 * global telecommunications network, enabling near-instantaneous communication across
 * vast distances for the first time. It directly led to the development of modern
 * stock tickers, news wire services, and global financial markets.
 *
 * Reality Relation: documentary with 0.0 fictionalization
 *
 * Research Sources:
 * - "The Victorian Internet" by Tom Standage (1998)
 * - Library of Congress, Samuel F. B. Morse Papers
 * - Smithsonian Institution, "History of the Telegraph" online exhibit
 * - W. J. King, "The Development of Electrical Technology in the 19th Century"
 *
 * Hierarchical Context: INDUSTRIAL_REVOLUTION -> US_HISTORY -> WORLD_HISTORY
 */
export const electricTelegraphUniverse: Universe = {
    universeId: "technology:electric_telegraph:1837", //createTechnologyUniverseId('communication',
    // 'electric_telegraph', '1837'),
    type: UniverseType.TECHNOLOGY,
    identifiers: {
        primary: 'tech:communication:telegraph:1837',
        aliases: ['Invention of the Telegraph'],
    },
    metadata: {
        canonicalName: 'Invention of the Electric Telegraph',
        description: 'The invention and practical demonstration of the first electric telegraph systems.',
        creators: ['Samuel F. B. Morse', 'Alfred Vail', 'William Fothergill Cooke', 'Charles Wheatstone'],
        released: new Date('1837-09-04T12:00:00Z'),
        cultural_significance: 0.98,
        tags: ['communication', 'invention', '19th_century', 'industrial_revolution'],
    },
    attribution: {
        public_domain: true,
        sources: ['Library of Congress', 'Smithsonian Institution', 'Public historical records'],
        citations_required: false,
        usage_restrictions: [],
    },
    realityRelation: {
        type: 'documents',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                anchorId: 'morse_demonstration_1838',
                description: "Samuel Morse's public demonstration of the telegraph at the Franklin Institute in Philadelphia.",
                confidence: 1.0,
                evidence: ["Franklin Institute records, January 24, 1838", "Morse's personal diaries"],
            },
            {
                anchorId: 'baltimore_washington_line_1844',
                description: 'The successful transmission of the message "What hath God wrought" from Washington D.C. to Baltimore.',
                confidence: 1.0,
                evidence: ["Congressional Records funding the line", "Newspaper accounts from May 24, 1844"],
            },
        ],
    },
    temporalStructure: {
        segments: [
            {
                segmentId: 'early_experiments',
                startTime: BigInt(new Date('1832-01-01T00:00:00Z').getTime()),
                endTime: BigInt(new Date('1837-09-03T23:59:59Z').getTime()),
                description: 'Period of conceptual development and early prototypes by Morse and others.',
                tags: ['research', 'prototype'],
            },
            {
                segmentId: 'demonstration_and_adoption',
                startTime: BigInt(new Date('1837-09-04T00:00:00Z').getTime()),
                endTime: BigInt(new Date('1861-12-31T23:59:59Z').getTime()),
                description: 'From the first successful public demonstration to the completion of the First Transcontinental Telegraph.',
                tags: ['commercialization', 'infrastructure'],
            },
        ],
        keyframes: [
            {
                id: 'morse_first_message',
                timestamp: BigInt(new Date('1838-01-06T12:00:00Z').getTime()),
                significance: 0.9,
                tags: ['demonstration', 'milestone'],
                description: "Morse sends the message 'A patient waiter is no loser' over two miles of wire at Speedwell Ironworks in Morristown, NJ.",
                certainty: 1.0,
            },
            {
                id: 'what_hath_god_wrought',
                timestamp: BigInt(new Date('1844-05-24T12:00:00Z').getTime()),
                significance: 1.0,
                tags: ['inauguration', 'public_demonstration'],
                description: 'Official opening of the Baltimore-Washington telegraph line with the famous message.',
                certainty: 1.0,
            },
        ],
        windows: {
            strategy: 'phase_based',
            avgWindowSize: 157788000000, // ~5 years in ms
        },
    },
    layers: [],
} as unknown as Universe;

/**
 * Discovery of Penicillin - The Dawn of Antibiotics
 *
 * This universe covers the accidental discovery of penicillin by Alexander Fleming,
 * and the subsequent work by Howard Florey and Ernst Boris Chain to isolate and
 * mass-produce the drug, launching the age of antibiotics.
 *
 * Cultural Significance: 1.0 - The discovery of penicillin is one of the most
 * significant breakthroughs in medical history. It fundamentally changed the treatment
 * of bacterial infections, saving hundreds of millions of lives and making many
 * previously life-threatening conditions treatable. It was a watershed moment for
 * modern medicine.
 *
 * Reality Relation: documentary with 0.0 fictionalization
 *
 * Research Sources:
 * - "The Life of Sir Alexander Fleming: Discoverer of Penicillin" by André Maurois
 * - Nobel Prize archives for the 1945 Prize in Physiology or Medicine
 * - Imperial College London, "The Discovery of Penicillin" historical archives
 * - Wellcome Collection, "The story of penicillin"
 *
 * Hierarchical Context: WORLD_WAR_II -> WORLD_HISTORY
 */
export const penicillinDiscoveryUniverse: Universe = {
    universeId: "technology:penicillin:1928", //createHistoricalUniverseId('medicine', 'penicillin_discovery', '1928'),
    type: UniverseType.HISTORICAL_EVENT,
    identifiers: {
        primary: 'history:medicine:penicillin:1928',
        aliases: ['Alexander Fleming Penicillin'],
    },
    metadata: {
        canonicalName: 'Discovery and Development of Penicillin',
        description: 'The discovery of penicillin by Alexander Fleming and its development into a usable drug by the Oxford team.',
        creators: ['Alexander Fleming', 'Howard Florey', 'Ernst Boris Chain', 'Norman Heatley'],
        released: new Date('1928-09-03T09:00:00Z'), // Approximate date of Fleming's observation
        cultural_significance: 1.0,
        tags: ['medicine', 'antibiotics', 'discovery', '20th_century', 'nobel_prize'],
    },
    attribution: {
        public_domain: false,
        copyright: {
            holders: ['Estate of Alexander Fleming', 'University of Oxford'],
            year: 1929, // Year of first publication
            status: 'active', // Varies by jurisdiction, but foundational papers are still under copyright.
        },
        sources: ['Nobel Foundation', 'Imperial College London', 'Wellcome Collection'],
        citations_required: true,
        usage_restrictions: ['Academic and research use permitted with citation.'],
    },
    realityRelation: {
        type: 'documents',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                anchorId: 'fleming_discovery_1928',
                description: "Alexander Fleming's observation of a bacteria-killing mold in a petri dish at St Mary's Hospital, London.",
                confidence: 1.0,
                evidence: ["Fleming's laboratory notebooks", "Publication in the British Journal of Experimental Pathology, 1929"],
            },
            {
                anchorId: 'oxford_team_purification_1940',
                description: 'The successful isolation and purification of penicillin by the team at the University of Oxford.',
                confidence: 1.0,
                evidence: ["Florey and Chain's publications in The Lancet, 1940", "University of Oxford laboratory records"],
            },
            {
                anchorId: 'first_human_trial_1941',
                description: 'The first clinical trial on Albert Alexander, a police constable with a severe infection.',
                confidence: 1.0,
                evidence: ["Radcliffe Infirmary medical records, 1941", "Biographies of the Oxford team"],
            },
        ],
    },
    temporalStructure: {
        segments: [
            {
                segmentId: 'discovery',
                startTime: BigInt(new Date('1928-09-03T00:00:00Z').getTime()),
                endTime: BigInt(new Date('1939-12-31T23:59:59Z').getTime()),
                description: "Fleming's initial discovery and subsequent period where the finding was largely unpursued.",
                tags: ['serendipity', 'research'],
            },
            {
                segmentId: 'development_and_production',
                startTime: BigInt(new Date('1940-01-01T00:00:00Z').getTime()),
                endTime: BigInt(new Date('1945-12-31T23:59:59Z').getTime()),
                description: 'Intensive research by the Oxford team, development of mass-production techniques in the US, and widespread use during WWII.',
                tags: ['wwii', 'mass_production', 'clinical_trials'],
            },
        ],
        keyframes: [
            {
                id: 'fleming_observation',
                timestamp: BigInt(new Date('1928-09-03T09:00:00Z').getTime()),
                significance: 1.0,
                tags: ['discovery', 'accident'],
                description: 'The moment Alexander Fleming observes the mold contaminating his Staphylococcus culture plate.',
                certainty: 0.95, // Date is historical approximation
            },
            {
                id: 'lancet_publication',
                timestamp: BigInt(new Date('1940-08-24T09:00:00Z').getTime()),
                significance: 0.95,
                tags: ['publication', 'validation'],
                description: "Publication of 'Penicillin as a Chemotherapeutic Agent' by the Oxford team in The Lancet, proving its efficacy.",
                certainty: 1.0,
            },
            {
                id: 'nobel_prize_1945',
                timestamp: BigInt(new Date('1945-12-10T17:00:00Z').getTime()),
                significance: 0.9,
                tags: ['award', 'recognition'],
                description: 'Fleming, Florey, and Chain are jointly awarded the Nobel Prize in Physiology or Medicine.',
                certainty: 1.0,
            },
        ],
        windows: {
            strategy: 'point_in_time',
        },
    },
    layers: [],
} as unknown as Universe;

/**
 * Invention of the Transistor - Foundation of the Digital Age
 *
 * This universe details the invention of the point-contact transistor at Bell Labs
 * in 1947 by John Bardeen, Walter Brattain, and William Shockley. This device
 * replaced bulky, inefficient vacuum tubes and became the fundamental building
 * block of all modern electronics.
 *
 * Cultural Significance: 1.0 - The transistor is arguably the most important
 * invention of the 20th century. It enabled the development of integrated circuits,
 * microprocessors, and virtually every electronic device today, from radios to
 * smartphones and supercomputers. It is the bedrock of the digital revolution.
 *
 * Reality Relation: documentary with 0.0 fictionalization
 *
 * Research Sources:
 * - "Crystal Fire: The Birth of the Information Age" by Michael Riordan and Lillian Hoddeson
 * - Bell Labs technical journals and internal memoranda (1947-1948)
 * - Nobel Prize archives for the 1956 Prize in Physics
 * - PBS documentary "Transistorized!"
 *
 * Hierarchical Context: BELL_LABS -> AT&T_CORPORATE -> US_HISTORY
 */
export const transistorInventionUniverse: Universe = {
    universeId: "technology:transistor:1947", // createTechnologyUniverseId('electronics', 'transistor_invention',
    // '1947'),
    type: UniverseType.TECHNOLOGY,
    identifiers: {
        primary: 'tech:electronics:transistor:1947',
        aliases: ['Bell Labs Transistor'],
    },
    metadata: {
        canonicalName: 'Invention of the Transistor',
        description: 'The invention of the first practical point-contact transistor at Bell Telephone Laboratories.',
        creators: ['John Bardeen', 'Walter Brattain', 'William Shockley'],
        released: new Date('1947-12-23T15:00:00Z'), // Date of first successful demonstration
        cultural_significance: 1.0,
        tags: ['electronics', 'semiconductor', 'invention', 'cold_war', 'nobel_prize', 'digital_revolution'],
    },
    attribution: {
        public_domain: false,
        copyright: {
            holders: ['AT&T', 'Bell Telephone Laboratories'],
            year: 1948, // Year of public announcement and patent filing
            status: 'expired', // Key patents have expired
        },
        sources: ['Nokia Bell Labs Archives', 'Nobel Foundation', 'IEEE Spectrum historical articles'],
        citations_required: true,
        usage_restrictions: [],
    },
    realityRelation: {
        type: 'documents',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                anchorId: 'first_demonstration_1947',
                description: 'The successful demonstration of amplification in a point-contact transistor to Bell Labs executives.',
                confidence: 1.0,
                evidence: ["Walter Brattain's lab notebook entry for December 16, 1947", "Internal Bell Labs memoranda"],
            },
            {
                anchorId: 'public_announcement_1948',
                description: 'The public announcement of the invention at a press conference in New York City.',
                confidence: 1.0,
                evidence: ['New York Times article, July 1, 1948', 'Bell Labs press release, June 30, 1948'],
            },
        ],
    },
    temporalStructure: {
        segments: [
            {
                segmentId: 'research_and_development',
                startTime: BigInt(new Date('1945-07-01T00:00:00Z').getTime()),
                endTime: BigInt(new Date('1947-12-22T23:59:59Z').getTime()),
                description: 'Post-war solid-state physics research at Bell Labs leading up to the invention.',
                tags: ['research', 'solid_state_physics'],
            },
            {
                segmentId: 'invention_and_refinement',
                startTime: BigInt(new Date('1947-12-23T00:00:00Z').getTime()),
                endTime: BigInt(new Date('1954-12-31T23:59:59Z').getTime()),
                description: 'The initial invention, public announcement, and subsequent development of the more robust junction transistor.',
                tags: ['invention', 'innovation'],
            },
        ],
        keyframes: [
            {
                id: 'first_amplification',
                timestamp: BigInt(new Date('1947-12-16T15:00:00Z').getTime()),
                significance: 1.0,
                tags: ['breakthrough', 'eureka_moment'],
                description: 'The moment Bardeen and Brattain achieve successful signal amplification with their point-contact device.',
                certainty: 1.0,
            },
            {
                id: 'patent_filing',
                timestamp: BigInt(new Date('1948-06-17T09:00:00Z').getTime()),
                significance: 0.9,
                tags: ['patent', 'intellectual_property'],
                description: 'The first patent application for the transistor is filed by Bell Labs.',
                certainty: 1.0,
            },
            {
                id: 'nobel_prize_1956',
                timestamp: BigInt(new Date('1956-12-10T17:00:00Z').getTime()),
                significance: 0.9,
                tags: ['award', 'recognition'],
                description: 'Bardeen, Brattain, and Shockley are jointly awarded the Nobel Prize in Physics.',
                certainty: 1.0,
            },
        ],
        windows: {
            strategy: 'phase_based',
            avgWindowSize: 63115200000, // ~2 years in ms
        },
    },
    layers: [],
} as unknown as Universe;

/**
 * Development of the World Wide Web - Global Information System
 *
 * This universe covers the invention and early development of the World Wide Web
 * at CERN by Tim Berners-Lee. It includes the creation of the core components:
 * HTTP, HTML, the first web browser (WorldWideWeb), and the first web server.
 *
 * Cultural Significance: 1.0 - The World Wide Web transformed society by creating
 * a globally accessible information space. It democratized publishing, revolutionized
 * commerce, communication, and access to knowledge, and forms the basis of the
 * modern internet-driven world.
 *
 * Reality Relation: documentary with 0.0 fictionalization
 *
 * Research Sources:
 * - "Weaving the Web" by Tim Berners-Lee
 * - CERN historical archives (info.cern.ch)
 * - World Wide Web Consortium (W3C) historical documents
 * - "A Brief History of the World Wide Web" by the Internet Society
 *
 * Hierarchical Context: CERN -> WORLD_HISTORY
 */
export const worldWideWebUniverse: Universe = {
    universeId:"technology:world_wide_web:timeline", // createTechnologyUniverseId('internet', 'world_wide_web',
    // '1989'),
    type: UniverseType.TECHNOLOGY,
    identifiers: {
        primary: 'tech:internet:www:1989',
        aliases: ['Invention of the Web', 'WWW'],
    },
    metadata: {
        canonicalName: 'Development of the World Wide Web',
        description: 'The invention of the World Wide Web, including HTML, HTTP, and the first browser, by Tim Berners-Lee at CERN.',
        creators: ['Tim Berners-Lee', 'Robert Cailliau'],
        released: new Date('1991-08-06T12:00:00Z'), // Public release on alt.hypertext newsgroup
        cultural_significance: 1.0,
        tags: ['internet', 'cern', 'hypertext', 'information_age', 'communication'],
    },
    attribution: {
        public_domain: true, // CERN released the technology into the public domain
        sources: ['CERN', 'World Wide Web Consortium (W3C)', 'Internet Society'],
        citations_required: false,
        usage_restrictions: [],
    },
    realityRelation: {
        type: 'documents',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                anchorId: 'proposal_march_1989',
                description: "Tim Berners-Lee's original proposal, 'Information Management: A Proposal', submitted to his manager at CERN.",
                confidence: 1.0,
                evidence: ['Archived copy of the proposal at W3C', 'CERN official history'],
            },
            {
                anchorId: 'first_web_server_1990',
                description: 'The first web server (info.cern.ch) goes live on a NeXT computer at CERN.',
                confidence: 1.0,
                evidence: ['CERN historical photos of the NeXT machine', 'First-hand accounts from Berners-Lee'],
            },
            {
                anchorId: 'public_release_1991',
                description: 'The project is announced to the public via the alt.hypertext Usenet newsgroup.',
                confidence: 1.0,
                evidence: ['Google Groups archive of the August 6, 1991 post'],
            },
        ],
    },
    temporalStructure: {
        segments: [
            {
                segmentId: 'conception_and_proposal',
                startTime: BigInt(new Date('1989-03-01T00:00:00Z').getTime()),
                endTime: BigInt(new Date('1990-09-30T23:59:59Z').getTime()),
                description: 'The period from the initial proposal to the start of active development.',
                tags: ['proposal', 'planning'],
            },
            {
                segmentId: 'development_and_launch',
                startTime: BigInt(new Date('1990-10-01T00:00:00Z').getTime()),
                endTime: BigInt(new Date('1993-04-30T23:59:59Z').getTime()),
                description: 'Development of the first browser and server, internal launch at CERN, public release, and CERN placing the technology in the public domain.',
                tags: ['development', 'release', 'public_domain'],
            },
        ],
        keyframes: [
            {
                id: 'initial_proposal',
                timestamp: BigInt(new Date('1989-03-12T10:00:00Z').getTime()),
                significance: 0.9,
                tags: ['proposal', 'origin'],
                description: 'Tim Berners-Lee submits his proposal for a hypertext-based information system.',
                certainty: 1.0,
            },
            {
                id: 'first_successful_communication',
                timestamp: BigInt(new Date('1990-12-25T12:00:00Z').getTime()),
                significance: 1.0,
                tags: ['milestone', 'proof_of_concept'],
                description: 'The first successful communication between a web browser and server over the internet is achieved.',
                certainty: 0.95, // Date is historical approximation
            },
            {
                id: 'cern_public_domain_declaration',
                timestamp: BigInt(new Date('1993-04-30T12:00:00Z').getTime()),
                significance: 1.0,
                tags: ['public_domain', 'democratization'],
                description: 'CERN announces that the World Wide Web technology will be available for anyone to use on a royalty-free basis.',
                certainty: 1.0,
            },
        ],
        windows: {
            strategy: 'phase_based',
            avgWindowSize: 31557600000, // ~1 year in ms
        },
    },
    layers: [],
} as unknown as Universe;
