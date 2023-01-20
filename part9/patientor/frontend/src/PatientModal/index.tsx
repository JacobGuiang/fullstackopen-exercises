import { useStateValue } from '../state';
import {
  Patient,
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
} from '../types';

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  const discharge = entry.discharge;
  return (
    <div>
      {discharge.date} {discharge.criteria}
    </div>
  );
};

const OccupationalHealthcareEntryDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  const { sickLeave } = entry;
  return (
    <>
      <div>employer: {entry.employerName}</div>
      {sickLeave && <div>start date: {sickLeave.startDate}</div>}
      {sickLeave && <div>end date: {sickLeave.endDate}</div>}
    </>
  );
};

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  return <div>health check rating: {entry.healthCheckRating}</div>;
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntryDetails entry={entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    case 'HealthCheck':
      return <HealthCheckEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const PatientModal = ({ patient }: { patient: Patient }) => {
  const [{ diagnoses }] = useStateValue();
  const { entries } = patient;

  const DiagnosisCodes = ({ entry }: { entry: Entry }) => {
    <ul>
      {entry.diagnosisCodes?.map((code) => (
        <li key={code}>
          {code} {diagnoses.find((diagnosis) => diagnosis.code === code)?.name}
        </li>
      ))}
    </ul>;
  };

  return (
    <div>
      <h1>{patient.name}</h1>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <h2>entries</h2>
      {entries.map((entry) => (
        <div key={entry.id}>
          <div>
            {entry.date} {entry.description}
          </div>
          {entry.diagnosisCodes && DiagnosisCodes}
          <EntryDetails entry={entry} />
          <div>diagnose by {entry.specialist}</div>
          <br />
        </div>
      ))}
    </div>
  );
};

export default PatientModal;
