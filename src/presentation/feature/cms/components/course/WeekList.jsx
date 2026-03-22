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

    if (weeks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-white/5 border-dashed rounded-2xl">
                <Calendar size={32} className="text-white/15 mb-3" />
                <p className="text-text-muted text-sm font-medium">No weeks scheduled yet.</p>
                <p className="text-text-muted/60 text-xs mt-1">Add your first week to start building the course curriculum.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {weeks.map((week, index) => {
                const weekId = week.documentId || week.id || index;
                const isExpanded = expandedWeekId === weekId;
                const lessons = week.lessons || [];

                return (
                    <div
                        key={weekId}
                        className={cn(
                            "rounded-xl border transition-all overflow-hidden",
                            isExpanded
                                ? "border-accent-primary/20 bg-surface-dark/60 shadow-lg shadow-accent-primary/5"
                                : "border-white/5 bg-surface-dark/40 hover:border-white/10"
                        )}
                    >
                        {/* Week Header (clickable to expand) */}
                        <div
                            className="group flex items-center justify-between px-5 py-4 cursor-pointer"
                            onClick={() => toggleExpand(weekId)}
                        >
                            <div className="flex items-center gap-4">
                                {/* Week Number Badge */}
                                <div className={cn(
                                    "w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                                    isExpanded
                                        ? "bg-accent-primary/20 text-accent-primary"
                                        : "bg-accent-primary/10 text-accent-primary"
                                )}>
                                    {index + 1}
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-tight">
                                        {week.title || `Week ${index + 1}`}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                                            <BookOpen size={10} />
                                            {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Action Buttons */}
                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEdit(week); }}
                                        className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary/30 transition-all"
                                        title="Edit week"
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(week); }}
                                        className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-text-muted hover:text-red-400 hover:border-red-400/30 transition-all"
                                        title="Delete week"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>

                                {/* Expand Chevron */}
                                <ChevronDown
                                    size={16}
                                    className={cn(
                                        "text-text-muted transition-transform duration-200",
                                        isExpanded ? "rotate-180 text-accent-primary" : ""
                                    )}
                                />
                            </div>
                        </div>

                        {/* Lessons Panel (Collapsible) */}
                        {isExpanded && (
                            <div className="border-t border-white/5 px-5 py-3 space-y-1 animation-fade-in">
                                {lessons.length === 0 ? (
                                    <p className="text-xs text-text-muted/60 text-center py-4 font-mono">
                                        No lessons in this week yet.
                                    </p>
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
                                    className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-white/10 text-text-muted text-xs font-medium hover:border-accent-primary/30 hover:text-accent-primary hover:bg-accent-primary/5 transition-all"
                                >
                                    <Plus size={14} />
                                    Add Lesson
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
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors group/lesson">
            <div className="flex items-center gap-3">
                {/* Lesson Order */}
                <span className="text-[10px] text-text-muted/50 font-mono w-5 text-right shrink-0">
                    {index + 1}.
                </span>

                {/* Type Icon */}
                <div className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                    lesson.type === 'video'
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-amber-500/10 text-amber-400"
                )}>
                    <TypeIcon size={13} />
                </div>

                {/* Info */}
                <div>
                    <p className="text-xs font-medium text-white/90 tracking-tight">
                        {lesson.title || `Lesson ${index + 1}`}
                    </p>
                </div>
            </div>

            {/* Right Side Badges */}
            <div className="flex items-center gap-2">
                {/* Type Badge */}
                <span className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider",
                    lesson.type === 'video'
                        ? "bg-blue-500/10 text-blue-400/80"
                        : "bg-amber-500/10 text-amber-400/80"
                )}>
                    {lesson.type || 'video'}
                </span>

                {/* Access Badge */}
                <AccessIcon
                    size={11}
                    className={cn(
                        lesson.isPublic ? "text-green-400/60" : "text-text-muted/40"
                    )}
                    title={lesson.isPublic ? 'Public' : 'Private'}
                />

                {/* Actions (Hidden until hover) */}
                <div className="flex items-center gap-1.5 ml-2 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                    <Link
                        to={`${PATHS.CONTENT_MANAGEMENT}/courses/${courseId}/weeks/${weekId}/lessons/${lessonId}/edit`}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Edit2 size={12} />
                    </Link>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(lesson); }}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};
