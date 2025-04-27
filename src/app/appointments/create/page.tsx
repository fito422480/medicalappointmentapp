"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { getDoctors } from "@/lib/firebase/db";
import { bookAppointment } from "@/lib/services/appointment-service";
import MedicalCalendar from "@/components/medical/MedicalCalendar";
import { Doctor } from "@/types/appointments";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Check, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CreateAppointmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    async function loadInitialData() {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // Cargar lista de doctores
        const doctorsData = await getDoctors();
        setDoctors(doctorsData);

        // Si solo hay un doctor, seleccionarlo por defecto
        if (doctorsData.length === 1) {
          setSelectedDoctor(doctorsData[0].id);
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        setErrorMessage(
          "Error al cargar datos. Por favor, intente nuevamente."
        );
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [user, router]);

  // Manejar selección de horario
  const handleTimeSlotSelect = (
    date: string,
    time: string,
    doctorId: string
  ) => {
    setSelectedDate(date);
    setSelectedTime(time);

    // Si el doctorId es diferente al seleccionado, actualizar la selección
    if (doctorId !== selectedDoctor) {
      setSelectedDoctor(doctorId);
    }
  };

  // Manejar cambio de doctor
  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    // Resetear fecha y hora al cambiar de doctor
    setSelectedDate("");
    setSelectedTime("");
  };

  // Manejar creación de cita
  const handleCreateAppointment = async () => {
    if (!user || !selectedDoctor || !selectedDate || !selectedTime) {
      setErrorMessage("Por favor, complete todos los campos requeridos.");
      return;
    }

    try {
      setSubmitting(true);

      // Obtener información del doctor seleccionado
      const doctor = doctors.find((doc) => doc.id === selectedDoctor);

      if (!doctor) {
        throw new Error("Doctor no encontrado");
      }

      // Calcular hora de finalización (30 minutos después)
      const [hours, minutes] = selectedTime.split(":");
      const endTime = `${hours}:${
        parseInt(minutes) + 30 >= 60
          ? `${parseInt(hours) + 1}:${(parseInt(minutes) + 30) % 60}`.padStart(
              5,
              "0"
            )
          : `${hours}:${parseInt(minutes) + 30}`.padStart(5, "0")
      }`;

      // Crear la cita
      await bookAppointment({
        title: `Consulta con ${doctor.displayName}`,
        description: description || "Consulta médica",
        date: selectedDate,
        startTime: selectedTime,
        endTime: endTime,
        status: "scheduled",
        doctorId: selectedDoctor,
        doctorName: doctor.displayName,
        patientId: user.uid,
        patientName: user.displayName || "Paciente",
        specialty: doctor.specialty,
      });

      // Redirigir al usuario a la página de citas
      router.push("/appointments");
    } catch (error: any) {
      console.error("Error al crear cita:", error);
      setErrorMessage(
        error.message ||
          "Error al crear la cita. Por favor, intente nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agendar Cita</h1>
          <p className="text-muted-foreground">
            Seleccione un médico y un horario disponible
          </p>
        </div>

        {/* Selector de doctor */}
        <div className="w-full md:w-auto">
          <Select value={selectedDoctor} onValueChange={handleDoctorChange}>
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue placeholder="Seleccionar médico" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.displayName} - {doctor.specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendario para seleccionar fecha y hora */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <MedicalCalendar
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            onTimeSlotSelect={handleTimeSlotSelect}
            userRole="PATIENT"
          />
        </CardContent>
      </Card>

      {/* Detalles de la cita */}
      {selectedDate && selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la cita</CardTitle>
            <CardDescription>
              Revise los detalles antes de confirmar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Médico</Label>
                <div className="flex items-center p-2 rounded-md bg-muted/50">
                  {doctors.find((d) => d.id === selectedDoctor)?.displayName} -{" "}
                  {doctors.find((d) => d.id === selectedDoctor)?.specialty}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fecha y hora</Label>
                <div className="flex items-center p-2 rounded-md bg-muted/50">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  {new Date(selectedDate).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  <Clock className="h-4 w-4 mx-2 text-muted-foreground" />
                  {selectedTime}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Motivo de la consulta (opcional)
              </Label>
              <Textarea
                id="description"
                placeholder="Describa brevemente el motivo de su consulta"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md">
                {errorMessage}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/appointments")}
            >
              Cancelar
            </Button>
            <Button onClick={() => setShowConfirmDialog(true)}>
              Confirmar cita
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Diálogo de confirmación */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cita</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea agendar esta cita?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Médico:</p>
              <p className="text-sm">
                {doctors.find((d) => d.id === selectedDoctor)?.displayName} -{" "}
                {doctors.find((d) => d.id === selectedDoctor)?.specialty}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Fecha y hora:</p>
              <p className="text-sm">
                {new Date(selectedDate).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                a las {selectedTime}
              </p>
            </div>

            {description && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Motivo de la consulta:</p>
                <p className="text-sm">{description}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateAppointment} disabled={submitting}>
              {submitting ? (
                "Procesando..."
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirmar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
