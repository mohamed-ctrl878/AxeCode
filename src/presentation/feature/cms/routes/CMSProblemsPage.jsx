import React from 'react';
import { Code2 } from 'lucide-react';
import { useFetchAdminProblems } from '@domain/useCase/useFetchAdminProblems';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSProblemsPage - Isolated CMS module for managing Problems.
 * Follows SRP: Only fetches and displays problem data.
 */
const CMSProblemsPage = () => {
    const { problems, isLoading, fetch: fetchProblems } = useFetchAdminProblems();

    return (
        <CMSResourceTable
            sectionName="Problems"
            items={problems || []}
            isLoading={isLoading}
            icon={Code2}
            onRefresh={fetchProblems}
        />
    );
};

export default CMSProblemsPage;
