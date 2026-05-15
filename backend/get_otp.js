const prisma = require('./lib/prisma');

async function test() {
  try {
    const otp = await prisma.otpRequest.findFirst({
        orderBy: { createdAt: 'desc' }
    });
    console.log(otp);
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
