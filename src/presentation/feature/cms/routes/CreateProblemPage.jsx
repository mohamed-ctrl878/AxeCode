import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProblem } from '@domain/useCase/useCreateProblem';
import { ProblemForm } from '../components/problem/ProblemForm';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { PATHS } from '@presentation/routes/paths';

/**
 * Page orchestrator for creating a new algorithmic Problem.
 * Note: Backend lifecycles will automatically handle code template generation.
 */
const CreateProblemPage = () => {
    const navigate = useNavigate();
    const { createProblem, inProgress: isCreating, error } = useCreateProblem();
    
    // Local processing state
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (dtoData) => {
        setIsProcessing(true);
        try {
            // Dispatch API Request
            // The DTO mapping is handled within the UseCase/Repository layer via ProblemRequest
            const response = await createProblem(dtoData);
            
            // Strapi response check
            const created = response?.data || response;

            if (created && created.documentId) {
                // Navigate to the management page (Details tab)
                // This allows the admin to immediately add test cases
                navigate(`${PATHS.CONTENT_MANAGEMENT}/problems/${created.documentId}/edit`);
            }

        } catch (err) {
            console.error("Problem creation failed:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const isBusy = isCreating || isProcessing;

    return (
        <div className="md:col-span-12 min-h-screen pt-24 pb-12 px-4 sm:px-6 relative z-10 w-full animate-in fade-in duration-500">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-secondary/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto mb-8 w-full">
                <button 
                    onClick={() => navigate(`${PATHS.CONTENT_MANAGEMENT}/problems`)}
                    className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Problem Directory</span>
                </button>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle size={20} className="shrink-0" />
                        <span className="text-sm">{error.message || "An error occurred while creating the problem."}</span>
                    </div>
                )}
                
                <ProblemForm 
                    onSubmit={handleSubmit} 
                    isLoading={isBusy} 
                />
            </div>
        </div>
    );
};

export default CreateProblemPage;
