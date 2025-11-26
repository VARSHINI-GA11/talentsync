import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'gradient';
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
    children,
    className = '',
    variant = 'default',
    hover = false,
    padding = 'md'
}: CardProps) {
    const baseStyles = 'rounded-xl transition-all duration-300';

    const variantStyles = {
        default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm',
        glass: 'glass-card shadow-lg',
        gradient: 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700',
    };

    const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';

    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${paddingStyles[padding]} ${className}`}>
            {children}
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    gradient?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export function StatCard({ title, value, subtitle, icon: Icon, gradient = 'from-blue-500 to-purple-600', trend }: StatCardProps) {
    return (
        <Card hover className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />

            <div className="relative">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
                        <h3 className="text-3xl font-bold mt-1">{value}</h3>
                        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{subtitle}</p>}
                    </div>

                    {Icon && (
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient}`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                    )}
                </div>

                {trend && (
                    <div className="flex items-center gap-1">
                        <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </span>
                        <span className="text-xs text-slate-500">vs last month</span>
                    </div>
                )}
            </div>
        </Card>
    );
}
