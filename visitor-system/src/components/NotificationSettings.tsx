import { useState } from 'react';
import { Mail, Bell, Settings, Save } from 'lucide-react';
import type { NotificationSettings } from '../services/notificationService';

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}

export default function NotificationSettings({ settings, onSettingsChange }: NotificationSettingsProps) {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleSave = () => {
    // In a real app, this would save to user preferences
    console.log('💾 Saving notification settings:', localSettings);
    alert('تم حفظ إعدادات الإشعارات بنجاح!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          إعدادات الإشعارات
        </h3>
        <button
          onClick={handleSave}
          className="btn-primary px-4 py-2 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          حفظ الإعدادات
        </button>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              إشعارات البريد الإلكتروني
            </h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.email}
                onChange={(e) => handleSettingChange('email', e.target.checked)}
                className="sr-only"
              />
              <div className="w-12 h-6 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out">
                <div 
                  className={`${
                    localSettings.email ? 'translate-x-6 bg-blue-600' : 'translate-x-6 bg-gray-300'
                  } absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200 ease-in-out`}
                />
              </div>
            </label>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localSettings.checkInNotification}
                onChange={(e) => handleSettingChange('checkInNotification', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="checkInNotification" className="cursor-pointer">
                إشعار عند تسجيل الدخول
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localSettings.reminderNotification}
                onChange={(e) => handleSettingChange('reminderNotification', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="reminderNotification" className="cursor-pointer">
                إشعار التذكير
              </label>
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-green-600" />
              إشعارات الرسائل النصية
            </h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.sms}
                onChange={(e) => handleSettingChange('sms', e.target.checked)}
                className="sr-only"
              />
              <div className="w-12 h-6 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out">
                <div 
                  className={`${
                    localSettings.sms ? 'translate-x-6 bg-green-600' : 'translate-x-6 bg-gray-300'
                  } absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200 ease-in-out`}
                />
              </div>
            </label>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <p className="mb-2">
              <strong>ملاحظة:</strong> لإرسال الرسائل النصية، يجب ربط النظام مع مزود خدمة الرسائل مثل Twilio أو AWS SNS.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm">
                <strong>وضع التطوير:</strong> الرسائل النصية حالياً في وضع العرض التوضيحي فقط.
              </p>
            </div>
          </div>
        </div>

        {/* Test Notifications */}
        <div className="border rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 mb-4">اختبار الإشعارات</h4>
          <div className="flex gap-4">
            <button
              onClick={() => {
                console.log('📧 Sending test email...');
                alert('تم إرسال بريد إلكتروني اختباري!');
              }}
              className="btn-secondary px-4 py-2 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              اختبار البريد الإلكتروني
            </button>
            <button
              onClick={() => {
                console.log('📱 Sending test SMS...');
                alert('تم إرسال رسالة نصية اختبارية!');
              }}
              className="btn-success px-4 py-2 flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              اختبار الرسالة النصية
            </button>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-2">حالة الإشعارات</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              localSettings.email ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            <span className={localSettings.email ? 'text-green-600' : 'text-gray-500'}>
              البريد الإلكتروني: {localSettings.email ? 'مفعل' : 'معطل'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              localSettings.sms ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            <span className={localSettings.sms ? 'text-green-600' : 'text-gray-500'}>
              الرسائل النصية: {localSettings.sms ? 'مفعل' : 'معطل'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
