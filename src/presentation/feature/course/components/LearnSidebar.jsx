import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, PlayCircle, BookOpen } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * LearnSidebar: Navigation component for course weeks and lessons.
 * 
 * @param {object} props
 * @param {CoursePreviewEntity} props.course - The full course structure.
 * @param {string} props.currentLessonId - The ID of the lesson currently being viewed.
 */
export const LearnSidebar = ({ course, currentLessonId }) => {
    const navigate = useNavigate();
    const [expandedWeeks, setExpandedWeeks] = useState(new Set([course.weeks[0]?.id]));

    const toggleWeek = (weekId) => {
        const newSet = new Set(expandedWeeks);
        if (newSet.has(weekId)) {
            newSet.delete(weekId);
        } else {
            newSet.add(weekId);
        }
        setExpandedWeeks(newSet);
    };

    const handleLessonSelect = (lessonId) => {
        navigate(`/courses/${course.uid}/learn/lesson/${lessonId}`);
    };

    return (
        <aside className="learn-sidebar">
            <div className="sidebar-header">
                <h2 className="text-sm font-black uppercase tracking-widest text-text-primary mb-1">Course Curriculum</h2>
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-surface-sunken rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-accent-primary transition-all duration-500" 
                            style={{ width: `${(course.completedLessonsCount / course.totalLessons) * 100}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-text-muted">
                        {course.completedLessonsCount || 0}/{course.totalLessons}
                    </span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto">
                {course.weeks.map((week, index) => (
                    <div key={week.id} className="week-group">
                        <button 
                            onClick={() => toggleWeek(week.id)}
                            className="week-header"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-surface-sunken flex items-center justify-center text-[10px] font-black text-text-muted">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="text-xs font-bold text-text-primary tracking-tight">{week.title}</span>
                            </div>
                            {expandedWeeks.has(week.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>

                        {expandedWeeks.has(week.id) && (
                            <div className="animation-fade-in">
                                {week.lessons.map((lesson) => {
                                    const lessonUrlId = lesson.uid || lesson.id;
                                    const isActive = String(lessonUrlId) === String(currentLessonId);
                                    const Icon = lesson.type === 'video' ? PlayCircle : BookOpen;
                                    
                                    return (
                                        <div 
                                            key={lesson.id}
                                            onClick={() => handleLessonSelect(lessonUrlId)}
                                            className={cn(
                                                "lesson-item",
                                                isActive && "active"
                                            )}
                                        >
                                            {lesson.isCompleted ? (
                                                <CheckCircle2 size={16} className="text-status-success" />
                                            ) : (
                                                <Icon size={16} className={isActive ? "text-accent-primary" : "text-text-muted/40"} />
                                            )}
                                            <span className="flex-1">{lesson.title}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};
