import React from 'react';

const StatCard = ({ icon, label, value, color }) => (
    <div className="flex items-center gap-4 bg-[#F7F8F0]/95 p-6 rounded-2xl border border-[#7AAACE]/45 shadow-sm hover:shadow-md transition-shadow">
        <div className={`p-4 rounded-lg ${color} bg-opacity-10 text-2xl`}>
            {icon}
        </div>
        <div>
            <p className="text-4xl font-extrabold text-[#355872]">{value}</p>
            <p className="text-[#355872]/75 text-sm font-semibold">{label}</p>
        </div>
    </div>
);

export default StatCard;