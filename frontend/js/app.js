// Main application logic for TaskHub QA Sandbox

// Global state
let currentUsers = [];
let currentProjects = [];
let currentTestCases = [];

// Export global state for access from other modules
window.currentProjects = currentProjects;
window.currentUsers = currentUsers;
window.currentTestCases = currentTestCases;

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatStatus(status) {
    const statusMap = {
        'draft': 'Черновик',
        'review': 'На проверке',
        'approved': 'Одобрен',
        'in_progress': 'В работе',
        'passed': 'Пройден',
        'failed': 'Провален',
        'blocked': 'Заблокирован'
    };
    return statusMap[status] || status;
}

function formatPriority(priority) {
    const priorityMap = {
        'low': 'Низкий',
        'medium': 'Средний',
        'high': 'Высокий',
        'critical': 'Критический'
    };
    return priorityMap[priority] || priority;
}

function getStatusClass(status) {
    return `status-${status}`;
}

function getPriorityClass(priority) {
    return `priority-${priority}`;
}

function createActionButtons(item, type) {
    if (!item || !item.id) {
        console.error('Invalid item passed to createActionButtons:', item);
        return '<div class="action-buttons">Ошибка</div>';
    }

    return `
        <div class="action-buttons">
            <button class="btn-view" data-action="view" data-id="${item.id}" data-type="${type}" title="Просмотр">👁</button>
            <button class="btn-edit" data-action="edit" data-id="${item.id}" data-type="${type}" title="Редактировать">✏</button>
            <button class="btn-delete" data-action="delete" data-id="${item.id}" data-type="${type}" title="Удалить">🗑</button>
        </div>
    `;
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 TaskHub QA Sandbox frontend initializing...');

    // Set up modal close handlers
    setupModalHandlers();

    // Set up form handlers
    setupFormHandlers();

    // Check authentication status first
    checkAuthStatus();

    console.log('✅ Frontend initialized successfully');
});

function initializeApp() {
    console.log('📊 Initializing authenticated application...');
    // Load initial data
    loadDashboardData();

    // Show dashboard by default
    showSection('dashboard');

    console.log('✅ Authenticated application initialized successfully');
}

// Load dashboard statistics
async function loadDashboardData() {
    const token = window.api.getToken();

    // If no token, set empty data and return
    if (!token) {
        console.log('No token available, setting empty dashboard data');
        setEmptyDashboardData();
        return;
    }

    try {
        // Load all data in parallel
        const [usersResult, projectsResult, testCasesResult] = await Promise.allSettled([
            window.api.getUsers(),
            window.api.getProjects(),
            window.api.getTestCases({})
        ]);


        // Update statistics
        const usersCount = usersResult.status === 'fulfilled' ? usersResult.value.data.length : 0;
        const projectsCount = projectsResult.status === 'fulfilled' ? projectsResult.value.data.length : 0;
        const testCasesCount = testCasesResult.status === 'fulfilled' ? testCasesResult.value.data.length : 0;

        // Store data globally for use in other functions
        if (usersResult.status === 'fulfilled') {
            window.currentUsers = usersResult.value.data;
        } else {
            window.currentUsers = [];
        }

        if (projectsResult.status === 'fulfilled') {
            window.currentProjects = projectsResult.value.data;
        } else {
            window.currentProjects = [];
        }

        if (testCasesResult.status === 'fulfilled') {
            window.currentTestCases = testCasesResult.value.data;
        } else {
            window.currentTestCases = [];
        }

        // Update UI
        document.getElementById('users-count').textContent = usersCount;
        document.getElementById('projects-count').textContent = projectsCount;
        document.getElementById('test-cases-count').textContent = testCasesCount;
        document.getElementById('active-tests-count').textContent = 0;


    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        setEmptyDashboardData();
    }
}

// Set empty data for dashboard when not authenticated
function setEmptyDashboardData() {
    // Clear global data
    window.currentUsers = [];
    window.currentProjects = [];
    window.currentTestCases = [];

    // Update UI with zeros
    const elements = ['users-count', 'projects-count', 'test-cases-count', 'active-tests-count'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '0';
        }
    });
}

// Navigation function
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Find and activate the corresponding nav button
    const navBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn =>
        btn.textContent.toLowerCase().includes(sectionId.replace('-', ' '))
    );
    if (navBtn) {
        navBtn.classList.add('active');
    }

    // Load data for the section
    loadSectionData(sectionId);
}

// Load section data
function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'users':
            loadUsers();
            break;
        case 'projects':
            loadProjects();
            break;
        case 'test-cases':
            loadTestCases();
            break;
        case 'dashboard':
            loadDashboardData();
            break;
    }
}

