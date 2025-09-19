'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Home, AlertCircle, MessageCircle, WifiOff } from 'lucide-react';

interface ErrorBoundaryProps {
    error?: Error;
    reset?: () => void;
    errorType?: 'network' | 'location' | 'general' | 'api';
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
    error,
    reset,
    errorType = 'general'
}) => {
    const [isRetrying, setIsRetrying] = useState(false);
    const router = useRouter();

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            if (reset) {
                reset();
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.error('Retry failed:', err);
        } finally {
            setTimeout(() => setIsRetrying(false), 1000);
        }
    };

    const handleGoHome = () => {
        router.push('/');
    };

    const getErrorContent = () => {
        switch (errorType) {
            case 'network':
                return {
                    title: 'Connection Lost',
                    description: 'Unable to connect to our servers. Please check your internet connection.',
                    icon: <WifiOff className="w-12 h-12" />
                };
            case 'location':
                return {
                    title: 'Location Error',
                    description: 'Unable to access location services. Please enable GPS and try again.',
                    icon: <AlertCircle className="w-12 h-12" />
                };
            case 'api':
                return {
                    title: 'Service Unavailable',
                    description: 'Our tracking service is temporarily down. Please try again in a few minutes.',
                    icon: <AlertCircle className="w-12 h-12" />
                };
            default:
                return {
                    title: 'Something went wrong',
                    description: error?.message || 'An unexpected error occurred while loading the page.',
                    icon: <AlertCircle className="w-12 h-12" />
                };
        }
    };

    const errorContent = getErrorContent();

    return (
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {/* Main Error Card */}
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Error Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-[#a94c4c]/10 rounded-full">
                        <div className="text-[#a94c4c]">
                            {errorContent.icon}
                        </div>
                    </div>
                </div>

                {/* Error Content */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        {errorContent.title}
                    </h1>
                    <p className="text-gray-600 leading-relaxed text-[12px]">
                        {errorContent.description}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={handleRetry}
                        disabled={isRetrying}
                        className={`w-full flex items-center justify-center space-x-2 py-3 px-4 
                            rounded-lg font-medium transition-all ${isRetrying
                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                : 'bg-[#a94c4c] hover:bg-red-700 text-white hover:shadow-md'
                            }`}
                    >
                        <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                        <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleGoHome}
                            className="flex items-center justify-center space-x-2 py-3 px-4 
                            rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 
                            font-medium transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </button>
                        <button
                            onClick={handleGoHome}
                            className="flex items-center justify-center space-x-2 py-3 px-4 
                            rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 
                            font-medium transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Support</span>
                        </button>
                    </div>
                </div>

                {/* Error ID */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                        Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundary;

