import React from 'react';

/**
 * CourseAbout: Renders course description blocks.
 */
export const CourseAbout = ({ description = [] }) => {
    return (
        <div className="flex flex-col gap-6 p-8 bg-surface/30 rounded-3xl border border-border-subtle">
            <h2 className="text-xl font-bold">About this course</h2>
            <div className="text-text-muted leading-relaxed flex flex-col gap-4">
                {description.map((block, i) => (
                    <div key={i}>
                        {block.type === 'heading' ? (
                            <h3 className="text-lg font-bold text-text-primary mt-4">{block.children?.[0]?.text}</h3>
                        ) : (
                            <p>{block.children?.[0]?.text}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
