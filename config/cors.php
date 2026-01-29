<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // Include SPA auth endpoints for local Vite dev (cross-origin requests)
    'paths' => ['api/*', 'login', 'register', 'logout', 'csrf-token', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // When supports_credentials is true, '*' is not allowed.
    'allowed_origins' => [
        'http://127.0.0.1:8000',
        'http://localhost:8000',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
