import { useState, useEffect } from 'react';
import { X, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { useInvitationStore } from '../stores/invitationStore';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const invitations = useInvitationStore((state) => state.invitations);

  useEffect(() => {
    // Listen for invitation status changes
    const checkForNewNotifications = () => {
      const newNotifications: Notification[] = [];
      
      invitations.forEach(invitation => {
        // Check for newly checked-in visitors
        if (invitation.status === 'CHECKED_IN') {
          const timeDiff = new Date().getTime() - new Date(invitation.createdAt).getTime();
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          
          if (hoursDiff < 1) { // Within last hour
            newNotifications.push({
              id: `checkin-${invitation.id}`,
              type: 'success',
              title: 'تسجيل دخول جديد',
              message: `${invitation.visitorFullName} قام بتسجيل الدخول`,
              timestamp: new Date(),
              read: false
            });
          }
        }
        
        // Check for expired invitations
        if (invitation.status === 'PENDING') {
          const visitDate = new Date(invitation.visitDate);
          const today = new Date();
          const daysDiff = Math.ceil((visitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff < 0 && daysDiff > -1) { // Expired yesterday
            newNotifications.push({
              id: `expired-${invitation.id}`,
              type: 'warning',
              title: 'انتهت صلاحية الدعوة',
              message: `دعوة ${invitation.visitorFullName} انتهت صلاحيتها`,
              timestamp: new Date(),
              read: false
            });
          }
        }
      });
      
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev].slice(0, 50));
      }
    };

    checkForNewNotifications();
    const interval = setInterval(checkForNewNotifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [invitations]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <X className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">الإشعارات</h3>
              <button
                onClick={clearAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                مسح الكل
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>لا توجد إشعارات جديدة</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleTimeString('ar-SA', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
