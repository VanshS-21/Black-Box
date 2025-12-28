import { SkeletonCard } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30 text-slate-200">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-full h-[500px] bg-violet-900/10 blur-[100px] pointer-events-none" />

            {/* Header Skeleton */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-md" />
                        <div className="h-5 w-32 bg-slate-800 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-4 w-24 bg-slate-800 rounded animate-pulse hidden sm:block" />
                        <div className="h-8 w-20 bg-slate-800 rounded animate-pulse" />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Title Skeleton */}
                <div className="mb-12">
                    <div className="h-8 w-48 bg-slate-800 rounded animate-pulse mb-2" />
                    <div className="h-4 w-64 bg-slate-800/50 rounded animate-pulse" />
                </div>

                {/* Search Bar Skeleton */}
                <div className="mb-8 flex gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex-1 flex gap-2 max-w-md">
                        <div className="h-10 flex-1 bg-slate-800 rounded-lg animate-pulse" />
                        <div className="h-10 w-20 bg-slate-800 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-10 w-32 bg-indigo-600/50 rounded-lg animate-pulse" />
                </div>

                {/* Analytics Skeleton */}
                <div className="mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="h-4 w-24 bg-slate-700 rounded mb-4 animate-pulse" />
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 bg-slate-800 rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Cards Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </main>
        </div>
    );
}
