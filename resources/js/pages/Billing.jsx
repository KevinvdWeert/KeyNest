import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { billingService } from '../api/client';

function Billing() {
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            setLoading(true);
            const data = await billingService.getSubscription();
            setSubscription(data);
        } catch (err) {
            console.error('Failed to fetch subscription:', err);
            setError('Failed to load subscription information');
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (plan) => {
        try {
            const { url } = await billingService.createCheckoutSession(plan);
            window.location.href = url;
        } catch (err) {
            alert('Failed to create checkout session');
        }
    };

    const handleManageBilling = async () => {
        try {
            const { url } = await billingService.getPortalUrl();
            window.location.href = url;
        } catch (err) {
            alert('Failed to open billing portal');
        }
    };

    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            features: [
                'Up to 25 password items',
                '1 vault',
                'End-to-end encryption',
                'Web access',
            ],
            current: !subscription || subscription.plan === 'free',
        },
        {
            name: 'Pro',
            price: '$4.99',
            period: 'per month',
            stripePlan: 'pro',
            features: [
                'Unlimited password items',
                'Unlimited vaults',
                'Notes & secure storage',
                'Priority support',
            ],
            popular: true,
            current: subscription?.plan === 'pro',
        },
        {
            name: 'Pro+',
            price: '$9.99',
            period: 'per month',
            stripePlan: 'pro_plus',
            features: [
                'Everything in Pro',
                'File attachments',
                'Early access to new features',
                '24/7 dedicated support',
            ],
            current: subscription?.plan === 'pro_plus',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading subscription...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-white mb-2">Billing & Subscription</h1>
                <p className="text-gray-400 text-lg">
                    Manage your subscription and billing information
                </p>
            </motion.div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Current Plan */}
            {subscription && subscription.plan !== 'free' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6"
                >
                    <h2 className="text-2xl font-semibold text-white mb-4">Current Plan</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400">
                                You are currently on the <span className="text-white font-semibold">{subscription.plan}</span> plan
                            </p>
                            {subscription.ends_at && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {subscription.status === 'active' ? 'Renews' : 'Expires'} on {new Date(subscription.ends_at).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleManageBilling}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                        >
                            Manage Billing
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Plans Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {plans.map((plan, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className={`relative bg-gray-800/50 backdrop-blur border rounded-2xl p-6 ${
                            plan.popular
                                ? 'border-indigo-500 shadow-xl shadow-indigo-500/20'
                                : 'border-gray-700'
                        }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-semibold rounded-full">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="mb-2">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-gray-400 ml-2">/ {plan.period}</span>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start text-gray-300">
                                    <svg
                                        className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => plan.stripePlan && handleUpgrade(plan.stripePlan)}
                            disabled={plan.current || !plan.stripePlan}
                            className={`w-full py-3 rounded-lg font-semibold transition-all ${
                                plan.current
                                    ? 'bg-gray-700 text-gray-400 cursor-default'
                                    : plan.popular
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                            }`}
                        >
                            {plan.current ? 'Current Plan' : plan.stripePlan ? 'Upgrade' : 'Current Plan'}
                        </button>
                    </motion.div>
                ))}
            </motion.div>

            {/* FAQ */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6"
            >
                <h2 className="text-2xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-white mb-2">Can I cancel anytime?</h3>
                        <p className="text-gray-400 text-sm">
                            Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">What payment methods do you accept?</h3>
                        <p className="text-gray-400 text-sm">
                            We accept all major credit cards, debit cards, and other payment methods through Stripe.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-2">Is my data secure?</h3>
                        <p className="text-gray-400 text-sm">
                            Absolutely. All your data is encrypted end-to-end using AES-GCM encryption. We never have access to your plaintext passwords.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Billing;
