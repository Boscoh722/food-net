// src/pages/LogisticsMapView.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ArrowLeft, Loader } from 'lucide-react';

const LogisticsMapView = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <button 
                onClick={() => navigate('/dashboard/logistics')} 
                className="flex items-center text-green-600 hover:text-green-700 transition mb-6"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Map className="w-7 h-7 text-green-600" />
                Live Delivery Map
            </h1>

            <div className="bg-white p-10 rounded-xl shadow-2xl border border-gray-100 min-h-[500px] flex flex-col justify-center items-center text-center">
                <Map className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Map Integration Placeholder</h2>
                <p className="text-gray-500 max-w-md">
                    To enable this feature, integrate a map library (e.g., Leaflet or Google Maps) here. This view will show 
                    your current location and the real-time locations of all active deliveries.
                </p>
                <div className='mt-5 flex items-center gap-2 text-sm text-gray-600'>
                    <Loader className='w-4 h-4 animate-spin' />
                    <p>Fetching geo-coordinates from assigned orders...</p>
                </div>
            </div>
        </div>
    );
};

export default LogisticsMapView;
