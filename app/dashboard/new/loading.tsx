export default function NewDecisionLoading() {
    return (
        <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30 text-slate-200">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-full h-[500px] bg-violet-900/10 blur-[100px] pointer-events-none" />

            <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-md" />
                        <div className="h-5 w-28 bg-slate-800 rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-28 bg-slate-800 rounded animate-pulse" />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8">
                    {/* Mode Toggle Skeleton */}
                    <div className="mb-8 flex gap-2 border-b border-white/5 pb-4">
                        <div className="h-12 w-48 bg-indigo-600/50 rounded-lg animate-pulse" />
                        <div className="h-12 w-32 bg-slate-800 rounded-lg animate-pulse" />
                    </div>

                    {/* Input Skeleton */}
                    <div className="space-y-4">
                        <div className="h-6 w-64 bg-slate-700 rounded animate-pulse mb-4" />
                        <div className="h-40 bg-slate-800 rounded-xl animate-pulse" />
                        <div className="h-12 w-40 bg-indigo-600/50 rounded-lg animate-pulse" />
                    </div>
                </div>
            </main>
        </div>
    );
}
