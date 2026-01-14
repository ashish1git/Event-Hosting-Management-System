import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, Keyboard, CheckCircle, XCircle, Loader, Users } from 'lucide-react';
import API from '../services/api';

const QRScanner = ({ eventId, eventName, onScanSuccess: onScanCallback }) => {
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'manual'
  const [manualToken, setManualToken] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    if (scanMode === 'camera') {
      initScanner();
    }
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanMode]);

  const initScanner = () => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    html5QrcodeScanner.render(handleQRSuccess, handleQRError);
    setScanner(html5QrcodeScanner);
  };

  const handleQRSuccess = async (decodedText) => {
    await handleScan(decodedText);
  };

  const handleQRError = (error) => {
    // Ignore scan errors (happens continuously while scanning)
  };

  const handleScan = async (token) => {
    try {
      setScanning(true);
      setResult(null);

      const { data } = await API.post('/api/attendance/scan', {
        qrToken: token
      });

      // Play success sound
      if (data.playSound) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs7y2Yk2CBlou+3nn00QDFC');
        audio.play().catch(() => {});
      }

      if (onScanCallback) {
        onScanCallback(data.attendance);
      }

      setResult({
        success: true,
        message: data.message,
        data: data.attendance
      });

      // Add to recent scans
      setRecentScans(prev => [data.attendance, ...prev.slice(0, 4)]);

      // Clear result after 3 seconds
      setTimeout(() => setResult(null), 3000);

    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Scan failed',
        data: null
      });

      // Play error sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs7y2Yk2CBlou+3nn00QDFC');
      audio.play().catch(() => {});

      setTimeout(() => setResult(null), 3000);
    } finally {
      setScanning(false);
      setManualToken('');
    }
  };

  const handleManualScan = (e) => {
    e.preventDefault();
    if (manualToken.trim()) {
      handleScan(manualToken.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1E1E1E] rounded-2xl p-4 sm:p-6 border border-white/10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">📱 QR Scanner</h2>
        <p className="text-gray-400">{eventName}</p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 sm:gap-4">
        <button
          onClick={() => setScanMode('camera')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            scanMode === 'camera'
              ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white'
              : 'bg-[#1E1E1E] text-gray-400 border border-white/10'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="hidden sm:inline">Camera</span>
        </button>
        <button
          onClick={() => setScanMode('manual')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            scanMode === 'manual'
              ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white'
              : 'bg-[#1E1E1E] text-gray-400 border border-white/10'
          }`}
        >
          <Keyboard className="w-5 h-5" />
          <span className="hidden sm:inline">Manual</span>
        </button>
      </div>

      {/* Scanner Area */}
      <div className="bg-[#1E1E1E] rounded-2xl p-4 sm:p-6 border border-white/10">
        {scanMode === 'camera' ? (
          <div id="qr-reader" className="w-full"></div>
        ) : (
          <form onSubmit={handleManualScan} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Enter QR Token</label>
              <textarea
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Paste QR token here..."
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                rows="4"
              />
            </div>
            <button
              type="submit"
              disabled={scanning || !manualToken.trim()}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {scanning ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                'Scan Token'
              )}
            </button>
          </form>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className={`p-4 sm:p-6 rounded-2xl border ${
          result.success
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <h3 className={`font-bold text-lg mb-1 ${
                result.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {result.message}
              </h3>
              {result.success && result.data && (
                <div className="text-sm space-y-1 mt-2">
                  <p className="text-white"><strong>Name:</strong> {result.data.userName}</p>
                  <p className="text-gray-400"><strong>Email:</strong> {result.data.userEmail}</p>
                  <p className="text-gray-400"><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <div className="bg-[#1E1E1E] rounded-2xl p-4 sm:p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Recent Check-ins
          </h3>
          <div className="space-y-2">
            {recentScans.map((scan, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{scan.userName}</p>
                  <p className="text-gray-400 text-sm truncate">{scan.userEmail}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
