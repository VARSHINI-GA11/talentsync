'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Briefcase, TrendingUp, UserCheck, Award, ArrowRight,
    MapPin, DollarSign, Calendar
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { calculateMatchScore } from '@/lib/db';

export default function CandidateDashboard() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get candidate profile
            const { data: profileData } = await supabase
                .from('candidate_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            setProfile(profileData);

            // Get applications
            const { data: appsData } = await supabase
                .from('applications')
                .select(`
          *,
          jobs (
            id,
            title,
            company_name,
            location
          )
        `)
                .eq('candidate_id', profileData?.id)
                .order('created_at', { ascending: false });

            setApplications(appsData || []);

            // Get active jobs
            const { data: jobsData } = await supabase
                .from('jobs')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(3);

            setJobs(jobsData || []);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const candidateSkills = profile?.skills || ['React', 'JavaScript', 'TypeScript'];
    const totalApplications = applications.length;
    const inProgress = applications.filter(app => !['rejected', 'hired'].includes(app.status)).length;
    const shortlisted = applications.filter(app => app.status === 'shortlisted').length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Welcome back, {profile?.first_name || 'Candidate'}! 👋
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Here's what's happening with your job search
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Applications"
                    value={totalApplications}
                    icon={Briefcase}
                    gradient="from-blue-500 to-purple-600"
                />
                <StatCard
                    title="In Progress"
                    value={inProgress}
                    icon={TrendingUp}
                    gradient="from-cyan-500 to-blue-600"
                />
                <StatCard
                    title="Shortlisted"
                    value={shortlisted}
                    icon={UserCheck}
                    gradient="from-green-500 to-emerald-600"
                />
                <StatCard
                    title="Profile Score"
                    value={profile?.resume_score || 75}
                    icon={Award}
                    gradient="from-purple-500 to-pink-600"
                    suffix="%"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* AI Job Suggestions */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            🎯 AI Job Suggestions
                        </h2>
                        <div className="space-y-4">
                            {loading ? (
                                <Card><p className="text-center py-8 text-slate-600">Loading...</p></Card>
                            ) : jobs.length === 0 ? (
                                <Card>
                                    <div className="text-center py-8">
                                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                                            No jobs available yet. Companies can post jobs from their dashboard!
                                        </p>
                                        <Link href="/candidate/jobs">
                                            <Button variant="outline">Browse All Jobs</Button>
                                        </Link>
                                    </div>
                                </Card>
                            ) : (
                                jobs.map((job) => {
                                    const matchScore = calculateMatchScore(job.required_skills, candidateSkills);

                                    return (
                                        <Card key={job.id} variant="hover">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-400">{job.company_name}</p>
                                                </div>
                                                {matchScore > 0 && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-full">
                                                        {matchScore}% Match
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    ₹{job.ctc_min}-{job.ctc_max} LPA
                                                </span>
                                                <span className="capitalize">{job.work_mode}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-wrap gap-2">
                                                    {job.required_skills?.slice(0, 3).map((skill: string, idx: number) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                                <Link href="/candidate/jobs">
                                                    <Button variant="ghost" size="sm" icon={ArrowRight}>
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Recent Applications */}
                    {applications.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                Recent Applications
                            </h2>
                            <div className="space-y-3">
                                {applications.slice(0, 3).map((app: any) => (
                                    <Card key={app.id} variant="hover">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                                    {app.jobs?.title}
                                                </h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {app.jobs?.company_name} • {app.jobs?.location}
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full capitalize">
                                                {app.status.replace('-', ' ')}
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link href="/candidate/jobs">
                                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <p className="font-medium text-slate-900 dark:text-white">Browse Jobs</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {jobs.length}+ active positions
                                    </p>
                                </button>
                            </Link>
                            <Link href="/candidate/applications">
                                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <p className="font-medium text-slate-900 dark:text-white">Track Applications</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {totalApplications} applications
                                    </p>
                                </button>
                            </Link>
                            <Link href="/candidate/career-assistant">
                                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <p className="font-medium text-slate-900 dark:text-white">AI Career Assistant</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Optimize your resume
                                    </p>
                                </button>
                            </Link>
                        </div>
                    </Card>

                    <Card variant="gradient" className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <h3 className="font-bold mb-2">✨ Fully Functional!</h3>
                        <p className="text-sm text-white/90 mb-4">
                            All data now saves to database. Try applying to jobs!
                        </p>
                        <Link href="/candidate/jobs">
                            <Button variant="outline" className="w-full bg-white text-blue-600 hover:bg-white/90">
                                Explore Jobs
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}
