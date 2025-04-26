import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, UserRound, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.2 } }
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header mejorado */}
      <header className="bg-white py-4 border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-primary hover:text-blue-600 transition-colors"
          >
            SysMed
          </motion.div>
          
          <nav className="hidden md:flex space-x-8">
            {['features', 'benefits', 'faq'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className="text-gray-600 hover:text-primary transition-colors font-medium relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
              </motion.a>
            ))}
          </nav>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex space-x-4"
          >
            <Button asChild variant="outline" className="hover:bg-gray-50 hover:shadow-sm transition-all">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-blue-600 hover:shadow-lg transition-all">
              <Link href="/register">Registrarse</Link>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section mejorada */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center px-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Gestiona tus citas médicas con eficiencia digital
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              SysMed revoluciona la gestión médica conectando pacientes y profesionales a través de una plataforma inteligente con tecnología predictiva.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-blue-600 hover:scale-[1.02] transition-transform shadow-lg"
              >
                <Link href="/register">Comenzar ahora</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="hover:bg-gray-50 hover:shadow-sm border-gray-300"
              >
                <Link href="/login" className="flex items-center">
                  Acceso profesional <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-xl bg-white p-1 shadow-2xl border border-gray-100 md:ml-auto overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Image
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1170&q=80"
              alt="Plataforma médica digital"
              width={600}
              height={400}
              className="rounded-lg transform group-hover:scale-[1.01] transition-transform"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section mejorada */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto text-center mb-16 px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Funcionalidades Avanzadas
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Tecnología diseñada para optimizar la experiencia médica digital
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-8 container mx-auto px-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-blue-100"
            >
              <div className="bg-blue-50 text-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Benefits Section mejorada */}
      <section id="benefits" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Beneficios Integrados
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Experiencia transformadora para todos los usuarios
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    {benefit.icon}
                  </span>
                  {benefit.title}
                </h3>
                <ul className="space-y-4">
                  {benefit.items.map((item, i) => (
                    <li key={i} className="flex items-start group">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section mejorada */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Preguntas Frecuentes
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-3xl mx-auto space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="group border rounded-xl p-6 hover:border-blue-200 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                    {faq.question}
                  </h3>
                  <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-transform group-hover:rotate-180" />
                </div>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer mejorado */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">SysMed</h4>
              <p className="text-gray-400">Revolucionando la gestión médica digital</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#benefits" className="text-gray-400 hover:text-white transition-colors">Beneficios</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacidad</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Términos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <p className="text-gray-400">support@sysmed.com</p>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            © 2025 SysMed. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <CalendarDays className="h-6 w-6" />,
    title: "Agenda Inteligente",
    description: "Sistema de gestión de tiempo con IA predictiva que optimiza tu disponibilidad"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Recordatorios Automáticos",
    description: "Notificaciones contextuales multi-canal (email, SMS, app) con confirmación integrada"
  },
  {
    icon: <UserRound className="h-6 w-6" />,
    title: "Historial Médico",
    description: "Almacenamiento seguro en la nube con acceso granular y registros encriptados"
  }
];

const benefits = [
  {
    title: "Para Pacientes",
    icon: <UserRound className="h-5 w-5" />,
    items: [
      "Programación 24/7 con confirmación inmediata",
      "Historial médico unificado accesible desde cualquier dispositivo",
      "Integración con sistemas de salud nacionales",
      "Seguimiento post-consulta automatizado"
    ]
  },
  {
    title: "Para Profesionales",
    icon: <CalendarDays className="h-5 w-5" />,
    items: [
      "Gestión de múltiples consultorios en una sola plataforma",
      "Analíticas avanzadas de productividad",
      "Sistema de facturación integrado",
      "Comunicación segura con pacientes"
    ]
  }
];

const faqs = [
  {
    question: "¿Cómo garantizan la seguridad de los datos?",
    answer: "Usamos encriptación AES-256 y cumplimos con regulaciones HIPAA y GDPR"
  },
  {
    question: "¿Ofrecen integración con otros sistemas?",
    answer: "Sí, tenemos API RESTful y soporte para HL7/FHIR"
  }
];