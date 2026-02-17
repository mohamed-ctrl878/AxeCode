import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

/**
 * Recaptcha: Reusable security component.
 * Responsible for token generation and exposure via ref.
 */
export const Recaptcha = forwardRef(({ onChange }, ref) => {
    const recaptchaRef = useRef(null);
    const siteKey = import.meta.env.VITE_RECAPATCH;

    useImperativeHandle(ref, () => ({
        reset: () => {
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
        }
    }));

    if (!siteKey) {
        console.warn("reCAPTCHA site key is missing in .env (VITE_RECAPATCH)");
        return null;
    }

    return (
        <div className="flex justify-center p-2 bg-surface-dark/30 border border-white/5 rounded-2xl overflow-hidden scale-95 origin-center transition-transform hover:scale-100">
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                onChange={onChange}
                theme="dark"
            />
        </div>
    );
});

Recaptcha.displayName = 'Recaptcha';
