'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    y?: number;
    className?: string;
}

export function Floating({
    children,
    delay = 0,
    duration = 4,
    y = 15,
    className
}: FloatingProps) {
    return (
        <motion.div
            animate={{
                y: [-y, y, -y],
                rotate: [-1, 1, -1]
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
