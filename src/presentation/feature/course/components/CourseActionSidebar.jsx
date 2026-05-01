import React, { useCallback, useState } from 'react';
import { PlayCircle, ArrowRight, ShoppingCart, BookOpen, Clock, Users, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCreateUserEntitlement } from '@domain/useCase/useCreateUserEntitlement';
import { useNavigate } from 'react-router-dom';
import { useInitiatePayment } from '@domain/useCase/useInitiatePayment';
import { PaymobModal } from '@presentation/shared/components/modals/PaymobModal';

/**
 * CourseActionSidebar: Sticky sidebar for pricing and CTAs.
 */
export const CourseActionSidebar = ({ course, onRefresh }) => {
    const navigate = useNavigate();
    const { createUserEntitlement, inProgress: entitlementLoading, error: entitlementError } = useCreateUserEntitlement();
    const { initiatePayment, inProgress: paymentLoading } = useInitiatePayment();
    
    const [isIframeOpen, setIsIframeOpen] = useState(false);
    const [iframeUrl, setIframeUrl] = useState('');

    const totalLessons = course.lessonCount || 0;
    const inProgress = entitlementLoading || paymentLoading;

    const handleAction = useCallback(async () => {
        if (course.hasAccess) {
            // Find the first available lesson across all weeks
            const firstLesson = course.weeks
                ?.flatMap(w => w.lessons || [])
                .find(l => l && (l.uid || l.id));

            if (firstLesson) {
                const lessonId = firstLesson.uid || firstLesson.id;
                navigate(`/courses/${course.uid}/learn/lesson/${lessonId}`);
            } else {
                console.warn("No lessons found for this course.");
            }
            return;
        }

        const isFree = !course.price || Number(course.price) === 0;

        if (isFree) {
            try {
                await createUserEntitlement({
                    productId: course.entitlementsId,
                    content_types: 'course'
                });
                if (onRefresh) onRefresh();
            } catch (err) {
                console.error('Enrollment failed:', err);
            }
        } else {
            // Initiate real payment
            try {
                const data = await initiatePayment(course.uid, 'course');
                if (data && data.iframe_url) {
                    setIframeUrl(data.iframe_url);
                    setIsIframeOpen(true);
                }
            } catch (err) {
                toast.error(err.message || 'Payment initiation failed');
            }
        }
    }, [course, createUserEntitlement, initiatePayment, navigate, onRefresh]);

    const isFree = !course.price || Number(course.price) === 0;

    const formatDuration = (minutes) => {
        if (!minutes) return 'Self-paced';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h ? `${h}h ` : ''}${m ? `${m}m` : ''}`.trim();
    };

    return (
        <div className="lg:sticky lg:top-28 h-fit">
            <div className="p-8 bg-card border border-border-subtle rounded-3xl flex flex-col gap-6 shadow-whisper">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">Course Investment</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-serif">{!isFree ? `$${course.price}` : 'FREE'}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button 
                        onClick={handleAction}
                        disabled={inProgress}
                        className="w-full h-14 rounded-2xl btn-primary disabled:opacity-50"
                    >
                        {inProgress ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : course.hasAccess ? (
                            <>
                                <PlayCircle size={20} />
                                <span>Continue Learning</span>
                            </>
                        ) : (
                            <>
                                {isFree ? <ArrowRight size={20} /> : <ShoppingCart size={20} />}
                                <span>{isFree ? 'Join For Free' : 'Secure Admission'}</span>
                            </>
                        )}
                    </button>
                    
                    {entitlementError && <p className="text-[10px] text-center text-status-error font-bold">{entitlementError}</p>}
                    <p className="text-[10px] text-center text-text-muted font-mono uppercase tracking-widest leading-relaxed">
                        Join {course.studentCount || 0}+ students starting their journey
                    </p>
                </div>

                <div className="pt-6 border-t border-border-subtle flex flex-col gap-4">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span className="flex items-center gap-2"><BookOpen size={14} /> Total Lessons</span>
                        <span className="font-mono text-text-primary">{totalLessons}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span className="flex items-center gap-2"><Clock size={14} /> Duration</span>
                        <span className="font-mono text-text-primary">{formatDuration(course.duration)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span className="flex items-center gap-2"><Users size={14} /> Access</span>
                        <span className="font-mono text-text-primary">Full Lifetime</span>
                    </div>
                </div>
            </div>

            <PaymobModal 
                isOpen={isIframeOpen} 
                onClose={() => setIsIframeOpen(false)} 
                iframeUrl={iframeUrl} 
                onSuccess={onRefresh}
            />
        </div>
    );
};

