'use client';

import { useState } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';
import { inventoryApi } from '../../lib/api';
import { getErrorMessage } from '../../lib/utils';

interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    lowStockThreshold: number;
    unit: string;
}

interface InventoryStepProps {
    onComplete: () => void;
    onNext: () => void;
}

export default function InventoryStep({ onComplete, onNext }: InventoryStepProps) {
    const [items, setItems] = useState<InventoryItem[]>([
        { id: '1', name: 'Massage Oil', quantity: 20, lowStockThreshold: 5, unit: 'bottles' },
        { id: '2', name: 'Clean Towels', quantity: 50, lowStockThreshold: 10, unit: 'pieces' },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const addItem = () => {
        const newItem: InventoryItem = {
            id: Date.now().toString(),
            name: '',
            quantity: 0,
            lowStockThreshold: 5,
            unit: 'pieces',
        };
        setItems(prev => [...prev, newItem]);
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateItem = (id: string, updates: Partial<InventoryItem>) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Save all inventory items
            for (const item of items) {
                if (item.name && item.quantity > 0) {
                    await inventoryApi.create({
                        name: item.name,
                        quantity: item.quantity,
                        lowStockThreshold: item.lowStockThreshold,
                        unit: item.unit,
                        isActive: true,
                    });
                }
            }
            onComplete();
            onNext();
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        onComplete();
        onNext();
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">
                    Set Up Inventory Tracking
                </h2>
                <p className="text-gray-600 mt-2">
                    Track supplies and get low stock alerts (optional)
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Inventory Items</h3>
                    <button
                        onClick={addItem}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">Add Item</span>
                    </button>
                </div>

                {items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Massage Oil"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Low Alert
                                </label>
                                <input
                                    type="number"
                                    value={item.lowStockThreshold}
                                    onChange={(e) => updateItem(item.id, { lowStockThreshold: parseInt(e.target.value) || 0 })}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Unit
                                </label>
                                <input
                                    type="text"
                                    value={item.unit}
                                    onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="bottles"
                                />
                            </div>
                            <div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Benefits:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Get alerts when items run low</li>
                    <li>• Track usage for each booking</li>
                    <li>• Dashboard shows current stock levels</li>
                </ul>
            </div>

            <div className="pt-6 flex space-x-4">
                <button
                    onClick={handleSkip}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300"
                >
                    Skip Inventory
                </button>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : 'Save Inventory'}
                </button>
            </div>
        </div>
    );
}