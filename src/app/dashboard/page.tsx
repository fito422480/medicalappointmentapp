// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { db } from "@/utils/firebase.config";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function Dashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      where("date", "==", date.toDateString())
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    });
    return () => unsubscribe();
  }, [date]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Calendario de Citas</h2>
      <Calendar onChange={setDate} value={date} className="mb-8" />
      <Card>
        <CardHeader>
          <CardTitle>Citas para el {date.toDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length > 0 ? (
                appointments.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.patientName}</TableCell>
                    <TableCell>{app.time}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No hay citas programadas para este día.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
