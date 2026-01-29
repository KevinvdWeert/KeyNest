<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>KeyNest - Your Personal Password Manager</title>
    @vite(['resources/css/app.css'])
</head>
<body class="antialiased">
    <div id="root"></div>
    
    <script>
        // Provide Laravel data to React app
        window.Laravel = {
            csrfToken: '{{ csrf_token() }}',
            user: @json(auth()->user()),
        };
    </script>
    
    @vite(['resources/js/main.jsx'])
</body>
</html>
