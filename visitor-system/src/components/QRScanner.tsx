import { useRef, useEffect } from 'react';

interface QRScannerProps {
  onScanSuccess: (result: any) => void;
  onScanError: (error: any) => void;
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (error) {
        console.error('Camera access error:', error);
        onScanError(error);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScanError]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // For this demo, we'll simulate QR code detection
          // In a real app, you'd use a QR code scanning library
          // For now, we'll just show a mock success
          const mockQRData = JSON.stringify({
            type: 'VISITOR_INVITE_V1',
            invitationId: 'demo-' + Date.now(),
            issuedAt: new Date().toISOString()
          });
          onScanSuccess(mockQRData);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ width: '320px', height: '240px' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 border-2 border-white rounded-lg"></div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Camera preview (simulated - use file upload for demo)
        </p>
        <label className="inline-block">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
            Upload QR Code Image
          </div>
        </label>
      </div>
    </div>
  );
}
