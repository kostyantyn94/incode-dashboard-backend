import express from 'express';
import dotenv from 'dotenv';
import dashboards from './routes/dashboards';
import tasks from './routes/tasks';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/dashboard', dashboards);
app.use('/api/v1/task', tasks);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
