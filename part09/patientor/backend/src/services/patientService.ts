import patients from '../../data/patients';
import {
  Patient,
  PublicPatient,
  PatientWithoutId,
  EntryWithoutId,
} from '../types';
import { v1 as uuid } from 'uuid';

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addPatient = (patient: PatientWithoutId): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (
  entry: EntryWithoutId,
  patientId: string
): Patient | undefined => {
  const patientToUpdate = patients.find((patient) => patient.id === patientId);

  if (!patientToUpdate) {
    return undefined;
  }

  const newEntry = {
    id: uuid(),
    ...entry,
  };
  const { entries } = patientToUpdate;
  entries.push(newEntry);

  return patientToUpdate;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  getPatientById,
  addPatient,
  addEntry,
};
