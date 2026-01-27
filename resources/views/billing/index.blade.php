@extends('layouts.app')

@section('title', 'Billing')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Billing & Subscription</h1>

    @if(session('success'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ session('success') }}
        </div>
    @endif

    @if(session('error'))
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ session('error') }}
        </div>
    @endif

    <!-- Current Subscription -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
        @if($subscription && $subscription->active())
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-2xl font-bold text-indigo-600">PRO Plan</p>
                    <p class="text-sm text-gray-600 mt-1">
                        Status: <span class="font-medium">{{ ucfirst($subscription->stripe_status) }}</span>
                    </p>
                    @if($subscription->onGracePeriod())
                        <p class="text-sm text-orange-600 mt-1">
                            Subscription ends on {{ $subscription->ends_at->format('F j, Y') }}
                        </p>
                    @endif
                </div>
                <div>
                    <a href="{{ route('billing.portal') }}" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded">
                        Manage Subscription
                    </a>
                </div>
            </div>
        @else
            <div>
                <p class="text-2xl font-bold text-gray-600">FREE Plan</p>
                <p class="text-sm text-gray-600 mt-1">
                    Limited to 25 vault items
                </p>
            </div>
        @endif
    </div>

    <!-- Available Plans -->
    @if(!$subscription || !$subscription->active())
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- FREE Plan -->
        <div class="bg-white shadow-sm rounded-lg p-6 border-2 border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-2">FREE</h3>
            <p class="text-3xl font-bold text-gray-900 mb-4">€0<span class="text-sm font-normal text-gray-600">/month</span></p>
            <ul class="space-y-2 mb-6">
                <li class="flex items-start">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm text-gray-600">Max 25 password entries</span>
                </li>
                <li class="flex items-start">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm text-gray-600">1 vault</span>
                </li>
                <li class="flex items-start">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm text-gray-600">Manual sync</span>
                </li>
            </ul>
            <button disabled class="w-full bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded cursor-not-allowed">
                Current Plan
            </button>
        </div>

        <!-- PRO Plan -->
        <div class="bg-white shadow-sm rounded-lg p-6 border-2 border-indigo-500 relative">
            <div class="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-xs font-bold rounded-bl">
                POPULAR
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">PRO</h3>
            <p class="text-3xl font-bold text-gray-900 mb-4">€3<span class="text-sm font-normal text-gray-600">/month</span></p>
            <ul class="space-y-2 mb-6">
                <li class="flex items-start">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm text-gray-600">Unlimited password entries</span>
                </li>
                <li class="flex items-start">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm text-gray-600">Unlimited vaults</span>
                </li>
                <li class="flex items-start">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm text-gray-600">Encrypted notes</span>
                </li>
                <li class="flex items-start">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm text-gray-600">Automatic cross-device sync</span>
                </li>
            </ul>
            <a href="{{ route('billing.checkout', 'pro') }}" class="block w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-center">
                Upgrade to PRO
            </a>
        </div>

        <!-- PRO+ Plan -->
        <div class="bg-white shadow-sm rounded-lg p-6 border-2 border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-2">PRO+</h3>
            <p class="text-3xl font-bold text-gray-900 mb-4">€6<span class="text-sm font-normal text-gray-600">/month</span></p>
            <ul class="space-y-2 mb-6">
                <li class="flex items-start">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm text-gray-600">Everything in PRO</span>
                </li>
                <li class="flex items-start">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm text-gray-600">Encrypted file attachments</span>
                </li>
                <li class="flex items-start">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm text-gray-600">Optional read-only vault sharing</span>
                </li>
                <li class="flex items-start">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-sm text-gray-600">Early access to new features</span>
                </li>
            </ul>
            <a href="{{ route('billing.checkout', 'pro_plus') }}" class="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded text-center">
                Upgrade to PRO+
            </a>
        </div>
    </div>
    @endif
</div>
@endsection
