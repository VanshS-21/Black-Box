'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center py-16 ${className}`}
        >
            {icon && (
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                    className="mb-6"
                >
                    {icon}
                </motion.div>
            )}
            <h3 className="text-xl font-bold text-white mb-2 font-outfit">
                {title}
            </h3>
            {description && (
                <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                    {description}
                </p>
            )}
            {action && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {action}
                </motion.div>
            )}
        </motion.div>
    );
}
