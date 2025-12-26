import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-slate-800/50',
                className
            )}
        />
    );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        'h-4',
                        i === lines - 1 ? 'w-3/4' : 'w-full'
                    )}
                />
            ))}
        </div>
    );
}

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn(
            'bg-slate-900/50 border border-white/5 rounded-xl p-5',
            className
        )}>
            <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
            </div>
            <SkeletonText lines={2} className="mb-4" />
            <div className="flex gap-2 pt-4 border-t border-white/5">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
            </div>
        </div>
    );
}
