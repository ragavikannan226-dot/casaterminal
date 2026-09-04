import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, UserCheck } from 'lucide-react';

type Step = 'LOGIN' | 'FORGOT_PASSWORD' | 'OTP' | 'RESET_PASSWORD' | 'SUCCESS';

interface AuthModalProps {
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<Step>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Logo fallback state
  const [logoError, setLogoError] = useState(false);
  const logoSrc = "/logo.png";

  // OTP & Password Reset state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 1: Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in user:', { email, password, rememberMe });
    if (onSuccess) {
      onSuccess();
    }
  };

  // Step 2: Request OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log('OTP sent to:', email);
    setStep('OTP');
  };

  // Step 3: Verify OTP Input Handling
  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      const lastInput = document.getElementById('otp-5');
      lastInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      alert('Please enter a full 6-digit OTP code.');
      return;
    }
    console.log('Verifying OTP:', enteredOtp);
    setStep('RESET_PASSWORD');
  };

  // Step 4: Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Password reset successfully');
    setStep('SUCCESS');
  };

  return (
    <div className="min-h-screen bg-[#523519] text-[#2c1a0e] flex flex-col items-center justify-center p-4 font-sans selection:bg-[#523519] selection:text-white">
      
      {/* Header outside of card */}
      <div className="text-center mb-8 flex flex-col items-center">
        {/* Emblem/Logo Container */}
        <div className="w-16 h-16 mb-4 rounded-full bg-[#412811] border border-[#6d4926] shadow-lg flex items-center justify-center p-2.5 overflow-hidden">
          {!logoError ? (
            <img
              src={logoSrc}
              alt="Casa Terminal Logo"
              className="w-full h-full object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <ShieldCheck className="w-8 h-8 text-[#e3d7c5]" />
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#f5ede4]">CASA TERMINAL</h1>
        <p className="text-sm text-[#c8b5a0] mt-1.5 font-normal">Welcome back! Sign in to your user account</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[430px] bg-[#ebdccb] rounded-2xl p-7 shadow-2xl relative border border-[#dfcaa6]/40">
        
        {/* 1. LOGIN FORM */}
        {step === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* 2FA / Secure Badge */}
            <div className="w-full py-2 px-3 bg-[#ded0bd] border border-[#cfbeaa] rounded-lg text-xs font-semibold text-[#544131] flex items-center gap-2 justify-start">
              <UserCheck className="w-4 h-4 text-[#544131]" />
              <span>User Authentication Enabled</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4a3b2c] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8c7b6c]" />
                <input
                  type="email"
                  required
                  placeholder="user@casaterminal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d2c2b0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#523519] focus:border-transparent text-[#2c1a0e] placeholder-[#a6998b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4a3b2c] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8c7b6c]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#d2c2b0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#523519] focus:border-transparent text-[#2c1a0e] placeholder-[#a6998b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#8c7b6c] hover:text-[#4a3b2c]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[#544131] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#bdab98] text-[#3d2414] focus:ring-0 accent-[#3d2414]"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setStep('FORGOT_PASSWORD')}
                className="font-medium text-[#4a3b2c] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3c2311] hover:bg-[#2b190c] text-[#f5ede4] font-semibold rounded-lg text-sm transition duration-150 flex items-center justify-center gap-2 shadow-md mt-2"
            >
              Sign In
            </button>

            {/* Subtext inside bottom card */}
            <div className="pt-4 text-center text-[11px] leading-relaxed text-[#7c6a59] border-t border-[#dfcaa6]/50 mt-4">
              <p>Welcome to Casa Terminal - Construction Marketplace.</p>
              <p className="mt-0.5 font-medium">Demo: Any email/password, then any 6-digit OTP</p>
            </div>
          </form>
        )}

        {/* 2. FORGOT PASSWORD STEP */}
        {step === 'FORGOT_PASSWORD' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <h3 className="text-base font-bold text-center text-[#3c2311]">Reset Password</h3>
            <p className="text-xs text-[#6e5d4f] text-center mb-2">
              Enter your registered email address to receive a 6-digit verification code.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#4a3b2c] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8c7b6c]" />
                <input
                  type="email"
                  required
                  placeholder="user@casaterminal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d2c2b0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#523519] text-[#2c1a0e]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3c2311] hover:bg-[#2b190c] text-[#f5ede4] font-semibold rounded-lg text-sm transition duration-150 shadow-md"
            >
              Send OTP Code
            </button>

            <button
              type="button"
              onClick={() => setStep('LOGIN')}
              className="w-full text-center text-xs font-semibold text-[#544131] hover:underline mt-2 block"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* 3. OTP VERIFICATION STEP */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
            <h3 className="text-base font-bold text-[#3c2311]">Enter Verification Code</h3>
            <p className="text-xs text-[#6e5d4f]">
              We sent a verification code to <span className="font-semibold text-[#3c2311]">{email || 'your email'}</span>
            </p>

            <div className="flex justify-center gap-2 my-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className="w-10 h-11 text-center text-lg font-bold bg-white border border-[#d2c2b0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#523519] text-[#2c1a0e]"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3c2311] hover:bg-[#2b190c] text-[#f5ede4] font-semibold rounded-lg text-sm transition duration-150 shadow-md"
            >
              Verify Code
            </button>
          </form>
        )}

        {/* 4. NEW PASSWORD STEP */}
        {step === 'RESET_PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h3 className="text-base font-bold text-center text-[#3c2311]">Set New Password</h3>

            <div>
              <label className="block text-xs font-semibold text-[#4a3b2c] mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8c7b6c]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d2c2b0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#523519] text-[#2c1a0e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4a3b2c] mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8c7b6c]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d2c2b0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#523519] text-[#2c1a0e]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3c2311] hover:bg-[#2b190c] text-[#f5ede4] font-semibold rounded-lg text-sm transition duration-150 shadow-md"
            >
              Update Password
            </button>
          </form>
        )}

        {/* 5. SUCCESS STEP */}
        {step === 'SUCCESS' && (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 bg-[#ded0bd] rounded-full flex items-center justify-center mx-auto text-[#3c2311]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#3c2311]">Password Reset Complete</h3>
            <p className="text-xs text-[#6e5d4f]">Your password has been reset successfully. You can now log in to your account.</p>
            <button
              onClick={() => setStep('LOGIN')}
              className="w-full py-3 bg-[#3c2311] hover:bg-[#2b190c] text-[#f5ede4] font-semibold rounded-lg text-sm transition duration-150 shadow-md"
            >
              Return to Sign In
            </button>
          </div>
        )}
      </div>

      {/* Footer link outside card */}
      <a
        href="/"
        className="mt-6 text-xs text-[#c8b5a0] hover:text-[#f5ede4] flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </a>
    </div>
  );
};