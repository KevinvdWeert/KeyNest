@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="py-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Welcome to KeyNest</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Vault Card -->
            <div class="bg-white overflow-hidden shadow-sm rounded-lg p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Vault Items
                            </dt>
                            <dd class="flex items-baseline">
                                <div class="text-2xl font-semibold text-gray-900">
                                    {{ auth()->user()->vaultItems()->count() }}
                                </div>
                                <div class="ml-2 text-sm text-gray-500">
                                    / {{ auth()->user()->getMaxVaultItems() === PHP_INT_MAX ? '∞' : auth()->user()->getMaxVaultItems() }}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
                <div class="mt-4">
                    <a href="{{ route('vault') }}" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Open Vault →
                    </a>
                </div>
            </div>

            <!-- Subscription Card -->
            <div class="bg-white overflow-hidden shadow-sm rounded-lg p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Current Plan
                            </dt>
                            <dd class="flex items-baseline">
                                <div class="text-2xl font-semibold text-gray-900">
                                    {{ auth()->user()->subscribed('default') ? 'PRO' : 'FREE' }}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
                <div class="mt-4">
                    <a href="{{ route('billing.index') }}" class="text-sm font-medium text-green-600 hover:text-green-500">
                        Manage Billing →
                    </a>
                </div>
            </div>

            <!-- Security Card -->
            <div class="bg-white overflow-hidden shadow-sm rounded-lg p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Encryption
                            </dt>
                            <dd class="text-2xl font-semibold text-gray-900">
                                AES-GCM
                            </dd>
                        </dl>
                    </div>
                </div>
                <div class="mt-4">
                    <span class="text-sm text-gray-500">
                        Client-side encrypted
                    </span>
                </div>
            </div>
        </div>

        <div class="mt-8 bg-white shadow-sm rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
            <div class="prose">
                <ul class="list-disc pl-5 space-y-2">
                    <li>Your passwords are encrypted on your device before being sent to our servers</li>
                    <li>We never have access to your plaintext passwords</li>
                    <li>Use a strong master password that you'll remember</li>
                    <li>Consider upgrading to PRO for unlimited storage</li>
                </ul>
            </div>
        </div>
    </div>
</div>
@endsection
