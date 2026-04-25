import React from 'react';

const DefaultDashboardViewer = () => {
    // Current "Activity Trend" bar chart logic
    const heights = [40, 60, 30, 80, 50, 70, 90, 45, 65, 85, 55, 75, 40, 60, 100];

    return (
        <div className="animation-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-serif font-bold text-near-black uppercase tracking-widest">Platform Activity Trend</h2>
                <span className="text-[10px] text-text-muted uppercase tracking-widest border border-border-subtle px-2 py-1 rounded-full bg-surface-sunken">System Aggregate</span>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-[2px] sm:gap-2 px-1 mt-4 border-b border-border-subtle pb-2">
                {heights.map((height, i) => (
                    <div key={i} className="w-full bg-border-subtle/40 rounded-t-sm relative group hover:bg-near-black transition-colors duration-300" style={{ height: `${height}%` }}>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-near-black text-ivory text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-mono tracking-tighter">
                            {height} Load
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-text-muted mt-4 italic">Note: This represents cumulative system interactions across all published modules in the current session.</p>
        </div>
    );
};

export default DefaultDashboardViewer;
