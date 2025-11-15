import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backfillRankings() {
  try {
    console.log('Starting to backfill rankings for users...');

    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true },
    });

    console.log(`Found ${users.length} users`);

    // Get all episodes
    const episodes = await prisma.episode.findMany({
      orderBy: { number: 'asc' },
    });

    console.log(`Found ${episodes.length} episodes`);

    for (const user of users) {
      console.log(`\nProcessing user: ${user.firstName} ${user.lastName} (${user.id})`);

      for (const episode of episodes) {
        // Check if user already has rankings for this episode
        const existingRankings = await prisma.ranking.findMany({
          where: {
            userId: user.id,
            episode: episode.number,
          },
        });

        if (existingRankings.length > 0) {
          console.log(`  - Episode ${episode.number}: Already has ${existingRankings.length} rankings, skipping`);
          continue;
        }

        // Get stars assigned to this episode
        const episodeStars = await prisma.episodeStar.findMany({
          where: { episodeId: episode.number },
          select: { starId: true },
          orderBy: { starId: 'asc' },
        });

        if (episodeStars.length === 0) {
          console.log(`  - Episode ${episode.number}: No stars assigned, skipping`);
          continue;
        }

        // Create rankings for this episode
        const rankings = episodeStars.map((es, index) => ({
          userId: user.id,
          starId: es.starId,
          rank: index + 1,
          episode: episode.number,
        }));

        await prisma.ranking.createMany({
          data: rankings,
        });

        console.log(`  - Episode ${episode.number}: Created ${rankings.length} rankings`);
      }
    }

    console.log('\n✅ Backfill complete!');
  } catch (error) {
    console.error('Error backfilling rankings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

backfillRankings();
