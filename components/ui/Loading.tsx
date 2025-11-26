export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeStyles = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`${sizeStyles[size]} animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-purple-600`} />
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
            </div>
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="animate-shimmer h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4" />
            <div className="animate-shimmer h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4" />
            <div className="space-y-2">
                <div className="animate-shimmer h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                <div className="animate-shimmer h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            </div>
        </div>
    );
}
