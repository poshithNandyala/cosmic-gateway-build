
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, Github, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import StarField from '@/components/StarField';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, signUp, signIn, signInWithProvider, resetPassword } = useAuth();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isResetPassword) {
      await resetPassword(email);
      setIsResetPassword(false);
      setEmail('');
    } else if (isSignUp) {
      if (password !== confirmPassword) {
        setLoading(false);
        return;
      }
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }

    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setLoading(true);
    await signInWithProvider(provider);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 light:from-blue-50 light:via-purple-50 light:to-pink-50 text-white dark:text-white light:text-gray-900 overflow-hidden relative">
      <StarField />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="bg-black/30 backdrop-blur-md border-white/20">
            <CardHeader className="text-center">
              <motion.div
                className="flex items-center justify-center space-x-3 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur opacity-30 animate-pulse"></div>
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {isResetPassword ? 'Reset Password' : isSignUp ? 'Join Nebula Nexus' : 'Welcome Back'}
              </CardTitle>
              <p className="text-gray-400 text-sm">
                {isResetPassword 
                  ? 'Enter your email to receive reset instructions'
                  : isSignUp 
                    ? 'Create your account to explore the cosmos' 
                    : 'Sign in to continue your cosmic journey'
                }
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!isResetPassword && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleOAuthSignIn('google')}
                      disabled={loading}
                      className="border-white/20 hover:bg-white/10"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleOAuthSignIn('github')}
                      disabled={loading}
                      className="border-white/20 hover:bg-white/10"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  </div>

                  <div className="relative">
                    <Separator className="bg-white/20" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black/30 px-2 text-gray-400 text-sm">or</span>
                    </span>
                  </div>
                </>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>

                {!isResetPassword && (
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                )}

                {isSignUp && !isResetPassword && (
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      {isResetPassword ? 'Send Reset Email' : isSignUp ? 'Create Account' : 'Sign In'}
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center space-y-2">
                {isResetPassword ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsResetPassword(false);
                      setEmail('');
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </Button>
                    
                    {!isSignUp && (
                      <Button
                        variant="ghost"
                        onClick={() => setIsResetPassword(true)}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        Forgot your password?
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
