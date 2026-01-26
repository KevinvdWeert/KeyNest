<?php

use App\Http\Controllers\Api\VaultController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Vault API routes with subscription limit checking
    Route::middleware('check.subscription.limit')->group(function () {
        Route::get('/vault', [VaultController::class, 'index']);
        Route::post('/vault', [VaultController::class, 'store']);
        Route::put('/vault/{id}', [VaultController::class, 'update']);
        Route::delete('/vault/{id}', [VaultController::class, 'destroy']);
    });
});
