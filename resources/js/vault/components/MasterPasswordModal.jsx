import React, { useState } from 'react';

function MasterPasswordModal({ onSubmit }) {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.trim()) {
            onSubmit(password);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Master Password</h2>
                    <p className="text-sm text-gray-600">
                        Enter your master password to unlock your vault. This password is used to encrypt/decrypt your data on your device.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter master password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg"
                    >
                        Unlock Vault
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Important: Your master password is never sent to our servers. All encryption happens on your device.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MasterPasswordModal;
