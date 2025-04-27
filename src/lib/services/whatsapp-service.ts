import { Message, MessageTemplate, MessageStatus } from "@/types/notifications";

// URL base para la API de WhatsApp Business
const WHATSAPP_API_URL = "https://graph.facebook.com/v17.0";

// Configuración de la API (en un entorno real, estos valores vendrían de variables de entorno)
const API_CONFIG = {
  phoneNumberId:
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID || "123456789",
  apiKey: process.env.NEXT_PUBLIC_WHATSAPP_API_KEY || "your-api-key",
};

/**
 * Envía un mensaje de WhatsApp utilizando la API de WhatsApp Business
 */
export async function sendWhatsAppMessage(
  message: Omit<Message, "id" | "status" | "sentAt" | "deliveredAt" | "readAt">
): Promise<Message> {
  try {
    // En un entorno real, aquí se conectaría con la API de WhatsApp Business
    // Ejemplo de cómo sería la implementación real:

    /* 
    const response = await fetch(
      `${WHATSAPP_API_URL}/${API_CONFIG.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: message.recipient,
          type: 'text',
          text: { body: message.content }
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error al enviar mensaje WhatsApp');
    }
    
    return {
      id: data.messages[0].id,
      ...message,
      status: 'sent',
      sentAt: new Date().toISOString()
    };
    */

    // Simulación para desarrollo
    console.log("Enviando mensaje WhatsApp:", message);

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simular respuesta exitosa
    return {
      id: `msg-${Date.now()}`,
      ...message,
      status: message.scheduledFor ? "pending" : "sent",
      sentAt: message.scheduledFor ? undefined : new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error al enviar mensaje WhatsApp:", error);
    throw error;
  }
}

/**
 * Obtiene las plantillas de mensaje disponibles
 */
export async function getWhatsAppTemplates(): Promise<MessageTemplate[]> {
  try {
    // En un entorno real, aquí se conectaría con la API de WhatsApp Business
    // Ejemplo de implementación real:

    /*
    const response = await fetch(
      `${WHATSAPP_API_URL}/${API_CONFIG.phoneNumberId}/message_templates`,
      {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.apiKey}`,
        },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error al obtener plantillas');
    }
    
    return data.data.map(template => ({
      id: template.id,
      name: template.name,
      content: template.components.find(c => c.type === 'BODY')?.text || '',
      type: mapTemplateCategory(template.category),
      variables: extractVariables(template.components.find(c => c.type === 'BODY')?.text || '')
    }));
    */

    // Simulación para desarrollo
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      {
        id: "template-1",
        name: "Recordatorio de Cita",
        content:
          "Hola {paciente}, te recordamos tu cita programada para el {fecha} a las {hora} con {doctor} ({especialidad}) en {lugar}. Por favor confirma respondiendo a este mensaje.",
        type: "appointment_reminder",
        variables: [
          "paciente",
          "fecha",
          "hora",
          "doctor",
          "especialidad",
          "lugar",
        ],
      },
      {
        id: "template-2",
        name: "Confirmación de Cita",
        content:
          "Hola {paciente}, tu cita ha sido confirmada para el {fecha} a las {hora} con {doctor} de la especialidad {especialidad}. Te esperamos en {lugar}.",
        type: "appointment_confirmation",
        variables: [
          "paciente",
          "fecha",
          "hora",
          "doctor",
          "especialidad",
          "lugar",
        ],
      },
      {
        id: "template-3",
        name: "Cancelación de Cita",
        content:
          "Hola {paciente}, lamentamos informarte que tu cita del {fecha} a las {hora} con {doctor} ha sido cancelada. Por favor contáctanos para reprogramar.",
        type: "appointment_cancellation",
        variables: ["paciente", "fecha", "hora", "doctor"],
      },
      {
        id: "template-4",
        name: "Resultados disponibles",
        content:
          "Hola {paciente}, tus resultados de {tipoExamen} ya están disponibles. Puedes consultarlos en línea o retirarlos del {lugarRetiro}.",
        type: "custom",
        variables: ["paciente", "tipoExamen", "lugarRetiro"],
      },
    ];
  } catch (error) {
    console.error("Error al obtener plantillas WhatsApp:", error);
    throw error;
  }
}

/**
 * Crea una nueva plantilla de mensaje
 */
