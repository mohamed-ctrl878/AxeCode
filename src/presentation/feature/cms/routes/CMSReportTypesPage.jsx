import React from 'react';
import { Flag } from 'lucide-react';
import { useFetchReportTypes } from '@domain/useCase/useFetchReportTypes';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSReportTypesPage - CMS module for managing Report Reasons.
 */
const CMSReportTypesPage = () => {
    const { reportTypes, isLoading, fetch: fetchReportTypes } = useFetchReportTypes();

    return (
        <CMSResourceTable
            sectionName="Report-Reasons"
            items={reportTypes || []}
            isLoading={isLoading}
            icon={Flag}
            onRefresh={fetchReportTypes}
        />
    );
};

export default CMSReportTypesPage;
