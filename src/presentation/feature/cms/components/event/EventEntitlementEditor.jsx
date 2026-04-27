import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { useCreateEntitlement } from '@domain/useCase/useCreateEntitlement';
import { useFetchEvent } from '@domain/useCase/useFetchEvent';
import { EntitlementRequest } from '@infrastructure/DTO/Request/EntitlementRequest';

export const EventEntitlementEditor = ({ eventId }) => {
    // ─── UseCases ────────────────────────────────────────────────────────
    const { fetchEvent, event, loading: isFetchingEvent } = useFetchEvent();
    const { createEntitlement, inProgress: isCreating } = useCreateEntitlement();

    // ─── Local State ─────────────────────────────────────────────────────
    const [price, setPrice] = useState(0);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    // ─── Initial Load ────────────────────────────────────────────────────
    useEffect(() => {
        if (eventId) {
            fetchEvent(eventId);
        }
    }, [eventId, fetchEvent]);

    // Sync price from event (for initial view)
    useEffect(() => {
        if (event) {
            setPrice(event.price || 0);
        }
    }, [event]);

    // ─── Actions ─────────────────────────────────────────────────────────
    const handleUpdatePrice = async () => {
        try {
            const request = new EntitlementRequest({
                title: `Event Pricing: ${event?.title || eventId}`,
                description: `Pricing update to ${price} USD`,
                price: Number(price),
                itemId: eventId, // event documentId
                contentType: 'event', // CRITICAL: Identify as event for pricing records
                decision: true,
                userId: null // Public pricing entitlement
            });

            await createEntitlement(request.toJSON());
            
            showStatus('success', 'Event pricing record created! (Sync pending)');
        } catch (err) {
            showStatus('error', 'Failed to update event pricing.');
        }
    };

    const showStatus = (type, text) => {
        setStatusMessage({ type, text });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 5000);
    };

    // ─── UI Helpers ─────────────────────────────────────────────────────
    if (isFetchingEvent && !event) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-text-muted animate-pulse">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Synchronizing event valuation parameters...</p>
            </div>
        );
    }

    return (
        <div className="animation-fade-in space-y-10 pb-20">
            {/* Context Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 text-accent-primary flex items-center justify-center shadow-inner">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-text-primary italic">Event Entitlement</h2>
                        <p className="text-xs text-text-muted mt-1 uppercase tracking-widest opacity-60">Revenue & Governance Engine</p>
                    </div>
                </div>

                {statusMessage.text && (
                    <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold animation-slide-up",
                        statusMessage.type === 'success' ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                    )}>
                        {statusMessage.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        {statusMessage.text}
                    </div>
                )}
            </div>

            <div className="max-w-xl mx-auto">
                <div className="bg-surface-dark/40 border border-border-subtle rounded-3xl p-10 space-y-8 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <CreditCard size={120} />
                    </div>
                    
                    <div className="space-y-2 relative z-10">
                        <h3 className="text-sm font-black text-text-primary/90 uppercase tracking-[0.2em]">Ticket Valuation</h3>
                        <p className="text-xs text-text-muted italic">Configure the access fee for this event. Free events attract wider engagement.</p>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] uppercase tracking-widest text-text-muted font-bold px-1">Price (USD)</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-accent-primary font-black text-2xl">$</span>
                                <input 
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-background/50 border border-border-subtle rounded-2xl pl-12 pr-6 py-5 text-3xl font-black text-text-primary focus:border-accent-primary/50 outline-none transition-all shadow-inner"
                                    placeholder="0.00"
                                />
                                {Number(price) === 0 && (
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-green-500/20 text-green-400 uppercase border border-green-500/20 shadow-lg shadow-green-500/10">Complimentary</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={handleUpdatePrice}
                            disabled={isCreating}
                            className="w-full h-16 bg-accent-primary text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-accent-primary/90 active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                        >
                            {isCreating ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} className="group-hover:rotate-12 transition-transform" />}
                            Publish New Pricing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal Save Icon Helper
const Save = ({ size, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);
