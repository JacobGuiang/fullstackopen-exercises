import {
  PatientWithoutId,
  Gender,
  HealthCheckRating,
  Diagnosis,
  EntryWithoutId,
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isArray = (list: unknown): list is Array<unknown> => {
  return typeof list === 'object';
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseString = (param: unknown): string => {
  if (!param || !isString(param)) {
    throw new Error('Incorrect or missing paramater: ' + param);
  }
  return param;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseDiagnosisCodes = (
  diagnosisCodes: unknown
): Array<Diagnosis['code']> => {
  if (
    !diagnosisCodes ||
    !isArray(diagnosisCodes) ||
    !diagnosisCodes.every((code) => isString(code))
  ) {
    throw new Error('Incorrect or missing diagnosis codes: ' + diagnosisCodes);
  }
  return diagnosisCodes as Array<Diagnosis['code']>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  console.log(Object.values(HealthCheckRating), param);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (
    healthCheckRating !== 0 &&
    (!healthCheckRating || !isHealthCheckRating(healthCheckRating))
  ) {
    throw new Error(
      'Incorrect or missing health check rating: ' + healthCheckRating
    );
  }
  return healthCheckRating;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewPatient = (obj: any): PatientWithoutId => {
  const newPatient: PatientWithoutId = {
    name: parseString(obj.name),
    dateOfBirth: parseDate(obj.dateOfBirth),
    ssn: parseString(obj.ssn),
    gender: parseGender(obj.gender),
    occupation: parseString(obj.occupation),
    entries: [],
  };

  return newPatient;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewEntry = (obj: any): EntryWithoutId => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newEntry: any = {
    description: parseString(obj.description),
    date: parseDate(obj.date),
    specialist: parseString(obj.specialist),
  };

  if (obj.diagnosisCodes) {
    newEntry.diagnosisCodes = parseDiagnosisCodes(obj.diagnosisCodes);
  }

  switch (obj.type) {
    case 'Hospital': {
      const discharge = {
        date: parseDate(obj.discharge.date),
        criteria: parseString(obj.discharge.criteria),
      };
      newEntry.discharge = discharge;
      break;
    }
    case 'OccupationalHealthcare': {
      if (obj.sickLeave) {
        const sickLeave = {
          startDate: parseDate(obj.sickLeave.startDate),
          endDate: parseDate(obj.sickLeave.endDate),
        };
        newEntry.sickLeave = sickLeave;
      }
      newEntry.employerName = parseString(obj.employerName);
      break;
    }
    case 'HealthCheck':
      newEntry.healthCheckRating = parseHealthCheckRating(
        obj.healthCheckRating
      );
      break;
    default:
      throw new Error(`error with entry: ${obj}`);
  }

  return newEntry as EntryWithoutId;
};
