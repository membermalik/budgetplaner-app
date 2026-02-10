'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useBudgetStore } from '@/store/budgetStore';
import { Notification } from '@/types';
import { Bell, AlertTriangle, Info, CheckCircle, AlertCircle, X } from 'lucide-react';

export function NotificationsCenter() {
    const { transactions, categories, settings, getCategoryBudgetStatus } = useBudgetStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showPanel, setShowPanel] = useState(false);

    useEffect(() => {
        generateNotifications();
    }, [transactions, categories]);

    const generateNotifications = () => {
        const newNotifications: Notification[] = [];

        // Check budget limits
        Object.keys(categories).forEach((category) => {
            const budget = getCategoryBudgetStatus(category);
            if (budget.limit > 0) {
                const percentage = budget.percentage;

                if (percentage > 100) {
                    newNotifications.push({
                        id: `budget-over-${category}`,
                        type: 'warning',
                        title: 'Budget überschritten',
                        message: `${categories[category]?.label} hat das Budget um ${((budget.used - budget.limit).toFixed(2))} € überschritten`,
                        timestamp: new Date().toISOString(),
                        read: false,
                    });
                } else if (percentage > 80) {
                    newNotifications.push({
                        id: `budget-warn-${category}`,
                        type: 'error',
                        title: 'Budget-Warnung',
                        message: `${categories[category]?.label} hat ${percentage.toFixed(0)}% des Budgets verwendet`,
                        timestamp: new Date().toISOString(),
                        read: false,
                    });
                }
            }
        });

        setNotifications(newNotifications);
    };

    const removeNotification = (id: string) => {
        setNotifications(notifications.filter((n) => n.id !== id));
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'warning':
                return <AlertTriangle size={18} className="text-warning" />;
            case 'error':
                return <AlertCircle size={18} className="text-danger" />;
            case 'success':
                return <CheckCircle size={18} className="text-success" />;
            default:
                return <Info size={18} className="text-accent" />;
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <>
            {/* Notification Bell Button */}
            <div className="relative">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowPanel(!showPanel)}
                    title="Benachrichtigungen"
                    className="relative w-12 h-12 p-0 rounded-full flex items-center justify-center bg-surface hover:bg-surface-hover border-surface-border transition-all"
                >
                    <div className="relative">
                        <Bell size={24} className="text-text-dim hover:text-text-main transition-colors" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full border-2 border-surface"></span>
                        )}
                    </div>
                </Button>

                {/* Notification Panel */}
                {showPanel && (
                    <div className="absolute right-0 top-full mt-4 w-[min(100vw_-_32px,380px)] max-h-[500px] overflow-y-auto rounded-2xl bg-card-bg border border-surface-border shadow-card z-[100] animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="p-4 border-b border-surface-border flex justify-between items-center">
                            <h4 className="font-outfit font-bold text-text-main">Benachrichtigungen</h4>
                            <button onClick={() => setShowPanel(false)} className="text-text-dim hover:text-text-main">
                                <X size={18} />
                            </button>
                        </div>

                        {notifications.length > 0 ? (
                            <div className="space-y-2 p-2">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="p-3 rounded-xl bg-surface hover:bg-surface-hover border border-surface-border flex items-start gap-3 transition-colors"
                                    >
                                        {getIcon(notification.type)}
                                        <div className="flex-1">
                                            <p className="font-outfit font-semibold text-text-main text-sm">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-text-dim mt-1">
                                                {notification.message}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeNotification(notification.id)}
                                            className="text-text-dim hover:text-text-main transition-colors p-1"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center mb-3 text-text-dim">
                                    <Bell size={20} />
                                </div>
                                <p className="text-text-main font-semibold text-sm">Alles ruhig</p>
                                <p className="text-xs text-text-dim mt-1">Keine neuen Nachrichten.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
