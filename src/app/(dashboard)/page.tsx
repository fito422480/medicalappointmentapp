import React, { useState, useEffect } from "react";
import {
  Activity,
  Calendar,
  Clock,
  Users,
  Bell,
  CheckCircle2,
  XCircle,
  UserRound,
  PlusCircle,
  ChevronRight,
  Search,
  BarChart3,
  ListFilter,
  Stethoscope,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Función para formatear fechas
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Función para formatear fechas cortas
const formatShortDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  }).format(date);
};

// Componente para la tarjeta de estadísticas
const StatCard = ({
  icon: Icon,
  title,
  value,
  description,
  trend,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold">{value}</p>
              {trend && (
                <Badge
                  variant={trend.positive ? "outline" : "destructive"}
                  className="text-xs"
                >
                  {trend.positive ? "↑" : "↓"} {trend.value}%
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para tarjeta de cita
const AppointmentCard = ({ appointment, userRole }) => {
  const { id, date, startTime, patientName, doctorName, specialty, status } =
    appointment;
  const statusColors = {
    scheduled: "bg-blue-50 border-blue-100 text-blue-600",
    completed: "bg-green-50 border-green-100 text-green-600",
    cancelled: "bg-red-50 border-red-100 text-red-600",
  };

  const statusIcons = {
    scheduled: <Clock className="h-4 w-4 mr-1" />,
    completed: <CheckCircle2 className="h-4 w-4 mr-1" />,
    cancelled: <XCircle className="h-4 w-4 mr-1" />,
  };

  const statusText = {
    scheduled: "Programada",
    completed: "Completada",
    cancelled: "Cancelada",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-sm font-medium">
                {formatDate(`${date}T${startTime}`)}
              </span>
            </div>

            <div className="flex items-center mt-1">
              {userRole === "DOCTOR" ? (
                <div className="flex items-center">
                  <UserRound className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm">{patientName}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Stethoscope className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm">{doctorName}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {specialty}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <Badge variant="outline" className={`${statusColors[status]}`}>
            {statusIcons[status]}
            {statusText[status]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para la lista de citas
const AppointmentsList = ({ appointments, userRole }) => {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No hay citas programadas</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {userRole === "DOCTOR"
            ? "No tienes citas programadas próximamente"
            : "No tienes consultas programadas. ¡Agenda tu primera cita!"}
        </p>
        <Button className="mt-4">
          <PlusCircle className="h-4 w-4 mr-2" />
          {userRole === "DOCTOR" ? "Añadir disponibilidad" : "Agendar cita"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          userRole={userRole}
        />
      ))}
    </div>
  );
};

// Componente para mostrar médicos destacados
const FeaturedDoctors = ({ doctors, onSelectDoctor }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((doctor) => (
        <Card
          key={doctor.id}
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="relative h-32">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50" />
            <div className="absolute bottom-0 left-0 w-full p-4">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarImage src={doctor.profileImage} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {doctor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <h3 className="font-medium">{doctor.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {doctor.specialty}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Valoración</span>
                <div className="flex items-center">
                  <span className="font-medium">{doctor.rating}</span>
                  <svg
                    className="h-4 w-4 text-yellow-500 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Próxima disponibilidad
                </span>
                <span className="font-medium">{doctor.nextAvailable}</span>
              </div>

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => onSelectDoctor(doctor.id)}
              >
                Agendar cita
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Componente para la gráfica de barras simplificada
const SimpleBarChart = ({ data, height = 160 }) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div>0</div>
        <div>{maxValue / 2}</div>
        <div>{maxValue}</div>
      </div>
      <div className="flex items-end h-40 gap-2">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className="w-full bg-primary/20 rounded-t-sm relative group"
                style={{ height: `${percentage}%` }}
              >
                <div
                  className="absolute bottom-0 left-0 w-full bg-primary rounded-t-sm transition-all group-hover:h-full"
                  style={{ height: "40%" }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background border px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.value}
                </div>
              </div>
              <span className="text-xs">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Componente principal del Dashboard
const Dashboard = ({ userRole = "DOCTOR" }) => {
  // Estados para los datos
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    // Estadísticas para doctores
    const doctorStats = {
      appointments: {
        value: 24,
        trend: { positive: true, value: 12 },
        description: "Citas esta semana",
      },
      patients: {
        value: 156,
        trend: { positive: true, value: 8 },
        description: "Pacientes totales",
      },
      ratings: { value: 4.8, description: "Valoración promedio (de 5)" },
      income: {
        value: "₲ 3.2M",
        trend: { positive: true, value: 15 },
        description: "Ingresos este mes",
      },
    };

    // Estadísticas para pacientes
    const patientStats = {
      appointments: {
        value: 3,
        trend: { positive: true, value: 1 },
        description: "Citas pendientes",
      },
      doctors: { value: 5, description: "Médicos visitados" },
      records: { value: 12, description: "Registros médicos" },
      nextAppointment: { value: "2 días", description: "Próxima consulta" },
    };

    // Datos de ejemplo para citas
    const sampleAppointments = [
      {
        id: "1",
        date: "2025-04-29",
        startTime: "10:00",
        endTime: "10:30",
        patientName: "Carlos Ramírez",
        doctorName: "Dra. Ana Martínez",
        specialty: "Cardiología",
        status: "scheduled",
      },
      {
        id: "2",
        date: "2025-04-30",
        startTime: "15:00",
        endTime: "15:30",
        patientName: "María Gómez",
        doctorName: "Dr. Juan López",
        specialty: "Dermatología",
        status: "scheduled",
      },
      {
        id: "3",
        date: "2025-04-28",
        startTime: "09:00",
        endTime: "09:30",
        patientName: "Luis Rodríguez",
        doctorName: "Dra. Sofía García",
        specialty: "Pediatría",
        status: "completed",
      },
    ];

    // Datos de ejemplo para médicos destacados
    const sampleDoctors = [
      {
        id: "1",
        name: "Dra. Ana Martínez",
        specialty: "Cardiología",
        rating: 4.9,
        nextAvailable: "Hoy, 15:00",
        profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        id: "2",
        name: "Dr. Juan López",
        specialty: "Dermatología",
        rating: 4.7,
        nextAvailable: "Mañana, 10:30",
        profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        id: "3",
        name: "Dra. Sofía García",
        specialty: "Pediatría",
        rating: 4.8,
        nextAvailable: "Mañana, 16:00",
        profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
      },
    ];

    // Datos para el gráfico
    const sampleChartData = [
      { label: "Lun", value: 8 },
      { label: "Mar", value: 12 },
      { label: "Mié", value: 10 },
      { label: "Jue", value: 15 },
      { label: "Vie", value: 20 },
      { label: "Sáb", value: 5 },
      { label: "Dom", value: 2 },
    ];

    // Simular actividad reciente
    const sampleActivity = [
      {
        id: 1,
        type: "appointment_scheduled",
        date: "2025-04-27T10:30:00",
        message: "Nueva cita agendada con Carlos Ramírez",
      },
      {
        id: 2,
        type: "appointment_cancelled",
        date: "2025-04-26T14:20:00",
        message: "María Gómez canceló su cita del 28/04",
      },
      {
        id: 3,
        type: "rating_received",
        date: "2025-04-26T09:15:00",
        message: "Has recibido una valoración de 5 estrellas",
      },
    ];

    // Establecer los datos según el rol del usuario
    setTimeout(() => {
      setStats(userRole === "DOCTOR" ? doctorStats : patientStats);
      setAppointments(sampleAppointments);
      setDoctors(sampleDoctors);
      setChartData(sampleChartData);
      setRecentActivity(sampleActivity);
      setLoading(false);
    }, 1000);
  }, [userRole]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold">
          {userRole === "DOCTOR" ? "Panel Médico" : "Mi Salud"}
        </h1>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-10 w-full md:w-64" />
          </div>

          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            {userRole === "DOCTOR" ? "Nueva disponibilidad" : "Nueva cita"}
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          title="Citas"
          value={stats.appointments?.value}
          description={stats.appointments?.description}
          trend={stats.appointments?.trend}
          color="blue"
        />

        <StatCard
          icon={userRole === "DOCTOR" ? Users : UserRound}
          title={userRole === "DOCTOR" ? "Pacientes" : "Médicos"}
          value={
            userRole === "DOCTOR" ? stats.patients?.value : stats.doctors?.value
          }
          description={
            userRole === "DOCTOR"
              ? stats.patients?.description
              : stats.doctors?.description
          }
          trend={userRole === "DOCTOR" ? stats.patients?.trend : null}
          color="purple"
        />

        <StatCard
          icon={userRole === "DOCTOR" ? Activity : Clock}
          title={userRole === "DOCTOR" ? "Valoración" : "Próxima cita"}
          value={
            userRole === "DOCTOR"
              ? stats.ratings?.value
              : stats.nextAppointment?.value
          }
          description={
            userRole === "DOCTOR"
              ? stats.ratings?.description
              : stats.nextAppointment?.description
          }
          color={userRole === "DOCTOR" ? "green" : "yellow"}
        />

        <StatCard
          icon={userRole === "DOCTOR" ? BarChart3 : CheckCircle2}
          title={userRole === "DOCTOR" ? "Ingresos" : "Registros"}
          value={
            userRole === "DOCTOR" ? stats.income?.value : stats.records?.value
          }
          description={
            userRole === "DOCTOR"
              ? stats.income?.description
              : stats.records?.description
          }
          trend={userRole === "DOCTOR" ? stats.income?.trend : null}
          color={userRole === "DOCTOR" ? "red" : "green"}
        />
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lado izquierdo */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <Tabs defaultValue="upcoming">
              <div className="flex justify-between items-center px-6 pt-6">
                <div>
                  <h2 className="text-xl font-bold">Citas</h2>
                  <p className="text-sm text-muted-foreground">
                    Administra tus consultas médicas
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                  <TabsTrigger value="past">Pasadas</TabsTrigger>
                  {userRole === "DOCTOR" && (
                    <TabsTrigger value="all">Todas</TabsTrigger>
                  )}
                </TabsList>
              </div>
              <CardContent className="pt-6">
                <TabsContent value="upcoming" className="m-0">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Badge className="bg-primary/10 text-primary border-primary/20 mr-2">
                        {
                          appointments.filter((a) => a.status === "scheduled")
                            .length
                        }{" "}
                        citas programadas
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        Próxima:{" "}
                        {appointments.filter((a) => a.status === "scheduled")
                          .length > 0
                          ? formatShortDate(
                              appointments.filter(
                                (a) => a.status === "scheduled"
                              )[0].date
                            )
                          : "N/A"}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ListFilter className="h-4 w-4 mr-1" />
                      Filtrar
                    </Button>
                  </div>
                  <AppointmentsList
                    appointments={appointments.filter(
                      (a) => a.status === "scheduled"
                    )}
                    userRole={userRole}
                  />
                </TabsContent>
                <TabsContent value="past" className="m-0">
                  <div className="flex justify-between items-center mb-4">
                    <Badge className="bg-green-50 text-green-600 border-green-100">
                      {
                        appointments.filter((a) => a.status === "completed")
                          .length
                      }{" "}
                      citas completadas
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <ListFilter className="h-4 w-4 mr-1" />
                      Filtrar
                    </Button>
                  </div>
                  <AppointmentsList
                    appointments={appointments.filter(
                      (a) => a.status === "completed"
                    )}
                    userRole={userRole}
                  />
                </TabsContent>
                {userRole === "DOCTOR" && (
                  <TabsContent value="all" className="m-0">
                    <div className="flex justify-between items-center mb-4">
                      <Badge className="bg-blue-50 text-blue-600 border-blue-100">
                        {appointments.length} citas en total
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <ListFilter className="h-4 w-4 mr-1" />
                        Filtrar
                      </Button>
                    </div>
                    <AppointmentsList
                      appointments={appointments}
                      userRole={userRole}
                    />
                  </TabsContent>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button variant="ghost" className="w-full">
                  Ver todas las citas
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Tabs>
          </Card>

          {userRole === "DOCTOR" ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Citas por día</CardTitle>
                    <CardDescription>
                      Resumen de la semana actual
                    </CardDescription>
                  </div>
                  <Select>
                    <Button variant="ghost" size="sm">
                      Esta semana <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={chartData} />
              </CardContent>
              <CardFooter className="border-t">
                <div className="w-full">
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                    <span>Progreso semanal</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Médicos Destacados</CardTitle>
                <CardDescription>
                  Profesionales recomendados para ti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeaturedDoctors doctors={doctors} onSelectDoctor={() => {}} />
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="ghost" className="w-full">
                  Ver todos los especialistas
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Lado derecho */}
        <div className="space-y-6">
          {userRole === "DOCTOR" && (
            <Card>
              <CardHeader>
                <CardTitle>Pacientes recientes</CardTitle>
                <CardDescription>Últimos 5 pacientes atendidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`https://randomuser.me/api/portraits/${
                              index % 2 === 0 ? "men" : "women"
                            }/${index}.jpg`}
                          />
                          <AvatarFallback>UN</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Usuario {index}</p>
                          <p className="text-xs text-muted-foreground">
                            Consulta:{" "}
                            {formatShortDate(
                              new Date(2025, 3, 28 - index).toISOString()
                            )}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="ghost" className="w-full">
                  Ver todos los pacientes
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Actividad reciente</CardTitle>
              <CardDescription>Últimas actualizaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-muted">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex gap-3 relative">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground z-10">
                      {activity.type.includes("appointment") ? (
                        <Calendar className="h-3 w-3" />
                      ) : (
                        <Bell className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm">{activity.message}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatShortDate(activity.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Button variant="ghost" className="w-full">
                Ver toda la actividad
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
