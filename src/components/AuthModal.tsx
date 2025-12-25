import { X, Mail, Lock, User, CheckCircle2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { resendVerification } from "../services/authService";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendSuccess, setResendSuccess] = useState("");

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResendSuccess("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        onClose();
        setFormData({ name: "", email: "", password: "" });
      } else {
        // Register doesn't log user in anymore, just shows verification message
        await register(formData.name, formData.email, formData.password);
        setRegisteredEmail(formData.email);
        setShowVerificationMessage(true);
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
      
      // Check if it's an email not verified error from login
      if (errorMessage.includes('verify your email')) {
        // Extract email from error if available
        setShowVerificationMessage(true);
        setRegisteredEmail(formData.email);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError("");
    setResendSuccess("");

    try {
      await resendVerification(registeredEmail);
      setResendSuccess("Verification email sent! Please check your inbox.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend verification email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowVerificationMessage(false);
    setRegisteredEmail("");
    setError("");
    setResendSuccess("");
    onClose();
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setShowVerificationMessage(false);
    setError("");
    setResendSuccess("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative glass-card rounded-2xl p-8 w-full max-w-md glow-soft animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full glass-dark flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <X className="w-5 h-5 text-foreground/70" />
        </button>

        {/* Verification Message */}
        {showVerificationMessage ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Check Your Email! 📧
            </h2>
            <p className="text-foreground/60 text-sm mb-4">
              We've sent a verification link to
            </p>
            <p className="text-amber-400 font-medium text-sm mb-6">
              {registeredEmail}
            </p>
            
            <div className="glass-dark rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-foreground/70 mb-2">
                <strong className="text-foreground">Next steps:</strong>
              </p>
              <ol className="text-sm text-foreground/60 space-y-2 list-decimal list-inside">
                <li>Check your inbox (and spam folder)</li>
                <li>Click the verification link in the email</li>
                <li>Return here to log in</li>
              </ol>
            </div>

            {resendSuccess && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg px-4 py-3 mb-4">
                <p className="text-green-400 text-sm">{resendSuccess}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleResendVerification}
              disabled={isLoading}
              className="w-full glass-dark rounded-lg px-6 py-3 text-base font-medium text-foreground/80 hover:bg-white/10 transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Resending...' : 'Resend Verification Email'}
            </button>

            <button
              onClick={handleClose}
              className="text-amber-400 text-sm hover:underline"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-foreground/60 text-sm">
            {isLogin 
              ? "Sign in to access your account" 
              : "Join our alumni network today"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full glass-dark rounded-lg pl-11 pr-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full glass-dark rounded-lg pl-11 pr-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full glass-dark rounded-lg pl-11 pr-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {isLogin && (
            <div className="flex justify-end">
              <a href="#" className="text-amber-400 text-sm hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-6 py-3 text-base font-medium text-white hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
              </div>
            ) : (
              <span>{isLogin ? "Sign In" : "Create Account"}</span>
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-foreground/60 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={handleSwitchMode}
              className="text-amber-400 font-medium hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
