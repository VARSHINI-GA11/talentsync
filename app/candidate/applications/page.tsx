'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('candidate_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!profile) return;

            const { data } = await supabase
                .from('applications')
                .select(`
          *,
          jobs (
            id,
            title,
            company_name,
            location,
            ctc_min,
            ctc_max
          )
        `)
                .eq('candidate_id', profile.id)
                .order('created_at', { ascending: false });

            setApplications(data || []);
        } catch (error) {
            console.error('Error loading applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            applied: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
            screening: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
            shortlisted: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
            hired: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
        };
        return colors[status] || colors.applied;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Applications Tracker</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    {applications.length} applications submitted
                </p>
            </div>

            {loading ? (
                <Card>
                    <p className="text-center py-12 text-slate-600">Loading applications...</p>
                </Card>
            ) : applications.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <Clock className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            No Applications Yet
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Start applying to jobs to track your applications here!
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <Card key={app.id} hover>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                        {app.jobs?.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {app.jobs?.company_name} • {app.jobs?.location}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                                        ₹{app.jobs?.ctc_min}-{app.jobs?.ctc_max} LPA
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(app.status)}`}>
                                    {app.status.replace('-', ' ')}
                                </span>
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                                <div>
                                    <p className="text-slate-600 dark:text-slate-400 mb-1">Applied</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {new Date(app.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                                <div>
                                    <p className="text-slate-600 dark:text-slate-400 mb-1">Status</p>
                                    <p className="font-semibold text-slate-900 dark:text-white capitalize">
                                        {app.status.replace('-', ' ')}
                                    </p>
                                </div>
                            </div>

                            {app.status === 'applied' && (
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Your application has been submitted successfully!
                                    </p>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
