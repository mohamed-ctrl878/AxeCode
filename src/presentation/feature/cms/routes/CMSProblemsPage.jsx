import React, { useState } from 'react';
import { Code2, Box } from 'lucide-react';
import { useFetchAdminProblems } from '@domain/useCase/useFetchAdminProblems';
import { CMSResourceTable } from '../components/CMSResourceTable';
import CMSProblemTypesPage from './CMSProblemTypesPage';
import { cn } from '@core/utils/cn';

/**
 * CMSProblemsPage - Tabbed module for managing Problems and their Categories.
 */
const CMSProblemsPage = () => {
    const [activeTab, setActiveTab] = useState('archive'); // 'archive' | 'types'

    const { 
        problems, 
        isLoading, 
        fetch: fetchProblems,
        currentPage,
        totalPages,
        totalItems,
        setPage,
        setSearch 
    } = useFetchAdminProblems();

    return (
        <div className="flex flex-col gap-8 w-full animation-fade-in">
            {/* Control Panel - Shared Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-surface-sunken/50 border border-border-subtle rounded-2xl w-full md:w-fit mx-auto shadow-sm backdrop-blur-md overflow-x-auto scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('archive')}
                    className={cn(
                        "flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all",
                        activeTab === 'archive' 
                            ? "bg-near-black text-ivory shadow-lg scale-[1.02]" 
                            : "text-text-muted hover:text-text-primary hover:bg-surface-sunken"
                    )}
                >
                    <Code2 size={16} />
                    <span className="hidden md:inline">Problems Archive</span>
                </button>
                <button 
                    onClick={() => setActiveTab('types')}
                    className={cn(
                        "flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all",
                        activeTab === 'types' 
                            ? "bg-near-black text-ivory shadow-lg scale-[1.02]" 
                            : "text-text-muted hover:text-text-primary hover:bg-surface-sunken"
                    )}
                >
                    <Box size={16} />
                    <span className="hidden md:inline">Problem Types</span>
                </button>
            </div>

            <div className="animation-fade-in">
                {activeTab === 'archive' ? (
                    <CMSResourceTable
                        sectionName="Problems"
                        items={problems || []}
                        isLoading={isLoading}
                        icon={Code2}
                        onRefresh={fetchProblems}
                        serverPagination={true}
                        serverPage={currentPage}
                        serverTotalPages={totalPages}
                        serverTotalItems={totalItems}
                        onPageChange={setPage}
                        onSearchChange={setSearch}
                        addLabel="Architect New Problem"
                    />
                ) : (
                    <CMSProblemTypesPage />
                )}
            </div>
        </div>
    );
};

export default CMSProblemsPage;
