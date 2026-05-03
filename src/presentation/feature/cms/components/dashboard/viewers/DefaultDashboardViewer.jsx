import React, { useMemo } from 'react';

const DefaultDashboardViewer = ({ data }) => {
    // Aggregate Activity Trend by summing up counts across all entities
    const aggregateTimeline = useMemo(() => {
        if (!data) return [];
        
        const entities = ['courses', 'events', 'users', 'reports'];
        const masterTimelineMap = {};

        entities.forEach(entity => {
            if (data[entity]?.timeline) {
                data[entity].timeline.forEach(point => {
                    if (!masterTimelineMap[point.time]) {
                        masterTimelineMap[point.time] = 0;
                    }
                    masterTimelineMap[point.time] += point.count;
                });
            }
        });

        return Object.entries(masterTimelineMap)
            .map(([time, count]) => ({ time, count }))
            .sort((a, b) => new Date(a.time) - new Date(b.time));
    }, [data]);

    const maxVal = Math.max(...aggregateTimeline.map(d => d.count), 1);

    return (
        <div className="animation-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-sm font-serif font-bold text-near-black uppercase tracking-widest">Platform Activity Trend</h2>
                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-tighter">Aggregate system interactions across all registries</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] bg-near-black/5 px-2 py-1 rounded-full border border-near-black/10">
                    <span className="text-near-black font-bold font-mono uppercase tracking-tighter">LIVE_AUDIT</span>
                </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-[2px] mt-8 border-b border-border-subtle pb-4 relative">
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5 py-4">
                   {[0, 1, 2, 4].map(i => <div key={i} className="border-t border-near-black w-full" />)}
                </div>

                {aggregateTimeline.length > 0 ? aggregateTimeline.map((item, i) => {
                    const height = (item.count / maxVal) * 100;
                    return (
                        <div 
                            key={item.time} 
                            className="flex-1 bg-near-black/20 rounded-t-[1px] relative group hover:bg-near-black transition-all duration-300" 
                            style={{ height: `${Math.max(height, 2)}%`, minWidth: '4px' }}
                        >
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-near-black text-ivory text-[9px] py-1.5 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20 pointer-events-none whitespace-nowrap border border-ivory/20">
                                <p className="font-bold">{item.count} Interactions</p>
                                <p className="opacity-60 text-[8px] font-mono">{item.time}</p>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-border-subtle animate-spin-slow" />
                        <p className="text-xs italic opacity-50">Sifting through the Archives...</p>
                    </div>
                )}
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-sunken/50 rounded-2xl border border-border-subtle">
                    <span className="text-[9px] text-text-muted uppercase font-bold tracking-widest block mb-1">Peak Intensity</span>
                    <span className="text-2xl font-serif font-bold text-near-black">{maxVal === 1 ? 0 : maxVal}</span>
                </div>
                <div className="p-4 bg-surface-sunken/50 rounded-2xl border border-border-subtle">
                    <span className="text-[9px] text-text-muted uppercase font-bold tracking-widest block mb-1">Session Actions</span>
                    <span className="text-2xl font-serif font-bold text-near-black">{aggregateTimeline.reduce((acc, curr) => acc + curr.count, 0)}</span>
                </div>
            </div>
        </div>
    );
};

export default DefaultDashboardViewer;
