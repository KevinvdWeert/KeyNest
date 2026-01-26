<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscriptionLimit
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Only check limits for POST requests (creating new items)
        if ($request->isMethod('post')) {
            if (!$user->canAddVaultItem()) {
                return response()->json([
                    'error' => 'Vault limit reached',
                    'message' => 'You have reached the maximum number of vault items for your subscription plan. Please upgrade to add more items.',
                    'max_items' => $user->getMaxVaultItems(),
                    'current_count' => $user->vaultItems()->count(),
                    'upgrade_required' => true,
                ], 403);
            }
        }

        return $next($request);
    }
}
