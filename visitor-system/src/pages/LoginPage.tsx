import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, User } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import type { UserRole } from '../types';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole, name || undefined);
      navigate(selectedRole === 'MANAGER' ? '/manager' : '/gate-guard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Visitor System</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole('MANAGER')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  selectedRole === 'MANAGER'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium text-gray-900">Manager</div>
                <div className="text-xs text-gray-500 mt-1">Create invitations</div>
              </button>
              <button
                onClick={() => setSelectedRole('GATE_GUARD')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  selectedRole === 'GATE_GUARD'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Shield className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium text-gray-900">Gate Guard</div>
                <div className="text-xs text-gray-500 mt-1">Verify visitors</div>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
