'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Briefcase, Users, Workflow, FileText,
    BarChart3, Settings, LogOut, Menu, X, Moon, Sun
} from 'lucide-react';

const corporateNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/corporate/dashboard' },
    { icon: Briefcase, label: 'Job Postings', href: '/corporate/jobs' },
    { icon: Users, label: 'Candidates', href: '/corporate/candidates' },
    { icon: Workflow, label: 'Workflow', href: '/corporate/workflow' },
    { icon: FileText, label: 'Offers', href: '/corporate/offers' },
    { icon: BarChart3, label: 'Analytics', href: '/corporate/analytics' },
];

export function CorporateLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const pathname = usePathname();

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden lg:block overflow-y-auto">
                <div className="p-6">
                    <Link href="/">
                        <h1 className="text-xl font-bold gradient-text">TalentSync AI</h1>
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Corporate Portal</p>
                </div>

                <nav className="px-4 space-y-1">
                    {corporateNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }
                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </Link>
                </div>
            </aside>

            <div className="lg:ml-64">
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex-1" />

                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                    T
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium">TechCorp Solutions</p>
                                    <p className="text-xs text-slate-500">HR Manager</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
