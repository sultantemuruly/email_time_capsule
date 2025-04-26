import express from 'express';
import { DateTime } from 'luxon';
import { adminDB } from './firebase-admin.js';

const app = express();
const port = 3008;

const MAIN_APP_URL = process.env.MAIN_APP_URL || 'http://localhost:3000';

let isCheckingEmails = false;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  startClock();
});

function startClock() {
  const now = Date.now();
  const delayUntilNextMinute = 60000 - (now % 60000);

  console.log(`First check will happen in ${Math.floor(delayUntilNextMinute / 1000)} seconds`);

  setTimeout(() => {
    checkEmails();

    const intervalId = setInterval(() => {
      const currentSecond = new Date().getSeconds();
      if (currentSecond !== 0) {
        console.log(`Realigning clock, current second is ${currentSecond}`);
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
    console.log('Previous check still running, skipping this minute.');
    return;
  }

  isCheckingEmails = true;

  const now = DateTime.utc().plus({ hours: 5 }); // Almaty time
  const currentDate = now.toFormat('yyyy-LL-dd');
  const currentTime = now.toFormat('HH:mm');

  const threeMinutesAgo = now.minus({ minutes: 3 });
  const reprocessDate = threeMinutesAgo.toFormat('yyyy-LL-dd');
  const reprocessTime = threeMinutesAgo.toFormat('HH:mm');

  console.log('Checking at Almaty time:', now.toFormat('yyyy-LL-dd HH:mm:ss'));

  try {
    const snapshot = await adminDB.collection('emails')
      .where('status', '==', 'Pending')
      .get();

    const pendingEmails = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      const isTodayOrBefore = data.date <= currentDate;
      const isTimeNowOrBefore = data.time <= currentTime;

      if (isTodayOrBefore && isTimeNowOrBefore) {
        const shouldReprocess = (data.date < reprocessDate) ||
                                (data.date === reprocessDate && data.time <= reprocessTime);

        if (shouldReprocess) {
          console.log(`${doc.id} should be sent now (more than 3 minutes old)`);
          pendingEmails.push({
            id: doc.id,
            data
          });
        } else {
          console.log(`${doc.id} detected but within 3-minute buffer window`);
        }
      }
    });

    for (const email of pendingEmails) {
      await sendEmailViaAPI(email.id);
    }

  } catch (error) {
    console.error('Error in checkEmails:', error);
  } finally {
    isCheckingEmails = false;
  }
}

async function sendEmailViaAPI(documentId) {
  try {
    console.log(`Sending email request to API for document ${documentId}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${MAIN_APP_URL}/api/email-delivery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = await response.json();

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, result.message);
    } else {
      console.log(`Successfully processed email ${documentId}`);
    }

  } catch (error) {
    console.error(`Network or system error sending ${documentId}:`, error.name, error.message);
  }
}
