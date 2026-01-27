import React, { useState, useEffect } from 'react';
import { decrypt } from '../crypto/encryption';

function VaultItem({ item, masterPassword, onEdit, onDelete }) {
    const [decryptedData, setDecryptedData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [decryptError, setDecryptError] = useState(false);

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

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (decryptError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">Failed to decrypt this item. Wrong master password?</p>
            </div>
        );
    }

    if (!decryptedData) {
        return (
            <div className="bg-white shadow rounded-lg p-4">
                <p className="text-gray-500">Decrypting...</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        {item.favorite && (
                            <span className="text-yellow-500">⭐</span>
                        )}
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {item.type}
                        </span>
                    </div>

                    {item.category && (
                        <p className="text-sm text-gray-500 mb-3">
                            Category: {item.category}
                        </p>
                    )}

                    <div className="space-y-2">
                        {decryptedData.username && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 w-24">Username:</span>
                                <span className="text-sm font-mono text-gray-900">{decryptedData.username}</span>
                                <button
                                    onClick={() => copyToClipboard(decryptedData.username)}
                                    className="text-gray-400 hover:text-gray-600"
                                    title="Copy username"
                                >
                                    📋
                                </button>
                            </div>
                        )}

                        {decryptedData.password && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 w-24">Password:</span>
                                <span className="text-sm font-mono text-gray-900">
                                    {showPassword ? decryptedData.password : '••••••••'}
                                </span>
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600"
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(decryptedData.password)}
                                    className="text-gray-400 hover:text-gray-600"
                                    title="Copy password"
                                >
                                    📋
                                </button>
                            </div>
                        )}

                        {decryptedData.url && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 w-24">URL:</span>
                                <a
                                    href={decryptedData.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    {decryptedData.url}
                                </a>
                            </div>
                        )}

                        {decryptedData.notes && (
                            <div className="mt-2">
                                <span className="text-sm text-gray-600">Notes:</span>
                                <p className="text-sm text-gray-700 mt-1">{decryptedData.notes}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-3 text-xs text-gray-400">
                        Last updated: {new Date(item.updated_at).toLocaleDateString()}
                    </div>
                </div>

                <div className="flex gap-2 ml-4">
                    <button
                        onClick={() => onEdit(item)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VaultItem;
