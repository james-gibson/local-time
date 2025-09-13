import {
    Universe,
    UniverseType,
    TimePrecision,
    createTechnicalUniverseId,
    TemporalReference,
    RelationshipType,
} from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * Secure Ledger System - A collection of universes defining a conceptual, secure,
 * distributed accounting ledger system based on public key cryptography.
 *
 * This system is defined in a hierarchical manner, with each universe extending the
 * capabilities of the previous one.
 *
 * - `LedgerAuthenticationSystem`: The core access control and immutability rules.
 * - `PerRecordEncryption`: Adds granular, per-record encryption for special access.
 * - `DistributedCustodianArchitecture`: Distributes encrypted records across a network of nodes.
 * - `CustodianBreachResponseProtocol`: Defines the security and recovery protocol for compromised nodes.
 *
 * Hierarchical Context: This system is a technical specification based on established principles
 * in cryptography and distributed systems. It naturally connects to universes for
 * COMPUTER_SCIENCE, CRYPTOGRAPHY, and INTERNET_HISTORY.
 *
 * Research Sources:
 * - The design is a synthesis of the requirements discussed in the generating conversation.
 * - Concepts are anchored in established cryptographic principles such as Public Key Infrastructure (PKI),
 *   hybrid cryptosystems (e.g., PGP/GPG), and symmetric-key encryption (e.g., AES).
 * - Distributed architecture concepts are inspired by Distributed Hash Tables (DHTs), Byzantine Fault
 *   Tolerance (BFT) consensus mechanisms, and secure hardware enclaves (e.g., Intel SGX).
 * - "Mastering Bitcoin" by Andreas M. Antonopoulos for concepts on immutable ledgers and key management.
 */

// Helper Enums and Interfaces for this Universe Collection
export enum LedgerAccessLevel {
    OWNER = 'owner',
    USER = 'user',
    PUBLIC = 'public'
}

export enum SystemComponent {
    KEY_MANAGEMENT = 'key_management',
    ACCESS_CONTROL = 'access_control',
    ENCRYPTION_LAYER = 'encryption_layer',
    DISTRIBUTED_STORAGE = 'distributed_storage',
    BREACH_RESPONSE = 'breach_response',
}

// --- Universe 1: Core Ledger Authentication System ---

/**
 * Ledger Authentication System - Defines the foundational access control and data model for a secure,
 * immutable accounting ledger.
 *
 * This universe specifies a three-tiered access model (Owner, User, Public) enforced by public key
 * cryptography. It establishes the core principles of immutability, sequential entries, and add-only
 * error correction.
 *
 * Cultural Significance: 0.7 - Represents a standard, well-architected design pattern for secure,
 * multi-user data systems, combining established cryptographic and ledger principles.
 * Reality Relation: inspired_by real-world cryptographic systems with 0.1 fictionalization (as a specific, unimplemented system).
 */
export const ledgerAuthenticationSystemUniverse: Universe = {
    universeId: createTechnicalUniverseId('system', 'secure_ledger', 'authentication_v1'),
    type: UniverseType.TECHNICAL_SPECIFICATION,
    identifiers: {
        primary: 'ledger:auth:v1',
        aliases: ['Core Ledger System', 'Three-Tiered Access Ledger'],
    },
    metadata: {
        canonicalName: 'Ledger Authentication System',
        description: 'A specification for a secure ledger with three access levels (owner, user, public) enforced by public key authentication.',
        system_components: [SystemComponent.KEY_MANAGEMENT, SystemComponent.ACCESS_CONTROL],
        access_rules: {
            [LedgerAccessLevel.OWNER]: 'Full visibility of all transaction details, can add entries, and authorize users.',
            [LedgerAccessLevel.USER]: 'Can view current balance, add entries, and see transaction count.',
            [LedgerAccessLevel.PUBLIC]: 'Can only view the initial (zeroing) entry and the total number of ledger entries.',
        },
        core_principles: ['Immutability', 'Sequential Entries', 'Add-Only Error Correction'],
    },
    realityRelation: {
        type: 'inspired_by',
        fictionalizationDegree: 0.1,
        realityAnchors: [{
            anchorId: 'pki_principles',
            description: 'The access control model is directly based on the principles of Public Key Infrastructure (PKI).',
            confidence: 1.0,
            evidence: ['NIST Special Publication 800-32', 'RFC 5280: Internet X.509 Public Key Infrastructure Certificate and CRL Profile'],
        }],
    },
    attribution: {
        public_domain: true,
        sources: ['Conceptual model derived from user interaction.'],
        citations_required: false,
        usage_restrictions: [],
    },
    temporalStructure: {
        segments: [{
            segmentId: 'key_management',
            startTime: 0n,
            endTime: 100n,
            description: 'Defines key pair generation, distribution, and role-based derivation.',
            tags: ['setup', 'security'],
        }, {
            segmentId: 'access_control_flow',
            startTime: 101n,
            endTime: 200n,
            description: 'Defines the transaction signing and verification process for each access level.',
            tags: ['operations', 'authentication'],
        }, {
            segmentId: 'error_correction_protocol',
            startTime: 201n,
            endTime: 300n,
            description: 'Specifies that errors are corrected by adding new, corrective entries, preserving the immutable history.',
            tags: ['integrity', 'audit'],
        }],
        keyframes: [{
            id: 'immutability_principle',
            timestamp: 50n,
            significance: 1.0,
            description: 'The core principle that ledger entries, once written, cannot be altered or deleted.',
            tags: ['core_concept', 'data_integrity'],
            certainty: 1.0,
        }],
        windows: { strategy: 'phase_based', avgWindowSize: 100n },
    },
} as unknown as Universe;

