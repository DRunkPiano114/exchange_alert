const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

async function sendEmail(to, rate, from, toCurr, threshold) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: `汇率提醒：${from} → ${toCurr} 低于 ${threshold}`,
    text: `当前汇率为 ${rate}，已低于设定值 ${threshold}`
  });
}

async function checkRates() {
  const alerts = await prisma.alert.findMany({ include: { user: true } });

  for (const alert of alerts) {
    const url = `https://api.exchangerate.host/latest?base=${alert.fromCurrency}&symbols=${alert.toCurrency}`;
    const res = await axios.get(url);
    const rate = res.data.rates[alert.toCurrency];

    if (rate < alert.threshold) {
      await sendEmail(alert.emailTo, rate, alert.fromCurrency, alert.toCurrency, alert.threshold);
    }
  }

  await prisma.$disconnect();
}

checkRates();