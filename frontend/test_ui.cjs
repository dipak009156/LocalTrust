const puppeteer = require('puppeteer');
const prisma = require('../backend/lib/prisma');

async function test() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/login');
    await page.type('input', '8888888888');
    await page.click('button');
    await new Promise(r => setTimeout(r, 2000));
    
    const otp = await prisma.otpRequest.findFirst({ orderBy: { createdAt: 'desc' } });
    console.log('Generated OTP:', otp.code);
    
    const inputs = await page.evaluateHandle(() => document.querySelectorAll('input'));
    const numInputs = await page.evaluate(inputs => inputs.length, inputs);
    console.log('Found', numInputs, 'inputs');
    
    for (let i = 0; i < 6; i++) {
      const el = await page.evaluateHandle((inputs, i) => inputs[i], inputs, i);
      await el.type(otp.code[i]);
    }
    
    const buttons = await page.evaluateHandle(() => document.querySelectorAll('button'));
    const btn = await page.evaluateHandle(buttons => buttons[buttons.length - 1], buttons);
    await btn.click();
    
    await new Promise(r => setTimeout(r, 2000));
    console.log('Current URL:', page.url());
    
    const errorText = await page.evaluate(() => {
        const err = document.querySelector('.text-red-500');
        return err ? err.innerText : 'No error';
    });
    console.log('Error displayed:', errorText);

    await browser.close();
  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
