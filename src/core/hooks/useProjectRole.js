import { useMemo } from 'react';
import { useRole } from './useRole';

/**
 * Hook to evaluate the current user's granular permissions within a specific project.
 * @param {Object} project - The project object containing publisher and members arrays.
 */
export const useProjectRole = (project) => {
    const { user, isAuthenticated } = useRole();

    return useMemo(() => {
        if (!isAuthenticated || !user || !project) {
            return {
                isPublisher: false,
                isMember: false,
                permissions: {},
                canWriteTasks: false,
                canWriteSprints: false,
                canWriteCheckpoints: false,
                canManageMembers: false,
                isAdmin: false,
            };
        }

        // Check if user is publisher
        // In Strapi, relations might expose id or documentId or both.
        const isPublisher = project.publisher?.id === user.id || project.publisher?.documentId === user.documentId;

        // Check membership
        const memberRecord = project.members?.find(
            m => m.user?.id === user.id || m.user?.documentId === user.documentId
        );
        const isMember = !!memberRecord;

        // Extract granular permissions from the member's project_role
        const permissions = memberRecord?.projectRole?.permissions || {};

        // Admins and publishers have all rights implicitly
        const isAdmin = isPublisher || permissions.admin === true;

        return {
            isPublisher,
            isMember,
            permissions,
            canWriteTasks: isAdmin || permissions.write_tasks === true,
            canWriteSprints: isAdmin || permissions.write_sprints === true,
            canWriteCheckpoints: isAdmin || permissions.write_checkpoints === true,
            canManageMembers: isAdmin || permissions.manage_members === true,
            isAdmin,
        };
    }, [project, user, isAuthenticated]);
};
