export type UserRole = 'MANAGER' | 'GATE_GUARD';

export type InvitationStatus = 'PENDING' | 'CHECKED_IN';

export interface Invitation {
  id: string;
  visitorFullName: string;
  visitorTitle: string;
  visitorEmail?: string;
  visitorPhone?: string;
  numberOfCompanions: number;
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // HH:mm
  reasonForVisit: string;
  floorNumber: number;
  officeNumber: string;
  invitingDirectorate: string;
  createdAt: string; // ISO string
  status: InvitationStatus;
}

export interface QRCodePayload {
  type: 'VISITOR_INVITE_V1';
  invitationId: string;
  issuedAt: string; // ISO string
}

export interface User {
  role: UserRole;
  name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface InvitationFormData {
  visitorFullName: string;
  visitorTitle: string;
  numberOfCompanions: number;
  visitDate: string;
  visitTime: string;
  reasonForVisit: string;
  floorNumber: number;
  officeNumber: string;
  invitingDirectorate: string;
}

export interface InvitationStore {
  invitations: Invitation[];
  addInvitation: (invitation: Omit<Invitation, 'id' | 'createdAt'>) => Invitation;
  updateInvitationStatus: (id: string, status: InvitationStatus) => void;
  updateInvitation: (id: string, data: Omit<Invitation, 'id' | 'createdAt'>) => void;
  deleteInvitation: (id: string) => void;
  getInvitationById: (id: string) => Invitation | undefined;
  getPendingInvitations: () => Invitation[];
  getExpiredInvitations: () => Invitation[];
  isInvitationExpired: (invitation: Invitation) => boolean;
}

export interface AuthStore {
  user: User | null;
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