// Load users data
async function loadUsers() {
    if (!window.api.isAuthenticated()) {
        renderUsersTable([]);
        return;
    }

    try {
        const result = await window.api.getUsers();
        currentUsers = result.data || [];
        renderUsersTable(currentUsers);
    } catch (error) {
        console.error('Error loading users:', error);
        // Show empty table on error
        renderUsersTable([]);
    }
}

// Render users table
function renderUsersTable(users) {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">Пользователи не найдены</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${formatDate(user.created_at)}</td>
            <td>${createActionButtons(user, 'user')}</td>
        </tr>
    `).join('');
}

// Load projects data
async function loadProjects() {
    if (!window.api.isAuthenticated()) {
        renderProjectsTable([]);
        return;
    }

    try {
        const result = await window.api.getProjects();
        currentProjects = result.data || [];
        renderProjectsTable(currentProjects);

        // Update project filter for test cases
        updateProjectFilter(currentProjects);
    } catch (error) {
        console.error('Error loading projects:', error);
        // Show empty table on error
        renderProjectsTable([]);
    }
}

// Render projects table
function renderProjectsTable(projects) {
    const tbody = document.getElementById('projects-tbody');
    if (!tbody) return;

    if (projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Проекты не найдены</td></tr>';
        return;
    }

    tbody.innerHTML = projects.map(project => `
        <tr>
            <td>${project.name}</td>
            <td>${project.description || '-'}</td>
            <td>${project.owner_username || project.owner_id}</td>
            <td><span class="status-badge status-${project.status}">${project.status}</span></td>
            <td>${project.test_cases_count || 0}</td>
            <td>${createActionButtons(project, 'project')}</td>
        </tr>
    `).join('');
}

// Load test cases data
async function loadTestCases() {
    if (!window.api.isAuthenticated()) {
        renderTestCasesTable([]);
        return;
    }

    try {
        // Load projects if not already loaded (needed for test case creation)
        if (!window.currentProjects || window.currentProjects.length === 0) {
            const projectsResult = await window.api.getProjects();
            window.currentProjects = projectsResult.data || [];
        }

        const result = await window.api.getTestCases({});
        currentTestCases = result.data || [];


        renderTestCasesTable(currentTestCases);

        // Update project filter if projects are loaded
        if (window.currentProjects && window.currentProjects.length > 0) {
            updateProjectFilter(window.currentProjects);
        }
    } catch (error) {
        console.error('Error loading test cases:', error);
        // Show empty table on error
        renderTestCasesTable([]);
    }
}

// Render test cases table
function renderTestCasesTable(testCases) {
    const tbody = document.getElementById('test-cases-tbody');
    if (!tbody) return;

    if (testCases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Тест-кейсы не найдены</td></tr>';
        return;
    }

    tbody.innerHTML = testCases.map(testCase => {
        // Find project name from currentProjects array
        const project = window.currentProjects ? window.currentProjects.find(p => p.id === testCase.project_id) : null;
        const projectName = project ? project.name : (testCase.project_name || testCase.project_id || 'Неизвестный проект');

        return `
            <tr>
                <td>${testCase.title}</td>
                <td>${projectName}</td>
                <td><span class="priority-badge ${getPriorityClass(testCase.priority)}">${formatPriority(testCase.priority)}</span></td>
                <td><span class="status-badge ${getStatusClass(testCase.status)}">${formatStatus(testCase.status)}</span></td>
                <td>${testCase.created_by_username || testCase.created_by || '-'}</td>
                <td>${testCase.assigned_to_username || testCase.assigned_to || '-'}</td>
                <td>${createActionButtons(testCase, 'test-case')}</td>
            </tr>
        `;
    }).join('');
}

// Setup form handlers
function setupFormHandlers() {
    // User form
    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    }

    // Project form
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSubmit);
    }

    // Test case form
    const testCaseForm = document.getElementById('test-case-form');
    if (testCaseForm) {
        testCaseForm.addEventListener('submit', handleTestCaseSubmit);
    }

    // Load users for test case assignment
    loadUsersForAssignment();
}

// Load users for test case assignment dropdown
async function loadUsersForAssignment() {
    try {
        const result = await window.api.getUsers();
        const users = result.data || [];

        // Update assigned-to dropdown in test case form
        const assignedToSelect = document.getElementById('test-case-assigned-to');
        if (assignedToSelect) {
            assignedToSelect.innerHTML = '<option value="">Не назначен</option>';
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.username;
                assignedToSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading users for assignment:', error);
    }
}

// Handle user form submission
async function handleUserSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const password = formData.get('password');
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: password,
        role: formData.get('role')
    };


    // Check if this is an update
    const userId = event.target.dataset.userId;

    try {
        if (userId) {
            await window.api.updateUser(userId, userData);
            showMessage('Пользователь успешно обновлен', 'success');
        } else {
            await window.api.createUser(userData);
            showMessage('Пользователь успешно создан', 'success');
        }
        closeModal('user-modal');
        loadUsers();
        loadDashboardData();
        // Clear userId after operation
        delete event.target.dataset.userId;
    } catch (error) {
        showMessage('Ошибка сохранения пользователя: ' + error.message, 'error');
    }
}

// Handle project form submission
async function handleProjectSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const projectData = {
        name: formData.get('name'),
        description: formData.get('description')
    };

    // Check if this is an update
    const projectId = event.target.dataset.projectId;

    try {
        if (projectId) {
            await window.api.updateProject(projectId, projectData);
            showMessage('Проект успешно обновлен', 'success');
        } else {
            await window.api.createProject(projectData);
            showMessage('Проект успешно создан', 'success');
        }
        closeModal('project-modal');
        loadProjects();
        loadDashboardData();
        // Clear projectId after operation
        delete event.target.dataset.projectId;
    } catch (error) {
        showMessage('Ошибка сохранения проекта: ' + error.message, 'error');
    }
}

// Filter functions
function filterUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const filteredUsers = currentUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    renderUsersTable(filteredUsers);
}

function filterProjects() {
    const searchTerm = document.getElementById('project-search').value.toLowerCase();
    const filteredProjects = currentProjects.filter(project =>
        project.name.toLowerCase().includes(searchTerm) ||
        (project.description && project.description.toLowerCase().includes(searchTerm))
    );
    renderProjectsTable(filteredProjects);
}

function filterTestCases() {
    const projectId = document.getElementById('project-filter').value;
    const status = document.getElementById('status-filter').value;
    const searchTerm = document.getElementById('test-case-search').value.toLowerCase();

    let filteredTestCases = currentTestCases;

    if (projectId) {
        filteredTestCases = filteredTestCases.filter(tc => tc.project_id === projectId);
    }

    if (status) {
        filteredTestCases = filteredTestCases.filter(tc => tc.status === status);
    }

    if (searchTerm) {
        filteredTestCases = filteredTestCases.filter(tc =>
            tc.title.toLowerCase().includes(searchTerm) ||
            (tc.description && tc.description.toLowerCase().includes(searchTerm))
        );
    }

    renderTestCasesTable(filteredTestCases);
}

// Authentication functions
async function checkAuthStatus() {
    if (window.api.isAuthenticated()) {
        try {
            const userData = await window.api.getCurrentUser();
            updateUserInterface(userData.data);
            // Initialize app for authenticated user
            initializeApp();
        } catch (error) {
            await logout();
        }
    } else {
        showUnauthenticatedInterface();
    }
}

function updateUserInterface(user) {
    if (user) {
        showAuthenticatedInterface(user);
    }
}

// Interface management functions
function showUnauthenticatedInterface() {
    // Hide user info and main navigation
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('main-nav').style.display = 'none';

    // Show auth buttons
    document.getElementById('auth-buttons').style.display = 'flex';

    // Clear main content
    clearApplicationData();
}

function showAuthenticatedInterface(user) {
    // Hide auth buttons
    document.getElementById('auth-buttons').style.display = 'none';

    // Show user info and main navigation
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('main-nav').style.display = 'flex';

    // Update user display name
    document.getElementById('current-user').textContent = user.username;
}

async function logout() {
    try {
        await window.api.logout();
        showUnauthenticatedInterface();
        showMessage('Вы успешно вышли из системы', 'success');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function clearApplicationData() {
    // Clear global state
    window.currentUsers = [];
    window.currentProjects = [];
    window.currentTestCases = [];

    // Clear UI
    const usersTbody = document.getElementById('users-tbody');
    const projectsTbody = document.getElementById('projects-tbody');
    const testCasesTbody = document.getElementById('test-cases-tbody');

    if (usersTbody) usersTbody.innerHTML = '';
    if (projectsTbody) projectsTbody.innerHTML = '';
    if (testCasesTbody) testCasesTbody.innerHTML = '';
}

// Update project filter options
function updateProjectFilter(projects = currentProjects) {
    const projectFilter = document.getElementById('project-filter');
    if (!projectFilter) return;

    projectFilter.innerHTML = '<option value="">Все проекты</option>';

    if (projects && projects.length > 0) {
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            projectFilter.appendChild(option);
        });
    }
}

// Handle test case form submission
async function handleTestCaseSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const stepsText = formData.get('steps') || '';

    // Convert steps text to array format expected by backend
    const steps = stepsText.trim() ? stepsText.split('\n').filter(step => step.trim()).map((step, index) => ({
        step: step.trim(),
        order: index + 1
    })) : null;

    const testCaseData = {
        title: formData.get('title'),
        description: formData.get('description'),
        project_id: formData.get('project_id'), // Keep as string (UUID)
        priority: formData.get('priority'),
        status: formData.get('status'),
        expected_result: formData.get('expected-result')
    };

    // Only add steps if they exist
    if (steps) {
        testCaseData.steps = steps;
    }

    // Check if this is an update
    const testCaseId = event.target.dataset.testCaseId;

    try {
        if (testCaseId) {
            await window.api.updateTestCase(testCaseId, testCaseData);
            showMessage('Тест-кейс успешно обновлен', 'success');
        } else {
            await window.api.createTestCase(testCaseData);
            showMessage('Тест-кейс успешно создан', 'success');
        }
        closeModal('test-case-modal');
        loadTestCases();
        loadDashboardData();
        // Clear testCaseId after operation
        delete event.target.dataset.testCaseId;
    } catch (error) {
        showMessage('Ошибка сохранения тест-кейса: ' + error.message, 'error');
    }
}

// CRUD operations
async function deleteUser(id) {
    try {
        await window.api.deleteUser(id);
        showMessage('Пользователь успешно удален', 'success');
        loadUsers();
        loadDashboardData();
    } catch (error) {
        showMessage('Ошибка удаления пользователя: ' + error.message, 'error');
    }
}

async function deleteProject(id) {
    try {
        await window.api.deleteProject(id);
        showMessage('Проект успешно удален', 'success');
        loadProjects();
        loadDashboardData();
    } catch (error) {
        showMessage('Ошибка удаления проекта: ' + error.message, 'error');
    }
}

async function deleteTestCase(id) {
    try {
        await window.api.deleteTestCase(id);
        showMessage('Тест-кейс успешно удален', 'success');
        loadTestCases();
        loadDashboardData();
    } catch (error) {
        showMessage('Ошибка удаления тест-кейса: ' + error.message, 'error');
    }
}

// Modal functions
function showUserModal(userId = null) {
    const modal = document.getElementById('user-modal');
    const form = document.getElementById('user-form');
    const title = document.getElementById('user-modal-title');

    if (userId) {
        title.textContent = 'Редактировать пользователя';
        form.dataset.userId = userId;
        loadUserForEdit(userId);
    } else {
        title.textContent = 'Создать пользователя';
        form.reset();
        delete form.dataset.userId;
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showProjectModal(projectId = null) {
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-form');
    const title = document.getElementById('project-modal-title');

    if (projectId) {
        title.textContent = 'Редактировать проект';
        form.dataset.projectId = projectId;
        loadProjectForEdit(projectId);
    } else {
        title.textContent = 'Создать проект';
        form.reset();
        delete form.dataset.projectId;
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showTestCaseModal(testCaseId = null) {
    const modal = document.getElementById('test-case-modal');
    const form = document.getElementById('test-case-form');
    const title = document.getElementById('test-case-modal-title');

    // Ensure users are loaded for assignment dropdown
    loadUsersForAssignment();

    if (testCaseId) {
        title.textContent = 'Редактировать тест-кейс';
        form.dataset.testCaseId = testCaseId;
        loadTestCaseForEdit(testCaseId);
    } else {
        title.textContent = 'Создать тест-кейс';
        form.reset();
        delete form.dataset.testCaseId;
        // Set default status for new test cases
        document.getElementById('test-case-status').value = 'draft';
        updateTestCaseProjectOptions();
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

function setupModalHandlers() {
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Handle action buttons clicks using event delegation
    document.addEventListener('click', function(event) {
        const button = event.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');
        const id = button.getAttribute('data-id');
        const type = button.getAttribute('data-type');

        if (action === 'view') {
            viewItem(id, type);
        } else if (action === 'edit') {
            editItem(id, type);
        } else if (action === 'delete') {
            deleteItem(id, type);
        }
    });
}

// Load functions for editing
async function loadUserForEdit(userId) {
    try {
        const result = await window.api.getUser(userId);
        const user = result.data;
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('password').value = '';
        document.getElementById('role').value = user.role;
    } catch (error) {
        console.error('Error loading user for edit:', error);
        showMessage('Ошибка загрузки данных пользователя', 'error');
    }
}

async function loadProjectForEdit(projectId) {
    try {
        const result = await window.api.getProject(projectId);
        const project = result.data;
        document.getElementById('project-name').value = project.name;
        document.getElementById('project-description').value = project.description || '';
    } catch (error) {
        console.error('Error loading project for edit:', error);
        showMessage('Ошибка загрузки данных проекта', 'error');
    }
}

async function loadTestCaseForEdit(testCaseId) {
    try {
        const result = await window.api.getTestCase(testCaseId);
        const testCase = result.data;
        document.getElementById('test-case-title').value = testCase.title;
        document.getElementById('test-case-description').value = testCase.description || '';
        document.getElementById('test-case-project').value = testCase.project_id;
        document.getElementById('test-case-priority').value = testCase.priority;
        document.getElementById('test-case-status').value = testCase.status;
        document.getElementById('test-case-assigned-to').value = testCase.assigned_to || '';

        // Convert steps array back to text for textarea
        const stepsText = Array.isArray(testCase.steps)
            ? testCase.steps.map(step => step.step || step).join('\n')
            : (testCase.steps || '');
        document.getElementById('test-case-steps').value = stepsText;


        document.getElementById('test-case-expected-result').value = testCase.expected_result || '';
        updateTestCaseProjectOptions();
    } catch (error) {
        console.error('Error loading test case for edit:', error);
        showMessage('Ошибка загрузки данных тест-кейса', 'error');
    }
}

function updateTestCaseProjectOptions() {
    const projectSelect = document.getElementById('test-case-project');
    if (!projectSelect) return;

    projectSelect.innerHTML = '<option value="">Выберите проект</option>';

    if (window.currentProjects && window.currentProjects.length > 0) {
        window.currentProjects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            projectSelect.appendChild(option);
        });
    }
}

// Action button handlers
function viewItem(id, type) {
    switch (type) {
        case 'user':
            viewUser(id);
            break;
        case 'project':
            viewProject(id);
            break;
        case 'test-case':
            viewTestCase(id);
            break;
    }
}

function editItem(id, type) {
    switch (type) {
        case 'user':
            showUserModal(id);
            break;
        case 'project':
            showProjectModal(id);
            break;
        case 'test-case':
            showTestCaseModal(id);
            break;
    }
}

function deleteItem(id, type) {
    const typeNames = {
        'user': 'пользователя',
        'project': 'проект',
        'test-case': 'тест-кейс'
    };

    if (confirm(`Вы уверены, что хотите удалить ${typeNames[type]}?`)) {
        switch (type) {
            case 'user':
                deleteUser(id);
                break;
            case 'project':
                deleteProject(id);
                break;
            case 'test-case':
                deleteTestCase(id);
                break;
        }
    }
}

// Show success/error messages
function showMessage(message, type = 'success') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
    `;

    document.body.appendChild(messageEl);

    // Remove after 3 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
}

