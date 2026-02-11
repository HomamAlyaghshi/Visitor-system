import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Camera, XCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useInvitationStore } from '../stores/invitationStore';
import QRScanner from '../components/QRScanner';
import InvitationDetails from '../components/InvitationDetails';

export default function GateGuardDashboard() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const getInvitationById = useInvitationStore((state) => state.getInvitationById);
  const updateInvitationStatus = useInvitationStore((state) => state.updateInvitationStatus);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleScanSuccess = (result: any) => {
    try {
      const payload = typeof result === 'string' ? JSON.parse(result) : result;
      
      if (!payload.type || payload.type !== 'VISITOR_INVITE_V1') {
        setError('Invalid QR code format');
        return;
      }

      const invitation = getInvitationById(payload.invitationId);
      
      if (!invitation) {
        setError('Invitation not found');
        return;
      }

      setScanResult({ invitation, qrPayload: payload });
      setError(null);
      setIsScanning(false);
    } catch (err) {
      setError('Failed to parse QR code');
      console.error('QR parse error:', err);
    }
  };

  const handleScanError = (err: any) => {
    setError('Failed to scan QR code');
    console.error('Scan error:', err);
  };

  const handleCheckIn = (invitationId: string) => {
    updateInvitationStatus(invitationId, 'CHECKED_IN');
    setScanResult(null);
  };

  const handleReset = () => {
    setScanResult(null);
    setError(null);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Gate Guard Dashboard</h1>
              <div className="text-sm text-gray-500">
                Welcome, {user?.name || 'Gate Guard'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!scanResult ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan Visitor QR Code</h2>
              <p className="text-gray-600">
                Position the QR code within the camera frame to scan
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              {isScanning ? (
                <div className="space-y-4 w-full max-w-md">
                  <QRScanner
                    onScanSuccess={handleScanSuccess}
                    onScanError={handleScanError}
                  />
                  <button
                    onClick={() => setIsScanning(false)}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel Scanning
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsScanning(true)}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Start Scanning</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Invitation Details</h2>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Scan Another</span>
              </button>
            </div>
            
            <InvitationDetails
              invitation={scanResult.invitation}
              onCheckIn={handleCheckIn}
            />
          </div>
        )}
      </main>
    </div>
  );
}
