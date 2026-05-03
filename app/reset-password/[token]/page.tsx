"use client";
import { useState, FormEvent, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/app/admin/components/ui/Input';
import { Button } from '@/app/admin/components/ui/Button';
import { authService } from '@/app/admin/lib/auth.service';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, password);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-paper-white flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-gold-start/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-ruby-red/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gold-start/20 relative z-10 text-center"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle2 size={48} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-ruby-red mb-4">Password Reset!</h1>
                    <p className="text-text-muted mb-8 text-lg">
                        Your password has been successfully updated. You can now log in with your new credentials.
                    </p>
                    <Button
                        onClick={() => router.push('/admin/login')}
                        className="w-full bg-linear-to-r from-gold-start to-gold-end text-ruby-red font-bold py-4 text-lg hover:shadow-xl transition-all"
                    >
                        Go to Login
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold-start/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-ruby-red/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gold-start/20 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-ruby-red/10 rounded-xl text-ruby-red">
                            <Lock size={32} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-ruby-red mb-2">New Password</h1>
                    <p className="text-text-muted text-sm mt-2">
                        Please enter your new secure password
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-red-500 text-sm text-center mb-6 bg-red-50 p-3 rounded-lg border border-red-100"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-dark">New Password</label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Min 6 characters"
                                className="bg-paper-white border-gold-start/30 focus:border-ruby-red text-text-dark placeholder:text-text-muted/50 pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-ruby-red transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-dark">Confirm Password</label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Repeat your password"
                                className="bg-paper-white border-gold-start/30 focus:border-ruby-red text-text-dark placeholder:text-text-muted/50 pr-10"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-ruby-red transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-linear-to-r from-gold-start to-gold-end text-ruby-red font-bold hover:shadow-lg transition-all py-3"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Reset Password'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => router.push('/admin/login')}
                        className="text-sm text-text-muted hover:text-ruby-red underline decoration-gold-start/50"
                    >
                        Cancel and go back
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
