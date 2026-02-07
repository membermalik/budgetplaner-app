// i18n - Multi-language support
export type Language = 'de' | 'en' | 'fr' | 'es';

const translations: Record<Language, Record<string, string>> = {
    de: {
        // General
        'app.title': 'Haushaltsbuch',
        'app.description': 'Deine persönliche Finanzverwaltung',
        'common.save': 'Speichern',
        'common.cancel': 'Abbrechen',
        'common.delete': 'Löschen',
        'common.edit': 'Bearbeiten',
        'common.add': 'Hinzufügen',
        'common.new': 'Neu',
        'common.close': 'Schließen',

        // Dashboard
        'dashboard.balance': 'Kontostand',
        'dashboard.income': 'Einnahmen',
        'dashboard.expenses': 'Ausgaben',
        'dashboard.transactions': 'Transaktionen',
        'dashboard.analysis': 'Analyse',

        // Settings
        'settings.title': 'Einstellungen',
        'settings.general': 'Allgemein',
        'settings.appearance': 'Erscheinungsbild',
        'settings.categories': 'Kategorien',
        'settings.data': 'Daten & Export',
        'settings.currency': 'Währungssymbol',
        'settings.language': 'Sprache',
        'settings.theme': 'Farbschema',
        'settings.theme.auto': 'Systemeinstellung',
        'settings.theme.light': 'Helles Design',
        'settings.theme.dark': 'Dunkles Design',

        // Accounts
        'accounts.title': 'Konten & Geldbörsen',
        'accounts.add': 'Neues Konto',
        'accounts.name': 'Kontoname',
        'accounts.type': 'Kontotyp',
        'accounts.balance': 'Anfangssaldo',
        'accounts.transfer': 'Zwischen Konten Übertragen',

        // Notifications
        'notifications.title': 'Benachrichtigungen',
        'notifications.budget_exceeded': 'Budget überschritten',
        'notifications.warning': 'Warnung',

        // Charts
        'charts.title': 'Analyse',
        'charts.pie': 'Pie',
        'charts.bar': 'Bar',
        'charts.line': 'Line',
        'charts.area': 'Area',

        // Transactions
        'transaction.description': 'Beschreibung',
        'transaction.amount': 'Betrag',
        'transaction.category': 'Kategorie',
        'transaction.date': 'Datum',
        'transaction.tags': 'Tags',
    },
    en: {
        'app.title': 'Budget Planner',
        'app.description': 'Your personal finance management',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.add': 'Add',
        'common.new': 'New',
        'common.close': 'Close',

        'dashboard.balance': 'Balance',
        'dashboard.income': 'Income',
        'dashboard.expenses': 'Expenses',
        'dashboard.transactions': 'Transactions',
        'dashboard.analysis': 'Analysis',

        'settings.title': 'Settings',
        'settings.general': 'General',
        'settings.appearance': 'Appearance',
        'settings.categories': 'Categories',
        'settings.data': 'Data & Export',
        'settings.currency': 'Currency Symbol',
        'settings.language': 'Language',
        'settings.theme': 'Color Scheme',
        'settings.theme.auto': 'System Setting',
        'settings.theme.light': 'Light Design',
        'settings.theme.dark': 'Dark Design',

        'accounts.title': 'Accounts & Wallets',
        'accounts.add': 'New Account',
        'accounts.name': 'Account Name',
        'accounts.type': 'Account Type',
        'accounts.balance': 'Starting Balance',
        'accounts.transfer': 'Transfer Between Accounts',

        'notifications.title': 'Notifications',
        'notifications.budget_exceeded': 'Budget Exceeded',
        'notifications.warning': 'Warning',

        'charts.title': 'Analysis',
        'charts.pie': 'Pie',
        'charts.bar': 'Bar',
        'charts.line': 'Line',
        'charts.area': 'Area',

        'transaction.description': 'Description',
        'transaction.amount': 'Amount',
        'transaction.category': 'Category',
        'transaction.date': 'Date',
        'transaction.tags': 'Tags',
    },
    fr: {
        'app.title': 'Planificateur Budgétaire',
        'app.description': 'Votre gestion financière personnelle',
        'common.save': 'Enregistrer',
        'common.cancel': 'Annuler',
        'common.delete': 'Supprimer',
        'common.edit': 'Modifier',
        'common.add': 'Ajouter',
        'common.new': 'Nouveau',
        'common.close': 'Fermer',

        'dashboard.balance': 'Solde',
        'dashboard.income': 'Revenus',
        'dashboard.expenses': 'Dépenses',
        'dashboard.transactions': 'Transactions',
        'dashboard.analysis': 'Analyse',

        'settings.title': 'Paramètres',
        'settings.general': 'Général',
        'settings.appearance': 'Apparence',
        'settings.categories': 'Catégories',
        'settings.data': 'Données & Export',
        'settings.currency': 'Symbole Monétaire',
        'settings.language': 'Langue',
        'settings.theme': 'Schéma de Couleurs',
        'settings.theme.auto': 'Paramètre Système',
        'settings.theme.light': 'Design Clair',
        'settings.theme.dark': 'Design Sombre',

        'accounts.title': 'Comptes & Portefeuilles',
        'accounts.add': 'Nouveau Compte',
        'accounts.name': 'Nom du Compte',
        'accounts.type': 'Type de Compte',
        'accounts.balance': 'Solde Initial',
        'accounts.transfer': 'Transférer entre Comptes',

        'notifications.title': 'Notifications',
        'notifications.budget_exceeded': 'Budget Dépassé',
        'notifications.warning': 'Avertissement',

        'charts.title': 'Analyse',
        'charts.pie': 'Pie',
        'charts.bar': 'Bar',
        'charts.line': 'Line',
        'charts.area': 'Area',

        'transaction.description': 'Description',
        'transaction.amount': 'Montant',
        'transaction.category': 'Catégorie',
        'transaction.date': 'Date',
        'transaction.tags': 'Étiquettes',
    },
    es: {
        'app.title': 'Planificador Presupuestario',
        'app.description': 'Tu gestión financiera personal',
        'common.save': 'Guardar',
        'common.cancel': 'Cancelar',
        'common.delete': 'Eliminar',
        'common.edit': 'Editar',
        'common.add': 'Añadir',
        'common.new': 'Nuevo',
        'common.close': 'Cerrar',

        'dashboard.balance': 'Saldo',
        'dashboard.income': 'Ingresos',
        'dashboard.expenses': 'Gastos',
        'dashboard.transactions': 'Transacciones',
        'dashboard.analysis': 'Análisis',

        'settings.title': 'Configuración',
        'settings.general': 'General',
        'settings.appearance': 'Apariencia',
        'settings.categories': 'Categorías',
        'settings.data': 'Datos & Exportar',
        'settings.currency': 'Símbolo de Moneda',
        'settings.language': 'Idioma',
        'settings.theme': 'Esquema de Colores',
        'settings.theme.auto': 'Configuración del Sistema',
        'settings.theme.light': 'Diseño Claro',
        'settings.theme.dark': 'Diseño Oscuro',

        'accounts.title': 'Cuentas y Billeteras',
        'accounts.add': 'Nueva Cuenta',
        'accounts.name': 'Nombre de la Cuenta',
        'accounts.type': 'Tipo de Cuenta',
        'accounts.balance': 'Saldo Inicial',
        'accounts.transfer': 'Transferir entre Cuentas',

        'notifications.title': 'Notificaciones',
        'notifications.budget_exceeded': 'Presupuesto Excedido',
        'notifications.warning': 'Advertencia',

        'charts.title': 'Análisis',
        'charts.pie': 'Pie',
        'charts.bar': 'Bar',
        'charts.line': 'Line',
        'charts.area': 'Area',

        'transaction.description': 'Descripción',
        'transaction.amount': 'Cantidad',
        'transaction.category': 'Categoría',
        'transaction.date': 'Fecha',
        'transaction.tags': 'Etiquetas',
    },
};

export function t(key: string, language: Language = 'de'): string {
    return translations[language]?.[key] || translations.de[key] || key;
}

export function useTranslation(language: Language) {
    return {
        t: (key: string) => t(key, language),
    };
}
