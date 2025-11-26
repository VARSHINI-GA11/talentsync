'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        required_skills: '',
        location: '',
        work_mode: 'on-site',
        job_type: 'off-campus',
        ctc_min: '',
        ctc_max: '',
        openings: '1',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data: profile } = await supabase
                .from('corporate_profiles')
                .select('id, company_name')
                .eq('user_id', user.id)
                .single();

            if (!profile) throw new Error('Corporate profile not found');

            const { error: jobError } = await supabase
                .from('jobs')
                .insert([
                    {
                        company_id: profile.id,
                        company_name: profile.company_name,
                        title: formData.title,
                        description: formData.description,
                        required_skills: formData.required_skills.split(',').map(s => s.trim()),
                        location: formData.location,
                        work_mode: formData.work_mode,
                        job_type: formData.job_type,
                        ctc_min: parseInt(formData.ctc_min),
                        ctc_max: parseInt(formData.ctc_max),
                        openings: parseInt(formData.openings),
                        status: 'active',
                    },
                ]);

            if (jobError) throw jobError;

            router.push('/corporate/dashboard');
        } catch (err: any) {
            setError(err.message || 'Error posting job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/corporate/dashboard" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <Card>
                    <h1 className="text-3xl font-bold mb-2">Post New Job</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">Fill in the details to create a new job posting</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Job Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Software Engineer"
                            required
                        />

                        <Textarea
                            label="Job Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the role, responsibilities, and requirements..."
                            rows={6}
                            required
                        />

                        <Input
                            label="Required Skills (comma-separated)"
                            value={formData.required_skills}
                            onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
                            placeholder="e.g. React, Node.js, TypeScript"
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* FIXED SELECT - ADDED options prop */}
                            <Select
                                label="Work Mode"
                                value={formData.work_mode}
                                onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                                required
                                options={[
                                    { label: "On-Site", value: "on-site" },
                                    { label: "Remote", value: "remote" },
                                    { label: "Hybrid", value: "hybrid" },
                                ]}
                            />

                            {/* FIXED SELECT - ADDED options prop */}
                            <Select
                                label="Job Type"
                                value={formData.job_type}
                                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                                required
                                options={[
                                    { label: "Off-Campus", value: "off-campus" },
                                    { label: "On-Campus", value: "on-campus" },
                                ]}
                            />
                        </div>

                        <Input
                            label="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g. Bangalore, India"
                            required
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <Input
                                label="Min CTC (LPA)"
                                type="number"
                                value={formData.ctc_min}
                                onChange={(e) => setFormData({ ...formData, ctc_min: e.target.value })}
                                placeholder="e.g. 5"
                                required
                            />

                            <Input
                                label="Max CTC (LPA)"
                                type="number"
                                value={formData.ctc_max}
                                onChange={(e) => setFormData({ ...formData, ctc_max: e.target.value })}
                                placeholder="e.g. 8"
                                required
                            />

                            <Input
                                label="Openings"
                                type="number"
                                value={formData.openings}
                                onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                                placeholder="1"
                                required
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1"
                                isLoading={loading}
                            >
                                {loading ? 'Posting Job...' : 'Post Job'}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
