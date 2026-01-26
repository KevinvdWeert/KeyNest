<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VaultItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VaultController extends Controller
{
    /**
     * Display a listing of the user's vault items.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $vaultItems = $user->vaultItems()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'items' => $vaultItems,
            'max_items' => $user->getMaxVaultItems(),
            'current_count' => $vaultItems->count(),
            'can_add_more' => $user->canAddVaultItem(),
        ]);
    }

    /**
     * Store a newly created vault item.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'encrypted_data' => 'required|string',
            'type' => 'required|string|in:password,note,card,identity',
            'category' => 'nullable|string|max:255',
            'favorite' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        $vaultItem = $user->vaultItems()->create([
            'title' => $request->input('title'),
            'encrypted_data' => $request->input('encrypted_data'),
            'type' => $request->input('type'),
            'category' => $request->input('category'),
            'favorite' => $request->input('favorite', false),
        ]);

        return response()->json([
            'message' => 'Vault item created successfully',
            'item' => $vaultItem,
        ], 201);
    }

    /**
     * Update the specified vault item.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'encrypted_data' => 'sometimes|required|string',
            'type' => 'sometimes|required|string|in:password,note,card,identity',
            'category' => 'nullable|string|max:255',
            'favorite' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $vaultItem = $user->vaultItems()->find($id);

        if (!$vaultItem) {
            return response()->json([
                'error' => 'Vault item not found',
            ], 404);
        }

        $vaultItem->update($request->only([
            'title',
            'encrypted_data',
            'type',
            'category',
            'favorite',
        ]));

        return response()->json([
            'message' => 'Vault item updated successfully',
            'item' => $vaultItem,
        ]);
    }

    /**
     * Remove the specified vault item.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $vaultItem = $user->vaultItems()->find($id);

        if (!$vaultItem) {
            return response()->json([
                'error' => 'Vault item not found',
            ], 404);
        }

        $vaultItem->delete();

        return response()->json([
            'message' => 'Vault item deleted successfully',
        ]);
    }
}
