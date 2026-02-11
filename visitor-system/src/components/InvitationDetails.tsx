import { Calendar, Clock, Users, MapPin, Building, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import type { Invitation } from '../types';
import { formatDate, formatTime, isInvitationExpired } from '../utils/helpers';

interface InvitationDetailsProps {
  invitation: Invitation;
  onCheckIn?: (id: string) => void;
  onExpire?: (id: string) => void;
  showActions?: boolean;
}

export default function InvitationDetails({ 
  invitation, 
  onCheckIn, 
  onExpire, 
  showActions = true 
}: InvitationDetailsProps) {
  const getStatusBadge = () => {
    if (isInvitationExpired(invitation)) {
      return (
        <span className="status-badge-enhanced expired">
          <AlertCircle className="w-4 h-4" />
          <span>منتهي الصلاحية</span>
        </span>
      );
    }
    
    if (invitation.status === 'CHECKED_IN') {
      return (
        <span className="status-badge-enhanced checked-in">
          <CheckCircle className="w-4 h-4" />
          <span>تم الدخول</span>
        </span>
      );
    }
    
    return (
      <span className="status-badge-enhanced pending">
        <Clock className="w-4 h-4" />
        <span>في الانتظار</span>
      </span>
    );
  };

  return (
    <div className="enhanced-card max-w-4xl mx-auto">
      {/* Permit-style header */}
      <div className="permit-header">
        <div className="permit-number">VP-{new Date(invitation.createdAt).getFullYear()}-{invitation.id.slice(-6)}</div>
        <div className="permit-title">تصريح زيارة</div>
      </div>

      {/* Visitor Information Section */}
      <div className="info-section">
        <div className="info-section-title">
          <Users className="w-5 h-5" />
          معلومات الزائر
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">الاسم الكامل</span>
            <span className="info-value">{invitation.visitorFullName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">المنصب/الجهة</span>
            <span className="info-value">{invitation.visitorTitle}</span>
          </div>
          <div className="info-item">
            <span className="info-label">عدد المرافقين</span>
            <span className="info-value">{invitation.numberOfCompanions} شخص</span>
          </div>
          <div className="info-item">
            <span className="info-label">سبب الزيارة</span>
            <span className="info-value">{invitation.reasonForVisit}</span>
          </div>
        </div>
      </div>

      {/* Visit Information Section */}
      <div className="info-section">
        <div className="info-section-title">
          <Calendar className="w-5 h-5" />
          معلومات الزيارة
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">تاريخ الزيارة</span>
            <span className="info-value">{formatDate(invitation.visitDate)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">وقت الزيارة</span>
            <span className="info-value">{formatTime(invitation.visitTime)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">نوع الزيارة</span>
            <span className="info-value">زيارة رسمية</span>
          </div>
          <div className="info-item">
            <span className="info-label">الحالة</span>
            <div>{getStatusBadge()}</div>
          </div>
        </div>
      </div>

      {/* Location Information Section */}
      <div className="info-section">
        <div className="info-section-title">
          <MapPin className="w-5 h-5" />
          معلومات المكان
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">الجهة المستضيفة</span>
            <span className="info-value">{invitation.invitingDirectorate}</span>
          </div>
          <div className="info-item">
            <span className="info-label">رقم الطابق</span>
            <span className="info-value">الطابق {invitation.floorNumber}</span>
          </div>
          <div className="info-item">
            <span className="info-label">رقم الغرفة</span>
            <span className="info-value">غرفة {invitation.officeNumber}</span>
          </div>
          <div className="info-item">
            <span className="info-label">الباب</span>
            <span className="info-value">الباب الرئيسي</span>
          </div>
        </div>
      </div>

      {/* Issuing Authority Section */}
      <div className="info-section">
        <div className="info-section-title">
          <Building className="w-5 h-5" />
          الجهة المصدرة
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">صادر عن</span>
            <span className="info-value">إدارة الزوار</span>
          </div>
          <div className="info-item">
            <span className="info-label">تاريخ الإصدار</span>
            <span className="info-value">{formatDate(invitation.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      {showActions && (
        <div className="info-section">
          <div className="flex flex-wrap gap-3 justify-center">
            {invitation.status === 'PENDING' && !isInvitationExpired(invitation) && (
              <button
                onClick={() => onCheckIn?.(invitation.id)}
                className="btn-enhanced primary"
              >
                <CheckCircle className="w-4 h-4" />
                تسجيل الدخول
              </button>
            )}
            
            {invitation.status === 'PENDING' && !isInvitationExpired(invitation) && (
              <button
                onClick={() => onExpire?.(invitation.id)}
                className="btn-enhanced secondary"
              >
                <AlertCircle className="w-4 h-4" />
                إنهاء الصلاحية
              </button>
            )}
            
            <button className="btn-enhanced secondary">
              <FileText className="w-4 h-4" />
              طباعة التصريح
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
