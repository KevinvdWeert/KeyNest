import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

function IconLock(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M7 11V8a5 5 0 0110 0v3" />
            <path d="M6 11h12v10H6z" />
            <path d="M12 15v2" />
        </svg>
    );
}

function IconCard(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5v-9z" />
            <path d="M3 9h18" />
            <path d="M7 15h4" />
        </svg>
    );
}

function IconCog(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
            <path d="M19.4 15a7.7 7.7 0 00.14-1.5c0-.5-.05-1-.14-1.5l2.06-1.2-2-3.46-2.36.78a7.7 7.7 0 00-2.6-1.5L14.9 5h-3.8l-.6 2.35a7.7 7.7 0 00-2.6 1.5L5.54 8.07l-2 3.46 2.06 1.2c-.09.5-.14 1-.14 1.5 0 .5.05 1 .14 1.5l-2.06 1.2 2 3.46 2.36-.78a7.7 7.7 0 002.6 1.5L11.1 21h3.8l.6-2.35a7.7 7.7 0 002.6-1.5l2.36.78 2-3.46L19.4 15z" />
        </svg>
    );
}

function IconPlus(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
        </svg>
    );
}

function IconSearch(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
        </svg>
    );
}

function Dashboard() {
    const { user } = useAuth();

    const cards = [
        {
            title: 'Vault',
            description: 'Manage your passwords securely',
            icon: IconLock,
            link: '/vault',
            color: 'from-indigo-600 to-indigo-700',
        },
        {
            title: 'Billing',
            description: 'Manage your subscription',
            icon: IconCard,
            link: '/billing',
            color: 'from-purple-600 to-purple-700',
        },
        {
            title: 'Settings',
            description: 'Update your preferences',
            icon: IconCog,
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
                                <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                                    <card.icon className="h-6 w-6 text-white" />
                                </div>
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
                    <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                        <IconLock className="h-5 w-5 text-indigo-300" />
                    </div>
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
                            <span className="h-9 w-9 rounded-lg bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-200">
                                <IconPlus className="h-5 w-5" />
                            </span>
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
                            <span className="h-9 w-9 rounded-lg bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-200">
                                <IconSearch className="h-5 w-5" />
                            </span>
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