// --- Universe 2: Per-Record Encryption Enhancement ---

/**
 * Per-Record Encryption - An extension to the core ledger system that adds a layer of granular
 * encryption for individual records.
 *
 * This universe details a hybrid encryption model where each sensitive record is encrypted with a unique
 * symmetric key, which is then wrapped using the public keys of authorized viewers. This allows for
 * special, revocable access to specific records without compromising the overall security model.
 *
 * Cultural Significance: 0.75 - A sophisticated application of hybrid cryptosystems to solve common
 * granular access control problems in secure data storage.
 * Reality Relation: inspired_by real-world hybrid encryption schemes like PGP/GPG.
 */
export const perRecordEncryptionUniverse: Universe = {
    universeId: createTechnicalUniverseId('system', 'secure_ledger', 'per_record_encryption_v1'),
    type: UniverseType.TECHNICAL_SPECIFICATION,
    identifiers: {
        primary: 'ledger:encryption:v1',
        aliases: ['Granular Access Control Layer'],
    },
    metadata: {
        canonicalName: 'Per-Record Encryption Enhancement',
        description: 'A specification for encrypting individual ledger records to grant special, revocable access to specific users.',
        system_components: [SystemComponent.ENCRYPTION_LAYER],
        core_principles: ['Hybrid Encryption', 'Symmetric Key Wrapping', 'Granular Access Revocation'],
    },
    connections: {
        temporal: [{
            targetUniverseId: ledgerAuthenticationSystemUniverse.universeId,
            relationship: RelationshipType.EXTENDS,
            description: 'This system adds an encryption layer on top of the foundational authentication model.',
            confidence: 1.0,
            evidence: ['This model requires the base public key infrastructure to manage access to the wrapped symmetric keys.'],
        }],
    },
    realityRelation: {
        type: 'inspired_by',
        fictionalizationDegree: 0.1,
        realityAnchors: [{
            anchorId: 'hybrid_cryptosystem',
            description: 'The model of using a symmetric key for data and an asymmetric key for sharing the symmetric key is the foundation of hybrid cryptosystems like PGP.',
            confidence: 1.0,
            evidence: ['OpenPGP Message Format (RFC 4880)'],
        }],
    },
    attribution: {
        public_domain: true,
        sources: ['Conceptual model derived from user interaction.'],
        citations_required: false,
        usage_restrictions: [],
    },
    temporalStructure: {
        segments: [{
            segmentId: 'encryption_workflow',
            startTime: 0n,
            endTime: 100n,
            description: 'The process of generating a per-record symmetric key and wrapping it with the public keys of authorized viewers.',
            tags: ['write_path', 'security'],
        }, {
            segmentId: 'decryption_workflow',
            startTime: 101n,
            endTime: 200n,
            description: 'The process where an authorized user uses their private key to unwrap the symmetric key and decrypt the record.',
            tags: ['read_path', 'access'],
        }],
        keyframes: [{
            id: 'access_revocation',
            timestamp: 150n,
            significance: 0.9,
            description: 'The principle that special access can be revoked simply by removing a user\'s wrapped symmetric key from the record metadata, without re-encrypting the data.',
            tags: ['access_control', 'efficiency'],
            certainty: 1.0,
        }],
        windows: { strategy: 'phase_based', avgWindowSize: 100n },
    },
} as unknown as Universe;

