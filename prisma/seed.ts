import { PrismaClient } from '@prisma/client';
import { allUniverses, allNetworks } from '../src/config/universes/index';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with universe data...');

  // Clear existing data
  await prisma.queryIndex.deleteMany();
  await prisma.universeSearchView.deleteMany();
  await prisma.referenceChainConnection.deleteMany();
  await prisma.referenceChain.deleteMany();
  await prisma.temporalReference.deleteMany();
  await prisma.universeNetworkMembership.deleteMany();
  await prisma.universeNetwork.deleteMany();
  await prisma.temporalKeyframe.deleteMany();
  await prisma.temporalSegment.deleteMany();
  await prisma.temporalStructure.deleteMany();
  await prisma.temporalWindow.deleteMany();
  await prisma.temporalEpoch.deleteMany();
  await prisma.temporalLayer.deleteMany();
  await prisma.universe.deleteMany();

  // Seed universes
  for (const universe of allUniverses) {
    console.log(`📚 Seeding universe: ${universe.universeId}`);
    
    // Create universe
    const createdUniverse = await prisma.universe.create({
      data: {
        id: universe.universeId,
        type: universe.type,
        canonicalName: universe.metadata?.canonicalName,
        culturalSignificance: universe.metadata?.cultural_significance,
        identifiers: universe.identifiers as any,
        realityRelation: universe.realityRelation as any,
        attribution: universe.attribution as any,
        metadata: universe.metadata as any,
      }
    });

    // Create temporal layers
    for (const layer of universe.layers) {
      const createdLayer = await prisma.temporalLayer.create({
        data: {
          layerId: layer.layerId,
          type: layer.type,
          universeId: universe.universeId,
          contains: layer.contains as any,
          realityCorrespondence: layer.reality_correspondence as any,
          subuniverses: layer.subuniverses as any,
        }
      });

      // Create epochs for this layer
      for (const [epochKey, epoch] of Object.entries(layer.epochs)) {
        await prisma.temporalEpoch.create({
          data: {
            epochId: epoch.epochId || epochKey,
            startTime: (epoch.startTime || epoch.start)?.toString(),
            endTime: (epoch.endTime || epoch.end)?.toString(),
            precision: epoch.precision,
            description: epoch.description,
            layerId: createdLayer.id,
            // Zero-reference fields if present
            zeroPoint: (epoch as any).zeroPoint?.toString(),
            zeroEvent: (epoch as any).zeroEvent,
            beforePrefix: (epoch as any).beforePrefix,
            afterPrefix: (epoch as any).afterPrefix,
            relativeFormat: (epoch as any).relativeFormat,
          }
        });
      }
    }

    // Create temporal windows
    if (universe.temporalWindows) {
      for (const window of universe.temporalWindows) {
        await prisma.temporalWindow.create({
          data: {
            windowId: window.windowId,
            startTime: window.startTime.toString(),
            endTime: window.endTime.toString(),
            precision: window.precision,
            type: window.type,
            universeId: universe.universeId,
            aliases: window.aliases as any,
            metadata: window.metadata as any,
          }
        });
      }
    }

    // Create temporal structure
    if (universe.temporalStructure) {
      const structure = await prisma.temporalStructure.create({
        data: {
          universeId: universe.universeId,
          windows: universe.temporalStructure.windows as any,
        }
      });

      // Create segments
      for (const segment of universe.temporalStructure.segments) {
        await prisma.temporalSegment.create({
          data: {
            segmentId: segment.id,
            start: segment.start.toString(),
            end: segment.end.toString(),
            type: segment.type,
            status: segment.status,
            jurisdiction: segment.jurisdiction,
            structureId: structure.id,
          }
        });
      }

      // Create keyframes
      for (const keyframe of universe.temporalStructure.keyframes) {
        await prisma.temporalKeyframe.create({
          data: {
            keyframeId: keyframe.id,
            timestamp: keyframe.timestamp.toString(),
            significance: keyframe.significance,
            certainty: keyframe.certainty,
            structureId: structure.id,
            tags: keyframe.tags as any,
            dateRange: keyframe.dateRange as any,
          }
        });
      }
    }

    // Create search view entry
    await createSearchViewEntry(universe);
  }

  // Seed networks
  for (const network of allNetworks) {
    console.log(`🌐 Seeding network: ${network.networkId}`);
    
    const createdNetwork = await prisma.universeNetwork.create({
      data: {
        networkId: network.networkId,
        sharedEpochs: network.sharedEpochs as any,
        eras: network.eras as any,
      }
    });

    // Create network memberships
    for (const universeId of network.universes) {
      // Check if universe exists
      const universeExists = await prisma.universe.findUnique({
        where: { id: universeId }
      });

      if (universeExists) {
        await prisma.universeNetworkMembership.create({
          data: {
            universeId: universeId,
            networkId: createdNetwork.id,
          }
        });
      }
    }
  }

  console.log('✅ Database seeded successfully!');
}

async function createSearchViewEntry(universe: any) {
  // Extract searchable content
  const searchText = [
    universe.metadata?.canonicalName,
    universe.identifiers?.aliases?.join(' '),
    universe.metadata?.creators?.join(' '),
    universe.attribution?.creators?.director?.join(' '),
    universe.attribution?.creators?.writer?.join(' '),
  ].filter(Boolean).join(' ');

  // Extract tags from keyframes
  const tags = universe.temporalStructure?.keyframes
    ?.flatMap((kf: any) => kf.tags)
    ?.join(', ') || '';

  // Extract year from universe ID or metadata
  const yearMatch = universe.universeId.match(/:(\d{4})(?:$|:)/);
  const createdYear = yearMatch ? parseInt(yearMatch[1]) : 
    universe.attribution?.copyright?.year ||
    universe.metadata?.released?.getFullYear();

  // Calculate temporal bounds
  let earliestTime: string | undefined;
  let latestTime: string | undefined;

  for (const layer of universe.layers) {
    for (const epoch of Object.values(layer.epochs)) {
      const start = (epoch as any).startTime || (epoch as any).start;
      const end = (epoch as any).endTime || (epoch as any).end;
      
      if (start) {
        const startStr = start.toString();
        if (!earliestTime || startStr < earliestTime) {
          earliestTime = startStr;
        }
      }
      
      if (end) {
        const endStr = end.toString();
        if (!latestTime || endStr > latestTime) {
          latestTime = endStr;
        }
      }
    }
  }

  await prisma.universeSearchView.create({
    data: {
      universeId: universe.universeId,
      canonicalName: universe.metadata?.canonicalName || 'Unknown',
      type: universe.type,
      culturalSignificance: universe.metadata?.cultural_significance,
      realityType: universe.realityRelation.type,
      fictionalizationDegree: universe.realityRelation.fictionalizationDegree,
      hasPublicDomain: universe.attribution.public_domain || false,
      createdYear,
      searchText,
      tags,
      earliestTime,
      latestTime,
    }
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
