import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * How I'd Start a $100k/Month Software Business From Scratch in 2026 — Bgo, 2025
 * (2025-08-25T14:45:03Z).
 *
 * A 79:10 four-part playbook for software engineers who want to leave the 9-to-5:
 * prerequisites (self-assessment, a creator mindset, a financial cushion, a
 * 3-6-9 year outlook and unique advantages), choosing a business model (escaping
 * the "SaaS curse", product vs service, market demand, an MVP and revenue
 * streams), acquiring the first 10-20 clients (the network, "grab life by the
 * horns" in-person outreach, credibility hacking, free value hacking and
 * referrals), and continuous improvement (feedback loops, process optimisation,
 * skill enhancement, adaptation and data-driven decisions).
 *
 * THE WORK IS THE UNIT. Every keyframe is addressed on the video's own clock at
 * publication + offset, and every non-zero offset is an exact start of a text
 * cue in the English caption track. The 25 segments below are the *published*
 * chapters from info.json, verbatim, not invented phases.
 *
 * ONE RENDERING, NOT TWO. Both requested English tracks (en-orig and en) were
 * fetched and are byte-identical, so confidence is the single-source cap 0.80
 * and `verification.secondAttempt.recommended` is true. Conspicuous ASR errors
 * are kept in `metadata.captionArtifacts` with `enUs: null` — repairs from
 * context, not an invented second reading.
 *
 * The business advice, the revenue figure ($113,000 in 18 days, stated at
 * 1984 s) and the founder anecdotes (Cortez, Mailchimp, Reddit) are claims made
 * in the video and are recorded at the speaker's standing. Elon Musk, Jeff
 * Bezos, Mark Zuckerberg, Ben Chestnut, Alexis Ohanian, Mailchimp, Reddit,
 * Photoshop, Microsoft, Google Drive and the named firms are outside works; no
 * id is invented for them.
 *
 * ID: `series:start_your_own_software_business_2026`, produced by
 * `createSeriesUniverseId`; `series:` because `UniverseType` has no video member.
 * Guarded by `isSeriesUniverseId` in the test, not merely by `isValidUniverseId`.
 *
 * Sources: the video's own public metadata and English caption track
 * (`youtube:HNn9j3sD6S0`), read 2026-11-19 — see `metadata.verification`.
 */

export const START_YOUR_OWN_BUSINESS_UNIVERSE_ID =
  'series:start_your_own_software_business:2026';

/** Publication instant: 2025-08-25T14:45:03Z, from `info.json` `timestamp`. */
export const START_YOUR_OWN_BUSINESS_PUBLISHED = dateToNanoseconds(
  new Date('2025-08-25T14:45:03Z'),
);

/** YouTube `videoDetails.lengthSeconds`. 4750 s = 79:10. */
export const START_YOUR_OWN_BUSINESS_RUNTIME_SECONDS = 4750;

/** A runtime offset on the video's own clock: publication instant + seconds. */
const at = (seconds: number): bigint =>
  START_YOUR_OWN_BUSINESS_PUBLISHED + BigInt(Math.round(seconds * 1000)) * 1_000_000n;