// --- Universe 3: Distributed Custodian Architecture ---

/**
 * Distributed Custodian Architecture - Extends the secure ledger by distributing encrypted records
 * across a network of custodian nodes.
 *
 * This universe specifies a "blind storage" model where custodians store encrypted data they cannot
 * read. It introduces a secure access protocol that separates authorization, location, and decryption
 * keys, using just-in-time key assembly and secure enclaves to protect keys from memory scraping.
 *
 * Cultural Significance: 0.8 - A modern, security-first design for distributed systems, incorporating
 * principles of zero-trust architecture and confidential computing.
 * Reality Relation: inspired_by confidential computing and distributed storage systems.
 */
export const distributedCustodianArchitectureUniverse: Universe = {
    universeId: createTechnicalUniverseId('system', 'secure_ledger', 'distributed_custodian_arch_v1'),
    type: UniverseType.TECHNICAL_SPECIFICATION,
    identifiers: {
        primary: 'ledger:distribution:v1',
        aliases: ['Blind Storage Ledger', 'Zero-Trust Distributed Ledger'],
    },
    metadata: {
        canonicalName: 'Distributed Custodian Architecture',
        description: 'A specification for distributing encrypted ledger records across a network of non-trusted custodians.',
        system_components: [SystemComponent.DISTRIBUTED_STORAGE],
        core_principles: ['Blind Custodian Storage', 'Just-in-Time Key Assembly', 'Separation of Keys (Access, Location, Decryption)', 'Secure Enclave Processing'],
    },
    connections: {
        temporal: [{
            targetUniverseId: perRecordEncryptionUniverse.universeId,
            relationship: RelationshipType.EXTENDS,
            description: 'This architecture provides a distributed storage and retrieval mechanism for the individually encrypted records defined in the previous layer.',
            confidence: 1.0,
            evidence: ['The "blind storage" principle relies on the records already being encrypted before they reach the custodian.'],
        }],
    },
    realityRelation: {
        type: 'inspired_by',
        fictionalizationDegree: 0.15,
        realityAnchors: [{
            anchorId: 'confidential_computing',
            description: 'The use of secure enclaves for just-in-time decryption is a core concept of confidential computing.',
            confidence: 1.0,
            evidence: ['Intel SGX and AMD SEV technology documentation.'],
        }, {
            anchorId: 'dht',
            description: 'The concept of querying for the nearest custodian of a record is analogous to key-based routing in Distributed Hash Tables (DHTs).',
            confidence: 0.9,
            evidence: ['Kademlia DHT protocol paper.'],
        }],
    },
    attribution: {
        public_domain: true,
        sources: ['Conceptual model derived from user interaction.'],
        citations_required: false,
        usage_restrictions: [],
    },
    temporalStructure: {
        segments: [{
            segmentId: 'secure_retrieval_protocol',
            startTime: 0n,
            endTime: 100n,
            description: 'The workflow for a user to authenticate, receive a location token and partial key, and retrieve an encrypted record from a custodian.',
            tags: ['read_path', 'security', 'network'],
        }, {
            segmentId: 'jit_decryption_protocol',
            startTime: 101n,
            endTime: 200n,
            description: 'The process of assembling the final decryption key in ephemeral memory or a secure enclave for one-time use.',
            tags: ['client_side', 'memory_security'],
        }],
        keyframes: [{
            id: 'blind_storage',
            timestamp: 50n,
            significance: 1.0,
            description: 'The core principle that custodian nodes store and serve data they are cryptographically unable to read.',
            tags: ['zero_trust', 'core_concept'],
            certainty: 1.0,
        }],
        windows: { strategy: 'phase_based', avgWindowSize: 100n },
    },
} as unknown as Universe;

// --- Universe 4: Custodian Breach Response Protocol ---

