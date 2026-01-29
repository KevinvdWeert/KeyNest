import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { encrypt, decrypt, generatePassword } from '../crypto/encryption';

function EditItemModal({ item, masterPassword, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        title: '',
        username: '',
        password: '',
        url: '',
        notes: '',
        type: 'password',
        category: '',
        favorite: false,
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        decryptAndPopulate();
    }, [item, masterPassword]);

    const decryptAndPopulate = async () => {
        try {
            const decrypted = await decrypt(item.encrypted_data, masterPassword);
            const data = JSON.parse(decrypted);
            
            setFormData({
                title: data.title || item.title,
                username: data.username || '',
                password: data.password || '',
                url: data.url || '',
                notes: data.notes || '',
                type: item.type || 'password',
                category: item.category || '',
                favorite: item.favorite || false,
            });
            setLoading(false);
        } catch (err) {
            setError('Failed to decrypt item data');
            console.error(err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleGeneratePassword = () => {
        setFormData({
            ...formData,
            password: generatePassword(16),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const dataToEncrypt = {
                title: formData.title,
                username: formData.username,
                password: formData.password,
                url: formData.url,
                notes: formData.notes,
            };

            const encryptedData = await encrypt(JSON.stringify(dataToEncrypt), masterPassword);

            const result = await onUpdate(item.id, {
                title: formData.title,
                encrypted_data: encryptedData,
                type: formData.type,
                category: formData.category || null,
                favorite: formData.favorite,
            });

            if (!result.success) {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to update item. Please try again.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                        <p className="mt-4 text-gray-400">Decrypting...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">Edit Vault Item</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            >
                                <option value="password">Password</option>
                                <option value="note">Note</option>
                                <option value="card">Card</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Username / Email
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleGeneratePassword}
                                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                                title="Generate password"
                            >
                                🎲
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Website URL
                        </label>
                        <input
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="favorite"
                            checked={formData.favorite}
                            onChange={handleChange}
                            className="w-4 h-4 text-indigo-600 bg-gray-900 border-gray-700 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">
                            Mark as favorite
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                        >
                            {submitting ? 'Updating...' : 'Update Item'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default EditItemModal;
