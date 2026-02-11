import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Users, QrCode, Clock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import type { Invitation } from '../types';
import { useInvitationStore } from '../stores/invitationStore';
import InvitationForm from '../components/InvitationForm';
import InvitationList from '../components/InvitationList';
import QRCodeDisplay from '../components/QRCodeDisplay';
import Notifications from '../components/Notifications';
import SearchFilter from '../components/SearchFilter';

export default function ManagerDashboard() {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'qrcode'>('list');
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const invitations = useInvitationStore((state) => state.invitations);
  const updateInvitationStatus = useInvitationStore((state) => state.updateInvitationStatus);
  const deleteInvitation = useInvitationStore((state) => state.deleteInvitation);
  const updateInvitation = useInvitationStore((state) => state.updateInvitation);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredInvitations = useMemo(() => {
    return invitations.filter(inv => {
      if (statusFilter && inv.status !== statusFilter) return false;
      if (searchTerm && !inv.visitorFullName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [invitations, statusFilter, searchTerm]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInvitationCreated = (_data: Omit<Invitation, 'id' | 'createdAt' | 'status'>) => {
    // Find the invitation that was just created (should be the last one)
    const latestInvitation = invitations[invitations.length - 1];
    if (latestInvitation) {
      setSelectedInvitationId(latestInvitation.id);
      setActiveView('qrcode');
    }
  };

  const handleCheckIn = (id: string) => {
    updateInvitationStatus(id, 'CHECKED_IN');
  };

  const handleExpire = (id: string) => {
    updateInvitationStatus(id, 'PENDING');
  };

  const handleDelete = (id: string) => {
    deleteInvitation(id);
  };

  const handleUpdate = (id: string, data: Omit<Invitation, 'id' | 'createdAt' | 'status'>) => {
    updateInvitation(id, { ...data, status: 'PENDING' });
  };

  const handleShowQRCode = (invitation: Invitation) => {
    setSelectedInvitationId(invitation.id);
    setActiveView('qrcode');
  };

  const pendingCount = invitations.filter(i => i.status === 'PENDING').length;
  const checkedInCount = invitations.filter(i => i.status === 'CHECKED_IN').length;


  return (
    <div className="min-h-screen w-full bg-gray-50" dir="rtl">
      {/* Header Section */}
      <header className="w-full bg-white border-gray-200 border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex gap-4 items-center">
              <h1 className="text-xl font-semibold text-gray-900">لوحة المدير</h1>
              <div className="text-sm text-gray-500">
                مرحباً، {user?.name || 'المدير'}
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Notifications />
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="w-full space-y-6">
        
          {/* Filters Section */}
          <section className="w-full">
            <div className="w-full bg-white rounded-lg border-gray-200 border shadow-sm p-6 card">
              <SearchFilter 
                invitations={invitations}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
              />
            </div>
          </section>

          {/* Stats Section */}
          <section className="w-full">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="w-full bg-white rounded-lg border-gray-200 border shadow-sm p-6 card">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الدعوات</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{invitations.length}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-white rounded-lg border-gray-200 border shadow-sm p-6 card">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{pendingCount}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-white rounded-lg border-gray-200 border shadow-sm p-6 card">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">تم تسجيل الدخول</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{checkedInCount}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <QrCode className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Invitation List Section */}
          <section className="w-full">
            <div className="w-full bg-white rounded-lg border-gray-200 border shadow-sm card">
              {/* Tabs */}
              <div className="border-gray-200 border-b">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveView('list')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                      activeView === 'list'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-2 items-center">
                      <Users className="w-4 h-4" />
                      <span>جميع الدعوات</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveView('create')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                      activeView === 'create'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-2 items-center">
                      <Plus className="w-4 h-4" />
                      <span>إنشاء دعوة</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeView === 'list' && (
                  <InvitationList
                    invitations={filteredInvitations}
                    onCheckIn={handleCheckIn}
                    onExpire={handleExpire}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    onShowQRCode={handleShowQRCode}
                  />
                )}
                {activeView === 'create' && (
                  <InvitationForm onInvitationCreated={handleInvitationCreated} />
                )}
                {activeView === 'qrcode' && selectedInvitationId && (
                  <QRCodeDisplay
                    invitationId={selectedInvitationId}
                    onClose={() => setActiveView('list')}
                  />
                )}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
