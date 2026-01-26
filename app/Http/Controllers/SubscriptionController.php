<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Show the billing dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        return view('billing.index', [
            'user' => $user,
            'subscription' => $user->subscription('default'),
        ]);
    }

    /**
     * Show the checkout page for a specific plan.
     */
    public function checkout(Request $request, string $plan)
    {
        $user = $request->user();
        
        $priceId = config("services.stripe.plans.{$plan}");
        
        if (!$priceId) {
            return redirect()->back()->with('error', 'Invalid plan selected.');
        }

        return $user->newSubscription('default', $priceId)
            ->checkout([
                'success_url' => route('billing.success'),
                'cancel_url' => route('billing.index'),
            ]);
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
        return $request->user()->redirectToBillingPortal(route('billing.index'));
    }

    /**
     * Cancel subscription.
     */
    public function cancel(Request $request)
    {
        $user = $request->user();
        $user->subscription('default')->cancel();

        return redirect()->route('billing.index')
            ->with('success', 'Subscription cancelled. You will have access until the end of your billing period.');
    }
}
