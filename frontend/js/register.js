// Register page logic
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }

    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: password,
        role: 'user'
    };

    try {
        const response = await window.api.register(userData);
        if (response.success) {
            alert('Регистрация успешна! Теперь вы можете войти в систему.');
            window.location.href = 'login.html';
        }
    } catch (error) {
        alert('Ошибка регистрации: ' + error.message);
    }
});