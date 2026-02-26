import React from 'react';

const StatCard = ({ icon, label, value, color }) => (
    <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className={`p-4 rounded-lg ${color} bg-opacity-10 text-2xl`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-zinc-700">{value}</p>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
        </div>
    </div>
);

export default StatCard;