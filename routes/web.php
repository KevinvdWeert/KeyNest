<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// CSRF Token Refresh Route (with rate limiting)
Route::get('/csrf-token', function () {
    return response()->json(['token' => csrf_token()]);
})->name('csrf-token')->middleware('throttle:60,1');

// Authentication Routes (API-style, no views)
Route::middleware('guest')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Billing Routes (redirect to React app)
Route::middleware('auth')->prefix('billing')->name('billing.')->group(function () {
    Route::get('/checkout/{plan}', [SubscriptionController::class, 'checkout'])->name('checkout');
    Route::get('/portal', [SubscriptionController::class, 'portal'])->name('portal');
    Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
});

// SPA Catch-all - React Router handles all routes
Route::get('/{path?}', function () {
    return view('app');
})->where('path', '.*')->name('app');
