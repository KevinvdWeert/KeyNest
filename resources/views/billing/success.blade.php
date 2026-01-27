@extends('layouts.app')

@section('title', 'Subscription Success')

@section('content')
<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-md w-full">
        <div class="bg-white shadow-md rounded-lg px-8 py-6 text-center">
            <div class="mb-4">
                <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Subscription Successful!</h2>
            <p class="text-gray-600 mb-6">
                Thank you for subscribing to KeyNest PRO. Your account has been upgraded and you now have access to all PRO features.
            </p>
            <div class="space-y-3">
                <a href="{{ route('vault') }}" class="block w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Go to Vault
                </a>
                <a href="{{ route('dashboard') }}" class="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                    Go to Dashboard
                </a>
            </div>
        </div>
    </div>
</div>
@endsection
