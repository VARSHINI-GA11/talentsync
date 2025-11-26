'use client';

import { CollegeLayout } from '@/components/layouts/CollegeLayout';
import { StatCard } from '@/components/ui/Card';
import { Users, Building2, TrendingUp, Award } from 'lucide-react';

export default function CollegeDashboard() {
    return (
        <CollegeLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">College Dashboard</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Placement overview and statistics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Students"
                        value={450}
                        icon={Users}
                        gradient="from-blue-500 to-purple-600"
                    />
                    <StatCard
                        title="Active Drives"
                        value={8}
                        icon={Building2}
                        gradient="from-purple-500 to-pink-600"
                        trend={{ value: 20, isPositive: true }}
                    />
                    <StatCard
                        title="Placement Rate"
                        value="78%"
                        icon={Award}
                        gradient="from-green-500 to-emerald-600"
                        trend={{ value: 5, isPositive: true }}
                    />
                    <StatCard
                        title="Avg CTC"
                        value="₹6.2L"
                        icon={TrendingUp}
                        gradient="from-cyan-500 to-blue-600"
                        trend={{ value: 12, isPositive: true }}
                    />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        College Portal - Full Features Coming Soon
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Student management, drive coordination, logistics,  and analytics
                    </p>
                </div>
            </div>
        </CollegeLayout>
    );
}
