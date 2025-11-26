'use client';

import { CandidateLayout } from '@/components/layouts/CandidateLayout';
import { Card } from '@/components/ui/Card';
import { careerRoadmaps } from '@/lib/data/mock-data';
import { GraduationCap, Clock, TrendingUp, Play, CheckCircle } from 'lucide-react';

export default function LearningPage() {
    return (
        <CandidateLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Learning Hub</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Explore career roadmaps and level up your skills
                    </p>
                </div>

                {/* Roadmaps Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {careerRoadmaps.map((roadmap) => (
                        <Card key={roadmap.id} hover>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <GraduationCap className="w-8 h-8 text-white" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                        {roadmap.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                        {roadmap.category}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                                            <Clock className="w-3 h-3" />
                                            {roadmap.duration}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded capitalize ${roadmap.difficulty === 'beginner'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                : roadmap.difficulty === 'intermediate'
                                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                            }`}>
                                            {roadmap.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                {roadmap.description}
                            </p>

                            {/* Steps Preview */}
                            {roadmap.steps.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                                        LEARNING PATH ({roadmap.steps.length} steps)
                                    </p>
                                    <div className="space-y-2">
                                        {roadmap.steps.slice(0, 3).map((step, index) => (
                                            <div key={step.id} className="flex items-start gap-2">
                                                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-xs font-medium">{index + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {step.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {step.estimatedTime}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {roadmap.steps.length > 3 && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 pl-7">
                                                +{roadmap.steps.length - 3} more steps
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                                <Play className="w-4 h-4" />
                                Start Learning
                            </button>
                        </Card>
                    ))}
                </div>

                {/* Resources Section */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Featured Resources</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card hover>
                            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Interview Preparation</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Common interview questions and best practices
                            </p>
                            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
                                Explore
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </Card>

                        <Card hover>
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Industry Insights</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Latest salary trends and skill demand analytics
                            </p>
                            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
                                View Reports
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </Card>

                        <Card hover>
                            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                                <GraduationCap className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Skill Assessments</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Test your knowledge and get certified
                            </p>
                            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
                                Take Test
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </Card>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}
