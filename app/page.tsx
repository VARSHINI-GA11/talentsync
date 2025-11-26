'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Building2, Briefcase, Sparkles, TrendingUp, Award, Target, Zap } from 'lucide-react';

export default function Home() {
    const roles = [
        {
            id: 'candidate',
            title: 'Candidate',
            subtitle: 'Students & Job Seekers',
            description: 'Build your career with AI-powered tools, personalized learning, and smart job matching',
            icon: Users,
            gradient: 'from-blue-500 to-purple-600',
            features: ['AI Resume Builder', 'Smart Job Matching', 'Skill Assessment', 'Interview Prep'],
            href: '/signup',
        },
        {
            id: 'college',
            title: 'College',
            subtitle: 'Placement Coordinators',
            description: 'Streamline campus recruitment, manage drives, and track placement success',
            icon: Building2,
            gradient: 'from-purple-500 to-pink-600',
            features: ['Drive Management', 'Student Analytics', 'Company Relations', 'Reports'],
            href: '/signup',
        },
        {
            id: 'corporate',
            title: 'Corporate',
            subtitle: 'HR & Recruiters',
            description: 'Hire faster with AI screening, automated interviews, and data-driven insights',
            icon: Briefcase,
            gradient: 'from-cyan-500 to-blue-600',
            features: ['AI Screening', 'Workflow Builder', 'Candidate Ranking', 'Offer Management'],
            href: '/signup',
        },
    ];

    const features = [
        { icon: Sparkles, title: 'AI-Powered', description: 'Smart automation for every step' },
        { icon: TrendingUp, title: 'Data-Driven', description: 'Analytics & insights dashboard' },
        { icon: Award, title: 'End-to-End', description: 'Complete hiring lifecycle' },
        { icon: Target, title: 'Personalized', description: 'Tailored for each user role' },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-700/25 bg-[size:40px_40px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-700 mb-6"
                        >
                            <Zap className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                Powered by AI Technology
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
                        >
                            <span className="gradient-text">TalentSync AI</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12"
                        >
                            Unified Career, Skills & Hiring Platform
                            <br />
                            <span className="text-lg text-slate-500 dark:text-slate-400">
                                Revolutionizing recruitment with end-to-end AI automation
                            </span>
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16"
                        >
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                                >
                                    <feature.icon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                    <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">{feature.description}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {roles.map((role, index) => (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                            >
                                <Link href={role.href}>
                                    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden h-full cursor-pointer">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                        <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${role.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <role.icon className="w-8 h-8 text-white" />
                                        </div>

                                        <div className="relative">
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{role.title}</h2>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">{role.subtitle}</p>
                                            <p className="text-slate-600 dark:text-slate-300 mb-6">{role.description}</p>

                                            <ul className="space-y-2 mb-6">
                                                {role.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${role.gradient} mr-2`} />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className={`inline-flex items-center text-sm font-semibold bg-gradient-to-br ${role.gradient} bg-clip-text text-transparent group-hover:translate-x-1 transition-transform duration-300`}>
                                                Get Started
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            href="/admin/dashboard"
                            className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-30 hover:opacity-100 transition-opacity"
                        >
                            Super Admin Portal
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="relative border-t border-slate-200 dark:border-slate-800 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                        © 2025 TalentSync AI. All rights reserved.
                    </p>
                </div>
            </footer>
        </main>
    );
}
