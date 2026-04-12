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

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="contribution-container">
            <div className="graph-wrapper">
                <div className="month-labels">
                    {monthLabels.map((m, i) => <span key={i}>{m}</span>)}
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
