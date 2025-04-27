import express from 'express';
import { DateTime } from 'luxon';
import { adminDB } from './firebase-admin.js';

const app = express();
const port = process.env.PORT || 5000;
const MAIN_APP_URL = process.env.MAIN_APP_URL || 'http://localhost:3000';

let isCheckingEmails = false;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  startClock();
});

function startClock() {
  const now = Date.now();
  const delayUntilNextMinute = 60000 - (now % 60000);

  console.log(`First email check in ${Math.floor(delayUntilNextMinute / 1000)} seconds`);

  setTimeout(() => {
    checkEmails();

    const intervalId = setInterval(() => {
      const currentSecond = new Date().getSeconds();
      if (currentSecond !== 0) {
        if (currentSecond % 10 === 0) { // Only log realign message every 10 seconds
          console.log(`Realigning clock (current second: ${currentSecond})`);
        }
        clearInterval(intervalId);
        startClock();
      } else {
        checkEmails();
      }
    }, 60000);
  }, delayUntilNextMinute);
}

async function checkEmails() {
  if (isCheckingEmails) {
    console.log('⏳ Previous check still running, skipping...');
    return;
  }

  isCheckingEmails = true;

  const now = DateTime.utc().plus({ hours: 5 }); // Almaty time
  const currentDate = now.toFormat('yyyy-LL-dd');
  const currentTime = now.toFormat('HH:mm');

  console.log(`Checking pending emails at ${now.toFormat('yyyy-LL-dd HH:mm:ss')}`);

  try {
    const snapshot = await adminDB.collection('emails')
      .where('status', '==', 'Pending')
      .get();

    const pendingEmails = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.date <= currentDate && data.time <= currentTime) {
        pendingEmails.push({ id: doc.id, data });
      }
    });

    if (pendingEmails.length) {
      console.log(`Found ${pendingEmails.length} pending emails to send.`);
    } else {
      console.log('No emails to send at this time.');
    }

    for (const email of pendingEmails) {
      await sendEmailViaAPI(email.id);
    }

  } catch (error) {
    console.error('Error checking emails:', error.message);
  } finally {
    isCheckingEmails = false;
  }
}

async function sendEmailViaAPI(documentId) {
  try {
    console.log(`Sending email for document ${documentId}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 sec timeout

    const response = await fetch(`${MAIN_APP_URL}/api/email-delivery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`API Error (${response.status}) for ${documentId}:`, await response.text());
    } else {
      console.log(`Email ${documentId} sent successfully`);
    }

  } catch (error) {
    console.error(`Network error for ${documentId}:`, error.name, error.message);
  }
}
