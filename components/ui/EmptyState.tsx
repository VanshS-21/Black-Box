export function EmptyState({
    icon,
    title,
    description,
    action,
}: {
    icon: string;
    title: string;
    description: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="text-center py-16">
            <div className="text-6xl mb-4">{icon}</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">{title}</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
            {action}
        </div>
    );
}
