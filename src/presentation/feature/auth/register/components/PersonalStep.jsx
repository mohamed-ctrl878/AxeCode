import React from 'react';
import { UserCircle, Phone, Calendar, School, User } from 'lucide-react';
import { Recaptcha } from '../../../../shared/components/Recaptcha';

/**
 * PersonalStep: Handles Profile-related inputs (Personal Info).
 */
export const PersonalStep = ({ formData, onUpdate, recaptchaRef }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">First Name</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={17} />
                        <input 
                            type="text" 
                            name="firstname"
                            value={formData.firstname || ''}
                            onChange={(e) => onUpdate({ firstname: e.target.value })}
                            placeholder="John"
                            className="w-full bg-surface-dark/50 border border-border-subtle rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-accent-primary outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Last Name</label>
                    <div className="relative group">
                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={17} />
                        <input 
                            type="text" 
                            name="lastname"
                            value={formData.lastname || ''}
                            onChange={(e) => onUpdate({ lastname: e.target.value })}
                            placeholder="Doe"
                            className="w-full bg-surface-dark/50 border border-border-subtle rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-accent-primary outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Phone Number</label>
                <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={17} />
                    <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone || ''}
                        onChange={(e) => onUpdate({ phone: e.target.value })}
                        placeholder="+20 123 456 7890"
                        className="w-full bg-surface-dark/50 border border-border-subtle rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-accent-primary outline-none transition-all"
                    />
                </div>
            </div>

            {/* University */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">University</label>
                <div className="relative group">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={17} />
                    <select 
                        name="university"
                        value={formData.university || ''}
                        onChange={(e) => onUpdate({ university: e.target.value })}
                        className="w-full bg-surface-dark/50 border border-border-subtle rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-accent-primary outline-none transition-all appearance-none"
                    >
                        <option value="" disabled className="bg-background">Select your university</option>
                        <option value="Cairo University" className="bg-background">Cairo University</option>
                        <option value="Ain Shams University" className="bg-background">Ain Shams University</option>
                        <option value="Alexandria University" className="bg-background">Alexandria University</option>
                        <option value="GUC" className="bg-background">German University in Cairo (GUC)</option>
                        <option value="AUC" className="bg-background">American University in Cairo (AUC)</option>
                    </select>
                </div>
            </div>

            {/* Birthday */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Birthday</label>
                <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={17} />
                    <input 
                        type="date" 
                        name="birthday"
                        max={new Date().toISOString().split('T')[0]} // Prevents future dates, format: yyyy-MM-dd
                        value={formData.birthday || ''}
                        onChange={(e) => onUpdate({ birthday: e.target.value })}
                        className="w-full bg-surface-dark/50 border border-border-subtle rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-accent-primary outline-none transition-all"
                    />
                </div>
            </div>

            {/* Security Protocol: reCAPTCHA */}
            <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-accent-primary px-1 flex items-center gap-2">
                    <div className="w-1 h-1 bg-accent-primary rounded-full animate-pulse" />
                    Security Verification
                </label>
                <Recaptcha 
                    ref={recaptchaRef}
                    onChange={(token) => onUpdate({ recaptchaToken: token })} 
                />
            </div>
        </div>
    );
};