/**
 * Custodian Breach Response Protocol - Defines the security and recovery procedures for handling a
 * compromised custodian node within the distributed architecture.
 *
 * This universe specifies a protocol for detecting a breach, issuing an immutable on-ledger revocation
 * certificate, and ensuring the network collectively ignores the compromised node. It also covers the
 * verification and redistribution of records to maintain data integrity and availability.
 *
 * Cultural Significance: 0.85 - A critical and well-defined protocol for resilience and fault tolerance
 * in a decentralized system, essential for building trust in such architectures.
 * Reality Relation: inspired_by certificate revocation lists (CRLs) and BFT consensus.
 */
export const custodianBreachResponseUniverse: Universe = {
    universeId: createTechnicalUniverseId('system', 'secure_ledger', 'custodian_breach_response_v1'),
    type: UniverseType.TECHNICAL_SPECIFICATION,
    identifiers: {
        primary: 'ledger:recovery:v1',
        aliases: ['Custodian Revocation Protocol'],
    },
    metadata: {
        canonicalName: 'Custodian Breach Response Protocol',
        description: 'A protocol for revoking a compromised custodian, recording the event on-ledger, and ensuring network integrity.',
        system_components: [SystemComponent.BREACH_RESPONSE],
        core_principles: ['On-Ledger Revocation', 'Network Quarantine', 'Consensus-Based Rejection', 'Data Redistribution'],
    },
    connections: {
        temporal: [{
            targetUniverseId: distributedCustodianArchitectureUniverse.universeId,
            relationship: RelationshipType.SUPPLEMENTS,
            description: 'This protocol provides the necessary security, fault-tolerance, and recovery mechanisms for the distributed custodian architecture.',
            confidence: 1.0,
            evidence: ['A distributed system with potentially untrusted nodes requires a robust protocol for handling compromised participants.'],
        }],
    },
    realityRelation: {
        type: 'inspired_by',
        fictionalizationDegree: 0.1,
        realityAnchors: [{
            anchorId: 'crl_ocsp',
            description: 'The concept of broadcasting a signed revocation notice is analogous to Certificate Revocation Lists (CRLs) and OCSP in PKI.',
            confidence: 1.0,
            evidence: ['RFC 5280', 'RFC 6960'],
        }, {
            anchorId: 'bft',
            description: 'The ability for the network to continue functioning correctly despite malicious nodes is the core promise of Byzantine Fault Tolerance (BFT) algorithms.',
            confidence: 0.95,
            evidence: ['"The Byzantine Generals Problem" by Lamport, Shostak, and Pease.'],
        }],
    },
    attribution: {
        public_domain: true,
        sources: ['Conceptual model derived from user interaction.'],
        citations_required: false,
        usage_restrictions: [],
    },
    temporalStructure: {
        segments: [{
            segmentId: 'detection_and_revocation',
            startTime: 0n,
            endTime: 100n,
            description: 'The process of detecting a compromise and the owner issuing a signed, timestamped revocation certificate to the ledger.',
            tags: ['incident_response', 'security'],
        }, {
            segmentId: 'network_quarantine',
            startTime: 101n,
            endTime: 200n,
            description: 'The propagation of the revocation, causing all healthy nodes to sever connections and reject data from the compromised custodian.',
            tags: ['network_integrity', 'defense'],
        }, {
            segmentId: 'data_recovery',
            startTime: 201n,
            endTime: 300n,
            description: 'The process of verifying the integrity of records held by the compromised node (via other custodians) and redistributing them to new, trusted custodians.',
            tags: ['recovery', 'resilience'],
        }],
        keyframes: [{
            id: 'immutable_revocation',
            timestamp: 50n,
            significance: 1.0,
            description: 'The principle that the revocation event is itself an immutable, auditable record on the ledger, preventing the compromised node from being silently re-admitted.',
            tags: ['audit', 'core_concept', 'security'],
            certainty: 1.0,
        }],
        windows: { strategy: 'phase_based', avgWindowSize: 100n },
    },
} as unknown as Universe;

/**
 * A collection of all universes defining the Secure Ledger System.
 */
export const secureLedgerSystemUniverses: Universe[] = [
    ledgerAuthenticationSystemUniverse,
    perRecordEncryptionUniverse,
    distributedCustodianArchitectureUniverse,
    custodianBreachResponseUniverse,
];
