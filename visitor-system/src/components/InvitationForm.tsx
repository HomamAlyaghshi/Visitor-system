import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invitationFormSchema } from '../utils/validation';
import type { InvitationFormData } from '../utils/validation';
import type { Invitation } from '../types';
import { useInvitationStore } from '../stores/invitationStore';

interface InvitationFormProps {
  onInvitationCreated: (data: Omit<Invitation, 'id' | 'createdAt' | 'status'>) => void;
  initialData?: Invitation;
  submitText?: string;
  onCancel?: () => void;
}

export default function InvitationForm({ onInvitationCreated, initialData, submitText = "Create Invitation", onCancel }: InvitationFormProps) {
  const addInvitation = useInvitationStore((state) => state.addInvitation);
  const updateInvitation = useInvitationStore((state) => state.updateInvitation);
  const isEditing = !!initialData;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InvitationFormData>({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: {
      visitorFullName: '',
      visitorTitle: '',
      numberOfCompanions: 0,
      invitingDirectorate: '',
      visitDate: '',
      visitTime: '',
      floorNumber: 1,
      officeNumber: '',
      reasonForVisit: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        visitorFullName: initialData.visitorFullName ?? '',
        visitorTitle: initialData.visitorTitle ?? '',
        numberOfCompanions: initialData.numberOfCompanions ?? 0,
        invitingDirectorate: initialData.invitingDirectorate ?? '',
        visitDate: initialData.visitDate ?? '',
        visitTime: initialData.visitTime ?? '',
        floorNumber: Number(initialData.floorNumber ?? 1),
        officeNumber: initialData.officeNumber ?? '',
        reasonForVisit: initialData.reasonForVisit ?? '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: InvitationFormData) => {
    try {
      if (isEditing && initialData) {
        // Update existing invitation
        updateInvitation(initialData.id, { ...data, status: 'PENDING' });
        onInvitationCreated(data);
      } else {
        // Create new invitation
        addInvitation({
          ...data,
          status: 'PENDING',
        });
        onInvitationCreated(data);
        reset();
      }
    } catch (error) {
      console.error('Error saving invitation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <label htmlFor="visitorFullName" className="w-full block text-sm font-medium text-gray-700 mb-2 text-right">
            الاسم الكامل للزائر *
          </label>
          <input
            type="text"
            id="visitorFullName"
            {...register('visitorFullName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            placeholder="أحمد محمد"
          />
          {errors.visitorFullName && (
            <p className="w-full mt-1 text-sm text-red-600 text-right">{errors.visitorFullName.message}</p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="visitorTitle" className="w-full block text-sm font-medium text-gray-700 mb-2 text-right">
            المسمى الوظيفي للزائر *
          </label>
          <input
            type="text"
            id="visitorTitle"
            {...register('visitorTitle')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            placeholder="مهندس برمجيات"
          />
          {errors.visitorTitle && (
            <p className="w-full mt-1 text-sm text-red-600 text-right">{errors.visitorTitle.message}</p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="numberOfCompanions" className="w-full block text-sm font-medium text-gray-700 mb-2 text-right">
            عدد المرافقين *
          </label>
          <input
            type="number"
            id="numberOfCompanions"
            {...register('numberOfCompanions', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            placeholder="0"
            min="0"
          />
          {errors.numberOfCompanions && (
            <p className="w-full mt-1 text-sm text-red-600 text-right">{errors.numberOfCompanions.message}</p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="invitingDirectorate" className="w-full block text-sm font-medium text-gray-700 mb-2 text-right">
            الإدارة الداعية *
          </label>
          <input
            type="text"
            id="invitingDirectorate"
            {...register('invitingDirectorate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            placeholder="قسم تقنية المعلومات"
          />
          {errors.invitingDirectorate && (
            <p className="w-full mt-1 text-sm text-red-600 text-right">{errors.invitingDirectorate.message}</p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="visitDate" className="w-full block text-sm font-medium text-gray-700 mb-2 text-right">
            تاريخ الزيارة *
          </label>
          <input
            type="date"
            id="visitDate"
            {...register('visitDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
          />
          {errors.visitDate && (
            <p className="w-full mt-1 text-sm text-red-600 text-right">{errors.visitDate.message}</p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="visitTime" className="w-full block text-sm font-medium text-gray-700 mb-2 text-right">
            وقت الزيارة *
          </label>
          <input
            type="time"
            id="visitTime"
            {...register('visitTime')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
          />
          {errors.visitTime && (
            <p className="w-full mt-1 text-sm text-red-600 text-right">{errors.visitTime.message}</p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="floorNumber" className="w-full block text-sm font-medium text-gray-700 mb-2 text-right">
            رقم الطابق *
          </label>
          <input
            type="number"
            id="floorNumber"
            {...register('floorNumber', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            placeholder="1"
            min="1"
          />
          {errors.floorNumber && (
            <p className="w-full mt-1 text-sm text-red-600 text-right">{errors.floorNumber.message}</p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="officeNumber" className="w-full block text-sm font-medium text-gray-700 mb-2 text-right">
            رقم المكتب *
          </label>
          <input
            type="text"
            id="officeNumber"
            {...register('officeNumber')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            placeholder="101"
          />
          {errors.officeNumber && (
            <p className="w-full mt-1 text-sm text-red-600 text-right">{errors.officeNumber.message}</p>
          )}
        </div>
      </div>

      <div className="w-full">
        <label htmlFor="reasonForVisit" className="w-full block text-sm font-medium text-gray-700 mb-2 text-right">
          سبب الزيارة *
        </label>
        <textarea
          id="reasonForVisit"
          {...register('reasonForVisit')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
          placeholder="اجتماع عمل مع الفريق..."
        />
        {errors.reasonForVisit && (
          <p className="w-full mt-1 text-sm text-red-600 text-right">{errors.reasonForVisit.message}</p>
        )}
      </div>

      <div className="w-full flex justify-start gap-3">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'جاري الحفظ...' : submitText}
        </button>
      </div>
    </form>
  );
}
