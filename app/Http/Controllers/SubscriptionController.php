<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Show the billing dashboard.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $subscription = $user->subscription('default');

        $data = [
            'user' => $user,
            'subscription' => $subscription,
            'plan' => $subscription ? $subscription->stripe_price : 'free',
            'status' => $subscription ? $subscription->stripe_status : null,
            'ends_at' => $subscription && $subscription->ends_at ? $subscription->ends_at->toDateString() : null,
        ];

        if ($request->expectsJson()) {
            return response()->json($data);
        }

        return view('billing.index', $data);
    }

    /**
     * Show the checkout page for a specific plan.
     */
    public function checkout(Request $request, string $plan)
    {
        $user = $request->user();

        $priceId = config("services.stripe.plans.{$plan}");

        if (! $priceId) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Invalid plan selected.'], 400);
            }
            return redirect()->back()->with('error', 'Invalid plan selected.');
        }

        $checkout = $user->newSubscription('default', $priceId)
            ->checkout([
                'success_url' => url('/billing?success=true'),
                'cancel_url' => url('/billing'),
            ]);

        if ($request->expectsJson()) {
            return response()->json(['url' => $checkout->url]);
        }

        return $checkout;
    }

    /**
     * Handle successful subscription.
     */
    public function success()
    {
        return view('billing.success');
    }

    /**
     * Show the portal for managing subscription.
     */
    public function portal(Request $request)
    {
        $portal = $request->user()->redirectToBillingPortal(url('/billing'));
        
        if ($request->expectsJson()) {
            return response()->json(['url' => $portal->url]);
        }
        
        return $portal;
    }

    /**
     * Cancel subscription.
     */
    public function cancel(Request $request)
    {
        $user = $request->user();
        $user->subscription('default')->cancel();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Subscription cancelled. You will have access until the end of your billing period.',
            ]);
        }

        return redirect()->route('billing.index')
            ->with('success', 'Subscription cancelled. You will have access until the end of your billing period.');
    }
}
