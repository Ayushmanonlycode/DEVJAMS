import React, { useState, useRef, useEffect, ForwardedRef } from 'react';

interface KarmOTPVerificationProps {
  phoneNumber?: string;
}

const KarmOTPVerification: React.FC<KarmOTPVerificationProps> = ({ phoneNumber = '+91XXXXXXXXXX' }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer effect for resend OTP
  useEffect(() => {
    let interval: number | undefined;
    if (resendTimer > 0 && !canResend) {
      interval = window.setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [resendTimer, canResend]);

  // Auto-focus first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (value: string, index: number) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace to focus previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'Enter') {
      handleVerifyOtp();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newOtp = pastedData.split('').concat(['', '', '', '']).slice(0, 4);
    setOtp(newOtp);
    
    // Focus the next empty input or last input
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      setError('Please enter the complete 4-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call for OTP verification
      console.log('Verifying OTP:', otpString);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle success - navigate to dashboard or next screen
      alert('OTP verified successfully!');
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(30);
    setOtp(['', '', '', '']);
    setError('');
    
    try {
      // Simulate API call for resending OTP
      console.log('Resending OTP to:', phoneNumber);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Focus first input after resend
      inputRefs.current[0]?.focus();
      alert('OTP sent successfully!');
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
      setCanResend(true);
      setResendTimer(0);
    }
  };

  const formatTimer = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4 py-8 bg-gray-50 font-sans">
      <div className="w-full max-w-sm text-center">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enter OTP</h1>
          <p className="text-gray-500 mt-2">
            We've sent a one-time password to your mobile number.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {phoneNumber}
          </p>
        </header>

        <main>
          <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }} className="space-y-6">
            {/* OTP Input Fields */}
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <OTPInput
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  value={digit}
                  onChange={(value) => handleInputChange(value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  hasError={!!error}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 4}
              className={`w-full rounded-xl h-14 text-base font-bold flex items-center justify-center transition-all ${
                isLoading || otp.join('').length !== 4
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner />
                  <span className="ml-2">Verifying...</span>
                </div>
              ) : (
                'Verify'
              )}
            </button>
          </form>

          {/* Resend OTP Section */}
          <div className="mt-6 text-center">
            <p className="text-gray-500">Didn't receive the OTP?</p>
            <div className="mt-2">
              <button
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`font-medium transition-colors ${
                  canResend
                    ? 'text-blue-500 hover:underline cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                Resend OTP
              </button>
              {!canResend && (
                <span className="text-gray-400 ml-2">
                  ({formatTimer(resendTimer)})
                </span>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  hasError: boolean;
  autoFocus: boolean;
}

const OTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(({ 
  value, 
  onChange, 
  onKeyDown, 
  onPaste, 
  hasError, 
  autoFocus 
}, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      pattern="[0-9]"
      maxLength={1}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      autoFocus={autoFocus}
      className={`w-14 h-16 text-center text-3xl font-bold rounded-xl border-2 transition-colors focus:outline-none focus:ring-0 ${
        hasError
          ? 'bg-red-50 border-red-500 focus:border-red-500'
          : value
          ? 'bg-blue-50 border-blue-500 text-gray-900'
          : 'bg-gray-100 border-transparent focus:border-blue-500 text-gray-900'
      }`}
      aria-label={`OTP digit ${ref && 'current' in ref && ref.current && ref.current.parentNode ? Array.from(ref.current.parentNode.children).indexOf(ref.current) + 1 : ''}`}
    />
  );
});

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
);

export default KarmOTPVerification;
