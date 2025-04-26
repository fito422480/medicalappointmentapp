"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Registrarse</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-600">Correo electrónico</Label>
            <Input
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="hover:border-gray-400 transition-colors duration-200 border-gray-300"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-600">Contraseña</Label>
            <Input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="hover:border-gray-400 transition-colors duration-200 border-gray-300"
            />
          </div>
          <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white transition-colors duration-200">
            Registrarse
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
