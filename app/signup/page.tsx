'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'candidate' as 'candidate' | 'college' | 'corporate',
        fullName: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) {
                throw authError;
            }

            if (authData.user) {
                const { error: userError } = await supabase
                    .from('users')
                    .insert([
                        {
                            id: authData.user.id,
                            email: formData.email,
                            role: formData.role,
                        },
                    ]);

                if (userError) throw userError;

                if (formData.role === 'candidate') {
                    const [firstName, ...lastNameParts] = formData.fullName.split(' ');
                    const lastName = lastNameParts.join(' ') || '';

                    await supabase.from('candidate_profiles').insert([
                        {
                            user_id: authData.user.id,
                            first_name: firstName,
                            last_name: lastName,
                        },
                    ]);
                } else if (formData.role === 'corporate') {
                    await supabase.from('corporate_profiles').insert([
                        {
                            user_id: authData.user.id,
                            company_name: formData.fullName,
                            hr_email: formData.email,
                        },
                    ]);
                } else if (formData.role === 'college') {
                    await supabase.from('college_profiles').insert([
                        {
                            user_id: authData.user.id,
                            institution_name: formData.fullName,
                            contact_email: formData.email,
                        },
                    ]);
                }

                router.push(`/${formData.role}/dashboard`);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 flex items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <Link href="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Join TalentSync AI Platform</p>

                <form onSubmit={handleSignup} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            I am a...
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['candidate', 'college', 'corporate'].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: role as any })}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${formData.role === role
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Input
                        label={formData.role === 'candidate' ? 'Full Name' : formData.role === 'corporate' ? 'Company Name' : 'Institution Name'}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        hint="At least 6 characters"
                        required
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        isLoading={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                        Log in
                    </Link>
                </p>
            </Card>
        </div>
    );
}
