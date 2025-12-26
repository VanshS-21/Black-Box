'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedIconProps {
    icon: LucideIcon;
    className?: string;
    size?: number;
    animate?: boolean;
    label?: string;
}

export function AnimatedIcon({
    icon: Icon,
    className,
    size = 20,
    animate = true,
    label
}: AnimatedIconProps) {
    const iconElement = <Icon size={size} className={cn('flex-shrink-0', className)} aria-hidden="true" />;

    if (!animate) {
        return (
            <>
                {iconElement}
                {label && <span className="sr-only">{label}</span>}
            </>
        );
    }

    return (
        <>
            <motion.span
                className="inline-flex"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
                {iconElement}
            </motion.span>
            {label && <span className="sr-only">{label}</span>}
        </>
    );
}
