<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vault_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title'); // Encrypted with Laravel Encryption
            $table->text('encrypted_data'); // Client-side encrypted password data
            $table->string('type')->default('password'); // password, note, etc.
            $table->string('category')->nullable(); // Encrypted with Laravel Encryption
            $table->boolean('favorite')->default(false);
            $table->timestamps();

            $table->index('user_id');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vault_items');
    }
};
