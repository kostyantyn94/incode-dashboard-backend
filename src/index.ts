import express from 'express';
import dotenv from 'dotenv';
import dashboards from './routes/dashboards';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/dashboard', dashboards);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
