import { z } from 'zod';

export const invitationFormSchema = z.object({
  visitorFullName: z.string().min(2, 'Visitor full name must be at least 2 characters'),
  visitorTitle: z.string().min(2, 'Visitor title must be at least 2 characters'),
  numberOfCompanions: z.number().min(0, 'Number of companions must be 0 or more'),
  visitDate: z.string().min(1, 'Visit date is required'),
  visitTime: z.string().min(1, 'Visit time is required'),
  reasonForVisit: z.string().min(5, 'Reason for visit must be at least 5 characters'),
  floorNumber: z.number().min(1, 'Floor number must be at least 1'),
  officeNumber: z.string().min(1, 'Office number is required'),
  invitingDirectorate: z.string().min(2, 'Directorate name must be at least 2 characters'),
});

export const qrCodePayloadSchema = z.object({
  type: z.literal('VISITOR_INVITE_V1'),
  invitationId: z.string(),
  issuedAt: z.string(),
});

export type InvitationFormData = z.infer<typeof invitationFormSchema>;
export type QRCodePayload = z.infer<typeof qrCodePayloadSchema>;
