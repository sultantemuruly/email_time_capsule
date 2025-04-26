import express from 'express';
import cron from 'node-cron';

const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

cron.schedule('* * * * *', () => {
  console.log('Cron job running: ', new Date().toLocaleString());
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
