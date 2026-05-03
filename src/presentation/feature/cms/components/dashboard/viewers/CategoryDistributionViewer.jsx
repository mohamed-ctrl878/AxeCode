import React from 'react';
import { Layers, PieChart, Activity } from 'lucide-react';

const CategoryDistributionViewer = ({ data = {} }) => {
    const total = (data.courses?.total || 0) + (data.events?.total || 0) + (data.reports?.total || 0);
    
    const items = [
        { label: 'Academic Courses', count: data.courses?.total || 0, color: 'bg-accent-primary', pct: total ? (data.courses?.total / total) * 100 : 0 },
        { label: 'Community Events', count: data.events?.total || 0, color: 'bg-accent-violet', pct: total ? (data.events?.total / total) * 100 : 0 },
        { label: 'Security Reports', count: data.reports?.total || 0, color: 'bg-accent-rose', pct: total ? (data.reports?.total / total) * 100 : 0 },
    ];

    return (
        <div className="animation-fade-in h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-sm font-serif font-bold text-near-black uppercase tracking-widest flex items-center gap-2">
                        <Layers size={16} className="text-near-black" />
                        Infrastructure Composition
                    </h2>
                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-tighter">Distribution of core system assets</p>
                </div>
                <PieChart size={24} className="opacity-10" />
            </div>

            <div className="space-y-8 flex-grow flex flex-col justify-center">
                {items.map((item) => (
                    <div key={item.label} className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{item.label}</span>
                            <span className="text-xl font-serif font-bold text-near-black">{item.count}</span>
                        </div>
                        <div className="h-3 w-full bg-surface-sunken rounded-full overflow-hidden border border-border-subtle shadow-inner">
                            <div 
                                className={`h-full ${item.color} transition-all duration-1000 ease-out`} 
                                style={{ width: `${item.pct}%` }} 
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 bg-surface-sunken/40 rounded-3xl border border-border-subtle border-dashed">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-ivory rounded-2xl shadow-sm">
                        <Activity size={20} className="text-accent-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-near-black uppercase tracking-widest">System Health Score</p>
                        <p className="text-[9px] text-text-muted font-medium mt-0.5">Stability verified across all curriculum nodes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryDistributionViewer;