// Add message animations to CSS dynamically (only if not already added)
if (!document.querySelector('style[data-message-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-message-animations', 'true');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// View functions
function viewUser(id) {
    const user = currentUsers.find(u => u.id === id);
    if (user) {
        alert(`Пользователь: ${user.username}\nEmail: ${user.email}\nРоль: ${user.role}\nСоздан: ${formatDate(user.created_at)}`);
    }
}

function viewProject(id) {
    const project = currentProjects.find(p => p.id === id);
    if (project) {
        alert(`Проект: ${project.name}\nОписание: ${project.description || 'Нет описания'}\nВладелец: ${project.owner_username}\nСтатус: ${project.status}\nТест-кейсов: ${project.test_cases_count}`);
    }
}

function viewTestCase(id) {
    const testCase = currentTestCases.find(tc => tc.id === id);
    if (testCase) {
        alert(`Тест-кейс: ${testCase.title}\nПроект: ${testCase.project_name}\nПриоритет: ${formatPriority(testCase.priority)}\nСтатус: ${formatStatus(testCase.status)}\nИсполнитель: ${testCase.assigned_to_username || 'Не назначен'}`);
    }
}

// Export all necessary functions to global scope at the end of file
window.showSection = showSection;
window.showUserModal = showUserModal;
window.showProjectModal = showProjectModal;
window.showTestCaseModal = showTestCaseModal;
window.closeModal = closeModal;
window.loadSectionData = loadSectionData;
window.filterUsers = filterUsers;
window.filterProjects = filterProjects;
window.filterTestCases = filterTestCases;
window.updateProjectFilter = updateProjectFilter;
window.checkAuthStatus = checkAuthStatus;
window.logout = logout;