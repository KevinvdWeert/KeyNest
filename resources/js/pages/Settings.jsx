import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getRememberMasterPassword, setRememberMasterPassword } from '../utils/securitySettings';

function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [rememberMasterPassword, setRememberMasterPasswordState] = useState(getRememberMasterPassword());

    const handleRememberMasterPasswordChange = (nextValue) => {
        setRememberMasterPasswordState(nextValue);
        setRememberMasterPassword(nextValue);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400 text-lg">Manage your account preferences</p>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="border-b border-gray-700"
            >
                <div className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
                            activeTab === 'profile'
                                ? 'border-indigo-500 text-white'
                                : 'border-transparent text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
                            activeTab === 'security'
                                ? 'border-indigo-500 text-white'
                                : 'border-transparent text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        Security
                    </button>
                </div>
            </motion.div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
                        <h2 className="text-2xl font-semibold text-white mb-6">Profile Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue={user?.name}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    defaultValue={user?.email}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="pt-4">
                                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
                        <h2 className="text-2xl font-semibold text-white mb-6">Change Password</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="pt-4">
                                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">Master Password</h2>
                        <p className="text-gray-400 mb-4">
                            Your master password is used to encrypt your vault. It is never stored on our servers.
                            Make sure to remember it, as we cannot recover it if lost.
                        </p>

                        <div className="mb-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-white font-medium">Remember master password (this session)</p>
                                    <p className="text-sm text-gray-400">
                                        Stores it in session storage so you don’t need to re-enter it when navigating.
                                        Not recommended on shared devices.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRememberMasterPasswordChange(!rememberMasterPassword)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                        rememberMasterPassword ? 'bg-indigo-600' : 'bg-gray-600'
                                    }`}
                                    aria-pressed={rememberMasterPassword}
                                    aria-label="Remember master password"
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                            rememberMasterPassword ? 'translate-x-5' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 px-4 py-3 rounded-lg">
                            <p className="font-medium">Important</p>
                            <p className="text-sm mt-1">
                                Changing your master password will require re-encrypting all your vault items.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default Settings;
