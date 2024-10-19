import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <FaSpinner className="animate-spin text-blue-500 text-6xl" />
        </div>
    );
};

export default Loading;
