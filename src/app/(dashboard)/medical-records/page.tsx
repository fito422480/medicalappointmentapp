"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getPatientProfile } from "@/lib/firebase/db";
import MedicalRecord from "@/components/medical/MedicalRecord";
import { Patient } from "@/types/appointments";
import { updatePatientProfile } from "@/lib/firebase/db";

export default function PatientMedicalRecordPage() {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [initialConditions, setInitialConditions] = useState([]);
  const [initialMedications, setInitialMedications] = useState([]);

  useEffect(() => {
    async function fetchPatientData() {
      if (user) {
        try {
          // Fetch patient profile
          const patientProfile = await getPatientProfile(user.uid);
          setPatient(patientProfile);

          // Convert existing medical conditions and medications to the required format
          const conditions =
            patientProfile?.medicalConditions?.map((condition, index) => ({
              id: `condition_${index}`,
              name: condition,
              diagnosisDate: new Date().toISOString().split("T")[0],
              status: "active",
            })) || [];

          const medications =
            patientProfile?.medications?.map((medication, index) => ({
              id: `medication_${index}`,
              name: medication,
              dosage: "",
              frequency: "",
              startDate: new Date().toISOString().split("T")[0],
            })) || [];

          setInitialConditions(conditions);
          setInitialMedications(medications);
        } catch (error) {
          console.error("Error fetching patient profile:", error);
        }
      }
    }

    fetchPatientData();
  }, [user]);

  const handleSaveMedicalRecord = async (data) => {
    if (!patient) return;

    try {
      // Update patient profile with medical information
      await updatePatientProfile(patient.id, {
        medicalConditions: data.conditions.map((c) => c.name),
        medications: data.medications.map((m) => m.name),
      });
    } catch (error) {
      console.error("Error saving medical record:", error);
    }
  };

  if (!patient) return <div>Cargando...</div>;

  return (
    <MedicalRecord
      patient={patient}
      initialConditions={initialConditions}
      initialMedications={initialMedications}
      onSave={handleSaveMedicalRecord}
    />
  );
}
