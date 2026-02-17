import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Play, BookOpen, Lock } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * CourseCurriculum: Interactive accordion for course lessons.
 */
export const CourseCurriculum = ({ weeks = [], hasAccess = false }) => {
    const [expandedWeeks, setExpandedWeeks] = useState([0]);

    const toggleWeek = (index) => {
        setExpandedWeeks(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold px-4">Curriculum</h2>
            <div className="flex flex-col gap-3">
                {weeks.map((week, wIndex) => (
                    <div key={week.id} className="bg-surface/50 rounded-2xl border border-border-subtle overflow-hidden transition-all duration-300">
                        <button 
                            onClick={() => toggleWeek(wIndex)}
                            className="w-full flex items-center justify-between p-5 hover:bg-surface transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono text-accent-primary">0{wIndex + 1}</span>
                                <span className="font-bold text-sm tracking-wide">{week.title}</span>
                            </div>
                            {expandedWeeks.includes(wIndex) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        
                        {expandedWeeks.includes(wIndex) && (
                            <div className="p-2 flex flex-col gap-1 bg-background/30">
                                {week.lessons?.map(lesson => (
                                    <div key={lesson.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface/50 group transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-background border border-border-subtle flex items-center justify-center text-text-muted group-hover:text-accent-primary transition-colors">
                                                {lesson.type === 'video' ? <Play size={14} /> : <BookOpen size={14} />}
                                            </div>
                                            <span className="text-xs font-medium text-text-muted group-hover:text-text-primary transition-colors">
                                                {lesson.title}
                                            </span>
                                        </div>
                                        {!lesson.isPublic && !hasAccess && (
                                            <div className="p-1 px-2 rounded-md bg-background/50 border border-border-subtle">
                                                 <Lock size={10} className="text-text-muted" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
