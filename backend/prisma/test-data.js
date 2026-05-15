const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔥 MEGA SEED: Clearing and repopulating with high-volume realistic data...');

  // 1. Clear existing transactional data
  await prisma.dispute.deleteMany({});
  await prisma.workerEarning.deleteMany({});
  await prisma.escrowTransaction.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.favourite.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.workerSkill.deleteMany({});
  await prisma.worker.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('🗑️ Cleaned up existing users, workers, and bookings.');

  // 2. Fetch Categories
  const leafCategories = await prisma.serviceCategory.findMany({ where: { parentId: { not: null } } });
  if (leafCategories.length === 0) {
    console.log('❌ No categories found. Run npx prisma db seed first.');
    return;
  }

  // 3. Seed Users (20 users)
  const users = [];
  for (let i = 0; i < 20; i++) {
    const user = await prisma.user.create({
      data: {
        phone: `91111000${i.toString().padStart(2, '0')}`,
        name: `Customer ${i + 1}`,
        city: 'Mumbai',
        bookerScore: 4.0 + Math.random()
      }
    });
    users.push(user);
  }
  console.log(`👤 Seeded ${users.length} users.`);

  // 4. Seed Workers (15 workers)
  const workers = [];
  const workerStatuses = ['provisional', 'verified', 'suspended'];
  for (let i = 0; i < 15; i++) {
    const status = i < 5 ? 'provisional' : (i < 12 ? 'verified' : 'suspended');
    const worker = await prisma.worker.create({
      data: {
        phone: `81111000${i.toString().padStart(2, '0')}`,
        name: `Professional Worker ${i + 1}`,
        city: 'Mumbai',
        status: status,
        aadhaarFront: i < 8 ? 'https://via.placeholder.com/400x250?text=Aadhaar+Front' : null,
        aadhaarBack: i < 8 ? 'https://via.placeholder.com/400x250?text=Aadhaar+Back' : null,
        aadhaarVerified: status === 'verified' || status === 'suspended',
        avgRating: 4.2 + (Math.random() * 0.8),
        totalJobs: Math.floor(Math.random() * 100)
      }
    });

    // Assign 2 random skills
    const skillCats = [...leafCategories].sort(() => 0.5 - Math.random()).slice(0, 2);
    for (const cat of skillCats) {
      await prisma.workerSkill.create({
        data: {
          workerId: worker.id,
          categoryId: cat.id,
          badge: 'skill_tested',
          testScore: 90
        }
      });
    }
    workers.push(worker);
  }
  console.log(`🛠️ Seeded ${workers.length} workers with skills.`);

  // 5. Seed Bookings (50 bookings)
  const bookingStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'confirmed', 'disputed', 'cancelled'];
  for (let i = 0; i < 50; i++) {
    const user = users[i % users.length];
    const cat = leafCategories[i % leafCategories.length];
    const status = bookingStatuses[i % bookingStatuses.length];
    
    // Pick a worker who has this skill, or just a random worker if none
    let worker = workers.find(w => w.status !== 'provisional') || workers[0];
    if (status === 'pending') worker = null;

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        workerId: worker ? worker.id : null,
        categoryId: cat.id,
        status: status,
        address: `${i + 101}, Main Road, Mumbai`,
        problemDesc: `Issue with ${cat.name}. Please fix as soon as possible.`,
        basePrice: cat.fixedPrice || 399,
        otpCode: '5678',
        createdAt: new Date(Date.now() - (i * 12 * 60 * 60 * 1000)) // Spread over last 25 days
      }
    });

    if (status === 'disputed') {
      await prisma.dispute.create({
        data: {
          bookingId: booking.id,
          reason: 'Quality of work was not as expected. Worker left without finishing.',
          outcome: 'pending'
        }
      });
    }

    if (['completed', 'confirmed'].includes(status)) {
      await prisma.workerEarning.create({
        data: {
          workerId: worker.id,
          bookingId: booking.id,
          grossAmount: booking.basePrice,
          commission: booking.basePrice * 0.1,
          netAmount: booking.basePrice * 0.9
        }
      });
    }
  }
  console.log(`📅 Seeded 50 bookings across all statuses.`);

  console.log('\n🌟 MEGA SEED COMPLETE! Refresh the admin dashboard now.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
