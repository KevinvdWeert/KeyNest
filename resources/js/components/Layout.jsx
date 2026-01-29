import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

function Layout() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navigation */}
            <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            {/* Logo */}
                            <NavLink 
                                to="/dashboard" 
                                className="flex items-center space-x-2 text-xl font-bold text-white hover:text-indigo-400 transition-colors"
                            >
                                <span>KeyNest</span>
                            </NavLink>

                            {/* Navigation Links */}
                            <div className="hidden md:flex space-x-1">
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    to="/vault"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`
                                    }
                                >
                                    Vault
                                </NavLink>
                                <NavLink
                                    to="/billing"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`
                                    }
                                >
                                    Billing
                                </NavLink>
                                <NavLink
                                    to="/settings"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`
                                    }
                                >
                                    Settings
                                </NavLink>
                            </div>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-300 hidden sm:block">
                                {user?.name}
                            </span>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

export default Layout;
