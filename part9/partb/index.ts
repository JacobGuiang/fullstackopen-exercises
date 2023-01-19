/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import qs from 'qs';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());
app.set('query parser', (str: string) => qs.parse(str));

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!height || !weight || isNaN(height) || isNaN(weight)) {
    return res.status(400).send({
      error: 'malformatted parameters',
    });
  }

  return res.send({
    height,
    weight,
    bmi: calculateBmi(height, weight),
  });
});

app.post('/exercises', (req, res) => {
  const dailyExercises: Array<number> = req.body.daily_exercises;
  const target = req.body.target;

  if (!dailyExercises || !target) {
    return res.status(400).send({ error: 'parameters missing' });
  }

  if (
    isNaN(Number(target)) ||
    typeof dailyExercises !== 'object' ||
    !dailyExercises.every((val) => typeof val === 'number')
  ) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  return res.send(calculateExercises(dailyExercises, Number(target)));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