/** The 25 published chapters, verbatim from info.json (start/end in seconds). */
export const startYourOwnBusinessChapters = [
  { id: 'ch_00_intro', title: '<Untitled Chapter 1>', startSeconds: 0, endSeconds: 149 },
  { id: 'ch_01_self_assessment', title: 'Self-Assessment', startSeconds: 149, endSeconds: 269 },
  { id: 'ch_02_mindset_shift', title: 'Mindset Shift', startSeconds: 269, endSeconds: 423 },
  { id: 'ch_03_financial_cushion', title: 'Financial Cushion', startSeconds: 423, endSeconds: 659 },
  { id: 'ch_04_3_6_9_year_outlook', title: '3-6-9 Year Outlook', startSeconds: 659, endSeconds: 790 },
  { id: 'ch_05_unique_advantages', title: 'Unique Advantages', startSeconds: 790, endSeconds: 1116 },
  { id: 'ch_06_action_items', title: 'Action Items', startSeconds: 1116, endSeconds: 1121 },
  { id: 'ch_07_the_saas_curse', title: 'The SaaS Curse', startSeconds: 1121, endSeconds: 1212 },
  { id: 'ch_08_business_models', title: 'Business Models', startSeconds: 1212, endSeconds: 1407 },
  { id: 'ch_09_market_demand', title: 'Market Demand', startSeconds: 1407, endSeconds: 1676 },
  { id: 'ch_10_mvp', title: 'MVP', startSeconds: 1676, endSeconds: 1819 },
  { id: 'ch_11_revenue_streams', title: 'Understanding Revenue Streams', startSeconds: 1819, endSeconds: 2121 },
  { id: 'ch_12_action_items', title: 'Action Items', startSeconds: 2121, endSeconds: 2263 },
  { id: 'ch_13_leverage_your_network', title: 'Leverage Your Network', startSeconds: 2263, endSeconds: 2451 },
  { id: 'ch_14_grab_life_by_the_horns', title: 'Grab Life by the Horns (IMPORTANT)', startSeconds: 2451, endSeconds: 3024 },
  { id: 'ch_15_credibility_hacking', title: 'Credibility Hacking', startSeconds: 3024, endSeconds: 3197 },
  { id: 'ch_16_free_value_hacking', title: 'Free Value Hacking', startSeconds: 3197, endSeconds: 3462 },
  { id: 'ch_17_referrals', title: 'Referrals & Strategic Partnerships', startSeconds: 3462, endSeconds: 3824 },
  { id: 'ch_18_action_items', title: 'Action Items', startSeconds: 3824, endSeconds: 3896 },
  { id: 'ch_19_customer_feedback', title: 'Customer Feedback Loops', startSeconds: 3896, endSeconds: 3972 },
  { id: 'ch_20_process_optimization', title: 'Process Optimization', startSeconds: 3972, endSeconds: 4040 },
  { id: 'ch_21_skill_enhancement', title: 'Skill Enhancement', startSeconds: 4040, endSeconds: 4119 },
  { id: 'ch_22_adaptation', title: 'Adaptation', startSeconds: 4119, endSeconds: 4187 },
  { id: 'ch_23_data_driven', title: 'Data-Driven Decisions', startSeconds: 4187, endSeconds: 4377 },
  { id: 'ch_24_action_items', title: 'Action Items', startSeconds: 4377, endSeconds: 4750 },
] as const;

/** Single-source ASR repairs — both requested tracks were byte-identical. */
export const startYourOwnBusinessCaptionArtifacts = [
  {
    atSeconds: 10.639,
    enOrig: 'billiondoll SAS company. But that is a',
    enUs: null,
    reading: 'billion-dollar SaaS company. But that is a',
    note: 'The "SaaS curse" is named repeatedly later in the video.',
  },
  {
    atSeconds: 26.240,
    enOrig: 'figureure business that leverages the',
    enUs: null,
    reading: 'seven-figure business that leverages the',
    note: 'The opening contrast is with a "billion-dollar" company; the same "seven-figure" claim follows.',
  },
  {
    atSeconds: 427.919,
    enOrig: 'and this is the story of Herdan Cortez.',
    enUs: null,
    reading: 'and this is the story of Hernán Cortés.',
    note: 'The conquistador who burned his ships in 1519 is unambiguous from the following cues.',
  },
  {
    atSeconds: 1517.760,
    enOrig: "you're doing a service-based business or",
    enUs: null,
    reading: "you're doing a service-based business or",
    note: 'Cue text recorded verbatim; the surrounding sentence contrasts product and service models.',
  },
  {
    atSeconds: 1990.640,
    enOrig: "we're already at let's see 50,000 there$",
    enUs: null,
    reading: "we're already at, let's see, 50,000 there, $",
    note: 'ASR garbles the currency token; the figure is restated in the next cue.',
  },
  {
    atSeconds: 2863.680,
    enOrig: 'customers didn\'t just help Trustnot',
    enUs: null,
    reading: "customers didn't just help Chestnut",
    note: 'Ben Chestnut of Mailchimp is the subject of the example.',
  },
  {
    atSeconds: 2914.640,
    enOrig: 'with it is Alexis Ohan.',
    enUs: null,
    reading: 'with it is Alexis Ohanian.',
    note: 'The Reddit co-founder; the surname is cut off in the cue.',
  },
  {
    atSeconds: 3823.760,
    enOrig: 'you\'ve gotten your first 10 to 20',
    enUs: null,
    reading: "you've gotten your first 10 to 20",
    note: 'Cue text recorded verbatim; it introduces the continuous-improvement section.',
  },
] as const;

const publishedKeyframe = {
  id: 'published',
  timestamp: at(0),
  significance: 1.0,
  certainty: 1.0,
  precision: TimePrecision.SECOND,
  tags: ['publication', 'verified_metadata', 'zero_reference'],
  type: KeyframeType.RELEASE,
  description:
    "Upload instant from the video's own metadata: 2025-08-25T14:45:03Z. Runtime 4750 s " +
    'with 25 published chapters; 11,527 views and 536 likes at verification.',
};

