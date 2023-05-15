import { useStateValue } from '../state';
import { Patient, Entry } from '../types';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  const [{ diagnoses }] = useStateValue();
  let details;

  switch (entry.type) {
    case 'Hospital':
      details = entry.discharge && (
        <div>
          discharged {entry.discharge.date}: {entry.discharge.criteria}
        </div>
      );
      break;
    case 'HealthCheck':
      details = <div> health check rating: {entry.healthCheckRating}</div>;
      break;
    case 'OccupationalHealthcare':
      details = (
        <div>
          <div>employer: {entry.employerName}</div>
          {entry.sickLeave && (
            <div>
              sickleave from {entry.sickLeave.startDate} to{' '}
              {entry.sickLeave.endDate}
            </div>
          )}
        </div>
      );
      break;
    default:
      return assertNever(entry);
  }

  return (
    <>
      {entry.date} <i>{entry.description}</i>
      {details}
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes?.map((code) => (
            <li key={code}>
              {code} {diagnoses[code].name}
            </li>
          ))}
        </ul>
      )}
      <div>diagnose by {entry.specialist}</div>
    </>
  );
};

const PatientModal = ({ patient }: { patient: Patient }) => {
  const { entries } = patient;

  return (
    <div>
      <h1>{patient.name}</h1>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <h2>entries</h2>
      {entries.map((entry) => (
        <div key={entry.id}>
          <EntryDetails entry={entry} />
          <br />
        </div>
      ))}
    </div>
  );
};

export default PatientModal;
