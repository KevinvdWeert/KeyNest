import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
    const { user } = useAuth();

    const cards = [
        {
            title: 'Vault',
            description: 'Manage your passwords securely',
            icon: '🔐',
            link: '/vault',
            color: 'from-indigo-600 to-indigo-700',
        },
        {
            title: 'Billing',
            description: 'Manage your subscription',
            icon: '💳',
            link: '/billing',
            color: 'from-purple-600 to-purple-700',
        },
        {
            title: 'Settings',
            description: 'Update your preferences',
            icon: '⚙️',
            link: '/settings',
            color: 'from-blue-600 to-blue-700',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-400 text-lg">
                    Your password vault is secure and ready to use.
                </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {cards.map((card, index) => (
                    <Link
                        key={index}
                        to={card.link}
                        className="group"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            className={`p-6 bg-gradient-to-br ${card.color} rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-white/10`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="text-5xl">{card.icon}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white mb-1">
                                        {card.title}
                                    </h3>
                                    <p className="text-indigo-100 text-sm">
                                        {card.description}
                                    </p>
                                </div>
                                <svg
                                    className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>

            {/* Security Notice */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6"
            >
                <div className="flex items-start space-x-4">
                    <div className="text-3xl">🔒</div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                            End-to-End Encryption
                        </h3>
                        <p className="text-gray-400">
                            All your passwords are encrypted on your device using AES-GCM encryption.
                            Your master password never leaves your device, and we never have access to your plaintext data.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6"
            >
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        to="/vault"
                        className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl border border-gray-600 transition-all group"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">➕</span>
                            <div>
                                <h4 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                    Add New Password
                                </h4>
                                <p className="text-sm text-gray-400">Secure a new login</p>
                            </div>
                        </div>
                    </Link>
                    <Link
                        to="/vault"
                        className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl border border-gray-600 transition-all group"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">🔍</span>
                            <div>
                                <h4 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                    Search Vault
                                </h4>
                                <p className="text-sm text-gray-400">Find your passwords</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default Dashboard;
