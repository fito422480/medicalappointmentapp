// src/types/notifications.d.ts
export type MessageStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";
export type MessageType =
  | "appointment_reminder"
  | "appointment_confirmation"
  | "appointment_cancellation"
  | "custom";

export interface Message {
  id: string;
  recipient: string;
  recipientName: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  scheduledFor?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  type: MessageType;
  variables: string[];
}
