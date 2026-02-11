import type { Invitation, QRCodePayload } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateQRCodePayload = (invitationId: string): QRCodePayload => {
  return {
    type: 'VISITOR_INVITE_V1',
    invitationId,
    issuedAt: new Date().toISOString(),
  };
};

export const isInvitationExpired = (invitation: Invitation): boolean => {
  const visitDateTime = new Date(`${invitation.visitDate}T${invitation.visitTime}`);
  return visitDateTime < new Date();
};

export const formatDateTime = (date: string, time: string): string => {
  return new Date(`${date}T${time}`).toLocaleString();
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatTime = (timeString: string): string => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const validateQRCodePayload = (payload: any): payload is QRCodePayload => {
  return (
    payload &&
    payload.type === 'VISITOR_INVITE_V1' &&
    typeof payload.invitationId === 'string' &&
    typeof payload.issuedAt === 'string'
  );
};
