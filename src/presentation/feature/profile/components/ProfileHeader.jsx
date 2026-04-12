import React, { useRef } from 'react';
import { Shield, Award, Zap, Star, Camera, Loader2, Pencil, Check, X } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { useSelector } from 'react-redux';
import { useUpdateUserAvatar } from '@domain/useCase/useUpdateUserAvatar';
import { useUpdateUserBio } from '@domain/useCase/useUpdateUserBio';
import { useUpdateUserName } from '@domain/useCase/useUpdateUserName';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

/**
 * ProfileHeader: Restructured to match AxeCode's central design language.
 * Features premium typography, level progression, and authoritative presence.
 */
export const ProfileHeader = ({ user, onUpdate }) => {
    const fileInputRef = useRef(null);
    const currentUser = useSelector((state) => state.auth.user);
    const { updateAvatar, isUpdating: isUpdatingAvatar, progress } = useUpdateUserAvatar();
    const { updateBio, isUpdating: isUpdatingBio } = useUpdateUserBio();

    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioValue, setBioValue] = useState(user.bio || '');

    const { updateName, isUpdating: isUpdatingName } = useUpdateUserName();
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValues, setNameValues] = useState({
        firstname: user.firstname || '',
        lastname: user.lastname || ''
    });

    const handleSaveName = async () => {
        try {
            const updatedUser = await updateName(user.id, nameValues);
            if (updatedUser && onUpdate) {
                onUpdate(updatedUser);
            }
            setIsEditingName(false);
            toast.success("Identity profile updated");
        } catch (err) {
            toast.error("Failed to update name");
        }
    };

    if (!user) return null;

    const isOwner = currentUser?.id === user?.id || currentUser?.username === user?.username;

    const handleAvatarClick = () => {
        if (isOwner && !isUpdatingAvatar) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const updatedUser = await updateAvatar(user.id, file);
            if (updatedUser && onUpdate) onUpdate(updatedUser);
            toast.success("Identity updated successfully.");
        } catch (err) {
            console.error('[ProfileHeader] Upload failed:', err);
            toast.error(err.message || "Cloud synchronization failed.");
        }
    };

    const handleSaveBio = async () => {
        try {
            const updatedUser = await updateBio(user.id, bioValue);
            setIsEditingBio(false);
            if (updatedUser && onUpdate) onUpdate(updatedUser);
            toast.success("Biography updated.");
        } catch (err) {
            console.error('[ProfileHeader] Bio update failed:', err);
            toast.error(err.message || "Failed to update bio.");
        }
    };

    return (
        <div className="flex flex-col gap-10 bg-surface/30 backdrop-blur-xl border border-border-subtle/50 p-8 md:p-12 rounded-[2rem] relative overflow-hidden group">
            {/* Background Decorative Mesh */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex flex-col lg:flex-row gap-10 items-start relative z-10">
                {/* Avatar Section */}
                <div className="relative shrink-0 group/avatar">
                    <div className="absolute inset-0 bg-accent-primary animate-pulse blur-3xl opacity-20" />
                    
                    {/* Progress Ring (SVG) */}
                    {isUpdatingAvatar && (
                        <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90 z-20 pointer-events-none">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="48%"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray="300"
                                strokeDashoffset={300 - (progress / 100) * 300}
                                className="text-accent-primary transition-all duration-300 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}

                    <div 
                        onClick={handleAvatarClick}
                        className={cn(
                            "w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-surface-dark border-2 border-border-default overflow-hidden relative transition-all duration-500 z-10",
                            isOwner && !isUpdatingAvatar ? "cursor-pointer hover:border-accent-primary group-hover/avatar:shadow-halo" : "border-border-default"
                        )}
                    >
                        <img 
                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=a855f7&color=fff&size=200`} 
                            alt={user.username} 
                            className={cn(
                                "w-full h-full object-cover transition-all duration-700",
                                isUpdatingAvatar ? "opacity-30 blur-sm" : "grayscale-[0.3] hover:grayscale-0"
                            )}
                        />

                        {/* Loading State Overlay */}
                        {isUpdatingAvatar && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 backdrop-blur-sm z-30">
                                <Loader2 className="w-8 h-8 text-accent-primary animate-spin mb-2" />
                                <span className="text-[10px] font-bold font-mono text-accent-primary animate-pulse">
                                    {progress}%
                                </span>
                            </div>
                        )}

                        {/* Edit Icon Overlay (Visible only to owner) */}
                        {isOwner && !isUpdatingAvatar && (
                            <div className="absolute inset-0 bg-accent-primary/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="p-3 bg-background/80 backdrop-blur-md rounded-2xl border border-accent-primary/30 shadow-halo transform translate-y-4 group-hover/avatar:translate-y-0 transition-transform duration-500">
                                    <Camera size={20} className="text-accent-primary" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Hidden File Input */}
                    {isOwner && (
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    )}

                    {/* Level Badge Overlay */}
                    {/* <div className="absolute -bottom-3 -right-3 px-4 py-2 bg-background border border-border-subtle rounded-2xl shadow-halo flex items-center gap-2">
                        <Zap size={14} className="text-accent-primary fill-accent-primary/20" />
                        <span className="text-xs font-bold font-mono text-text-primary tracking-widest">LVL.12</span>
                    </div> */}
                </div>

                {/* Identity Info */}
                <div className="flex-1 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 text-accent-primary">
                                <Shield size={16} />
                                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] opacity-80 decoration-accent-primary underline-offset-8 decoration-2">Verified Architect</span>
                            </div>

                            {isEditingName ? (
                                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input 
                                            value={nameValues.firstname}
                                            onChange={(e) => setNameValues(prev => ({ ...prev, firstname: e.target.value }))}
                                            placeholder="First Name"
                                            className="bg-surface-sunken/50 border border-border-subtle rounded-xl px-4 py-3 text-lg font-serif text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all w-full sm:w-1/2"
                                            autoFocus
                                        />
                                        <input 
                                            value={nameValues.lastname}
                                            onChange={(e) => setNameValues(prev => ({ ...prev, lastname: e.target.value }))}
                                            placeholder="Last Name"
                                            className="bg-surface-sunken/50 border border-border-subtle rounded-xl px-4 py-3 text-lg font-serif text-text-primary focus:outline-none focus:border-accent-primary/50 transition-all w-full sm:w-1/2"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={handleSaveName}
                                            disabled={isUpdatingName}
                                            className="flex items-center gap-2 bg-accent-primary text-black px-4 py-2 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {isUpdatingName ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                            Update Identity
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setIsEditingName(false);
                                                setNameValues({ firstname: user.firstname || '', lastname: user.lastname || '' });
                                            }}
                                            className="p-2 text-text-muted hover:text-text-primary transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    onClick={() => setIsEditingName(true)}
                                    className="group/name cursor-pointer "
                                >
                                    <h1 className="text-5xl md:text-6xl font-serif text-text-primary tracking-tight leading-tight flex items-center gap-4 group-hover/name:text-accent-primary transition-colors">
                                        {user.displayName || user.username}
                                        <Pencil size={20} className="opacity-0 group-hover/name:opacity-50 transition-opacity" />
                                    </h1>
                                    <p className="text-lg text-text-muted font-mono tracking-tight opacity-70">@{user.username}</p>
                                </div>
                            )}
                        </div>

                    <div className="relative group/bio">
                        {isEditingBio ? (
                            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <textarea 
                                    value={bioValue}
                                    onChange={(e) => setBioValue(e.target.value)}
                                    placeholder="Tell your story as an Architect..."
                                    className="w-full bg-surface-dark border border-accent-primary/30 p-4 rounded-2xl text-text-primary text-sm font-sans focus:outline-none focus:border-accent-primary transition-all min-h-[100px] resize-none"
                                    autoFocus
                                />
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={handleSaveBio}
                                        disabled={isUpdatingBio}
                                        className="btn-primary px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center gap-2"
                                    >
                                        {isUpdatingBio ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                        Secure Data
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setIsEditingBio(false);
                                            setBioValue(user.bio || '');
                                        }}
                                        disabled={isUpdatingBio}
                                        className="px-4 py-2 bg-surface border border-border-subtle rounded-xl text-[10px] font-bold text-text-muted hover:text-accent-rose transition-colors flex items-center gap-2"
                                    >
                                        <X size={12} />
                                        Discard
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <p className="text-text-muted max-w-2xl text-lg font-sans leading-relaxed opacity-90 italic">
                                    "{user.bio || 'Exploring the boundaries of modularity and digital craftsmanship within the AxeCode ecosystem.'}"
                                </p>
                                {isOwner && (
                                    <button 
                                        onClick={() => setIsEditingBio(true)}
                                        className="absolute -right-10 top-0 p-2 text-text-muted hover:text-accent-primary opacity-0 group-hover/bio:opacity-100 transition-all transform translate-x-4 group-hover/bio:translate-x-0"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Meta Badges */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {['Top Contributor', 'Modular Master', 'Founding Member'].map((tag) => (
                            <div key={tag} className="px-3 py-1 bg-surface shadow-ring border border-border-subtle rounded-lg text-[10px] font-bold text-text-muted uppercase tracking-widest hover:text-accent-primary transition-colors cursor-default">
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vertical Statistics Grid */}
                <div className="lg:ml-auto grid grid-cols-2 lg:flex lg:flex-col gap-4 w-full lg:w-48">
                    <StatBox label="Submissions" value={user.submissionCount || 0} icon={Zap} />
                    <StatBox label="Passed Submissions" value={user.passedSubmissionsCount || 0} icon={Award} />
                    <div className="col-span-2">
                        <StatBox label="EXP Points" value={(user.stats?.points || 0).toLocaleString()} icon={Star} primary />
                    </div>
                </div>
            </div>

            {/* Bottom Interaction Strip */}
            <div className="flex items-center gap-4 pt-8 border-t border-border-subtle/30">
                <button className="btn-primary px-8 py-3 rounded-2xl text-sm font-bold tracking-widest uppercase">
                    Commence Sync
                </button>
                <button className="px-8 py-3 border border-border-subtle rounded-2xl text-sm font-bold text-text-muted hover:bg-surface transition-all">
                    Direct Channel
                </button>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, icon: Icon, primary }) => (
    <div className={cn(
        "p-4 rounded-2xl border flex flex-col gap-1 transition-all group/stat",
        primary 
            ? "bg-accent-primary/5 border-accent-primary/20 shadow-halo" 
            : "bg-surface border-border-subtle hover:border-accent-primary/30"
    )}>
        <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] font-bold text-text-muted">
            <span>{label}</span>
            <Icon size={12} className={cn(primary ? "text-accent-primary" : "text-text-muted group-hover/stat:text-accent-primary")} />
        </div>
        <span className={cn(
            "text-2xl font-serif tracking-tighter",
            primary ? "text-accent-primary" : "text-text-primary"
        )}>
            {value}
        </span>
    </div>
);
