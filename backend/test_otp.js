const prisma = require('./lib/prisma');

async function test() {
  try {
    const created = await prisma.otpRequest.create({
      data: {
        phone: '9999999999',
        code: '123456',
        role: 'USER',
        expiresAt: new Date(Date.now() + 1000000)
      }
    });
    console.log('Created OTP:', created);

    // Now test findFirst
    const digits = '9999999999';
    const role = 'USER';
    const otp = '123456';

    const otpRecord = await prisma.otpRequest.findFirst({
        where: { phone: digits, used: false, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' },
    });

    console.log('Found Record:', otpRecord);

    if (!otpRecord) {
        console.log('OTP expired or not found.');
        return;
    }
    if (otpRecord.code !== String(otp)) {
        console.log('Invalid OTP');
        return;
    }
    if (otpRecord.role !== role) {
        console.log('Role mismatch');
        return;
    }

    console.log('OTP Verified successfully!');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
