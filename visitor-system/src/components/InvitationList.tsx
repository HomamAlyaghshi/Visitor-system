import { useState } from 'react';
import {
  Eye,
  QrCode,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
} from 'lucide-react';
import { formatDate, formatTime, isInvitationExpired } from '../utils/helpers';
import type { Invitation } from '../types';
import InvitationForm from './InvitationForm';

interface InvitationListProps {
  invitations: Invitation[];
  onCheckIn: (id: string) => void;
  onExpire: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Omit<Invitation, 'id' | 'createdAt' | 'status'>) => void;
  onShowQRCode: (invitation: Invitation) => void;
}

export default function InvitationList({ 
  invitations, 
  onCheckIn, 
  onExpire, 
  onDelete,
  onUpdate,
  onShowQRCode 
}: InvitationListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  const getStatusIcon = (invitation: Invitation) => {
    if (isInvitationExpired(invitation)) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (invitation.status === 'CHECKED_IN') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusText = (invitation: Invitation) => {
    if (isInvitationExpired(invitation)) {
      return 'منتهية الصلاحية';
    }
    if (invitation.status === 'CHECKED_IN') {
      return 'تم تسجيل الدخول';
    }
    return 'في الانتظار';
  };

  const handleEdit = (invitation: Invitation) => {
    setEditingId(invitation.id);
    setShowActions(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الدعوة؟')) {
      onDelete(id);
      setShowActions(null);
    }
  };

  const handleSaveEdit = (data: Omit<Invitation, 'id' | 'createdAt' | 'status'>) => {
    onUpdate(editingId!, data);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  if (invitations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
          <Eye className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد دعوات بعد</h3>
        <p className="text-gray-500">قم بإنشاء أول دعوة للبدء.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {invitations.map((invitation) => (
        <div key={invitation.id} className="w-full bg-white rounded-xl border border-gray-200 p-6">
          {editingId === invitation.id ? (
            <div className="w-full">
              <InvitationForm
                onInvitationCreated={handleSaveEdit}
                initialData={invitation}
                submitText="حفظ التغييرات"
                onCancel={handleCancelEdit}
              />
            </div>
          ) : (
            <div className="w-full space-y-4">
              {/* Header with actions */}
              <div className="w-full flex items-start justify-between">
                <div className="w-full flex-1">
                  <h3 className="w-full text-lg font-medium text-gray-900 mb-2 text-right">
                    {invitation.visitorFullName}
                  </h3>
                  <div className="w-full inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    isInvitationExpired(invitation) 
                      ? 'bg-red-100 text-red-800' 
                      : invitation.status === 'CHECKED_IN' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }">
                    {getStatusIcon(invitation)}
                    <span>{getStatusText(invitation)}</span>
                  </div>
                </div>
                
                {/* Actions dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowActions(showActions === invitation.id ? null : invitation.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {showActions === invitation.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <button
                          onClick={() => handleEdit(invitation)}
                          className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          تعديل الدعوة
                        </button>
                        <button
                          onClick={() => onShowQRCode && onShowQRCode(invitation)}
                          className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <QrCode className="w-4 h-4" />
                          عرض رمز QR
                        </button>
                        {invitation.status === 'PENDING' && !isInvitationExpired(invitation) && (
                          <>
                            <button
                              onClick={() => onCheckIn(invitation.id)}
                              className="w-full px-4 py-2 text-right text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              تسجيل الدخول
                            </button>
                            <button
                              onClick={() => onExpire(invitation.id)}
                              className="w-full px-4 py-2 text-right text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4" />
                              انتهاء الصلاحية
                            </button>
                          </>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => handleDelete(invitation.id)}
                          className="w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          حذف الدعوة
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Visitor title */}
              <p className="w-full text-gray-600 text-right">{invitation.visitorTitle}</p>
              
              {/* Details grid */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="w-full">
                  <span className="w-full block text-gray-500 mb-1 text-right">تاريخ الزيارة</span>
                  <span className="w-full font-medium text-gray-900 text-right block">{formatDate(invitation.visitDate)}</span>
                </div>
                <div className="w-full">
                  <span className="w-full block text-gray-500 mb-1 text-right">وقت الزيارة</span>
                  <span className="w-full font-medium text-gray-900 text-right block">{formatTime(invitation.visitTime)}</span>
                </div>
                <div className="w-full">
                  <span className="w-full block text-gray-500 mb-1 text-right">المرافقون</span>
                  <span className="w-full font-medium text-gray-900 text-right block">{invitation.numberOfCompanions}</span>
                </div>
                <div className="w-full">
                  <span className="w-full block text-gray-500 mb-1 text-right">الطابق</span>
                  <span className="w-full font-medium text-gray-900 text-right block">{invitation.floorNumber}</span>
                </div>
                <div className="w-full">
                  <span className="w-full block text-gray-500 mb-1 text-right">المكتب</span>
                  <span className="w-full font-medium text-gray-900 text-right block">{invitation.officeNumber}</span>
                </div>
                <div className="w-full">
                  <span className="w-full block text-gray-500 mb-1 text-right">الإدارة</span>
                  <span className="w-full font-medium text-gray-900 text-right block text-xs">{invitation.invitingDirectorate}</span>
                </div>
              </div>
              
              {/* Visit reason */}
              <div className="w-full">
                <span className="w-full block text-gray-500 text-sm mb-1 text-right">سبب الزيارة</span>
                <p className="w-full text-sm text-gray-700 text-right">{invitation.reasonForVisit}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
