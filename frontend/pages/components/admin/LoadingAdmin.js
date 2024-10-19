import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingAdmin = () => {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-800">
            <FaSpinner className="animate-spin text-blue-500 text-6xl" />
        </div>
    );
};

export default LoadingAdmin;
