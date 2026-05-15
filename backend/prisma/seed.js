/**
 * prisma/seed.js
 * Run: npx prisma db seed
 *
 * Seeds:
 *  - 1 Admin (predefined, never self-registers)
 *  - Service categories (parent + leaf) so the home screen has real data
 *  - ReviewTags
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // ─── Admin ────────────────────────────────────────────────────────────────
    const admin = await prisma.admin.upsert({
        where:  { phone: '9699236125' },
        update: {},
        create: {
            phone: '9699236125',
            name:  'Mihayel Noronha',
        },
    });
    console.log(`✅ Admin: ${admin.name} (${admin.phone})`);

    // ─── Service Categories ───────────────────────────────────────────────────
    // Parent categories first
    const parents = await Promise.all([
        prisma.serviceCategory.upsert({
            where:  { id: 'cat-plumbing' },
            update: {},
            create: { id: 'cat-plumbing',   name: 'Plumbing',    iconUrl: '🚰', isActive: true },
        }),
        prisma.serviceCategory.upsert({
            where:  { id: 'cat-electrical' },
            update: {},
            create: { id: 'cat-electrical', name: 'Electrical',  iconUrl: '⚡', isActive: true },
        }),
        prisma.serviceCategory.upsert({
            where:  { id: 'cat-cleaning' },
            update: {},
            create: { id: 'cat-cleaning',   name: 'Cleaning',    iconUrl: '🧹', isActive: true },
        }),
        prisma.serviceCategory.upsert({
            where:  { id: 'cat-ac' },
            update: {},
            create: { id: 'cat-ac',         name: 'AC Repair',   iconUrl: '❄️', isActive: true },
        }),
        prisma.serviceCategory.upsert({
            where:  { id: 'cat-carpentry' },
            update: {},
            create: { id: 'cat-carpentry',  name: 'Carpentry',   iconUrl: '🪚', isActive: true },
        }),
        prisma.serviceCategory.upsert({
            where:  { id: 'cat-painting' },
            update: {},
            create: { id: 'cat-painting',   name: 'Painting',    iconUrl: '🎨', isActive: true },
        }),
    ]);
    console.log(`✅ ${parents.length} parent categories seeded`);

    // Leaf categories (sub-services with fixed prices)
    const leaves = [
        // Plumbing
        { id: 'cat-tap-repair',      parentId: 'cat-plumbing',   name: 'Tap Repair',        fixedPrice: 249 },
        { id: 'cat-pipe-leak',       parentId: 'cat-plumbing',   name: 'Pipe Leak Fix',      fixedPrice: 349 },
        { id: 'cat-drain-clean',     parentId: 'cat-plumbing',   name: 'Drain Cleaning',     fixedPrice: 399 },
        { id: 'cat-toilet-repair',   parentId: 'cat-plumbing',   name: 'Toilet Repair',      fixedPrice: 299 },
        // Electrical
        { id: 'cat-fan-repair',      parentId: 'cat-electrical', name: 'Fan Repair',         fixedPrice: 199 },
        { id: 'cat-switch-repair',   parentId: 'cat-electrical', name: 'Switch/Socket Fix',  fixedPrice: 149 },
        { id: 'cat-wiring',          parentId: 'cat-electrical', name: 'New Wiring',         fixedPrice: 599 },
        // Cleaning
        { id: 'cat-home-clean',      parentId: 'cat-cleaning',   name: 'Full Home Cleaning', fixedPrice: 1299 },
        { id: 'cat-sofa-clean',      parentId: 'cat-cleaning',   name: 'Sofa Cleaning',      fixedPrice: 799 },
        { id: 'cat-bathroom-clean',  parentId: 'cat-cleaning',   name: 'Bathroom Cleaning',  fixedPrice: 499 },
        // AC
        { id: 'cat-ac-service',      parentId: 'cat-ac',         name: 'AC Service',         fixedPrice: 599 },
        { id: 'cat-ac-gas',          parentId: 'cat-ac',         name: 'AC Gas Refill',      fixedPrice: 1499 },
        { id: 'cat-ac-install',      parentId: 'cat-ac',         name: 'AC Installation',    fixedPrice: 1799 },
        // Carpentry
        { id: 'cat-furniture-fix',   parentId: 'cat-carpentry',  name: 'Furniture Repair',   fixedPrice: 399 },
        { id: 'cat-door-repair',     parentId: 'cat-carpentry',  name: 'Door/Window Fix',    fixedPrice: 299 },
        // Painting
        { id: 'cat-room-paint',      parentId: 'cat-painting',   name: 'Room Painting',      fixedPrice: 2999 },
        { id: 'cat-touch-paint',     parentId: 'cat-painting',   name: 'Touch-up Paint',     fixedPrice: 799 },
    ];

    for (const leaf of leaves) {
        await prisma.serviceCategory.upsert({
            where:  { id: leaf.id },
            update: {},
            create: { ...leaf, isActive: true },
        });
    }
    console.log(`✅ ${leaves.length} service sub-categories seeded`);

    // ─── Review Tags ──────────────────────────────────────────────────────────
    const tags = [
        { label: 'On Time',       slug: 'on_time',        type: 'positive' },
        { label: 'Clean Work',    slug: 'clean_work',     type: 'positive' },
        { label: 'Professional',  slug: 'professional',   type: 'positive' },
        { label: 'Polite',        slug: 'polite',         type: 'positive' },
        { label: 'Good Value',    slug: 'good_value',     type: 'positive' },
        { label: 'Fixed First Try', slug: 'fixed_first_try', type: 'positive' },
        { label: 'Late Arrival',  slug: 'late_arrival',   type: 'negative' },
        { label: 'Overcharged',   slug: 'overcharged',    type: 'negative' },
        { label: 'Rude Behaviour',slug: 'rude',           type: 'negative' },
        { label: 'Incomplete Job',slug: 'incomplete',     type: 'negative' },
    ];

    for (const tag of tags) {
        await prisma.reviewTag.upsert({
            where:  { slug: tag.slug },
            update: {},
            create: tag,
        });
    }
    console.log(`✅ ${tags.length} review tags seeded`);

    console.log('\n🎉 Seed complete!');
    console.log('──────────────────────────────');
    console.log('Admin login:  http://localhost:5173/admin-portal-xk92');
    console.log('Admin phone:  9999999999');
    console.log('──────────────────────────────');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