export async function createWhatsAppTemplate(
  template: Omit<MessageTemplate, "id">
): Promise<MessageTemplate> {
  try {
    // En un entorno real, aquí se conectaría con la API de WhatsApp Business
    // Ejemplo de implementación real:

    /*
    const response = await fetch(
      `${WHATSAPP_API_URL}/${API_CONFIG.phoneNumberId}/message_templates`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: template.name,
          category: mapTemplateType(template.type),
          components: [
            {
              type: 'BODY',
              text: template.content,
              example: {
                body_text: generateExamples(template.content, template.variables)
              }
            }
          ],
          language: 'es'
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error al crear plantilla');
    }
    
    return {
      id: data.id,
      ...template
    };
    */

    // Simulación para desarrollo
    console.log("Creando plantilla WhatsApp:", template);

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simular respuesta exitosa
    return {
      id: `template-${Date.now()}`,
      ...template,
    };
  } catch (error) {
    console.error("Error al crear plantilla WhatsApp:", error);
    throw error;
  }
}

/**
 * Obtiene los mensajes enviados
 */
export async function getWhatsAppMessages(): Promise<Message[]> {
  try {
    // En un entorno real, aquí se conectaría con la API de WhatsApp Business
    // Nota: La API de WhatsApp no proporciona un endpoint directo para obtener todos los mensajes enviados
    // Normalmente, esto requeriría implementar un sistema de seguimiento propio

    // Simulación para desarrollo
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      {
        id: "msg-1",
        recipient: "+595972123456",
        recipientName: "Carlos Gómez",
        content:
          "Hola Carlos, te recordamos tu cita programada para el 29 de abril de 2025 a las 10:00 AM con Dr. Juan López (Cardiología) en Consultorio 305, Edificio Médico Central. Por favor confirma respondiendo a este mensaje.",
        type: "appointment_reminder",
        status: "read",
        sentAt: "2025-04-26T09:00:00",
        deliveredAt: "2025-04-26T09:01:00",
        readAt: "2025-04-26T09:05:00",
      },
      {
        id: "msg-2",
        recipient: "+595961987654",
        recipientName: "Ana Silva",
        content:
          "Hola Ana, tu cita ha sido confirmada para el 30 de abril de 2025 a las 15:00 PM con Dr. Juan López de la especialidad Dermatología. Te esperamos en Consultorio 305, Edificio Médico Central.",
        type: "appointment_confirmation",
        status: "delivered",
        sentAt: "2025-04-26T10:30:00",
        deliveredAt: "2025-04-26T10:31:00",
      },
      {
        id: "msg-3",
        recipient: "+595985765432",
        recipientName: "Marta Pérez",
        content:
          "Hola Marta, lamentamos informarte que tu cita del 27 de abril de 2025 a las 09:00 AM con Dra. Sofía García ha sido cancelada. Por favor contáctanos para reprogramar.",
        type: "appointment_cancellation",
        status: "failed",
        sentAt: "2025-04-26T08:00:00",
      },
    ];
  } catch (error) {
    console.error("Error al obtener mensajes WhatsApp:", error);
    throw error;
  }
}

/**
 * Guarda la configuración de WhatsApp
 */
export async function saveWhatsAppSettings(settings: any): Promise<void> {
  try {
    // En un entorno real, aquí se actualizaría la configuración en la base de datos
    console.log("Guardando configuración WhatsApp:", settings);

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    // En un entorno real, podrías actualizar un documento en Firestore:
    // await updateDoc(doc(db, "settings", "whatsapp"), settings);

    return;
  } catch (error) {
    console.error("Error al guardar configuración WhatsApp:", error);
    throw error;
  }
}

// Funciones auxiliares para la integración con WhatsApp Business API

function extractVariables(text: string): string[] {
  const regex = /\{([^}]+)\}/g;
  const matches = text.match(regex) || [];
  return matches.map((match) => match.slice(1, -1));
}

function mapTemplateType(type: string): string {
  switch (type) {
    case "appointment_reminder":
    case "appointment_confirmation":
      return "APPOINTMENT_UPDATE";
    case "appointment_cancellation":
      return "ISSUE_RESOLUTION";
    default:
      return "UTILITY";
  }
}

function mapTemplateCategory(category: string): string {
  switch (category) {
    case "APPOINTMENT_UPDATE":
      return "appointment_reminder";
    case "ISSUE_RESOLUTION":
      return "appointment_cancellation";
    default:
      return "custom";
  }
}

function generateExamples(content: string, variables: string[]): string[] {
  const examples: Record<string, string> = {
    paciente: "Juan Pérez",
    fecha: "25 de abril de 2025",
    hora: "15:30",
    doctor: "Dra. Ana Martínez",
    especialidad: "Cardiología",
    lugar: "Consultorio 305, Edificio Médico Central",
    tipoExamen: "análisis de sangre",
    lugarRetiro: "recepción principal",
  };

  let result = content;
  variables.forEach((variable) => {
    result = result.replace(
      `{${variable}}`,
      examples[variable] || `[${variable}]`
    );
  });

  return [result];
}
