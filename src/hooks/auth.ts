import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase.config";

export type UserRole = "DOCTOR" | "PATIENT" | "ADMIN";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  photoURL?: string | null;
  phoneNumber?: string | null;
  createdAt?: Date;
}

// Registrar un nuevo usuario
export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  role: UserRole = "PATIENT",
  phoneNumber?: string
): Promise<User> {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    // Actualizar perfil con nombre
    await updateProfile(user, { displayName });

    // Crear documento en Firestore con información adicional
    const userData: Omit<User, "uid"> = {
      email: user.email,
      displayName: user.displayName,
      role,
      photoURL: user.photoURL,
      phoneNumber: phoneNumber || user.phoneNumber,
      createdAt: new Date(),
    };

    // Guardar en la colección users (general)
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
    });

    // Guardar en la colección específica según el rol
    const roleCollection = role.toLowerCase() + "s"; // doctors, patients, admins
    await setDoc(doc(db, roleCollection, user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
    });

    return {
      uid: user.uid,
      ...userData,
    };
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
}

// Iniciar sesión
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    // Obtener información adicional del usuario desde Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      throw new Error("Usuario no encontrado en la base de datos");
    }

    const userData = userDoc.data() as Omit<User, "uid">;

    return {
      uid: user.uid,
      ...userData,
    };
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}

// Cerrar sesión
export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

// Convertir un usuario de Firebase a nuestro modelo de usuario
export async function firebaseUserToUser(
  firebaseUser: FirebaseUser | null
): Promise<User | null> {
  if (!firebaseUser) return null;

  try {
    // Obtener datos adicionales de Firestore
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

    // Si el usuario no existe en Firestore, crear un registro básico
    if (!userDoc.exists()) {
      const basicUserData: Omit<User, "uid"> = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role: "PATIENT", // Rol por defecto
        photoURL: firebaseUser.photoURL,
        phoneNumber: firebaseUser.phoneNumber,
        createdAt: new Date(),
      };

      // Guardar usuario básico en Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        ...basicUserData,
        createdAt: serverTimestamp(),
      });

      // También guardarlo en la colección de pacientes
      await setDoc(doc(db, "patients", firebaseUser.uid), {
        ...basicUserData,
        createdAt: serverTimestamp(),
      });

      return {
        uid: firebaseUser.uid,
        ...basicUserData,
      };
    }

    const userData = userDoc.data() as Omit<User, "uid">;

    return {
      uid: firebaseUser.uid,
      ...userData,
    };
  } catch (error) {
    console.error("Error al obtener información del usuario:", error);

    // Devolver un usuario básico en caso de error
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      role: "PATIENT",
      photoURL: firebaseUser.photoURL,
      phoneNumber: firebaseUser.phoneNumber,
    };
  }
}
