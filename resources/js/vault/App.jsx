import React, { useState, useEffect } from 'react';
import VaultList from './components/VaultList';
import AddItemModal from './components/AddItemModal';
import EditItemModal from './components/EditItemModal';
import MasterPasswordModal from './components/MasterPasswordModal';

function App() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [masterPassword, setMasterPassword] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [maxItems, setMaxItems] = useState(25);
    const [currentCount, setCurrentCount] = useState(0);
    const [canAddMore, setCanAddMore] = useState(true);

    useEffect(() => {
        if (masterPassword) {
            fetchVaultItems();
        }
    }, [masterPassword]);

    const fetchVaultItems = async () => {
        try {
            setLoading(true);
            const response = await window.axios.get('/api/vault');
            setItems(response.data.items);
            setMaxItems(response.data.max_items);
            setCurrentCount(response.data.current_count);
            setCanAddMore(response.data.can_add_more);
            setError(null);
        } catch (err) {
            setError('Failed to load vault items');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (itemData) => {
        try {
            const response = await window.axios.post('/api/vault', itemData);
            setItems([response.data.item, ...items]);
            setCurrentCount(currentCount + 1);
            setCanAddMore(currentCount + 1 < maxItems);
            setShowAddModal(false);
            return { success: true };
        } catch (err) {
            if (err.response && err.response.data.upgrade_required) {
                return { 
                    success: false, 
                    error: err.response.data.message,
                    upgradeRequired: true 
                };
            }
            return { 
                success: false, 
                error: err.response?.data?.message || 'Failed to add item' 
            };
        }
    };

    const handleUpdateItem = async (id, itemData) => {
        try {
            const response = await window.axios.put(`/api/vault/${id}`, itemData);
            setItems(items.map(item => item.id === id ? response.data.item : item));
            setEditingItem(null);
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || 'Failed to update item' 
            };
        }
    };

    const handleDeleteItem = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            await window.axios.delete(`/api/vault/${id}`);
            setItems(items.filter(item => item.id !== id));
            setCurrentCount(currentCount - 1);
            setCanAddMore(true);
        } catch (err) {
            setError('Failed to delete item');
            console.error(err);
        }
    };

    const handleMasterPasswordSubmit = (password) => {
        setMasterPassword(password);
    };

    if (!masterPassword) {
        return <MasterPasswordModal onSubmit={handleMasterPasswordSubmit} />;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading vault...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Your Vault</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {currentCount} / {maxItems === 9007199254740991 ? '∞' : maxItems} items
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    disabled={!canAddMore}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        canAddMore
                            ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    + Add Item
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!canAddMore && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    <p className="font-medium">Vault limit reached</p>
                    <p className="text-sm">
                        You have reached the maximum number of items for your plan. 
                        <a href="/billing" className="underline ml-1">Upgrade to add more items</a>
                    </p>
                </div>
            )}

            <VaultList
                items={items}
                masterPassword={masterPassword}
                onEdit={setEditingItem}
                onDelete={handleDeleteItem}
            />

            {showAddModal && (
                <AddItemModal
                    masterPassword={masterPassword}
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddItem}
                />
            )}

            {editingItem && (
                <EditItemModal
                    item={editingItem}
                    masterPassword={masterPassword}
                    onClose={() => setEditingItem(null)}
                    onUpdate={handleUpdateItem}
                />
            )}
        </div>
    );
}

export default App;
