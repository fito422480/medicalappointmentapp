"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Star,
  Shield,
  Bell,
  CalendarDays,
  MessageSquare,
  PhoneCall,
  Activity,
  ListChecks,
  Award,
  Users,
  UserCheck,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

// Animaciones para entradas
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
    } 
  }
};

const heroImage = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
const doctorCarouselImages = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
];

// Doctor Carousel Component
const DoctorCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const doctors = [
    { name: 'Dra. Valentina Torres', specialty: 'Cardiología', rating: 4.9, experience: '12 años' },
    { name: 'Dr. Martín Acosta', specialty: 'Neurología', rating: 4.8, experience: '15 años' },
    { name: 'Dra. Carolina Ruiz', specialty: 'Pediatría', rating: 5.0, experience: '8 años' },
    { name: 'Dr. Felipe Méndez', specialty: 'Dermatología', rating: 4.7, experience: '10 años' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % doctors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [doctors.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl bg-white p-6 shadow-2xl border overflow-hidden max-w-sm"
      >
        <div className="absolute top-0 right-0 bg-primary/10 px-3 py-1 rounded-bl-lg">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
            <span className="text-sm font-semibold">{doctors[currentIndex].rating}</span>
          </div>
        </div>
        
        <div className="relative h-80 mb-6 rounded-xl overflow-hidden">
          <Image 
            src={doctorCarouselImages[currentIndex]} 
            alt={doctors[currentIndex].name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{doctors[currentIndex].name}</h3>
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
              {doctors[currentIndex].specialty}
            </Badge>
            <span className="text-sm text-muted-foreground">{doctors[currentIndex].experience} de experiencia</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-muted">
            <Button asChild className="w-full">
              <Link href="/doctors">
                Agendar cita
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-6 right-6 flex space-x-1">
          {doctors.map((_, index) => (
            <span 
              key={index} 
              className={`block h-1.5 rounded-full ${index === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted'}`} 
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, accentColor = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100/30 text-blue-700 border-blue-100",
    green: "from-green-50 to-green-100/30 text-green-700 border-green-100",
    purple: "from-purple-50 to-purple-100/30 text-purple-700 border-purple-100",
    amber: "from-amber-50 to-amber-100/30 text-amber-700 border-amber-100",
    pink: "from-pink-50 to-pink-100/30 text-pink-700 border-pink-100",
    indigo: "from-indigo-50 to-indigo-100/30 text-indigo-700 border-indigo-100"
  };
  
  return (
    <motion.div
      variants={fadeInUp}
      className={`rounded-2xl p-6 border bg-gradient-to-br ${colorClasses[accentColor]} hover:shadow-md transition-shadow`}
    >
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 items-start">
        <div className="rounded-lg bg-white p-3 shadow-sm">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Testimonial Component
const Testimonial = ({ name, role, content, avatar }) => {
  return (
    <motion.div 
      variants={fadeInUp}
      className="flex flex-col bg-white p-6 rounded-xl shadow-sm border"
    >
      <div className="mb-4">
        <svg className="h-8 w-8 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{content}</p>
      <div className="mt-auto flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Estadísticas Component
const StatisticCard = ({ value, label, icon: Icon }) => {
  return (
    <motion.div 
      variants={fadeInUp}
      className="text-center"
    >
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

// Especialidades Component
const SpecialtyCard = ({ name, icon: Icon, description }) => {
  return (
    <motion.div 
      variants={fadeInUp} 
      className="rounded-xl overflow-hidden shadow-sm border bg-white transition-shadow hover:shadow-md"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="bg-primary/10 rounded-lg p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <Badge variant="outline" className="text-xs">Disponible</Badge>
        </div>
        <h3 className="mt-4 font-semibold text-lg">{name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <Button variant="ghost" className="mt-4 px-0 hover:bg-transparent hover:text-primary">
          Ver doctores
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
};

// Header con Navbar
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          SysMed
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Características
          </Link>
          <Link href="#specialties" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Especialidades
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Testimonios
          </Link>
          <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Registrarse</Link>
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t shadow-sm"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
              <nav className="flex flex-col gap-4">
                <Link 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium py-2 border-b border-muted hover:text-primary transition-colors"
                >
                  Características
                </Link>
                <Link 
                  href="#specialties" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium py-2 border-b border-muted hover:text-primary transition-colors"
                >
                  Especialidades
                </Link>
                <Link 
                  href="#testimonials" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium py-2 border-b border-muted hover:text-primary transition-colors"
                >
                  Testimonios
                </Link>
                <Link 
                  href="#faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium py-2 border-b border-muted hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </nav>
              
              <div className="flex flex-col gap-3">
                <Button variant="outline" asChild>
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Registrarse</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">SysMed</h2>
            <p className="text-sm text-gray-400 mb-4">
              Plataforma avanzada de gestión de citas médicas que conecta pacientes y profesionales de la salud.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Inicio</Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Características</Link>
              </li>
              <li>
                <Link href="#specialties" className="text-gray-400 hover:text-white transition-colors text-sm">Especialidades</Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-gray-400 hover:text-white transition-colors text-sm">Testimonios</Link>
              </li>
              <li>
                <Link href="#faq" className="text-gray-400 hover:text-white transition-colors text-sm">Preguntas frecuentes</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Política de privacidad</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Términos de servicio</Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">Política de cookies</Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors text-sm">Accesibilidad</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="text-primary mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <span className="text-sm">Av. Mariscal López 1234, Asunción</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-primary mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <span className="text-sm">(+595) 21 123 4567</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-primary mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <span className="text-sm">contacto@sysmed.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p> 2025 SysMed. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

// Landing Page Component
const LandingPage = () => {
  // Datos para las pestañas de usuarios
  const userTabsData = {
    patients: {
      title: "Para Pacientes",
      features: [
        "Agenda citas médicas de forma rápida y sencilla",
        "Recibe recordatorios automáticos por WhatsApp",
        "Accede a tu historial médico desde cualquier dispositivo",
        "Gestiona citas para toda la familia desde una sola cuenta",
        "Califica y comenta sobre la atención recibida",
        "Recibe notificaciones sobre resultados de exámenes"
      ],
      cta: { 
        text: "Registrarme como paciente", 
        href: "/register?role=patient" 
      }
    },
    doctors: {
      title: "Para Médicos",
      features: [
        "Administra tu agenda y disponibilidad de forma eficiente",
        "Configura horarios personalizados según tus necesidades",
        "Accede al historial completo de tus pacientes",
        "Recibe notificaciones automáticas de citas y cancelaciones",
        "Gestiona múltiples consultorios desde un solo lugar",
        "Obtén estadísticas detalladas sobre tu práctica"
      ],
      cta: { 
        text: "Registrarme como médico", 
        href: "/register?role=doctor" 
      }
    },
    clinics: {
      title: "Para Clínicas",
      features: [
        "Centraliza la gestión de todos tus médicos y consultorios",
        "Optimiza la ocupación de salas y equipamiento",
        "Reduce ausencias con recordatorios automáticos",
        "Automatiza procesos administrativos",
        "Obtén reportes y analíticas en tiempo real",
        "Mejora la experiencia y satisfacción de tus pacientes"
      ],
      cta: { 
        text: "Contactar para plan empresarial", 
        href: "/contact" 
      }
    }
  };
  
  // Testimonios
  const testimonials = [
    {
      name: "Roberto Gómez",
      role: "Paciente",
      content: "SysMed ha revolucionado la forma en que gestiono mis citas médicas. Las notificaciones por WhatsApp son súper útiles y ya no me olvido de ninguna consulta.",
      avatar: "https://api.dicebear.com/6.x/micah/svg?seed=1"
    },
    {
      name: "Dra. Lucía Martínez",
      role: "Cardióloga",
      content: "Como médico, valoro enormemente la eficiencia que SysMed ha traído a mi consulta. El sistema de gestión de disponibilidad me permite organizar mi agenda de forma óptima.",
      avatar: "https://api.dicebear.com/6.x/micah/svg?seed=2"
    },
    {
      name: "Clínica San Lucas",
      role: "Centro Médico",
      content: "Implementar SysMed en nuestra clínica redujo un 40% las inasistencias y mejoró significativamente la satisfacción de nuestros pacientes. La integración fue muy sencilla.",
      avatar: "https://api.dicebear.com/6.x/micah/svg?seed=3"
    },
    {
      name: "Ana García",
      role: "Paciente",
      content: "La facilidad para encontrar especialistas y agendar citas es impresionante. La plataforma es intuitiva y las confirmaciones instantáneas me dan mucha tranquilidad.",
      avatar: "https://api.dicebear.com/6.x/micah/svg?seed=4"
    }
  ];
  
  // Especialidades
  const specialties = [
    { 
      name: "Cardiología", 
      icon: Activity, 
      description: "Especialistas en diagnóstico y tratamiento de enfermedades cardiovasculares." 
    },
    { 
      name: "Pediatría", 
      icon: Users, 
      description: "Cuidados médicos especializados para niños y adolescentes." 
    },
    { 
      name: "Dermatología", 
      icon: Shield, 
      description: "Tratamiento de afecciones de la piel, cabello y uñas." 
    },
    { 
      name: "Neurología", 
      icon: Award, 
      description: "Diagnóstico y manejo de trastornos del sistema nervioso." 
    },
    { 
      name: "Oftalmología", 
      icon: ListChecks, 
      description: "Especialistas en salud visual y tratamiento de enfermedades oculares." 
    },
    { 
      name: "Traumatología", 
      icon: UserCheck, 
      description: "Tratamiento de lesiones y enfermedades del sistema musculoesquelético." 
    }
  ];
  
  // Preguntas frecuentes
  const faqs = [
    {
      question: "¿Cómo puedo agendar una cita médica?",
      answer: "Registrarse es muy sencillo. Solo necesitas crear una cuenta, buscar el especialista o clínica de tu preferencia, seleccionar un horario disponible y confirmar tu cita. Recibirás una confirmación instantánea y recordatorios por WhatsApp."
    },
    {
      question: "¿El sistema garantiza la privacidad de mis datos médicos?",
      answer: "Absolutamente. SysMed cumple con todos los estándares de seguridad y privacidad internacionales. Todos los datos médicos están encriptados y solo pueden ser accedidos por ti y los profesionales médicos autorizados que tú elijas."
    },
    {
      question: "¿Puedo cancelar o reprogramar una cita?",
      answer: "Sí, puedes cancelar o reprogramar tus citas hasta 24 horas antes de la hora programada sin ningún costo. Para cambios con menos anticipación, la política puede variar según el profesional o centro médico."
    },
    {
      question: "¿Cómo funciona el sistema para los médicos?",
      answer: "Los profesionales médicos pueden gestionar su disponibilidad, personalizar sus horarios, recibir notificaciones de nuevas citas y acceder al historial de consultas. También ofrecemos herramientas de analítica para optimizar la práctica médica."
    },
    {
      question: "¿El sistema funciona para múltiples especialidades?",
      answer: "Sí, SysMed está diseñado para adaptarse a cualquier especialidad médica. Cada profesional puede configurar parámetros específicos según sus necesidades particulares."
    },
    {
      question: "¿Ofrecen integraciones con otros sistemas de gestión hospitalaria?",
      answer: "Sí, SysMed cuenta con APIs de integración para los principales sistemas de gestión hospitalaria y registros médicos electrónicos. Nuestro equipo técnico puede asesorarte sobre las opciones disponibles para tu caso específico."
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-blue-50 via-blue-50/50 to-transparent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-6"
            >
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Badge variant="secondary" className="mr-1 bg-primary text-white">Nuevo</Badge>
                Plataforma v2.0 disponible
              </div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                Gestión de citas médicas 
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> inteligente</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-lg text-muted-foreground max-w-xl"
              >
                Conectamos pacientes y médicos a través de una plataforma digital intuitiva para una experiencia sanitaria sin fricciones.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button className="h-12 px-6 font-medium" asChild>
                  <Link href="/register">
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" className="h-12 px-6" asChild>
                  <Link href="/demo">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Ver demostración
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                className="pt-6 flex items-center gap-4"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="border-2 border-white">
                      <AvatarImage src={`https://api.dicebear.com/6.x/micah/svg?seed=${i}`} />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">+2,500 profesionales</span> confían en nosotros
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto lg:mx-0"
            >
              <DoctorCarousel />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Marcas y partners */}
      <section className="py-10 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">Confían en nuestra plataforma</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-80">
            {['Hospital Central', 'Clínica San Lucas', 'Sanatorio Metropolitano', 'Instituto Médico', 'Centro Cardiológico'].map((brand, index) => (
              <div key={index} className="text-lg font-semibold text-muted-foreground">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-3" variant="secondary">Características</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simplificamos la experiencia médica</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Nuestra plataforma integra avanzadas funcionalidades diseñadas para optimizar el proceso de gestión de citas.
            </p>
          </div>
          
          <Tabs defaultValue="patients" className="mb-12">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="patients">Pacientes</TabsTrigger>
                <TabsTrigger value="doctors">Médicos</TabsTrigger>
                <TabsTrigger value="clinics">Clínicas</TabsTrigger>
              </TabsList>
            </div>
            
            {Object.entries(userTabsData).map(([key, data]) => (
              <TabsContent key={key} value={key} className="space-y-8">
                <motion.div 
                  initial="hidden" 
                  animate="visible" 
                  variants={stagger} 
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="space-y-6">
                    <motion.h3 
                      variants={fadeInUp} 
                      className="text-2xl font-bold"
                    >
                      {data.title}
                    </motion.h3>
                    <motion.ul variants={fadeInUp} className="space-y-4">
                      {data.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </motion.ul>
                    <motion.div variants={fadeInUp}>
                      <Button asChild>
                        <Link href={data.cta.href}>
                          {data.cta.text}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    variants={fadeInUp}
                    className="rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={`/screenshots/${key}-dashboard.jpg`}
                      alt={`Dashboard para ${key}`}
                      width={600}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <FeatureCard 
              icon={Calendar}
              title="Agenda Inteligente"
              description="Sistema que aprende tus preferencias y optimiza la distribución de citas para maximizar la eficiencia."
              accentColor="blue"
            />
            <FeatureCard 
              icon={Bell}
              title="Notificaciones Automáticas"
              description="Recordatorios personalizados vía WhatsApp para reducir inasistencias y mantener informados a pacientes."
              accentColor="green"
            />
            <FeatureCard 
              icon={MessageSquare}
              title="Comunicación Segura"
              description="Canal encriptado para comunicaciones entre médicos y pacientes con historial completo."
              accentColor="indigo"
            />
            <FeatureCard 
              icon={CalendarDays}
              title="Gestión de Disponibilidad"
              description="Configura horarios personalizados, días festivos y períodos de bloqueo de forma sencilla."
              accentColor="amber"
            />
            <FeatureCard 
              icon={Shield}
              title="Datos Protegidos"
              description="Cumplimos con los estándares internacionales de protección de datos médicos sensibles."
              accentColor="purple"
            />
            <FeatureCard 
              icon={Activity}
              title="Reportes y Analíticas"
              description="Visualiza tendencias y obtén insights para mejorar la eficiencia y atención."
              accentColor="pink"
            />
          </motion.div>
        </div>
      </section>
      
      {/* Estadísticas Section */}
      <section className="py-16 bg-primary/5 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Impacto en números</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Resultados que demuestran el valor de nuestra plataforma
            </p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <StatisticCard value="94%" label="Reducción en inasistencias" icon={CheckCircle} />
            <StatisticCard value="25K+" label="Citas mensuales" icon={Calendar} />
            <StatisticCard value="2,500+" label="Profesionales activos" icon={UserCheck} />
            <StatisticCard value="98%" label="Satisfacción de usuarios" icon={Award} />
          </motion.div>
        </div>
      </section>
      
      {/* Especialidades Section */}
      <section id="specialties" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-3" variant="secondary">Especialidades</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Múltiples especialidades médicas</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Conectamos pacientes con especialistas calificados en diversas áreas médicas
            </p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {specialties.map((specialty, index) => (
              <SpecialtyCard
                key={index}
                name={specialty.name}
                icon={specialty.icon}
                description={specialty.description}
              />
            ))}
          </motion.div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link href="/specialties">
                Ver todas las especialidades
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonios Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-blue-50/50 to-white border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-3" variant="secondary">Testimonios</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Historias reales de médicos y pacientes que utilizan nuestra plataforma
            </p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <Testimonial
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                content={testimonial.content}
                avatar={testimonial.avatar}
              />
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-3" variant="secondary">Preguntas Frecuentes</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitas saber</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Respuestas a las dudas más comunes sobre nuestra plataforma
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="max-w-3xl mx-auto mt-12 p-6 rounded-xl bg-primary/5 border">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">¿Tienes más preguntas?</h3>
              <p className="text-muted-foreground mb-6">
                Nuestro equipo está disponible para ayudarte con cualquier consulta
              </p>
              <Button asChild>
                <Link href="/contact">
                  Contáctanos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Revoluciona la gestión de tus citas médicas hoy
            </h2>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Únete a miles de profesionales y pacientes que ya disfrutan de una experiencia médica más eficiente y satisfactoria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 h-12 px-6" asChild>
                <Link href="/register">
                  Comenzar gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-12 px-6" asChild>
                <Link href="/demo">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Ver demostración
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Componente PlayCircle
const PlayCircle = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
};

// Componente File
const File = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
};

export default LandingPage;