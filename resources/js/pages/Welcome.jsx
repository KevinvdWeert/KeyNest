import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

function IconShield(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
    );
}

function IconBolt(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-1 8 12-14h-7l1-6z" />
        </svg>
    );
}

function IconGem(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l4-6h10l4 6-9 12L3 9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3l3 6 3-6" />
        </svg>
    );
}

function Welcome() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
            {/* Navigation */}
            <nav className="absolute top-0 right-0 p-6 z-10">
                {isAuthenticated ? (
                    <Link
                        to="/dashboard"
                        className="px-6 py-2 text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <div className="space-x-4">
                        <Link
                            to="/login"
                            className="px-6 py-2 text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div className="relative flex items-center justify-center min-h-screen px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="h-20 w-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                            <IconShield className="h-10 w-10 text-indigo-300" />
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-6xl md:text-7xl font-bold text-white mb-6"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                            KeyNest
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
                    >
                        Your personal password manager.
                        <br />
                        <span className="text-indigo-400">Secure, encrypted, and always accessible.</span>
                    </motion.p>

                    {/* CTA Buttons */}
                    {!isAuthenticated && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white text-lg font-semibold rounded-xl transition-all border border-gray-700 hover:border-indigo-600"
                            >
                                Sign In
                            </Link>
                        </motion.div>
                    )}

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
                    >
                        <div className="p-6 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
                            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4">
                                <IconShield className="h-5 w-5 text-indigo-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                End-to-End Encryption
                            </h3>
                            <p className="text-gray-400">
                                Your passwords are encrypted client-side with AES-GCM
                            </p>
                        </div>

                        <div className="p-6 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
                            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4">
                                <IconBolt className="h-5 w-5 text-indigo-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Fast & Intuitive
                            </h3>
                            <p className="text-gray-400">
                                Modern interface with smooth animations and quick access
                            </p>
                        </div>

                        <div className="p-6 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
                            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4">
                                <IconGem className="h-5 w-5 text-indigo-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Flexible Plans
                            </h3>
                            <p className="text-gray-400">
                                Start free, upgrade as you grow with Pro and Pro+ plans
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default Welcome;
