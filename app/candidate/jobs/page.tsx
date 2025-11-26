'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, MapPin, Briefcase, DollarSign, TrendingUp, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { calculateMatchScore } from '@/lib/db';

interface Job {
    id: string;
    company_name: string;
    title: string;
    location: string;
    ctc_min: number;
    ctc_max: number;
    work_mode: string;
    job_type: string;
    required_skills: string[];
    openings: number;
    description: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [workModeFilter, setWorkModeFilter] = useState<'all' | 'remote' | 'hybrid' | 'on-site'>('all');

    // Mock candidate skills - in real app, fetch from profile
    const candidateSkills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS'];

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            // Only fetch OFF-CAMPUS jobs
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('status', 'active')
                .eq('job_type', 'off-campus') // ONLY OFF-CAMPUS!
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId: string, jobTitle: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('Please login to apply');
                return;
            }

            const { data: profile } = await supabase
                .from('candidate_profiles')
                .select('id, first_name, last_name')
                .eq('user_id', user.id)
                .single();

            if (!profile) {
                alert('Please complete your profile first');
                return;
            }

            const { error } = await supabase
                .from('applications')
                .insert([
                    {
                        job_id: jobId,
                        candidate_id: profile.id,
                        candidate_name: `${profile.first_name} ${profile.last_name}`,
                        candidate_email: user.email,
                        status: 'applied',
                        scores: { resume: 0, aptitude: 0, interview: 0 },
                        timeline: [
                            {
                                stage: 'applied',
                                date: new Date().toISOString(),
                                status: 'completed',
                            },
                        ],
                    },
                ]);

            if (error) throw error;

            alert(`✅ Successfully applied to ${jobTitle}!`);
            // Refresh to show updated job count
            fetchJobs();
        } catch (error: any) {
            console.error('Error applying:', error);
            alert('Error applying to job. Please try again.');
        }
    };

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.required_skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesWorkMode =
            workModeFilter === 'all' || job.work_mode === workModeFilter;

        return matchesSearch && matchesWorkMode;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Off-Campus Job Opportunities</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    {jobs.length} off-campus positions available • AI-powered matching
                </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        icon={Search}
                        placeholder="Search by job title, company, location, or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {(['all', 'remote', 'hybrid', 'on-site'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setWorkModeFilter(mode)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${workModeFilter === mode
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            {mode === 'all' ? 'All Jobs' : mode.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Jobs Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-slate-600 dark:text-slate-400 mt-4">Loading jobs...</p>
                </div>
            ) : filteredJobs.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <Briefcase className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {jobs.length === 0 ? 'No Jobs Yet' : 'No Matching Jobs'}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            {jobs.length === 0
                                ? 'Companies will post jobs soon. Check back later!'
                                : 'Try adjusting your search or filters.'}
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {filteredJobs.map((job) => {
                        const matchScore = calculateMatchScore(job.required_skills, candidateSkills);

                        return (
                            <Card key={job.id} hover>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                {job.title}
                                            </h3>
                                            {matchScore > 0 && (
                                                <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                                                    <TrendingUp className="w-4 h-4" />
                                                    {matchScore}% Match
                                                </span>
                                            )}
                                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full">
                                                Off-Campus
                                            </span>
                                        </div>
                                        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                            {job.company_name}
                                        </p>
                                    </div>

                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleApply(job.id, job.title)}
                                    >
                                        Apply Now
                                    </Button>
                                </div>

                                {job.description && (
                                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                        {job.description}
                                    </p>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm">{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm">
                                            ₹{job.ctc_min}-{job.ctc_max} LPA
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Briefcase className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm capitalize">{job.work_mode}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <TrendingUp className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm">{job.openings} openings</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {job.required_skills?.map((skill: string, idx: number) => {
                                        const isMatched = candidateSkills.some(
                                            (s) => s.toLowerCase() === skill.toLowerCase()
                                        );
                                        return (
                                            <span
                                                key={idx}
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${isMatched
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500'
                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                                    }`}
                                            >
                                                {skill}
                                                {isMatched && ' ✓'}
                                            </span>
                                        );
                                    })}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
