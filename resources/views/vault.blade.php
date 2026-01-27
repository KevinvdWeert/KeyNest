@extends('layouts.app')

@section('title', 'Vault')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- React mounts here -->
    <div id="vault-root"></div>
</div>
@endsection

@section('scripts')
    @vite(['resources/js/vault.jsx'])
@endsection
