import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { vaultService } from '../api/client';
import { decrypt } from '../crypto/encryption';
import VaultItemCard from '../components/VaultItemCard';
import AddItemModal from '../components/AddItemModal';
import EditItemModal from '../components/EditItemModal';
import MasterPasswordModal from '../components/MasterPasswordModal';

function Vault() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [masterPassword, setMasterPassword] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [maxItems, setMaxItems] = useState(25);
    const [currentCount, setCurrentCount] = useState(0);
    const [canAddMore, setCanAddMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (masterPassword) {
            fetchVaultItems();
        }
    }, [masterPassword]);

    const fetchVaultItems = async () => {
        try {
            setLoading(true);
            const response = await vaultService.getItems();
            setItems(response.items || []);
            setMaxItems(response.max_items || 25);
            setCurrentCount(response.current_count || 0);
            setCanAddMore(response.can_add_more !== false);
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
            const response = await vaultService.createItem(itemData);
            setItems([response.item, ...items]);
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
            const response = await vaultService.updateItem(id, itemData);
            setItems(items.map(item => item.id === id ? response.item : item));
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
            await vaultService.deleteItem(id);
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

    const filteredItems = items.filter(item => {
        if (!searchTerm) return true;
        try {
            const decrypted = JSON.parse(decrypt(item.encrypted_data, masterPassword));
            return decrypted.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   decrypted.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   decrypted.url?.toLowerCase().includes(searchTerm.toLowerCase());
        } catch {
            return false;
        }
    });

    if (!masterPassword) {
        return <MasterPasswordModal onSubmit={handleMasterPasswordSubmit} />;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading vault...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Your Vault</h1>
                    <p className="text-gray-400">
                        {currentCount} / {maxItems === 9007199254740991 ? '∞' : maxItems} items
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    disabled={!canAddMore}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        canAddMore
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    + Add Item
                </button>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <input
                    type="text"
                    placeholder="Search your vault..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg"
                >
                    {error}
                </motion.div>
            )}

            {!canAddMore && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 px-4 py-3 rounded-lg"
                >
                    <p className="font-medium">Vault limit reached</p>
                    <p className="text-sm mt-1">
                        You have reached the maximum number of items for your plan.{' '}
                        <a href="/billing" className="underline hover:text-yellow-300">
                            Upgrade to add more items
                        </a>
                    </p>
                </motion.div>
            )}

            {/* Vault Items Grid */}
            {filteredItems.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <VaultItemCard
                                item={item}
                                masterPassword={masterPassword}
                                onEdit={() => setEditingItem(item)}
                                onDelete={() => handleDeleteItem(item.id)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl"
                >
                    <div className="text-6xl mb-4">🔐</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {searchTerm ? 'No items found' : 'Your vault is empty'}
                    </h3>
                    <p className="text-gray-400 mb-6">
                        {searchTerm
                            ? 'Try a different search term'
                            : 'Add your first password to get started'}
                    </p>
                    {!searchTerm && canAddMore && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                        >
                            Add Your First Item
                        </button>
                    )}
                </motion.div>
            )}

            {/* Modals */}
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

export default Vault;
