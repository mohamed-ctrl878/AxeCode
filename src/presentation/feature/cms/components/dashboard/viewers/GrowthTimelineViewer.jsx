import React from 'react';
import { TrendingUp, Users } from 'lucide-react';

const COLOR_MAPS = {
    "accent-primary": { bar: "bg-accent-primary/40", hover: "hover:bg-accent-primary", text: "text-accent-primary", border: "border-accent-primary/20", bg: "bg-accent-primary/5" },
    "accent-blue": { bar: "bg-accent-blue/40", hover: "hover:bg-accent-blue", text: "text-accent-blue", border: "border-accent-blue/20", bg: "bg-accent-blue/5" },
    "accent-violet": { bar: "bg-accent-violet/40", hover: "hover:bg-accent-violet", text: "text-accent-violet", border: "border-accent-violet/20", bg: "bg-accent-violet/5" },
    "accent-rose": { bar: "bg-accent-rose/40", hover: "hover:bg-accent-rose", text: "text-accent-rose", border: "border-accent-rose/20", bg: "bg-accent-rose/5" },
};

const UnifiedTimelineViewer = ({ data = {}, title, subtitle, colorClass = "accent-blue" }) => {
    const timeline = data.timeline || [];
    const maxVal = Math.max(...timeline.map(d => d.count), 1);
    const colors = COLOR_MAPS[colorClass] || COLOR_MAPS["accent-blue"];

    return (
        <div className="animation-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-sm font-serif font-bold text-near-black uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={16} className={colors.text} />
                        {title}
                    </h2>
                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-tighter">{subtitle}</p>
                </div>
                <div className={`flex items-center gap-2 text-[10px] ${colors.bg} px-2 py-1 rounded-full border ${colors.border}`}>
                    <span className={`${colors.text} font-bold font-mono uppercase`}>Dynamic_Pulse</span>
                </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-1 px-1 mt-8 border-b border-border-subtle pb-4 relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5 py-4">
                   {[0, 1, 2, 4].map(i => <div key={i} className="border-t border-near-black w-full" />)}
                </div>

                {timeline.length > 0 ? timeline.map((item, i) => {
                    const height = (item.count / maxVal) * 100;
                    return (
                        <div 
                            key={item.time} 
                            className={`flex-1 ${colors.bar} rounded-t-[1px] relative group ${colors.hover} transition-all duration-200`} 
                            style={{ height: `${Math.max(height, 2)}%`, minWidth: '2px' }}
                        >
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-near-black text-ivory text-[9px] py-1.5 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20 pointer-events-none border border-border-subtle whitespace-nowrap">
                                <p className="font-bold">{item.count} Actions Logged</p>
                                <p className="opacity-60 text-[8px] font-mono">{item.time}</p>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-xs italic opacity-50">
                        Historical Ledger Empty
                    </div>
                )}
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="p-5 bg-surface-sunken rounded-2xl border border-border-subtle shadow-inner">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-[0.2em] block mb-2">Peak Activity</span>
                    <span className="text-3xl font-serif font-bold text-near-black">{maxVal === 1 && timeline.every(t => t.count === 0) ? 0 : maxVal}</span>
                </div>
                <div className="p-5 bg-surface-sunken rounded-2xl border border-border-subtle shadow-inner">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-[0.2em] block mb-2">Cumulative total</span>
                    <span className="text-3xl font-serif font-bold text-near-black">{data.total || 0}</span>
                </div>
            </div>
        </div>
    );
};

export default UnifiedTimelineViewer;
