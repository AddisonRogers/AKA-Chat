import React from 'react';

interface SettingsCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export function SettingsCard({ title, description, children }: SettingsCardProps) {
    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-950 shadow-sm">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{description}</p>}
            {children}
        </div>
    );
}