/** Compact beat table: every `at` is an exact `tStartMs / 1000` from the track. */
type Beat = {
  id: string;
  at: number;
  significance: number;
  type: KeyframeType;
  tags: string[];
  description: string;
};

const beats: Beat[] = [
  { id: 'opening_mistake', at: 0.080, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['framing', 'hook'], description: '"Most software engineers trying to escape the 9-to-5 make the same exact mistake."' },
  { id: 'number_one_reason', at: 14.000, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['framing', 'hook'], description: 'Jumping to build the next billion-dollar SaaS is "the number one reason" developers burn through savings and end up back in the cubicle.' },
  { id: 'quit_fortune_500', at: 33.040, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['testimony', 'credential'], description: 'The speaker says he quit his Fortune 500 software-engineering-manager job and built a seven-figure B2B consulting firm from the ground up.' },
  { id: 'four_step_playbook', at: 44.320, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['framing', 'structure'], description: 'The promised "full four-step playbook to go from developer to owner": prerequisites, business model, first clients, continuous improvement.' },
  { id: 'self_assessment_start', at: 149.040, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['transition', 'prerequisite'], description: '"Let\'s just start with self assessment" — the first prerequisite.' },
  { id: 'house_metaphor', at: 151.200, significance: 0.8, type: KeyframeType.PUBLIC_STATEMENT, tags: ['metaphor', 'prerequisite'], description: 'Building a business is compared to building a house: the ground must be stable and the blueprints in place before the foundation.' },
  { id: 'engineers_foundation', at: 204.879, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['prerequisite', 'skills'], description: 'Software engineers already have a strong foundation in problem solving, technical expertise and logical thinking — but a business needs more.' },
  { id: 'mindset_shift', at: 276.560, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['prerequisite', 'mindset'], description: '"There\'s a very big mind(set) shift we have to" make: a business owner must adopt a completely different mindset from a developer.' },
  { id: 'focus_on_how', at: 301.600, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['mindset', 'comparison'], description: 'A developer\'s primary focus is solving specific technical problems — how to make something work — without questioning why.' },
  { id: 'owner_focus_on_why', at: 324.320, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['mindset', 'comparison'], description: 'As a business owner "it\'s completely different": focus on the why, the purpose behind the problems you solve.' },
  { id: 'creator_not_executor', at: 354.320, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['mindset'], description: 'The role changes from "an executor of tasks to more so a creator of tasks."' },
  { id: 'risk_of_entrepreneurship', at: 365.840, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['mindset', 'risk'], description: '"Entrepreneurship is inherently risky" — more risk, greater reward, and comfort with the unknown.' },
  { id: 'cortes_burn_ships', at: 427.919, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['anecdote', 'cushion'], description: 'The financial-cushion section opens with the story of Hernán Cortés.' },
  { id: 'burn_all_ships', at: 442.720, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['anecdote', 'commitment'], description: 'In 1519 Cortés "gave out the order to burn all their ships" — the commitment metaphor for the financial decision.' },
  { id: 'long_term_vision', at: 660.800, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['prerequisite', 'vision'], description: '"Having a long-term vision is" important — the 3-6-9 year outlook prerequisite.' },
  { id: 'life_evolve', at: 699.760, significance: 0.8, type: KeyframeType.PUBLIC_STATEMENT, tags: ['vision'], description: 'The outlook must allow for life to evolve — a reason to leave room for change in the plan.' },
  { id: 'unique_advantage', at: 791.440, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['prerequisite', 'advantage'], description: 'Every software engineer "has a unique advantage" to identify — location, network and experience.' },
  { id: 'location_tradeoff', at: 830.000, significance: 0.8, type: KeyframeType.PUBLIC_STATEMENT, tags: ['advantage'], description: 'A tech hub may be an advantage but brings high living costs — the location trade-off.' },
  { id: 'leverage_unique_advantages', at: 877.040, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['advantage'], description: 'Recognising and leveraging unique advantages positions you ahead of the competition.' },
  { id: 'second_section', at: 1118.799, significance: 0.75, type: KeyframeType.PUBLIC_STATEMENT, tags: ['transition'], description: '"The second section of choosing a business" model begins.' },
  { id: 'saas_curse_intro', at: 1127.440, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['business_model', 'thesis'], description: '"Understand what I call the SaaS curse" — the reflex to equate software entrepreneurship with SaaS.' },
  { id: 'saas_curse_named', at: 1152.960, significance: 0.95, type: KeyframeType.PUBLIC_STATEMENT, tags: ['business_model', 'thesis'], description: '"I refer to this as the SaaS curse" — millions of engineers trying to build the next Facebook or Google.' },
  { id: 'outside_saas', at: 1204.640, significance: 0.8, type: KeyframeType.PUBLIC_STATEMENT, tags: ['business_model'], description: 'The speaker asks what there is for a developer to do outside SaaS, then answers it.' },
  { id: 'product_vs_service', at: 1220.559, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['business_model', 'decision'], description: 'Two paths: a product-based model (sell software products) or a service-based model.' },
  { id: 'service_model', at: 1233.760, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['business_model'], description: 'In a service model you use coding skills to automate, consult or build custom solutions; the software supports the service and revenue comes from delivering it.' },
  { id: 'python_software_service', at: 1246.159, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['testimony', 'business_model'], description: 'The speaker built a Python data-analytics tool in about a month and a half and kept it as a back-end support for his service rather than a SaaS.' },
  { id: 'strengths_weaknesses_advantages', at: 1284.559, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['decision', 'prerequisite'], description: 'Strengths, weaknesses and unique advantages "are going to guide your decision" between product and service.' },
  { id: 'higher_ceiling', at: 1305.440, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['business_model', 'tradeoff'], description: 'Product-based models have a higher growth ceiling but are harder to get off the ground.' },
  { id: 'staffing_company', at: 1391.039, significance: 0.8, type: KeyframeType.PUBLIC_STATEMENT, tags: ['business_model', 'example'], description: 'A "quote unquote staffing company" that builds custom software for others is still a service-based model.' },
  { id: 'market_demand', at: 1428.080, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['market', 'thesis'], description: '"Understand the market demand for your solution" — no matter how skilled you are, without demand the business fails.' },
  { id: 'pain_points', at: 1461.760, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['market', 'thesis'], description: 'The most important part of market research is the "pain point": the solution must address something causing the customer pain.' },
  { id: 'market_research_example', at: 1524.480, significance: 0.8, type: KeyframeType.PUBLIC_STATEMENT, tags: ['market', 'testimony'], description: 'The speaker describes analysing market trends, competition and saturation when he started.' },
  { id: 'product_scalability', at: 1562.799, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['market', 'business_model'], description: 'For product-based businesses, focus on scalability and long-term relevance; look at competitors established 5-10 years.' },
  { id: 'sustainable_need', at: 1631.360, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['market', 'example'], description: '"Sustainable is a key word here" — mask and hand-sanitiser sales at COVID were not a sustainable need.' },
  { id: 'create_mvp', at: 1676.240, significance: 0.95, type: KeyframeType.PUBLIC_STATEMENT, tags: ['mvp', 'action'], description: '"You need to create an MVP, a minimum viable product" and test before fully investing time, energy and money.' },
  { id: 'mvp_essentials', at: 1710.240, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['mvp'], description: 'An MVP is "a streamlined version of your product or service that includes only the essential features needed to test your concept with real users."' },
  { id: 'mvp_goal', at: 1727.919, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['mvp'], description: 'The main goal is to quickly assess market interest and gather feedback before a full-scale launch.' },
  { id: 'three_to_five_mvps', at: 1796.080, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['mvp', 'action'], description: 'A product-based model needs "at least... three to five MVPs"; a service model can get away with one or two sample tries.' },
  { id: 'revenue_streams', at: 1830.240, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['revenue', 'action'], description: 'Once the business model and MVP are set, "you need to understand the revenue streams" for how the business will make money.' },
  { id: 'subscription_models', at: 1850.960, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['revenue', 'example'], description: 'Product revenue can come from subscriptions, one-time sales, licensing fees or premium models — Photoshop, Microsoft Windows and Google Drive are cited.' },
  { id: 'service_revenue', at: 1892.320, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['revenue'], description: 'Service revenue streams are hourly billing, retainer agreements, project-based pricing or performance-based fees; diversify where possible.' },
  { id: 'hourly_to_project', at: 1975.039, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['revenue', 'testimony'], description: 'The speaker "changed to a project fee essentially" after hourly billing caused quality problems when one person was split across projects.' },
  { id: 'profits_not_revenue', at: 2110.079, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['revenue', 'thesis'], description: '"What\'s really important are your profits" — how much you actually take home, not the headline revenue figure.' },
  { id: 'choose_model', at: 2122.880, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['action', 'business_model'], description: 'The action item: choose between a product-based or service-based model using your self-assessment.' },
  { id: 'recommend_service', at: 2143.040, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['recommendation'], description: '"For 90% of you I would recommend a service-based model" — easier to start, faster to run, money up front, lower ceiling.' },
  { id: 'research_market', at: 2194.800, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['action', 'market'], description: 'Research your market: competitors, overall trends, and most importantly the primary pain point your business will solve.' },
  { id: 'leverage_network', at: 2291.920, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['clients', 'action'], description: 'To get the first 10-20 clients, "you need to leverage your network" — the best way to land the first few.' },
  { id: 'inner_circle', at: 2301.040, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['clients', 'network'], description: 'The first of the "big three" network tiers is the inner circle: close friends, family and trusted colleagues.' },
  { id: 'professional_network', at: 2356.880, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['clients', 'network'], description: 'Outside the inner circle is the professional network: co-workers, clients and acquaintances who can refer or introduce.' },
  { id: 'three_tiers', at: 2431.680, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['clients', 'network'], description: 'The three tiers are run in order — inner circle, professional network, extended network.' },
  { id: 'grab_life_horns', at: 2457.599, significance: 0.95, type: KeyframeType.PUBLIC_STATEMENT, tags: ['clients', 'thesis'], description: '"Grabbing life by the horns": the most underrated client-acquisition method is meeting people in person.' },
  { id: 'ads_threshold', at: 2484.160, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['clients', 'advertising'], description: 'Ads and cold email should only be used once you are "already at least making 15 to $20,000 a month" from your offer.' },
  { id: 'doctor_patient', at: 2516.160, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['clients', 'metaphor'], description: 'The doctor-patient analogy: treat prospects as a doctor treats a patient with a tumour — your offer is their relief.' },
  { id: 'bakery_problem', at: 2686.560, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['clients', 'example'], description: 'A bakery he frequented "couldn\'t get an accurate forecast on their demand" and discarded hundreds of dollars of goods daily.' },
  { id: 'free_bread_forecast', at: 2714.240, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['clients', 'example'], description: 'He offered free work forecasting bread demand, then a paid contract for the remaining items once it succeeded.' },
  { id: 'spot_and_seize', at: 2745.839, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['thesis', 'clients'], description: '"Opportunities are all around you every single day" — you must be sharp enough to recognise and bold enough to seize them.' },
  { id: 'ben_chestnut', at: 2796.319, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['example', 'clients'], description: 'Ben Chestnut, co-founder of Mailchimp, is the second in-person acquisition example.' },
  { id: 'atlanta_demos', at: 2841.839, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['example', 'clients'], description: 'Chestnut visited local businesses in Atlanta and demoed Mailchimp in person; those meetings got it off the ground.' },
  { id: 'alexis_ohanian', at: 2919.200, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['example', 'clients'], description: 'Alexis Ohanian of Reddit is the third example: he went to college campuses, tech meetups and conferences to pitch in person.' },
  { id: 'opportunities_everywhere', at: 2981.119, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['thesis', 'clients'], description: '"Opportunities are everywhere. You need to spot them, seize them" and use personal outreach for the first few clients.' },
  { id: 'credibility_hacking', at: 3024.480, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['credibility', 'thesis'], description: 'The third acquisition method is "credibility hacking" with the early clients.' },
  { id: 'early_clients_gold', at: 3052.079, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['credibility'], description: 'Early clients "are gold" because they help you build credibility, however much or little they paid.' },
  { id: 'underpromise_overdeliver', at: 3077.040, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['credibility', 'action'], description: '"You always want to underpromise but overdeliver to really shock the clients."' },
  { id: 'podcast_interviews', at: 3097.680, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['credibility', 'action'], description: 'Use "podcast style interviews" rather than standard testimonials — a deeper, unscripted conversation with the client.' },
  { id: 'social_proof_expert', at: 3163.839, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['credibility'], description: 'The interview "doesn\'t only give you social proof. It also positions you as an expert who cares."' },
  { id: 'free_value_hacking', at: 3229.599, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['content', 'thesis'], description: '"Free value hacking" means repurposing the podcast-style interviews into educational content.' },
  { id: 'repurpose_testimonials', at: 3330.880, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['content', 'action'], description: 'Repurpose podcast-style testimonials "into educational content that provides free value to potential clients" — lead magnets.' },
  { id: 'pdf_case_studies', at: 3414.400, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['content', 'testimony'], description: 'The speaker made PDF case-study breakdowns and shared them by email or Google Drive when pitching in person.' },
  { id: 'ask_for_referral', at: 3474.480, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['referral', 'action'], description: 'Leverage your first paying client by "asking for a referral" and incentivising it with something of equal value.' },
  { id: 'word_of_mouth', at: 3521.680, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['referral', 'testimony'], description: '"99% of my clients have come through in person and word of mouth" — and those are the highest-paying clients.' },
  { id: 'strategic_partnerships', at: 3528.720, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['partnership', 'action'], description: 'Beyond referrals, form strategic partnerships with other B2B businesses you have helped.' },
  { id: 'invoice_automation_example', at: 3539.359, significance: 0.8, type: KeyframeType.PUBLIC_STATEMENT, tags: ['partnership', 'example'], description: 'Custom invoicing-automation software bundled with a bookkeeping or accounting firm is the partnership example.' },
  { id: 'leverage_early_clients', at: 3684.640, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['action', 'credibility'], description: 'The acquisition action items: leverage early clients with podcast interviews, then reprocess the content with free value hacking.' },
  { id: 'continuous_improvement', at: 3826.160, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['transition', 'improvement'], description: 'With 10-20 clients secured, the continuous-improvement section begins — for an autonomous business or an exit.' },
  { id: 'improvement_house', at: 3877.520, significance: 0.8, type: KeyframeType.PUBLIC_STATEMENT, tags: ['metaphor', 'improvement'], description: 'The house metaphor returns: once moved in, you rely on feedback from everyone living there to make adjustments.' },
  { id: 'feedback_loops', at: 3896.400, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['improvement', 'feedback'], description: '"Customer feedback loops" come into play — customers experience the business from the inside and notice things you might not.' },
  { id: 'feedback_into_action', at: 3928.240, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['improvement', 'feedback'], description: 'It is "not just about listening" — create a loop where feedback is actively turned into action and followed up.' },
  { id: 'process_optimization', at: 3973.599, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['improvement', 'process'], description: 'Process optimisation streamlines day-to-day internal workflows to enhance efficiency and reduce waste.' },
  { id: 'streamline_workflows', at: 3980.640, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['improvement', 'process'], description: 'Automate repetitive tasks, improve communication between teams and refine the product-development cycle.' },
  { id: 'optimize_processes', at: 4025.599, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['improvement', 'process'], description: 'Optimise processes from the start to reduce churn and waste and increase operational efficiency as you hire.' },
  { id: 'skill_enhancement', at: 4042.079, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['improvement', 'skills'], description: 'Focus on skill enhancement "both not only for yourself but also for your team" as the landscape evolves.' },
  { id: 'update_skills', at: 4060.319, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['improvement', 'skills'], description: 'Constantly update your skill set: new technologies and tools for engineers, leadership and decision-making as soft skills.' },
  { id: 'adaptation', at: 4119.440, significance: 0.9, type: KeyframeType.PUBLIC_STATEMENT, tags: ['improvement', 'adaptation'], description: 'One of the most crucial factors for long-term success "is the ability to adapt."' },
  { id: 'everchanging_environment', at: 4141.279, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['improvement', 'adaptation'], description: 'Adaptation means staying flexible and responsive to the ever-changing environment in which the business operates.' },
  { id: 'resilient', at: 4167.520, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['improvement', 'adaptation'], description: 'Businesses that embrace adaptation survive and thrive, staying resilient to changing times.' },
  { id: 'data_driven', at: 4192.960, significance: 0.95, type: KeyframeType.PUBLIC_STATEMENT, tags: ['improvement', 'data'], description: 'All decisions "need to be datadriven" — instinct alone is risky; choices must be guided by solid data and metrics.' },
  { id: 'data_firm', at: 4204.560, significance: 0.8, type: KeyframeType.PUBLIC_STATEMENT, tags: ['data', 'credential'], description: 'Running a data-analytics firm, the speaker says "so many businesses overlook this aspect."' },
  { id: 'skills_action', at: 4333.040, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['action', 'skills'], description: 'The action item for skills: identify gaps for you and your team, then train, workshop or bring in a mentor.' },
  { id: 'stay_informed', at: 4377.360, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['action', 'adaptation'], description: 'Stay informed about market trends, emerging technologies and changes in customer behaviour, and be ready to pivot.' },
  { id: 'recap_prerequisites', at: 4440.960, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['recap'], description: 'The closing recap starts with the prerequisites: self-assess strengths, weaknesses and unique advantages.' },
  { id: 'recap_clients', at: 4508.400, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['recap'], description: 'The recap covers getting the first 10-20 clients: leverage the network, grab life by the horns, credibility hacking.' },
  { id: 'recap_processes', at: 4663.199, significance: 0.8, type: KeyframeType.PUBLIC_STATEMENT, tags: ['recap'], description: 'The recap of continuous improvement: optimise internal processes so efficiency stays high as the team grows.' },
  { id: 'data_is_king', at: 4708.960, significance: 0.85, type: KeyframeType.PUBLIC_STATEMENT, tags: ['recap', 'data'], description: '"Always follow data, never based on instinct... Data is king here" — the final substantive lesson.' },
  { id: 'close', at: 4731.679, significance: 0.75, type: KeyframeType.PUBLIC_STATEMENT, tags: ['outro'], description: '"That\'s pretty much everything I wanted to discuss" — the video closes with a like/subscribe and comment request.' },
];

