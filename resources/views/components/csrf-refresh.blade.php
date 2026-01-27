{{-- CSRF Token Auto-Refresh Component --}}
<script>
    // Refresh CSRF token periodically to prevent "Page Expired" errors
    (function() {
        const CSRF_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
        
        function refreshCsrfToken() {
            fetch('/csrf-token')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch CSRF token');
                    }
                    return response.json();
                })
                .then(data => {
                    // Update meta tag
                    const metaTag = document.querySelector('meta[name="csrf-token"]');
                    if (metaTag) {
                        metaTag.setAttribute('content', data.token);
                    }
                    
                    // Update form token
                    const csrfInput = document.querySelector('input[name="_token"]');
                    if (csrfInput) {
                        csrfInput.value = data.token;
                    }
                    
                    // Update Laravel global object if it exists
                    if (window.Laravel) {
                        window.Laravel.csrfToken = data.token;
                    }
                })
                .catch(error => {
                    console.error('Error refreshing CSRF token:', error);
                    // Show user-friendly notification
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg z-50';
                    notification.innerHTML = '⚠️ Session may have expired. Please refresh the page if you experience issues.';
                    document.body.appendChild(notification);
                    
                    // Auto-remove notification after 5 seconds
                    setTimeout(() => {
                        notification.remove();
                    }, 5000);
                });
        }
        
        // Start the refresh interval
        const intervalId = setInterval(refreshCsrfToken, CSRF_REFRESH_INTERVAL);
        
        // Clear interval when form is submitted to prevent unnecessary requests
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function() {
                clearInterval(intervalId);
            });
        });
    })();
</script>
