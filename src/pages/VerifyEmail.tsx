import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          setStatus('error');
          setMessage('Invalid verification link');
          return;
        }

        const response = await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(response.data.message);

        // Auto-login the user
        if (response.data.token && response.data.user) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setToken(response.data.token);
          setUser(response.data.user);

          // Redirect to home after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        setStatus('error');
        setMessage(err.response?.data?.message || 'Failed to verify email. Please try again.');
      }
    };

    verifyEmail();
  }, [token, navigate, setUser]);

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      const email = prompt('Please enter your email address:');
      if (!email) {
        setIsResending(false);
        return;
      }

      await api.post('/auth/resend-verification', { email });
      setResendMessage('Verification email sent! Please check your inbox.');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setResendMessage(err.response?.data?.message || 'Failed to send verification email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-background">
      <div className="max-w-md w-full">
        <div className="glass-card rounded-2xl p-8 glow-soft animate-in fade-in zoom-in duration-500">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">
                Verifying Your Email
              </h1>
              <p className="text-foreground/60">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">
                Email Verified! 🎉
              </h1>
              <p className="text-foreground/70 mb-6">
                {message}
              </p>
              <div className="glass-dark rounded-lg p-4 mb-6">
                <p className="text-sm text-foreground/60">
                  Redirecting you to the home page in a few seconds...
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-6 py-3 text-base font-medium text-white hover:scale-105 transition-all shadow-lg"
              >
                Go to Home
              </button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">
                Verification Failed
              </h1>
              <p className="text-foreground/70 mb-6">
                {message}
              </p>
              
              <div className="glass-dark rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Need a new verification link?
                    </p>
                    <p className="text-xs text-foreground/60">
                      Click the button below to receive a new verification email
                    </p>
                  </div>
                </div>
              </div>

              {resendMessage && (
                <div className={`mb-4 p-3 rounded-lg ${
                  resendMessage.includes('sent') 
                    ? 'bg-green-500/10 border border-green-500/50 text-green-400' 
                    : 'bg-red-500/10 border border-red-500/50 text-red-400'
                }`}>
                  <p className="text-sm">{resendMessage}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-6 py-3 text-base font-medium text-white hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full glass-dark rounded-lg px-6 py-3 text-base font-medium text-foreground/80 hover:bg-white/10 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
