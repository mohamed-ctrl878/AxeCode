import React from 'react';
import { RichTextBlocks } from '@presentation/shared/components/RichTextBlocks';

/**
 * CourseAbout: Renders course description using the shared RichTextBlocks renderer.
 * @param {object} props
 * @param {Array<object>} props.description - Strapi rich text blocks array
 */
export const CourseAbout = ({ description = [] }) => {
    return (
        <div className="flex flex-col gap-6 p-8 bg-surface/30 rounded-3xl border border-border-subtle">
            <h2 className="text-xl font-bold">About this course</h2>
            <RichTextBlocks blocks={description} />
        </div>
    );
};

