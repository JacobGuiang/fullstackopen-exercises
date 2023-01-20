import express from 'express';
import diagnoseRouter from './routes/diagnose';
import patientRouter from './routes/patient';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/diagnoses', diagnoseRouter);
app.use('/api/patients', patientRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
