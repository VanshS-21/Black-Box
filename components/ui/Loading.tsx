export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`animate-spin rounded-full border-b-2 border-indigo-500 ${sizes[size]}`}></div>
        </div>
    );
}

export function LoadingPage({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-slate-400">{message}</p>
            </div>
        </div>
    );
}
