import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Loader2, Save } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { useFetchRoles } from '@domain/useCase/useFetchRoles';
import { useUpdateUserRole } from '@domain/useCase/useUpdateUserRole';

export const ChangeUserRoleModal = ({ user, onClose, onSuccess }) => {
    const { roles, isLoading: isLoadingRoles } = useFetchRoles();
    const { updateUserRole, isUpdating } = useUpdateUserRole();
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        if (roles.length > 0 && user?.role?.id) {
            setSelectedRole(user.role.id);
        }
    }, [roles, user]);

    const handleSubmit = async () => {
        if (!selectedRole || selectedRole === user?.role?.id) return;
        
        try {
            await updateUserRole({ userId: user.id, roleId: selectedRole });
            onSuccess();
        } catch (error) {
            console.error("Failed to update role", error);
        }
    };

    const hasChanged = selectedRole && selectedRole !== user?.role?.id;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animation-fade-in"
                onClick={onClose}
            />
            
            <div className="bg-surface w-full max-w-md rounded-[32px] border border-border-default shadow-2xl relative z-10 overflow-hidden animation-slide-up flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-border-subtle flex items-center justify-between bg-surface-sunken">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-text-primary text-surface flex items-center justify-center shadow-lg">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-bold text-text-primary">User Privileges</h2>
                            <p className="text-xs text-text-muted mt-0.5">Adjust role for {user?.username}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-border-subtle/50 text-text-muted hover:text-text-primary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    {isLoadingRoles ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Loader2 size={32} className="animate-spin text-accent-primary" />
                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Fetching Roles...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">
                                Assign System Role
                            </label>
                            
                            <div className="grid gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={cn(
                                            "w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all",
                                            selectedRole === role.id 
                                                ? "border-text-primary bg-text-primary/[0.03] shadow-sm"
                                                : "border-border-default bg-surface hover:border-border-subtle hover:bg-surface-sunken"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors",
                                            selectedRole === role.id 
                                                ? "border-text-primary" 
                                                : "border-border-subtle"
                                        )}>
                                            {selectedRole === role.id && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={cn(
                                                "font-serif font-bold text-sm",
                                                selectedRole === role.id ? "text-text-primary" : "text-text-muted"
                                            )}>
                                                {role.name}
                                            </h3>
                                            {role.description && (
                                                <p className="text-[11px] text-text-muted/70 mt-1 line-clamp-2">
                                                    {role.description}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-surface-sunken border-t border-border-subtle flex gap-4 justify-end mt-auto">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-text-muted hover:text-text-primary transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!hasChanged || isUpdating}
                        className="btn-dark flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Confirm Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
};
