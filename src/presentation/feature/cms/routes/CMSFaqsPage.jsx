import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useFetchAdminFaqs } from '@domain/useCase/useFetchAdminFaqs';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSFaqsPage: Admin page for managing FAQs.
 */
const CMSFaqsPage = () => {
    const { 
        faqs, 
        isLoading, 
        fetch: reloadFaqs, 
        deleteFaq,
        currentPage,
        totalPages,
        totalItems,
        setPage,
        setSearch
    } = useFetchAdminFaqs();

    const tableItems = faqs.map(faq => ({
        ...faq,
        title: faq.question || 'Untitled FAQ',
        type: 'FAQ',
        createdAt: faq.createdAt,
        publishedAt: faq.publishedAt
    }));

    return (
        <CMSResourceTable 
            sectionName="FAQs" 
            items={tableItems} 
            isLoading={isLoading} 
            icon={HelpCircle} 
            onRefresh={reloadFaqs}
            onDelete={deleteFaq}
            serverPagination={true}
            serverPage={currentPage}
            serverTotalPages={totalPages}
            serverTotalItems={totalItems}
            onPageChange={setPage}
            onSearchChange={setSearch}
        />
    );
};

export default CMSFaqsPage;
