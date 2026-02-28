import React, { useState } from 'react';
import { FlowBuilder } from '@presentation/shared/components/flow/FlowBuilder';
import { FlowPreviewer } from '@presentation/shared/components/flow/FlowPreviewer';
import { Eye, Edit3 } from 'lucide-react';

export const FlowSandboxPage = () => {
    const [savedData, setSavedData] = useState(null);
    const [mode, setMode] = useState('edit');

    const handleSave = (flowData) => {
        console.log("Exported Flow Data:", flowData);
        setSavedData(flowData);
        alert('Flow saved to console!');
    };

    return (
        <div className="md:col-span-12 w-full h-[calc(100vh-100px)] min-h-[600px] flex flex-col bg-surface rounded-2xl overflow-hidden shadow-2xl border border-border-subtle">
            <div className="p-4 bg-surface-light border-b border-border-subtle shrink-0 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">React Flow Builder Sandbox</h1>
                    <p className="text-text-muted text-sm text-balance">Test the dynamic shapes, colors, and Rich Text integrations.</p>
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

            <div className="flex-1 relative w-full h-full bg-surface-dark">
                {mode === 'edit' ? (
                    <FlowBuilder 
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
                <div className="mt-8 p-6 bg-surface-dark border border-border-subtle rounded-2xl overflow-auto">
                    <h3 className="font-bold mb-4 text-accent-primary">Exported JSON State</h3>
                    <pre className="text-xs font-mono text-text-muted">
                        {JSON.stringify(savedData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default FlowSandboxPage;
