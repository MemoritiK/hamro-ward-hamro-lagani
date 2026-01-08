class AuthManager {
    constructor() {
        this.subscribers = [];
        this.state = {
            isAuthenticated: !!localStorage.getItem('auth_token'),
            currentUser: JSON.parse(localStorage.getItem('current_user')) || null,
            isLoading: false,
            error: null
        };
    }

    /**
     * Subscribe to auth state changes
     * @param {Function} callback
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.subscribers.push(callback);
        callback(this.state); // Call immediately with current state
        
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    /**
     * Update auth state
     * @param {Object} newState
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifySubscribers();
    }

    /**
     * Notify all subscribers
     */
    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.state));
    }

    /**
     * Handle login success
     * @param {Object} user
     * @param {string} token
     */
    loginSuccess(user, token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('current_user', JSON.stringify(user));
        this.setState({
            isAuthenticated: true,
            currentUser: user,
            isLoading: false,
            error: null
        });
    }

    /**
     * Handle logout
     */
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        this.setState({
            isAuthenticated: false,
            currentUser: null,
            isLoading: false,
            error: null
        });
    }

    /**
     * Handle authentication error
     * @param {Error} error
     */
    authError(error) {
        this.setState({
            isLoading: false,
            error: error.message
        });
    }

    /**
     * Set loading state
     * @param {boolean} loading
     */
    setLoading(loading) {
        this.setState({ isLoading: loading });
    }
}

// Create singleton instance
const authManager = new AuthManager();

// Make available globally
if (typeof window !== 'undefined') {
    window.authManager = authManager;
    console.log('✅ authManager loaded');
}