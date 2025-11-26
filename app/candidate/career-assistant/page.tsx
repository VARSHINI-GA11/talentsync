'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Upload, FileText, Award, TrendingUp, AlertCircle,
    CheckCircle, XCircle, Download, FileCheck, Sparkles,
    Loader
} from 'lucide-react';
import { analyzeResume } from '@/lib/resumeParser';

interface ResumeAnalysis {
    score: number;
    completeness: number;
    atsCompliance: number;
    keywords: number;
    grammar: number;
    strengths: string[];
    improvements: string[];
    presentKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
}

export default function CareerAssistantPage() {
    const [file, setFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showBuilder, setShowBuilder] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (!uploadedFile) return;

        // Validate file type
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!validTypes.includes(uploadedFile.type) && !uploadedFile.name.match(/\.(pdf|doc|docx|txt)$/i)) {
            setError('Please upload a PDF, DOC, DOCX, or TXT file');
            return;
        }

        // Validate file size (5MB limit)
        if (uploadedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setFile(uploadedFile);
        setAnalyzing(true);
        setError(null);

        try {
            // Analyze the resume using real parser
            const result = await analyzeResume(uploadedFile);
            setAnalysis(result);
        } catch (err) {
            console.error('Analysis error:', err);
            setError('Failed to analyze resume. Please try again with a text-based file.');
        } finally {
            setAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80) return 'from-green-500 to-emerald-600';
        if (score >= 60) return 'from-yellow-500 to-orange-600';
        return 'from-red-500 to-pink-600';
    };

    if (showBuilder) {
        return <ResumeBuilder onClose={() => setShowBuilder(false)} />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Career Assistant</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Upload your resume for real AI-powered analysis and ATS scoring
                </p>
            </div>

            {/* Upload Section */}
            {!analysis && (
                <Card>
                    <div className="text-center py-12">
                        <Upload className="w-20 h-20 mx-auto mb-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Upload Your Resume
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                            Get instant AI-powered analysis with real scoring based on your resume content
                        </p>

                        {error && (
                            <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-700 dark:text-red-400 flex items-center gap-2 justify-center">
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="max-w-md mx-auto">
                            <label className="block">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt"
                                    onChange={handleFileUpload}
                                    disabled={analyzing}
                                    className="hidden"
                                />
                                <Button
                                    variant="primary"
                                    size="lg"
                                    disabled={analyzing}
                                    icon={analyzing ? Loader : FileText}
                                    as="span"
                                    className={analyzing ? 'animate-pulse' : ''}
                                >
                                    {analyzing ? 'Analyzing Resume...' : 'Choose File to Analyze'}
                                </Button>
                            </label>
                            <p className="text-sm text-slate-500 mt-4">
                                Supported: PDF, DOC, DOCX, TXT (Max 5MB)
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                ✨ Now with REAL AI analysis of your content!
                            </p>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Don't have a resume yet?
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setShowBuilder(true)}
                                icon={FileCheck}
                            >
                                Build Resume from Scratch
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Analysis Results */}
            {analysis && (
                <>
                    {/* File Info */}
                    {file && (
                        <Card className="bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-600" />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        Analyzed: {file.name}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {(file.size / 1024).toFixed(1)} KB • {file.type || 'Document'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Overall Score Card */}
                    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border-2 border-blue-200 dark:border-blue-800">
                        <div className="text-center py-8">
                            <Award className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                            <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                                {analysis.score}/100
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
                                Overall ATS Score
                            </p>
                            <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                                <div
                                    className={`bg-gradient-to-r ${getScoreGradient(analysis.score)} h-4 rounded-full transition-all`}
                                    style={{ width: `${analysis.score}%` }}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Score Breakdown */}
                    <Card>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                            Detailed Analysis
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Completeness', score: analysis.completeness, icon: CheckCircle },
                                { label: 'ATS Compliance', score: analysis.atsCompliance, icon: FileCheck },
                                { label: 'Keywords', score: analysis.keywords, icon: Sparkles },
                                { label: 'Grammar', score: analysis.grammar, icon: FileText },
                            ].map((item) => (
                                <div key={item.label} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <item.icon className={`w-6 h-6 mb-2 ${getScoreColor(item.score)}`} />
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{item.label}</p>
                                    <p className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                                        {item.score}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Strengths & Improvements */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Strengths</h3>
                            </div>
                            <ul className="space-y-2">
                                {analysis.strengths.map((strength, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-green-600 mt-1">✓</span>
                                        <span className="text-slate-700 dark:text-slate-300">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card>
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Areas to Improve
                                </h3>
                            </div>
                            <ul className="space-y-2">
                                {analysis.improvements.map((improvement, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-orange-600 mt-1">→</span>
                                        <span className="text-slate-700 dark:text-slate-300">{improvement}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>

                    {/* Keywords Analysis */}
                    <Card>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                            Keywords Analysis
                        </h3>
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Found in Your Resume ({analysis.presentKeywords.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.presentKeywords.length > 0 ? (
                                        analysis.presentKeywords.map((keyword, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium"
                                            >
                                                {keyword}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-sm">No industry keywords detected</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    Consider Adding ({analysis.missingKeywords.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.missingKeywords.map((keyword, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Tips */}
                    <Card>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            💡 Quick Tips
                        </h3>
                        <ul className="space-y-2">
                            {analysis.suggestions.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700 dark:text-slate-300">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <Button
                            variant="primary"
                            icon={FileCheck}
                            onClick={() => setShowBuilder(true)}
                        >
                            Build Better Resume
                        </Button>
                        <Button
                            variant="outline"
                            icon={Upload}
                            onClick={() => {
                                setAnalysis(null);
                                setFile(null);
                                setError(null);
                            }}
                        >
                            Analyze Another Resume
                        </Button>
                        <Button variant="outline" icon={Download}>
                            Download Report (PDF)
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

// Resume Builder Component
function ResumeBuilder({ onClose }: { onClose: () => void }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Resume Builder</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Create a professional ATS-friendly resume in minutes
                    </p>
                </div>
                <Button variant="outline" onClick={onClose}>
                    Back to Analysis
                </Button>
            </div>

            <Card>
                <div className="text-center py-12">
                    <FileCheck className="w-20 h-20 mx-auto mb-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        Resume Builder Coming Soon!
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                        We're working on an amazing resume builder with:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                        {[
                            '10+ Professional Templates',
                            'AI-Powered Content Suggestions',
                            'Real-time ATS Score',
                            'Export to PDF/Word',
                            'LinkedIn Import',
                            'Auto-formatting',
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}
