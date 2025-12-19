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
    initializeApp();

    // Set up modal close handlers
    setupModalHandlers();
});

function initializeApp() {
    console.log('📊 Loading dashboard data...');
    // Load initial data
    loadDashboardData();

    // Set up form handlers
    setupFormHandlers();

    // Show dashboard by default
    showSection('dashboard');

    console.log('✅ Frontend initialized successfully');
}

// Load dashboard statistics
async function loadDashboardData() {
    console.log('🔄 Loading dashboard data...');
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

        // Update UI
        document.getElementById('users-count').textContent = usersCount;
        document.getElementById('projects-count').textContent = projectsCount;
        document.getElementById('test-cases-count').textContent = testCasesCount;
        document.getElementById('active-tests-count').textContent = 0;

        console.log('✅ Dashboard data loaded successfully');

    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
    }
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
    try {
        const result = await window.api.getProjects();
        currentProjects = result.data || [];
        renderProjectsTable(currentProjects);
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
    try {
        const result = await window.api.getTestCases({});
        currentTestCases = result.data || [];
        renderTestCasesTable(currentTestCases);
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
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Тест-кейсы не найдены</td></tr>';
        return;
    }

    tbody.innerHTML = testCases.map(testCase => `
        <tr>
            <td>${testCase.title}</td>
            <td>${testCase.project_name || testCase.project_id}</td>
            <td><span class="priority-badge ${getPriorityClass(testCase.priority)}">${formatPriority(testCase.priority)}</span></td>
            <td><span class="status-badge ${getStatusClass(testCase.status)}">${formatStatus(testCase.status)}</span></td>
            <td>${testCase.assigned_to_username || testCase.assigned_to || '-'}</td>
            <td>${createActionButtons(testCase, 'test-case')}</td>
        </tr>
    `).join('');
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

// Handle test case form submission
async function handleTestCaseSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const testCaseData = {
        title: formData.get('title'),
        description: formData.get('description'),
        project_id: parseInt(formData.get('project_id')),
        priority: formData.get('priority'),
        steps: formData.get('steps'),
        expected_result: formData.get('expected-result')
    };

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

    if (testCaseId) {
        title.textContent = 'Редактировать тест-кейс';
        form.dataset.testCaseId = testCaseId;
        loadTestCaseForEdit(testCaseId);
    } else {
        title.textContent = 'Создать тест-кейс';
        form.reset();
        delete form.dataset.testCaseId;
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
        document.getElementById('test-case-steps').value = testCase.steps || '';
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

    if (window.currentProjects) {
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