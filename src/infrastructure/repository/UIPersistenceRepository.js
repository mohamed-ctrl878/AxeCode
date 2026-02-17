/**
 * UIPersistenceRepository: Handles persistence of UI-related configurations.
 * Follows SRP: Dedicated to key-value storage for UI preferences.
 * Adheres to DIP: Decouples UIProvider from direct localStorage API.
 */
class UIPersistenceRepository {
    constructor() {
        this.themeKey = 'axe_theme_preference';
    }

    /**
     * Retrieves the persisted theme or returns a default.
     * @returns {'light' | 'dark'}
     */
    getTheme() {
        try {
            const savedTheme = localStorage.getItem(this.themeKey);
            return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
        } catch (e) {
            console.error("Failed to retrieve theme from storage", e);
            return 'dark';
        }
    }

    /**
     * Persists the theme preference.
     * @param {'light' | 'dark'} theme 
     */
    setTheme(theme) {
        try {
            localStorage.setItem(this.themeKey, theme);
        } catch (e) {
            console.error("Failed to save theme to storage", e);
        }
    }
}

export const uiPersistenceRepository = new UIPersistenceRepository();
