'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: 'light' | 'dark' | 'auto') => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { settings, updateSettings } = useBudgetStore();
    const [theme, setThemeState] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Determine initial theme
        let initialTheme: Theme = 'dark';
        if (settings.theme === 'auto') {
            initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        } else {
            initialTheme = settings.theme as Theme;
        }

        setThemeState(initialTheme);
        applyTheme(initialTheme);
    }, [settings.theme]);

    const applyTheme = (themeValue: Theme) => {
        const html = document.documentElement;
        html.classList.remove('light', 'dark');
        html.classList.add(themeValue);
        html.setAttribute('data-theme', themeValue);
    };

    const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
        updateSettings({ theme: newTheme });
        
        let themeToApply: Theme = 'dark';
        if (newTheme === 'auto') {
            themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        } else {
            themeToApply = newTheme;
        }
        
        setThemeState(themeToApply);
        applyTheme(themeToApply);
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
