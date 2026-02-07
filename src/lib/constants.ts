import { CategoryMap, SparkasseData, AppSettings, ValidationError } from '@/types';

export const DEFAULT_CATEGORIES: CategoryMap = {
    General: { color: '#64748b', label: 'Allgemein' },
    Salary: { color: '#10b981', label: 'Gehalt' },
    Food: { color: '#f59e0b', label: 'Essen & Trinken' },
    Housing: { color: '#6366f1', label: 'Wohnen' },
    Transport: { color: '#0ea5e9', label: 'Transport' },
    Leisure: { color: '#a855f7', label: 'Freizeit' },
    Shopping: { color: '#ec4899', label: 'Shopping' },
    Health: { color: '#f43f5e', label: 'Gesundheit' },
};

export const DEFAULT_ACCOUNT_TYPES = [
    { id: 'cash', label: 'Bargeld', emoji: '💵' },
    { id: 'bank', label: 'Bankkonto', emoji: '🏦' },
    { id: 'card', label: 'Kreditkarte', emoji: '💳' },
    { id: 'wallet', label: 'Wallet', emoji: '👛' },
    { id: 'savings', label: 'Sparkonto', emoji: '🏴' },
    { id: 'depot', label: 'Depot', emoji: '📈' },
];



export const DEFAULT_SETTINGS: AppSettings = {
    currency: '€',
    theme: 'auto',
    notifications: true,
    budgetLimit: 0,
};

export const DEFAULT_SPARKASSE: SparkasseData = {
    balance: 0,
    goal: 1000,
    monthlyDeposited: 0,
    settings: {
        autoSaveAmount: 50,
        autoSaveEnabled: false,
        autoSaveDay: 1,
    }
};

export const MONTHS_DE = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

// Validation Rules
export const VALIDATION_RULES = {
    transaction: {
        text: {
            minLength: 3,
            maxLength: 100,
            required: true,
        },
        amount: {
            min: 0.01,
            max: 999999.99,
            required: true,
        },
    },
    budgetLimit: {
        min: 0,
        max: 999999.99,
    },
};

// Error Messages
export const ERROR_MESSAGES: Record<string, string> = {
    TRANSACTION_TEXT_SHORT: 'Bezeichnung muss mindestens 3 Zeichen lang sein',
    TRANSACTION_TEXT_LONG: 'Bezeichnung darf maximal 100 Zeichen lang sein',
    TRANSACTION_TEXT_REQUIRED: 'Bezeichnung ist erforderlich',
    TRANSACTION_AMOUNT_REQUIRED: 'Betrag ist erforderlich',
    TRANSACTION_AMOUNT_INVALID: 'Betrag muss zwischen 0,01 und 999.999,99 liegen',
    TRANSACTION_CATEGORY_REQUIRED: 'Kategorie ist erforderlich',
    BUDGET_LIMIT_INVALID: 'Budget-Limit muss eine positive Zahl sein',
    IMPORT_INVALID_FORMAT: 'Ungültiges Dateiformat',
    IMPORT_EMPTY: 'Die Datei enthält keine Daten',
};

// Theme colors - Light Mode
export const LIGHT_THEME = {
    background: '#f8f9fa',
    surface: 'rgba(255, 255, 255, 0.95)',
    surfaceBorder: 'rgba(0, 0, 0, 0.08)',
    accent: '#6366f1',
    accentLight: '#e0e7ff',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#f43f5e',
    textMain: '#1f2937',
    textDim: '#6b7280',
    textDimmer: '#9ca3af',
};

// Theme colors - Dark Mode
export const DARK_THEME = {
    background: '#050505',
    surface: 'rgba(20, 20, 25, 0.85)',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
    accent: '#6366f1',
    accentLight: 'rgba(99, 102, 241, 0.1)',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#f43f5e',
    textMain: '#ffffff',
    textDim: '#94a3b8',
    textDimmer: '#64748b',
};
