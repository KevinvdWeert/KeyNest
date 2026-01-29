import React, { useState } from 'react';
import { motion } from 'framer-motion';

function MasterPasswordModal({ onSubmit }) {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.trim()) {
            onSubmit(password);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md w-full"
            >
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">Master Password</h2>
                    <p className="text-sm text-gray-400">
                        Enter your master password to unlock your vault.
                        This password encrypts your data on your device.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter master password"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            autoFocus
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
                    >
                        Unlock Vault
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Important: Your master password is never sent to our servers.
                        All encryption happens on your device.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default MasterPasswordModal;
