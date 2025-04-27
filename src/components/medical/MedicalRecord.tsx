import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  PlusCircle, 
  AlertCircle 
} from "lucide-react";

// Tipos definidos localmente
interface MedicalCondition {
  id: string;
  name: string;
  diagnosisDate: string;
  status: 'active' | 'managed' | 'resolved';
  notes?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  condition?: string;
}

interface PatientProfile {
  id: string;
  displayName?: string | null;
  email?: string | null;
}

interface PatientMedicalRecordProps {
  patient: PatientProfile;
  initialConditions?: MedicalCondition[];
  initialMedications?: Medication[];
  onSave?: (data: { conditions: MedicalCondition[], medications: Medication[] }) => Promise<void>;
}

const PatientMedicalRecord: React.FC<PatientMedicalRecordProps> = ({ 
  patient, 
  initialConditions = [],
  initialMedications = [],
  onSave 
}) => {
  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>(initialConditions);
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  
  // Modal states
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  
  // Form states
  const [newCondition, setNewCondition] = useState<Partial<MedicalCondition>>({});
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({});

  const handleAddCondition = async () => {
    if (!newCondition.name) return;

    const condition: MedicalCondition = {
      id: `condition_${Date.now()}`,
      name: newCondition.name || '',
      diagnosisDate: newCondition.diagnosisDate || new Date().toISOString().split('T')[0],
      status: newCondition.status || 'active',
      notes: newCondition.notes
    };

    const updatedConditions = [...medicalConditions, condition];
    setMedicalConditions(updatedConditions);

    // Llamar a la función de guardado si está definida
    if (onSave) {
      await onSave({
        conditions: updatedConditions,
        medications
      });
    }

    setNewCondition({});
    setIsConditionModalOpen(false);
  };

  const handleAddMedication = async () => {
    if (!newMedication.name) return;

    const medication: Medication = {
      id: `medication_${Date.now()}`,
      name: newMedication.name || '',
      dosage: newMedication.dosage || '',
      frequency: newMedication.frequency || '',
      startDate: newMedication.startDate || new Date().toISOString().split('T')[0],
      endDate: newMedication.endDate,
      condition: newMedication.condition
    };

    const updatedMedications = [...medications, medication];
    setMedications(updatedMedications);

    // Llamar a la función de guardado si está definida
    if (onSave) {
      await onSave({
        conditions: medicalConditions,
        medications: updatedMedications
      });
    }

    setNewMedication({});
    setIsMedicationModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <ShieldCheck className="h-8 w-8 mr-3 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Historial Médico</h1>
          <p className="text-muted-foreground">
            Información médica de {patient.displayName || 'Paciente'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="conditions">
        <TabsList className="mb-4">
          <TabsTrigger value="conditions">Condiciones Médicas</TabsTrigger>
          <TabsTrigger value="medications">Medicaciones</TabsTrigger>
          <TabsTrigger value="allergies">Alergias</TabsTrigger>
        </TabsList>

        <TabsContent value="conditions">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Condiciones Médicas</CardTitle>
                  <CardDescription>
                    Registro de condiciones médicas diagnosticadas
                  </CardDescription>
                </div>
                <Dialog 
                  open={isConditionModalOpen} 
                  onOpenChange={setIsConditionModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <PlusCircle className="h-4 w-4 mr-2" /> 
                      Añadir Condición
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nueva Condición Médica</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm">Nombre de la Condición</label>
                        <Input 
                          placeholder="Ej: Hipertensión"
                          value={newCondition.name || ''}
                          onChange={(e) => setNewCondition({
                            ...newCondition, 
                            name: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm">Fecha de Diagnóstico</label>
                        <Input 
                          type="date"
                          value={newCondition.diagnosisDate || ''}
                          onChange={(e) => setNewCondition({
                            ...newCondition, 
                            diagnosisDate: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm">Estado</label>
                        <Select
                          value={newCondition.status || 'active'}
                          onValueChange={(value) => setNewCondition({
                            ...newCondition, 
                            status: value as MedicalCondition['status']
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Activo</SelectItem>
                            <SelectItem value="managed">Controlado</SelectItem>
                            <SelectItem value="resolved">Resuelto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm">Notas (opcional)</label>
                        <Textarea 
                          placeholder="Información adicional"
                          value={newCondition.notes || ''}
                          onChange={(e) => setNewCondition({
                            ...newCondition, 
                            notes: e.target.value
                          })}
                        />
                      </div>
                      <Button 
                        onClick={handleAddCondition}
                        className="w-full"
                      >
                        Guardar Condición
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {medicalConditions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                  <p>No hay condiciones médicas registradas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicalConditions.map((condition) => (
                    <Card key={condition.id} className="border-l-4" 
                      style={{
                        borderLeftColor: 
                          condition.status === 'active' ? 'red' : 
                          condition.status === 'managed' ? 'orange' : 
                          'green'
                      }}
                    >
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold mr-2">{condition.name}</h3>
                            <Badge 
                              variant={
                                condition.status === 'active' ? 'destructive' :
                                condition.status === 'managed' ? 'warning' : 
                                'default'
                              }
                            >
                              {condition.status === 'active' ? 'Activo' :
                               condition.status === 'managed' ? 'Controlado' : 
                               'Resuelto'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Diagnosticado: {new Date(condition.diagnosisDate).toLocaleDateString()}
                          </p>
                          {condition.notes && (
                            <p className="text-sm mt-2">{condition.notes}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Medicaciones</CardTitle>
                  <CardDescription>
                    Registro de medicamentos actuales y pasados
                  </CardDescription>
                </div>
                <Dialog 
                  open={isMedicationModalOpen} 
                  onOpenChange={setIsMedicationModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <PlusCircle className="h-4 w-4 mr-2" /> 
                      Añadir Medicación
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nueva Medicación</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm">Nombre del Medicamento</label>
                        <Input 
                          placeholder="Ej: Aspirina"
                          value={newMedication.name || ''}
                          onChange={(e) => setNewMedication({
                            ...newMedication, 
                            name: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm">Dosis</label>
                        <Input 
                          placeholder="Ej: 500mg"
                          value={newMedication.dosage || ''}
                          onChange={(e) => setNewMedication({
                            ...newMedication, 
                            dosage: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm">Frecuencia</label>
                        <Input 
                          placeholder="Ej: Cada 8 horas"
                          value={newMedication.frequency || ''}
                          onChange={(e) => setNewMedication({
                            ...newMedication, 
                            frequency: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm">Fecha de Inicio</label>
                        <Input 
                          type="date"
                          value={newMedication.startDate || ''}
                          onChange={(e) => setNewMedication({
                            ...newMedication, 
                            startDate: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm">Fecha de Fin (opcional)</label>
                        <Input 
                          type="date"
                          value={newMedication.endDate || ''}
                          onChange={(e) => setNewMedication({
                            ...newMedication, 
                            endDate: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm">Condición Relacionada (opcional)</label>
                        <Select
                          value={newMedication.condition || ''}
                          onValueChange={(value) => setNewMedication({
                            ...newMedication, 
                            condition: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione condición" />
                          </SelectTrigger>
                          <SelectContent>
                            {medicalConditions.map((condition) => (
                              <SelectItem 
                                key={condition.id} 
                                value={condition.name}
                              >
                                {condition.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleAddMedication}
                        className="w-full"
                      >
                        Guardar Medicación
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {medications.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                  <p>No hay medicaciones registradas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medications.map((medication) => (
                    <Card key={medication.id} className="border-l-4 border-blue-500">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold mr-2">{medication.name}</h3>
                            <Badge variant="secondary">{medication.dosage}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Frecuencia: {medication.frequency}
                          </p<div className="text-sm mt-1 flex items-center space-x-2">
                            <span>
                              Desde: {new Date(medication.startDate).toLocaleDateString()}
                            </span>
                            {medication.endDate && (
                              <span>
                                Hasta: {new Date(medication.endDate).toLocaleDateString()}
                              </span>
                            )}
                            {medication.condition && (
                              <Badge variant="outline">
                                {medication.condition}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allergies">
          <Card>
            <CardHeader>
              <CardTitle>Alergias</CardTitle>
              <CardDescription>
                Registro de alergias conocidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                <p>No hay alergias registradas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientMedicalRecord;