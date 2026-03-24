// src\components\ui\LoadingSpinner.tsx
import React from "react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl";
    color?: "primary" | "white" | "gray" | "current";
    className?: string;
}

export function LoadingSpinner({
    size = "md",
    color = "primary",
    className = ""
}: LoadingSpinnerProps) {

    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
    };

    const colorClasses = {
        primary: "text-[#1a6b36] dark:text-[#28a152]",
        white: "text-white",
        gray: "text-gray-400 dark:text-zinc-500",
        current: "text-current",
    };

    return (
        <svg
            className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

export function LoadingScreen({ text = "Loading..." }: { text?: string }) {
    return (
        <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-3">
            <LoadingSpinner size="lg" color="primary" />
            {text && (
                <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}