import { clsx, type ClassValue } from 'clsx';
import { ValidationError } from '@/types';
import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function generateID(): number {
    return Math.floor(Math.random() * 100000000);
}

export function formatCurrency(amount: number, currency: string = '€'): string {
    return `${amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export function formatDate(date: Date = new Date()): string {
    return date.toLocaleDateString('de-DE');
}

export function formatMonth(date: Date = new Date()): string {
    return date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
}

export function downloadFile(content: string, type: string, filename: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// Validation Functions
export function validateTransactionText(text: string): ValidationError | null {
    if (!text || !text.trim()) {
        return { field: 'text', message: ERROR_MESSAGES.TRANSACTION_TEXT_REQUIRED };
    }
    if (text.length < VALIDATION_RULES.transaction.text.minLength) {
        return { field: 'text', message: ERROR_MESSAGES.TRANSACTION_TEXT_SHORT };
    }
    if (text.length > VALIDATION_RULES.transaction.text.maxLength) {
        return { field: 'text', message: ERROR_MESSAGES.TRANSACTION_TEXT_LONG };
    }
    return null;
}

export function validateTransactionAmount(amount: string | number): ValidationError | null {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(num)) {
        return { field: 'amount', message: ERROR_MESSAGES.TRANSACTION_AMOUNT_REQUIRED };
    }
    
    if (num < VALIDATION_RULES.transaction.amount.min || num > VALIDATION_RULES.transaction.amount.max) {
        return { field: 'amount', message: ERROR_MESSAGES.TRANSACTION_AMOUNT_INVALID };
    }
    
    return null;
}

export function validateBudgetLimit(limit: string | number): ValidationError | null {
    const num = typeof limit === 'string' ? parseFloat(limit) : limit;
    
    if (isNaN(num)) {
        return { field: 'budgetLimit', message: ERROR_MESSAGES.BUDGET_LIMIT_INVALID };
    }
    
    if (num < VALIDATION_RULES.budgetLimit.min || num > VALIDATION_RULES.budgetLimit.max) {
        return { field: 'budgetLimit', message: ERROR_MESSAGES.BUDGET_LIMIT_INVALID };
    }
    
    return null;
}

export function validateTransaction(text: string, amount: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const textError = validateTransactionText(text);
    if (textError) errors.push(textError);
    
    const amountError = validateTransactionAmount(amount);
    if (amountError) errors.push(amountError);
    
    return errors;
}

// Formatting utilities
export function formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
}

export function truncateText(text: string, maxLength: number = 50): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Date utilities
export function getMonthsArray(count: number = 12): Array<{ month: string; year: string }> {
    const months = [];
    const today = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
            month: date.toLocaleString('de-DE', { month: 'long' }),
            year: date.getFullYear().toString(),
        });
    }
    
    return months;
}

// Import/Export utilities
export function parseJSONImport(content: string): { transactions?: any[]; categories?: any } | null {
    try {
        const data = JSON.parse(content);
        if (!data.transactions && !data.categories) {
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

export function parseCSVImport(content: string): any[] | null {
    try {
        const lines = content.trim().split('\n');
        if (lines.length < 2) return null;
        
        const headers = lines[0].split(',').map(h => h.trim());
        const transactions = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            if (values.length !== headers.length) continue;
            
            transactions.push({
                id: parseInt(values[0]) || generateID(),
                date: values[1] || formatDate(),
                month: values[2] || formatMonth(),
                text: values[3] || 'Imported',
                amount: parseFloat(values[4]) || 0,
                category: values[5] || 'General',
            });
        }
        
        return transactions.length > 0 ? transactions : null;
    } catch {
        return null;
    }
}
