'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useBudgetStore } from '@/store/budgetStore';
import { Plus, Trash2, Tag } from 'lucide-react';

interface TagsState {
    tags: Record<string, string>;
}

export function TagsManager() {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        color: '#6366f1',
    });
    const [tagsState, setTagsState] = useState<TagsState>({
        tags: JSON.parse(localStorage.getItem('budget_tags') || '{}'),
    });

    const handleAddTag = () => {
        if (formData.name.trim()) {
            const newTags = {
                ...tagsState.tags,
                [formData.name.toLowerCase()]: formData.color,
            };
            setTagsState({ tags: newTags });
            localStorage.setItem('budget_tags', JSON.stringify(newTags));
            setFormData({ name: '', color: '#6366f1' });
            setShowModal(false);
        }
    };

    const handleDeleteTag = (tagName: string) => {
        const { [tagName]: _, ...rest } = tagsState.tags;
        setTagsState({ tags: rest });
        localStorage.setItem('budget_tags', JSON.stringify(rest));
    };

    return (
        <Card className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-outfit text-base font-semibold text-text-main flex items-center gap-2">
                    <Tag size={16} />
                    Labels & Tags
                </h3>
                <Button
                    size="sm"
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-1"
                >
                    <Plus size={16} />
                    Neu
                </Button>
            </div>

            {/* Tags List */}
            <div className="space-y-2 flex-1 overflow-y-auto">
                {Object.keys(tagsState.tags).length === 0 ? (
                    <div className="text-center py-8 text-text-dim text-sm">
                        Keine Tags erstellt
                    </div>
                ) : (
                    Object.entries(tagsState.tags).map(([name, color]) => (
                        <div
                            key={name}
                            className="p-3 rounded-xl bg-black/20 flex items-center justify-between hover:bg-black/30 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ background: color as string }}
                                />
                                <span className="text-sm text-text-main capitalize">{name}</span>
                            </div>
                            <button
                                onClick={() => handleDeleteTag(name)}
                                className="text-text-dim hover:text-danger transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Tag Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Neues Label"
            >
                <div className="space-y-4">
                    <Input
                        label="Label Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="z.B. Notwendig, Geschenk"
                    />

                    <div>
                        <label className="block text-xs font-semibold text-text-dim mb-2">Farbe</label>
                        <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-full h-12 rounded-xl border border-white/[0.08] cursor-pointer"
                        />
                    </div>

                    <Button onClick={handleAddTag} className="w-full">
                        Label Erstellen
                    </Button>
                </div>
            </Modal>
        </Card>
    );
}
