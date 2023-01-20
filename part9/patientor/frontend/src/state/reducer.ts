import { State } from './state';
import { Diagnosis, Patient } from '../types';

export type Action =
  | {
      type: 'SET_PATIENT_LIST';
      payload: Patient[];
    }
  | {
      type: 'ADD_PATIENT';
      payload: Patient;
    }
  | {
      type: 'SET_CUR_PATIENT';
      payload: Patient;
    }
  | {
      type: 'SET_DIAGNOSIS_LIST';
      payload: Diagnosis[];
    };

export const patientListCreator = (patients: Patient[]): Action => {
  return { type: 'SET_PATIENT_LIST', payload: patients };
};

export const curPatientCreator = (patient: Patient): Action => {
  return { type: 'SET_CUR_PATIENT', payload: patient };
};

export const diagnosisListCreator = (diagnoses: Diagnosis[]): Action => {
  return { type: 'SET_DIAGNOSIS_LIST', payload: diagnoses };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PATIENT_LIST':
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case 'SET_CUR_PATIENT':
      return {
        ...state,
        curPatient: action.payload,
      };
    case 'SET_DIAGNOSIS_LIST':
      return {
        ...state,
        diagnoses: action.payload,
      };
    default:
      return state;
  }
};
