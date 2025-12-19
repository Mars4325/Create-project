// API Client for TaskHub QA Sandbox
class ApiClient {
    constructor(baseURL = '') {
        // If no baseURL provided and we're on localhost or file://, use localhost:3000
        if (!baseURL) {
            if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '') {
                this.baseURL = 'http://localhost:3000';
            } else {
                this.baseURL = window.location.origin;
            }
        } else {
            this.baseURL = baseURL;
        }
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem('authToken');


        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add authorization header if token exists
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }


        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Network error' }));

                // Handle validation errors
                if (error.errors && Array.isArray(error.errors)) {
                    const errorMessages = error.errors.map(e => e.msg || e.message).join(', ');
                    throw new Error(errorMessages);
                }

                // Handle single error message
                if (error.error) {
                    throw new Error(error.error);
                }

                // Handle other error formats
                if (error.message) {
                    throw new Error(error.message);
                }

                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Users API
    async getUsers() {
        return this.request('/api/users');
    }

    async getUser(id) {
        return this.request(`/api/users/${id}`);
    }

    async createUser(userData) {
        return this.request('/api/users', {
            method: 'POST',
            body: userData
        });
    }

    async updateUser(id, userData) {
        return this.request(`/api/users/${id}`, {
            method: 'PUT',
            body: userData
        });
    }

    async deleteUser(id) {
        return this.request(`/api/users/${id}`, {
            method: 'DELETE'
        });
    }

    // Projects API
    async getProjects() {
        return this.request('/api/projects');
    }

    async getProject(id) {
        return this.request(`/api/projects/${id}`);
    }

    async getProjectsByOwner(ownerId) {
        return this.request(`/api/projects/owner/${ownerId}`);
    }

    async createProject(projectData) {
        return this.request('/api/projects', {
            method: 'POST',
            body: projectData
        });
    }

    async updateProject(id, projectData) {
        return this.request(`/api/projects/${id}`, {
            method: 'PUT',
            body: projectData
        });
    }

    async deleteProject(id) {
        return this.request(`/api/projects/${id}`, {
            method: 'DELETE'
        });
    }

    // Test Cases API
    async getTestCases(filters = {}) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const queryString = params.toString();
        return this.request(`/api/test-cases${queryString ? '?' + queryString : ''}`);
    }

    async getTestCase(id) {
        return this.request(`/api/test-cases/${id}`);
    }

    async getTestCasesByProject(projectId) {
        return this.request(`/api/test-cases/project/${projectId}`);
    }

    async getTestCasesByAssignedUser(userId) {
        return this.request(`/api/test-cases/assigned/${userId}`);
    }

    async getTestCaseStats(projectId) {
        return this.request(`/api/test-cases/project/${projectId}/stats`);
    }

    async createTestCase(testCaseData) {
        return this.request('/api/test-cases', {
            method: 'POST',
            body: testCaseData
        });
    }

    async updateTestCase(id, testCaseData) {
        return this.request(`/api/test-cases/${id}`, {
            method: 'PUT',
            body: testCaseData
        });
    }

    async deleteTestCase(id) {
        return this.request(`/api/test-cases/${id}`, {
            method: 'DELETE'
        });
    }

    // Authentication methods
    async login(credentials) {
        const response = await fetch(`${this.baseURL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Login failed' }));
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        if (data.success && data.data.token) {
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.data.user));
        }
        return data;
    }

    async register(userData) {
        const response = await fetch(`${this.baseURL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Registration failed' }));
            throw new Error(error.error || 'Registration failed');
        }

        const data = await response.json();
        if (data.success && data.data.token) {
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.data.user));
        }
        return data;
    }

    async logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        return { success: true };
    }

    async getCurrentUser() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No token found');
        }

        return this.request('/api/auth/me');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    // Get stored user data
    getCurrentUserData() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    // Get auth token
    getToken() {
        return localStorage.getItem('authToken');
    }
}

// Create global API client instance
const api = new ApiClient();

// Export for use in other modules
window.ApiClient = ApiClient;
window.api = api;
