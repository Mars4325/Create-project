// Test authentication page logic
const statusDiv = document.getElementById('status');
const contentDiv = document.getElementById('content');

async function checkStatus() {
    if (window.api.isAuthenticated()) {
        statusDiv.innerHTML = '<p style="color: green;">✅ Authenticated</p>';

        try {
            const user = await window.api.getCurrentUser();
            contentDiv.innerHTML = `
                <p>Welcome, ${user.data.username}!</p>
                <button onclick="logout()">Logout</button>
            `;
        } catch (error) {
            statusDiv.innerHTML = '<p style="color: red;">❌ Token invalid</p>';
            contentDiv.innerHTML = '<a href="frontend/login.html">Login</a>';
        }
    } else {
        statusDiv.innerHTML = '<p style="color: red;">❌ Not authenticated</p>';
        contentDiv.innerHTML = `
            <a href="frontend/login.html">Login</a> |
            <a href="frontend/register.html">Register</a>
        `;
    }
}

async function logout() {
    await window.api.logout();
    checkStatus();
}

// Make functions global
window.logout = logout;

checkStatus();