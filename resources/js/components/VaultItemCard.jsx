import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { decrypt } from '../crypto/encryption';

function VaultItemCard({ item, masterPassword, onEdit, onDelete }) {
    const [decryptedData, setDecryptedData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [decryptError, setDecryptError] = useState(false);
    const [copied, setCopied] = useState(null);

    useEffect(() => {
        decryptItemData();
    }, [item, masterPassword]);

    const decryptItemData = async () => {
        try {
            const decrypted = await decrypt(item.encrypted_data, masterPassword);
            setDecryptedData(JSON.parse(decrypted));
            setDecryptError(false);
        } catch (error) {
            console.error('Failed to decrypt item:', error);
            setDecryptError(true);
        }
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    if (decryptError) {
        return (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6">
                <p className="text-red-400 text-sm">
                    Failed to decrypt this item. Wrong master password?
                </p>
            </div>
        );
    }

    if (!decryptedData) {
        return (
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">
                        {decryptedData.title || item.title}
                    </h3>
                    {item.favorite && <span className="text-yellow-500">⭐</span>}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {item.category && (
                <span className="inline-block text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded mb-3">
                    {item.category}
                </span>
            )}

            <div className="space-y-3">
                {decryptedData.username && (
                    <div className="group">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 uppercase">Username</span>
                            <button
                                onClick={() => copyToClipboard(decryptedData.username, 'username')}
                                className="text-gray-500 hover:text-gray-300 transition-colors"
                                title="Copy username"
                            >
                                {copied === 'username' ? (
                                    <span className="text-green-400 text-xs">✓ Copied</span>
                                ) : (
                                    '📋'
                                )}
                            </button>
                        </div>
                        <p className="text-sm font-mono text-gray-300 mt-1">
                            {decryptedData.username}
                        </p>
                    </div>
                )}

                {decryptedData.password && (
                    <div className="group">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 uppercase">Password</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-500 hover:text-gray-300 transition-colors"
                                    title={showPassword ? 'Hide' : 'Show'}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(decryptedData.password, 'password')}
                                    className="text-gray-500 hover:text-gray-300 transition-colors"
                                    title="Copy password"
                                >
                                    {copied === 'password' ? (
                                        <span className="text-green-400 text-xs">✓ Copied</span>
                                    ) : (
                                        '📋'
                                    )}
                                </button>
                            </div>
                        </div>
                        <p className="text-sm font-mono text-gray-300 mt-1">
                            {showPassword ? decryptedData.password : '••••••••••••'}
                        </p>
                    </div>
                )}

                {decryptedData.url && (
                    <div className="group">
                        <span className="text-xs text-gray-500 uppercase block mb-1">URL</span>
                        <a
                            href={decryptedData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-400 hover:text-indigo-300 break-all"
                        >
                            {decryptedData.url}
                        </a>
                    </div>
                )}

                {decryptedData.notes && (
                    <div className="group">
                        <span className="text-xs text-gray-500 uppercase block mb-1">Notes</span>
                        <p className="text-sm text-gray-400">{decryptedData.notes}</p>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                    Updated {new Date(item.updated_at).toLocaleDateString()}
                </p>
            </div>
        </motion.div>
    );
}

export default VaultItemCard;
