import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Edit2, Trash2, BookOpen, ChevronDown, Video, FileText, Lock, Globe, Plus } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { PATHS } from '@presentation/routes/paths';

/**
 * WeekList: Dumb presentation component for rendering weeks + nested lessons.
 * Follows SRP: Only renders data, delegates actions upward.
 *
 * @param {object} props
 * @param {string} props.courseId - The parent course documentId
 * @param {Array} props.weeks - Array of week objects from CoursePreviewEntity (with nested lessons)
 * @param {Function} props.onEdit - Callback when editing a week
 * @param {Function} props.onDelete - Callback when deleting a week
 * @param {Function} props.onDeleteLesson - Callback when deleting a lesson
 */
export const WeekList = ({ courseId, weeks = [], onEdit, onDelete, onDeleteLesson }) => {
    const [expandedWeekId, setExpandedWeekId] = useState(null);

    const toggleExpand = (weekId) => {
        setExpandedWeekId(prev => prev === weekId ? null : weekId);
    };

    if (weeks.length === 0) return null; // Handled in parent

    return (
        <div className="space-y-4">
            {weeks.map((week, index) => {
                const weekId = week.documentId || week.id || index;
                const isExpanded = expandedWeekId === weekId;
                const lessons = week.lessons || [];

                return (
                    <div
                        key={weekId}
                        className={cn(
                            "rounded-2xl border transition-all overflow-hidden",
                            isExpanded
                                ? "border-accent-primary/20 bg-surface shadow-xl shadow-accent-primary/5"
                                : "border-border-subtle bg-surface-light hover:border-border-default shadow-sm"
                        )}
                    >
                        {/* Week Header (clickable to expand) */}
                        <div
                            className="group flex items-center justify-between px-6 py-5 cursor-pointer select-none"
                            onClick={() => toggleExpand(weekId)}
                        >
                            <div className="flex items-center gap-4">
                                {/* Week Number Badge */}
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                                    isExpanded
                                        ? "bg-accent-primary text-on-accent shadow-lg shadow-accent-primary/20"
                                        : "bg-surface-sunken text-text-primary border border-border-subtle"
                                )}>
                                    {index + 1}
                                </div>

                                <div>
                                    <h3 className="text-sm font-black text-text-primary tracking-tight">
                                        {week.title || `Week ${index + 1}`}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] text-text-muted flex items-center gap-1 font-bold uppercase tracking-widest opacity-60">
                                            <BookOpen size={10} />
                                            {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEdit(week); }}
                                        className="w-8 h-8 rounded-lg border border-border-default flex items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary/30 hover:bg-accent-primary/5 transition-all shadow-sm bg-surface"
                                        title="Edit week"
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(week); }}
                                        className="w-8 h-8 rounded-lg border border-border-default flex items-center justify-center text-text-muted hover:text-status-error hover:border-status-error/30 hover:bg-status-error/5 transition-all shadow-sm bg-surface"
                                        title="Delete week"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>

                                {/* Expand Chevron */}
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                    isExpanded ? "bg-accent-primary/10 text-accent-primary rotate-180" : "text-text-muted"
                                )}>
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Lessons Panel (Collapsible) */}
                        {isExpanded && (
                            <div className="border-t border-border-subtle px-6 py-4 space-y-1.5 animation-fade-in bg-surface-sunken/30">
                                {lessons.length === 0 ? (
                                    <div className="flex flex-col items-center gap-2 py-8 opacity-40">
                                        <BookOpen size={24} className="text-text-muted" />
                                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest text-center">
                                            No lessons defined
                                        </p>
                                    </div>
                                ) : (
                                    lessons.map((lesson, lessonIdx) => (
                                        <LessonRow 
                                            key={lesson.uid || lesson.id || lessonIdx} 
                                            lesson={lesson} 
                                            index={lessonIdx} 
                                            courseId={courseId}
                                            weekId={weekId}
                                            onDelete={onDeleteLesson}
                                        />
                                    ))
                                )}

                                {/* Add Lesson Link */}
                                <Link
                                    to={`${PATHS.CONTENT_MANAGEMENT}/courses/${courseId}/weeks/${weekId}/add-lesson`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border-default text-text-muted text-xs font-bold uppercase tracking-widest hover:border-accent-primary hover:text-accent-primary hover:bg-accent-primary/5 transition-all group"
                                >
                                    <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                                    Add Lesson to Week
                                </Link>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

/**
 * LessonRow: Dumb sub-component for rendering a single lesson inside a week.
 * Follows ISP: Minimal props, no unnecessary dependencies.
 */
const LessonRow = ({ lesson, index, courseId, weekId, onDelete }) => {
    const lessonId = lesson.uid || lesson.id;
    const TypeIcon = lesson.type === 'video' ? Video : FileText;
    const AccessIcon = lesson.isPublic ? Globe : Lock;

    return (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-elevated transition-all group/lesson border border-transparent hover:border-border-subtle shadow-sm hover:shadow-md">
            <div className="flex items-center gap-4">
                {/* Lesson Order */}
                <span className="text-[10px] text-text-muted/40 font-black w-6 text-right shrink-0">
                    {String(index + 1).padStart(2, '0')}
                </span>

                {/* Type Icon */}
                <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                    lesson.type === 'video'
                        ? "bg-status-info/10 text-status-info"
                        : "bg-status-warning/10 text-status-warning"
                )}>
                    <TypeIcon size={14} />
                </div>

                {/* Info */}
                <div>
                    <p className="text-xs font-bold text-text-primary tracking-tight">
                        {lesson.title || `Untitled Lesson`}
                    </p>
                    <p className="text-[9px] text-text-muted/60 uppercase tracking-widest font-bold mt-0.5">
                        {lesson.type || 'Lesson'}
                    </p>
                </div>
            </div>

            {/* Right Side Badges */}
            <div className="flex items-center gap-3">
                {/* Access Badge */}
                <div className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                    lesson.isPublic 
                        ? "bg-status-success/10 text-status-success border-status-success/20" 
                        : "bg-text-muted/5 text-text-muted/40 border-border-subtle"
                )}>
                    <AccessIcon size={10} />
                    <span>{lesson.isPublic ? 'Public' : 'Private'}</span>
                </div>

                {/* Actions (Hidden until hover) */}
                <div className="flex items-center gap-1.5 ml-2 opacity-0 group-hover/lesson:opacity-100 transition-all">
                    <Link
                        to={`${PATHS.CONTENT_MANAGEMENT}/courses/${courseId}/weeks/${weekId}/lessons/${lessonId}/edit`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all border border-border-subtle bg-surface"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Edit2 size={13} />
                    </Link>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(lesson); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-status-error hover:bg-status-error/10 transition-all border border-border-subtle bg-surface"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
};
