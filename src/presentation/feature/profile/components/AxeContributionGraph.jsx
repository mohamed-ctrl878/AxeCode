import React, { useMemo } from 'react';
import './AxeContributionGraph.css';

export const AxeContributionGraph = ({ username }) => {
    // Generate mock data for the last 52 weeks
    const weeks = useMemo(() => {
        const result = [];
        for (let w = 0; w < 52; w++) {
            const days = [];
            for (let d = 0; d < 7; d++) {
                // Random intensity 0-4
                const intensity = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
                days.push(intensity);
            }
            result.push(days);
        }
        return result;
    }, []);

    const months = [
        { name: 'Jan', week: 0 },
        { name: 'Feb', week: 4 },
        { name: 'Mar', week: 9 },
        { name: 'Apr', week: 13 },
        { name: 'May', week: 17 },
        { name: 'Jun', week: 22 },
        { name: 'Jul', week: 26 },
        { name: 'Aug', week: 31 },
        { name: 'Sep', week: 35 },
        { name: 'Oct', week: 39 },
        { name: 'Nov', week: 44 },
        { name: 'Dec', week: 48 },
    ];

    return (
        <div className="contribution-container">
            <div className="graph-wrapper">
                <div className="month-labels">
                    {months.map((m, i) => (
                        <span key={i} style={{ left: `${m.week * 16 + 35}px` }}>
                            {m.name}
                        </span>
                    ))}
                </div>
                
                <div className="graph-grid">
                    <div className="day-labels">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                    </div>
                    
                    <div className="weeks-container">
                        {weeks.map((days, wIndex) => (
                            <div key={wIndex} className="week-column">
                                {days.map((intensity, dIndex) => (
                                    <div 
                                        key={dIndex} 
                                        className={`day-square intensity-${intensity}`}
                                        title={`Intensity: ${intensity}`}
                                    ></div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="graph-legend">
                <span>Less</span>
                <div className="day-square intensity-0"></div>
                <div className="day-square intensity-1"></div>
                <div className="day-square intensity-2"></div>
                <div className="day-square intensity-3"></div>
                <div className="day-square intensity-4"></div>
                <span>More</span>
            </div>
        </div>
    );
};
