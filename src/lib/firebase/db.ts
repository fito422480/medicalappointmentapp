import { db } from "./firebase-config"; // Aquí debes inicializar Firebase
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

// Obtener el perfil del doctor
export const getDoctorProfile = async (uid: string) => {
  const docRef = doc(db, "doctors", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Obtener citas del doctor
export const getDoctorAppointments = async (uid: string) => {
  const q = query(collection(db, "appointments"), where("doctorId", "==", uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

// Obtener el perfil del paciente
export const getPatientProfile = async (uid: string) => {
  const docRef = doc(db, "patients", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Obtener citas del paciente
export const getPatientAppointments = async (uid: string) => {
  const q = query(collection(db, "appointments"), where("patientId", "==", uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};
