// src/app/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded shadow-lg max-w-md">
        <h1 className="text-4xl font-bold mb-6">SysMed</h1>
        <p className="text-lg text-gray-700 mb-8">
          Un sistema moderno para gestionar citas médicas.
        </p>
        <Link href="/login">
          <Button className="mr-4">Iniciar sesión</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline">Registrarse</Button>
        </Link>
      </div>
    </div>
  );
}
