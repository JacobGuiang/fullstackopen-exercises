import React, { createContext, useContext, useReducer } from 'react';
import { Patient, Diagnosis } from '../types';

import {
  Action,
  patientListCreator,
  curPatientCreator,
  diagnosisListCreator,
} from './reducer';

export type State = {
  patients: { [id: string]: Patient };
  curPatient: Patient | undefined;
  diagnoses: Diagnosis[];
};

const initialState: State = {
  patients: {},
  curPatient: undefined,
  diagnoses: [],
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState,
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider = ({ reducer, children }: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);

export const setPatientList = patientListCreator;

export const setCurPatient = curPatientCreator;

export const setDiagnosisList = diagnosisListCreator;