export const startYourOwnBusinessUniverse = {
  universeId: START_YOUR_OWN_BUSINESS_UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: START_YOUR_OWN_BUSINESS_UNIVERSE_ID,
    aliases: [
      "How I'd Start a $100k/Month Software Business From Scratch in 2026",
      'Bgo developer-to-owner business playbook',
      'youtube:HNn9j3sD6S0',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.0,
    realityAnchors: [],
  },

  attribution: {
    public_domain: false,
    copyright: {
      holders: ['Bgo (speaker and publisher)'],
      year: 2025,
      status: 'active',
    },
    sources: [
      'YouTube HNn9j3sD6S0 — public metadata (info.json: timestamp, duration, title, channel, counts, 25 published chapters), read 2026-11-19',
      'Video description — the four-part developer-to-owner framing',
      'English caption track en-orig (json3): 2407 text events, 16366 words, first cue 0.080 s, last cue 4750.080 s',
      'English caption track en (json3): byte-identical to en-orig; one rendering, not a cross-check',
    ],
    citations_required: true,
    usage_restrictions: [
      'Do not reproduce the audio or video. This module stores metadata, offsets and short quotations only.',
      'The business advice, the revenue figure and the founder anecdotes are claims made in the video, recorded at the speaker\'s standing, not verified facts or endorsements.',
    ],
  },

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        runtime: {
          epochId: `${START_YOUR_OWN_BUSINESS_UNIVERSE_ID}:runtime`,
          startTime: START_YOUR_OWN_BUSINESS_PUBLISHED,
          endTime: at(START_YOUR_OWN_BUSINESS_RUNTIME_SECONDS),
          precision: TimePrecision.SECOND,
          description:
            'The 4750 s runtime from the measured upload instant. The 25 segments below are the ' +
            'published chapters from info.json verbatim. Every keyframe offset is an exact cue ' +
            'start in the caption rendering.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: startYourOwnBusinessChapters.map((chapter) => ({
      id: chapter.id,
      start: at(chapter.startSeconds),
      end: at(chapter.endSeconds),
      type: 'phase' as const,
      status: 'active' as const,
      description: chapter.title,
    })),

    keyframes: [
      publishedKeyframe,
      ...beats.map((beat) => ({
        id: beat.id,
        timestamp: at(beat.at),
        significance: beat.significance,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: beat.tags,
        type: beat.type,
        description: beat.description,
      })),
    ],

    windows: { strategy: 'time_based' },
  },

  metadata: {
    canonicalName: "How I'd Start a $100k/Month Software Business From Scratch in 2026",
    description:
      'A 79:10 four-part playbook for software engineers: prerequisites (self-assessment, a ' +
      'creator mindset, a financial cushion, a 3-6-9 year outlook, unique advantages), choosing ' +
      'a business model (the SaaS curse, product vs service, market demand, an MVP, revenue ' +
      'streams), acquiring the first 10-20 clients (network, in-person outreach, credibility and ' +
      'free value hacking, referrals) and continuous improvement (feedback loops, process ' +
      'optimisation, skills, adaptation, data-driven decisions).',
    creators: ['Bgo (speaker and publisher)'],
    released: new Date('2025-08-25T14:45:03Z'),
    cultural_significance: 0.35,
    significance:
      'A long-form, chaptered business-advice video whose 25 published chapters give a measured ' +
      'clock for a complete developer-to-owner argument. Recorded for that clock and structure, ' +
      'not as an endorsement of its claims.',
    tags: ['youtube', 'business', 'software-engineering', 'entrepreneurship', 'consulting', 'clients'],
    platform: 'YouTube',
    externalId: 'HNn9j3sD6S0',
    externalIds: { youtubeVideoId: 'HNn9j3sD6S0' },
    durationSeconds: START_YOUR_OWN_BUSINESS_RUNTIME_SECONDS,
    contentType: 'video',
    metricsAsOf: '2026-11-19',

    chapters: startYourOwnBusinessChapters.map((chapter) => ({ ...chapter })),

    interpretations: [
      {
        id: 'I-1',
        claim:
          'The single biggest mistake is jumping straight to building the next billion-dollar SaaS. ' +
          'For most software engineers the faster, lower-risk path is a service-based business in ' +
          'which code supports the service but revenue comes from delivering it.',
        statedAtSeconds: 1152.96,
        standing: 'The video\'s central recommendation, stated in the SaaS-curse section and repeated in the recap; recorded at the speaker\'s standing.',
      },
      {
        id: 'I-2',
        claim:
          'The first 10-20 clients come from the network and in-person outreach, not ads or cold ' +
          'email, which should wait until the offer already makes $15-20k a month.',
        statedAtSeconds: 2484.16,
        standing: 'The acquisition thesis, stated in "Grab Life by the Horns" and supported by the Cortez, Mailchimp and Reddit anecdotes.',
      },
      {
        id: 'I-3',
        claim:
          'Early clients are leveraged twice: first into credibility through podcast-style interviews ' +
          '(underpromise, overdeliver), then into free-value lead magnets that educate other businesses ' +
          'in the same industry.',
        statedAtSeconds: 3229.599,
        standing: 'The credibility/free-value argument, recorded as the work\'s interpretation rather than verified marketing science.',
      },
      {
        id: 'I-4',
        claim:
          'Once the business is running, continuous improvement — customer feedback loops, process ' +
          'optimisation, skill enhancement, adaptation and data-driven decisions — is what makes it ' +
          'autonomous or exit-ready.',
        statedAtSeconds: 3826.16,
        standing: 'The framing of the fourth section, stated at its opening and restated in the closing recap.',
      },
    ],

    captionArtifacts: startYourOwnBusinessCaptionArtifacts,

    verification: {
      performed: '2026-11-19',
      instruments: [
        'yt-dlp 2025.10.14 (python 3.9, youtube:player_client=android_vr) — info.json with timestamp, duration, title, channel, counts and 25 published chapters',
        'English caption track en-orig (json3): 2407 text events, 16366 words, first cue 0.080 s, last cue 4750.080 s, ~100% coverage of the 4750 s runtime',
        'English caption track en (json3): byte-identical to en-orig; one rendering, not a cross-check',
        'Video description — the four-part developer-to-owner framing',
      ],
      measured: {
        title: "How I'd Start a $100k/Month Software Business From Scratch in 2026",
        channel: 'Bgo',
        published: '2025-08-25T14:45:03Z',
        durationSeconds: START_YOUR_OWN_BUSINESS_RUNTIME_SECONDS,
        viewCountAtVerification: 11527,
        likeCountAtVerification: 536,
        publishedChapterCount: 25,
        captionEvents: 2407,
        captionWords: 16366,
        firstSpokenCueSeconds: 0.08,
        lastSpokenCueSeconds: 4750.08,
      },
      scope: { start: 0, end: START_YOUR_OWN_BUSINESS_RUNTIME_SECONDS },
      confidence: 0.8,
      secondAttempt: {
        recommended: true,
        why:
          'The two requested English tracks are byte-identical: YouTube served one automatic ' +
          'rendering under both names. One rendering is not a cross-check, so confidence is the ' +
          'single-source cap of 0.80, not the printed ceiling.',
        what:
          'Acquire a published transcript or ASR the garbled proper names (Hernán Cortés, Ben ' +
          'Chestnut, Alexis Ohanian) with a named model and record which reading carries the trust. ' +
          'No manual English subtitles were listed for this video.',
        attempted:
          'Both en-orig and en were fetched as json3 and found byte-identical. No second attempt ' +
          'was made because no independent rendering or published transcript was found.',
      },
      limits: [
        'The en-orig and en tracks are byte-identical; all quotations are a single rendering, and the repairs in metadata.captionArtifacts are unconfirmed reads from context.',
        'The business advice, the $113,000-in-18-days revenue figure and the founder anecdotes are claims made in the video, not independently verified facts.',
        'The first spoken cue starts at 0.080 s and the last at 4750.080 s; the publication zero-point is metadata-derived.',
        'The speaker\'s employment history and consulting results are first-person claims, not measurements made by this vault.',
        'View and like counts are point-in-time reads, not properties of the work.',
        'No audio or video was archived: no ticket named this source as volatile and it is not in the archive subset.',
      ],
    },

    uncertaintyNotes: [
      'Both requested caption tracks are byte-identical, so there is exactly one rendering. The captionArtifacts are single-source repairs, not a second reading.',
      'Proper names garbled by ASR (Hernán Cortés, Ben Chestnut / "Trustnot", Alexis Ohanian) are repaired from context and flagged single-source.',
      'Elon Musk, Jeff Bezos, Mark Zuckerberg, Ben Chestnut, Alexis Ohanian, Mailchimp, Reddit, Photoshop, Microsoft, Google Drive and the named firms are outside works; no id is invented for them.',
      'The $113,000-in-18-days revenue figure, the "quit my Fortune 500 job" history and the client outcomes are the speaker\'s claims, recorded at his standing.',
      'Significance and cultural-significance values are editorial weights for retrieval, not measurements of influence.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.GLOBAL_ECONOMY],
    },
  },
} as unknown as Universe;
