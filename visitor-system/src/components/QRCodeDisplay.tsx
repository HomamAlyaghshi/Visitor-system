import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, X } from 'lucide-react';
import { useInvitationStore } from '../stores/invitationStore';
import { generateQRCodePayload } from '../utils/helpers';

interface QRCodeDisplayProps {
  invitationId: string;
  onClose: () => void;
}

export default function QRCodeDisplay({ invitationId, onClose }: QRCodeDisplayProps) {
  const getInvitationById = useInvitationStore((state) => state.getInvitationById);
  const invitation = getInvitationById(invitationId);
  
  const [copied, setCopied] = useState(false);

  if (!invitation) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Invitation not found</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    );
  }
  const qrPayload = generateQRCodePayload(invitation.id);
  
  const handleDownload = () => {
    // Get the SVG element
    const svgElement = document.querySelector('.qr-code-container svg');
    if (!svgElement) return;
    
    // Convert SVG to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 256;
    canvas.height = 256;
    
    // Get SVG data
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    
    img.onload = () => {
      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code
      ctx.drawImage(img, 0, 0, 256, 256);
      
      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `visitor-qr-${invitation.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(qrPayload));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy QR code:', error);
    }
  };

  return (
    <div className="enhanced-card max-w-2xl mx-auto">
      {/* Header */}
      <div className="permit-header">
        <div className="flex items-center justify-between">
          <div>
            <div className="permit-number">VP-{new Date(invitation.createdAt).getFullYear()}-{invitation.id.slice(-6)}</div>
            <div className="permit-title">رمز التعريف السريع</div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="qr-section">
        <div className="qr-code-container">
          <QRCodeSVG 
            value={JSON.stringify(qrPayload)}
            size={256}
            level="H"
            bgColor="#ffffff"
            fgColor="#1e40af"
          />
        </div>
        <div className="qr-instruction">
          يرجى مسح هذا الرمز عند المدخل
        </div>
      </div>

      {/* Visitor Information */}
      <div className="info-section">
        <div className="info-section-title">
          معلومات الزائر
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="info-label">الاسم</span>
            <span className="info-value">{invitation.visitorFullName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="info-label">الجهة</span>
            <span className="info-value">{invitation.visitorTitle}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="info-label">التاريخ</span>
            <span className="info-value">{invitation.visitDate}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="info-label">الوقت</span>
            <span className="info-value">{invitation.visitTime}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="info-section">
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleDownload}
            className="btn-enhanced primary"
          >
            <Download className="w-4 h-4" />
            تحميل الرمز
          </button>
          
          <button
            onClick={handleCopy}
            className="btn-enhanced secondary"
          >
            <Share2 className="w-4 h-4" />
            {copied ? 'تم النسخ!' : 'نسخ الرمز'}
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>This QR code contains the visitor invitation details.</p>
          <p>Present this code at the gate for verification.</p>
        </div>
      </div>
    </div>
  );
}
