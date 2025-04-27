import React, { useState, useEffect } from "react";
import { addHoliday, deleteHoliday, getHolidays } from "@/lib/firebase/db";
import { HolidayDate } from "@/types/appointments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Trash2, Plus, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export default function HolidayManager() {
  const [holidays, setHolidays] = useState<HolidayDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHoliday, setNewHoliday] = useState<Omit<HolidayDate, "id">>({
    date: "",
    name: "",
    isFullDay: true,
  });
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Cargar días festivos
  useEffect(() => {
    async function loadHolidays() {
      try {
        setLoading(true);
        const holidayData = await getHolidays();
        setHolidays(holidayData);
      } catch (error) {
        console.error("Error al cargar días festivos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHolidays();
  }, []);

  // Manejar creación de día festivo
  const handleAddHoliday = async () => {
    try {
      if (!newHoliday.date || !newHoliday.name) {
        alert("Por favor complete todos los campos requeridos");
        return;
      }

      // Añadir el día festivo
      const id = await addHoliday(newHoliday);

      // Actualizar el estado local
      setHolidays([...holidays, { id, ...newHoliday }]);

      // Resetear el formulario
      setNewHoliday({
        date: "",
        name: "",
        isFullDay: true,
      });

      // Cerrar el diálogo
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error al añadir día festivo:", error);
      alert("Error al añadir día festivo");
    }
  };

  // Manejar eliminación de día festivo
  const handleDeleteHoliday = async (id: string) => {
    try {
      // Confirmar antes de eliminar
      if (!confirm("¿Está seguro de que desea eliminar este día festivo?")) {
        return;
      }

      // Eliminar el día festivo
      await deleteHoliday(id);

      // Actualizar el estado local
      setHolidays(holidays.filter((holiday) => holiday.id !== id));
    } catch (error) {
      console.error("Error al eliminar día festivo:", error);
      alert("Error al eliminar día festivo");
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        Cargando...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Días Festivos</h2>
          <p className="text-muted-foreground">
            Administre los días festivos en los que no se atenderán citas
          </p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Añadir día festivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir día festivo</DialogTitle>
              <DialogDescription>
                Añada un nuevo día festivo a la lista. Las citas no estarán
                disponibles en estos días.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={newHoliday.date}
                  onChange={(e) =>
                    setNewHoliday({ ...newHoliday, date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Ej: Año Nuevo"
                  value={newHoliday.name}
                  onChange={(e) =>
                    setNewHoliday({ ...newHoliday, name: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFullDay"
                  checked={newHoliday.isFullDay}
                  onCheckedChange={(checked) =>
                    setNewHoliday({ ...newHoliday, isFullDay: checked })
                  }
                />
                <Label htmlFor="isFullDay">Día completo</Label>
              </div>

              {!newHoliday.isFullDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Hora inicio</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newHoliday.startTime || ""}
                      onChange={(e) =>
                        setNewHoliday({
                          ...newHoliday,
                          startTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Hora fin</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newHoliday.endTime || ""}
                      onChange={(e) =>
                        setNewHoliday({
                          ...newHoliday,
                          endTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Input
                  id="description"
                  placeholder="Descripción del día festivo"
                  value={newHoliday.description || ""}
                  onChange={(e) =>
                    setNewHoliday({
                      ...newHoliday,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddHoliday}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {holidays.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay días festivos</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Añada días festivos para bloquear citas en esas fechas
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir día festivo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {holidays.map((holiday) => (
            <Card key={holiday.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                  <span>{holiday.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteHoliday(holiday.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>{formatDate(holiday.date)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {holiday.isFullDay ? (
                    <span className="text-muted-foreground">Día completo</span>
                  ) : (
                    <span className="text-muted-foreground">
                      De {holiday.startTime} a {holiday.endTime}
                    </span>
                  )}
                </div>
                {holiday.description && (
                  <p className="text-sm mt-2">{holiday.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
