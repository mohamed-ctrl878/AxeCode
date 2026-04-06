import React, { useMemo, useState } from 'react';
import { 
  format, 
  subDays, 
  subMonths, 
  isAfter, 
  startOfDay, 
  eachDayOfInterval, 
  eachMonthOfInterval, 
  startOfMonth, 
  isSameMonth,
  isSameDay 
} from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * SubscriptionChart: A high-end custom SVG Area Chart for enrollment analytics.
 * Reusable across Courses and Events.
 */
export const SubscriptionChart = ({ data = [], filter = 'all', accentColor = 'var(--color-accent-blue)' }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // ─── Data Processing ──────────────────────────────────────────────────
  const chartData = useMemo(() => {
    const now = new Date();
    let startDate;
    let interval;
    let formatStr = 'MMM dd';

    switch (filter) {
      case '7d':
        startDate = subDays(now, 6);
        interval = eachDayOfInterval({ start: startDate, end: now });
        formatStr = 'EEE';
        break;
      case '1m':
        startDate = subMonths(now, 1);
        interval = eachDayOfInterval({ start: startDate, end: now });
        formatStr = 'MMM dd';
        break;
      case '3m':
        startDate = subMonths(now, 3);
        // For 3 months, group by weeks to keep it clean
        interval = eachDayOfInterval({ start: startDate, end: now }).filter((_, i) => i % 7 === 0);
        formatStr = 'MMM dd';
        break;
      case 'all':
      default:
        // Group by months for all time
        const sortedDates = data.map(d => d.startDate).filter(Boolean).sort((a, b) => a - b);
        startDate = sortedDates.length > 0 ? startOfMonth(sortedDates[0]) : subMonths(now, 6);
        interval = eachMonthOfInterval({ start: startDate, end: now });
        formatStr = 'MMM yy';
        break;
    }

    return interval.map(date => {
      const count = data.filter(entry => {
        if (!entry.startDate) return false;
        if (filter === 'all') return isSameMonth(entry.startDate, date);
        if (filter === '7d' || filter === '1m') return isSameDay(entry.startDate, date);
        // For 3m/weekly view, count items in that week interval
        const weekEnd = new Date(date);
        weekEnd.setDate(date.getDate() + 7);
        return isAfter(entry.startDate, date) && isAfter(weekEnd, entry.startDate);
      }).length;

      return {
        label: format(date, formatStr),
        fullDate: format(date, 'PPP'),
        value: count,
        date
      };
    });
  }, [data, filter]);

  const maxValue = Math.max(...chartData.map(d => d.value), 5); // Base of 5 for scale
  
  // ─── SVG Calculations ────────────────────────────────────────────────
  const width = 800;
  const height = 240;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = chartData.map((d, i) => {
    const x = padding + (i / (chartData.length - 1 || 1)) * chartWidth;
    const y = height - padding - (d.value / maxValue) * chartHeight;
    return { x, y, data: d, index: i };
  });

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return `${line} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  }, [points]);

  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [points, height, padding]);

  return (
    <div className="relative w-full bg-surface border border-border-subtle rounded-[2rem] p-8 backdrop-blur-md overflow-hidden group/chart animation-fade-in shadow-xl">
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-sunken text-text-muted/40 group-hover/chart:text-accent-blue transition-colors" style={{ color: hoveredPoint ? accentColor : undefined }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-text-primary uppercase tracking-widest">Growth Analytics</h4>
            <p className="text-[10px] text-text-muted opacity-60">Subscriber density over time</p>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-text-primary">{data.length}</span>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Subscribers</span>
        </div>
      </div>

      <div className="relative h-[240px] w-full">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line 
              key={p}
              x1={padding}
              y1={height - padding - p * chartHeight}
              x2={width - padding}
              y2={height - padding - p * chartHeight}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area */}
          <path 
            d={areaPath} 
            fill="url(#areaGradient)" 
            className="transition-all duration-700 ease-out"
          />

          {/* Line */}
          <path 
            d={linePath} 
            fill="none" 
            stroke={accentColor} 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter="url(#glow)"
            className="transition-all duration-700 ease-out opacity-80"
          />

          {/* Interaction Points */}
          {points.map((p) => (
            <g key={p.index} onMouseEnter={() => setHoveredPoint(p)}>
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="12" 
                fill="transparent" 
                className="cursor-pointer"
              />
              <circle 
                cx={p.x} 
                cy={p.y} 
                r={hoveredPoint?.index === p.index ? 6 : 4} 
                fill={accentColor}
                className={cn(
                    "transition-all duration-300 pointer-events-none shadow-2xl",
                    hoveredPoint?.index === p.index ? "opacity-100" : "opacity-0"
                )}
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {chartData.map((d, i) => {
             if (chartData.length > 15 && i % 2 !== 0) return null; // Simple declutter
             const x = padding + (i / (chartData.length - 1 || 1)) * chartWidth;
             return (
               <text 
                 key={i} 
                 x={x} 
                 y={height - 10} 
                 textAnchor="middle" 
                 className="text-[10px] fill-text-muted font-mono opacity-40 uppercase tracking-tighter"
               >
                 {d.label}
               </text>
             );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div 
            className="absolute z-50 pointer-events-none animation-scale-in"
            style={{ 
              left: `${(hoveredPoint.x / width) * 100}%`, 
              top: `${(hoveredPoint.y / height) * 100}%`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div className="bg-surface-elevated border border-border-default rounded-xl p-3 shadow-2xl min-w-[120px] backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase mb-1" style={{ color: accentColor }}>{hoveredPoint.data.label}</p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-text-primary">Enrollments</span>
                <span className="text-sm font-black text-text-primary">{hoveredPoint.data.value}</span>
              </div>
              <p className="text-[8px] text-text-muted mt-2 opacity-50 tabular-nums">{hoveredPoint.data.fullDate}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
