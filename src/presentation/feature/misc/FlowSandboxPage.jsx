import React, { useState } from 'react';
import { FlowBuilder } from '@presentation/shared/components/flow/FlowBuilder';
import { FlowPreviewer } from '@presentation/shared/components/flow/FlowPreviewer';
import { Eye, Edit3, CloudUpload, Loader } from 'lucide-react';
import { useUploadRoadmap } from '@domain/useCase/useUploadRoadmap';
import { UploadRoadmapModal } from '../roadmap/components/UploadRoadmapModal';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchRoadmaps } from '@domain/useCase/useFetchRoadmaps';

export const FlowSandboxPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Core states
    const [savedData, setSavedData] = useState(null);
    const [mode, setMode] = useState('edit');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    
    // Domain Integration
    const { fetchRoadmaps, roadmaps, loading: isFetching } = useFetchRoadmaps();
    const { uploadRoadmap, loading: isUploading, error: uploadError, resetStatus } = useUploadRoadmap();

    // Handle Edit Mode Fetching
    React.useEffect(() => {
        if (id) {
            fetchRoadmaps();
        } else {
            setInitialLoadDone(true); // If no ID, ready immediately
        }
    }, [id, fetchRoadmaps]);

    React.useEffect(() => {
        if (id && roadmaps !== null) {
            const searchId = String(id);
            const found = roadmaps.find(r => String(r.uid) === searchId || String(r.id) === searchId);
            if (found) {
                setSavedData(found.flowData || null);
            }
            setInitialLoadDone(true);
        }
    }, [roadmaps, id]);

    const handleSave = (flowData) => {
        console.log("Locally saved Flow Data:", flowData);
        setSavedData(flowData);
    };

    const handleUploadClick = () => {
        resetStatus();
        setIsModalOpen(true);
    };

    const onCompleteUpload = async (payload) => {
        const result = await uploadRoadmap(payload, id); // pass id for update if exists
        if (result) {
            alert(id ? 'Roadmap successfully updated!' : 'Roadmap successfully published to the Server!');
            setIsModalOpen(false);
            navigate('/cms/roadmaps'); // Redirect back to CMS table
        }
    };

    if (id && !initialLoadDone) {
        return (
            <div className="md:col-span-12 w-full h-[calc(100vh-100px)] min-h-[600px] flex items-center justify-center bg-surface-sunken rounded-2xl border border-border-subtle shadow-2xl">
                <Loader size={48} className="animate-spin text-accent-primary opacity-50" />
            </div>
        );
    }

    return (
        <div className="md:col-span-12 w-full h-[calc(100vh-100px)] min-h-[600px] flex flex-col bg-surface rounded-2xl overflow-hidden shadow-2xl border border-border-subtle">
            <div className="p-4 bg-surface-light border-b border-border-subtle shrink-0 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-3">
                        {id ? 'React Flow Editor' : 'React Flow Builder Sandbox'}
                        {savedData && (
                            <button 
                                onClick={handleUploadClick}
                                className="px-3 py-1 flex items-center gap-1.5 bg-accent-primary/10 text-accent-primary border border-accent-primary/20 hover:bg-accent-primary hover:text-background transition-all text-[10px] uppercase font-black tracking-widest rounded-full cursor-pointer"
                            >
                                <CloudUpload size={14} /> {id ? 'Save Changes' : 'Upload to Server'}
                            </button>
                        )}
                    </h1>
                    <p className="text-text-muted text-sm text-balance">Test the dynamic shapes, colors, and upload your path directly.</p>
                </div>
                
                <div className="flex bg-surface-dark p-1 rounded-xl">
                    <button 
                        onClick={() => setMode('edit')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'edit' ? 'bg-accent-primary text-background shadow-md' : 'text-text-muted hover:text-text-primary'}`}
                    >
                        <Edit3 size={16} /> Edit
                    </button>
                    <button 
                        onClick={() => setMode('preview')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'preview' ? 'bg-purple-500 text-white shadow-md' : 'text-text-muted hover:text-text-primary'}`}
                    >
                        <Eye size={16} /> Preview
                    </button>
                </div>
            </div>

            <div className="flex-1 relative w-full h-full bg-surface-sunken">
                {mode === 'edit' ? (
                    <FlowBuilder 
                        key={id ? `edit-${id}` : 'create'} // Force remount if ID changes to reset initial nodes
                        initialNodes={savedData?.nodes || []}
                        initialEdges={savedData?.edges || []}
                        onSave={handleSave} 
                        className="absolute inset-0 border-none rounded-none" 
                    />
                ) : (
                    savedData ? (
                        <FlowPreviewer 
                            nodes={savedData.nodes} 
                            edges={savedData.edges} 
                            className="absolute inset-0 border-none rounded-none"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted">
                            <Eye size={48} className="opacity-20 mb-4" />
                            <p>No flowchart data saved yet!</p>
                            <p className="text-sm">Go back to Edit mode, create a flow, and click 'Save Flow'.</p>
                        </div>
                    )
                )}
            </div>

            {savedData && (
                <div className="mt-8 p-6 bg-surface-sunken border border-border-subtle rounded-2xl overflow-auto">
                    <h3 className="font-bold mb-4 text-accent-primary">Exported JSON State</h3>
                    <pre className="text-xs font-mono text-text-muted">
                        {JSON.stringify(savedData, null, 2)}
                    </pre>
                </div>
            )}
            {/* Overlay Modal */}
            <UploadRoadmapModal 
                isOpen={isModalOpen}
                onClose={() => !isUploading && setIsModalOpen(false)}
                uploadData={savedData}
                onUpload={onCompleteUpload}
                isUploading={isUploading}
                error={uploadError}
                existingRoadmap={id ? roadmaps?.find(r => r.uid === id || r.id === id) : null}
            />
        </div>
    );
};

export default FlowSandboxPage;
