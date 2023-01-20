import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { apiBaseUrl } from '../constants';
import { useStateValue, setCurPatient } from '../state';
import { Patient } from '../types';
import PatientModal from '../PatientModal';

const PatientPage = () => {
  const [{ curPatient }, dispatch] = useStateValue();
  const id = useParams().id as string;

  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    if (curPatient?.id === id) {
      return;
    }

    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setCurPatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatient();
  }, [dispatch]);

  if (!curPatient) {
    return null;
  }
  return <PatientModal patient={curPatient} />;
};

export default PatientPage;
