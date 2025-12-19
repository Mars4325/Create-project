// Login page logic
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const credentials = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    try {
        const response = await window.api.login(credentials);
        if (response.success) {
            // Перенаправляем на главную страницу
            window.location.href = 'index.html';
        }
    } catch (error) {
        alert('Ошибка входа: ' + error.message);
    }
});