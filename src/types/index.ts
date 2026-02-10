// Transaction type
export interface Transaction {
    id: number;
    text: string;
    amount: number;
    category: string;
    date: string;
    month: string;
    accountId?: string;
}

// Category type
export interface Category {
    color: string;
    label: string;
    budgetLimit?: number;
}

export interface SparkasseData {
    balance: number;
    goal: number;
    monthlyDeposited: number;
    settings: {
        autoSaveAmount: number;
        autoSaveEnabled: boolean;
        autoSaveDay: number;
    };
}

// Recurring Transaction type
export interface RecurringTransaction {
    id: string;
    text: string;
    amount: number;
    category: string;
    interval: 'monthly';
    dayOfMonth: number;
    startDate: string; // ISO Date string (YYYY-MM-DD)
    endDate?: string; // ISO Date string (YYYY-MM-DD), optional
    lastExecuted: string | null; // ISO Date string
    isActive: boolean;
    noticePeriod?: string;
    notes?: string;
    history: { date: string; changes: string[] }[];
}

export interface RecurringTransactionHistory {
    date: string;
    changes: string[];
}

export type CategoryMap = Record<string, Category>;

// Account Type Definition
export interface AccountType {
    id: string; // used as value
    label: string;
    emoji: string;
}

// Account/Wallet type
export interface Account {
    id: string;
    name: string;
    type: string; // Dynamic type id
    balance: number;
    currency: string;
    color: string;
    createdAt: string;
    updatedAt?: string;
}

// App Settings type
export interface AppSettings {
    currency: string;
    theme: 'dark' | 'light' | 'auto';
    notifications: boolean;
    budgetLimit: number;
}

// Notification type
export interface Notification {
    id: string;
    type: 'warning' | 'info' | 'success' | 'error';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

// Tag type
export interface Tag {
    id: string;
    name: string;
    color: string;
}

// Transaction with tags
export interface TransactionWithTags extends Transaction {
    tags?: string[];
}

// Statistics type
export interface Statistics {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    categoryBreakdown: Record<string, { amount: number; percentage: number }>;
    monthlyTrend: Array<{ month: string; income: number; expense: number }>;
}

// Validation Error type
export interface ValidationError {
    field: string;
    message: string;
}

// Store State type
export interface BudgetState {
    transactions: Transaction[];
    categories: CategoryMap;
    accounts: Account[];
    recurringTransactions: RecurringTransaction[];
    settings: AppSettings;
    sparkasse: SparkasseData;
    activeAccountId?: string;
    isLoading: boolean;
    error: string | null;

    // Initialization
    fetchInitialData: () => Promise<void>;

    // Transaction Actions
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    updateTransaction: (id: number, transaction: Partial<Transaction>) => Promise<void>;
    deleteTransaction: (id: number) => Promise<void>;

    // Recurring Transaction Actions
    addRecurringTransaction: (transaction: Omit<RecurringTransaction, 'id' | 'lastExecuted' | 'isActive'>) => Promise<void>;
    deleteRecurringTransaction: (id: string) => Promise<void>;
    updateRecurringTransaction: (id: string, updates: Partial<RecurringTransaction>) => Promise<void>;
    checkRecurringTransactions: () => Promise<void>;


    // Account Actions
    accountTypes: AccountType[];
    addAccountType: (type: AccountType) => void; // Keep sync for now or updates 
    deleteAccountType: (id: string) => void;

    addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => Promise<void>;
    deleteAccount: (id: string) => Promise<void>;
    updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
    setActiveAccount: (id: string) => void;
    transferBetweenAccounts: (fromId: string, toId: string, amount: number) => Promise<void>;

    // Sparkasse Actions
    deposit: (amount: number) => Promise<void>;
    withdraw: (amount: number) => Promise<void>;
    updateSparkasseSettings: (updates: Partial<SparkasseData['settings']>) => Promise<void>;
    resetMonthlyProgress: () => Promise<void>;

    // Category Actions
    addCategory: (key: string, category: Category) => Promise<void>;
    updateCategory: (key: string, updates: Partial<Category>) => Promise<void>;
    deleteCategory: (key: string) => Promise<void>;
    setCategoryBudget: (category: string, limit: number) => Promise<void>;

    // Settings Actions
    updateSettings: (settings: Partial<AppSettings>) => Promise<void>;

    // Data Actions
    importData: (data: { transactions?: Transaction[]; categories?: CategoryMap; accounts?: Account[] }) => void;
    resetAllData: () => void;

    // Query Actions (for derived data)
    getCategoryBudgetStatus: (category: string, month?: string) => { used: number; limit: number; percentage: number };
    getStatistics: (month?: string) => Statistics;
    getTransactionsByMonth: (month: string) => Transaction[];
    searchTransactions: (term: string, month?: string) => Transaction[];
}
