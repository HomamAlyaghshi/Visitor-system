import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InvitationStore, Invitation, InvitationStatus } from '../types';
import { generateId, isInvitationExpired } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/localStorage';

export const useInvitationStore = create<InvitationStore>()(
  persist(
    (set, get) => ({
      invitations: [],
      
      addInvitation: (invitationData) => {
        const invitation: Invitation = {
          ...invitationData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          invitations: [...state.invitations, invitation],
        }));
        
        return invitation;
      },
      
      updateInvitationStatus: (id: string, status: InvitationStatus) => {
        set((state) => ({
          invitations: state.invitations.map((invitation) =>
            invitation.id === id ? { ...invitation, status } : invitation
          ),
        }));
      },

      updateInvitation: (id: string, data: Omit<Invitation, 'id' | 'createdAt'>) => {
        set((state) => ({
          invitations: state.invitations.map((invitation) =>
            invitation.id === id ? { ...invitation, ...data } : invitation
          ),
        }));
      },
      
      deleteInvitation: (id: string) => {
        set((state) => ({
          invitations: state.invitations.filter((invitation) => invitation.id !== id),
        }));
      },
      
      getInvitationById: (id: string) => {
        return get().invitations.find((invitation) => invitation.id === id);
      },
      
      getPendingInvitations: () => {
        return get().invitations.filter(
          (invitation) => invitation.status === 'PENDING' && !isInvitationExpired(invitation)
        );
      },
      
      getExpiredInvitations: () => {
        return get().invitations.filter(isInvitationExpired);
      },
      
      isInvitationExpired,
    }),
    {
      name: STORAGE_KEYS.INVITATIONS,
    }
  )
);
