// API Client for TaskHub QA Sandbox
class ApiClient {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }


        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Network error' }));
                throw new Error(error.errors ? error.errors.map(e => e.msg).join(', ') : (error.error || `HTTP ${response.status}: ${response.statusText}`));
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
}

// Create global API client instance
const api = new ApiClient();

// Export for use in other modules
window.ApiClient = ApiClient;
window.api = api;
