import React from 'react';
import { InlineComments } from '@presentation/shared/components/interactions/InlineComments';

/**
 * ProblemComments - Tab 2 content: reuses InlineComments.
 * Pure wrapper — delegates rendering to the shared component.
 *
 * @param {{ problemId: string }} props
 */
export const ProblemComments = ({ problemId }) => {
    if (!problemId) return null;

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-4">
            <InlineComments docId={problemId} contentType="problem" />
        </div>
    );
};
