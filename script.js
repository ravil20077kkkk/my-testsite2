let users = JSON.parse(localStorage.getItem('users')) || [];
const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentUser = null;

function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    if (!username || !password) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        alert('Пользователь с таким именем уже существует.');
        return;
    }

    const newUser = { username, password, balance: 10000, registrationDate: new Date() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Регистрация успешна! Ваш баланс: 10000');
    document.getElementById('regUsername').value = '';
    document.getElementById('regPassword').value = '';
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        document.getElementById('auth').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('userDisplay').textContent = `Добро пожаловать, ${user.username}!`;
        document.getElementById('balanceDisplay').textContent = user.balance;
        displayUsers();
        displayTransactions();
    } else {
        alert('Неверное имя пользователя или пароль');
    }
}

function displayUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.sort((a, b) => new Date(a.registrationDate) - new Date(b.registrationDate)).forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="username" onclick="viewProfile('${user.username}')">${user.username}</span>`;
        userList.appendChild(li);
    });
}

function displayTransactions() {
    const transactionHistory = document.getElementById('transactionHistory');
    transactionHistory.innerHTML = '';
    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.textContent = `От: ${transaction.from}, Кому: ${transaction.to}, Сумма: ${transaction.amount}`;
        transactionHistory.appendChild(li);
    });
}

function viewProfile(username) {
    const user = users.find(u => u.username === username);
    if (user) {
        document.getElementById('profileUsername').textContent = user.username;
        document.getElementById('profileBalance').textContent = user.balance;
        document.getElementById('profile').style.display = 'block';
    }
}

function closeProfile() {
    document.getElementById('profile').style.display = 'none';
}

function logout() {
    currentUser = null;
    document.getElementById('auth').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

function transfer() {
    const recipient = document.getElementById('recipient').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const recipientUser = users.find(u => u.username === recipient);

    if (recipientUser && amount > 0 && currentUser.balance >= amount) {
        currentUser.balance -= amount;
        recipientUser.balance += amount;
        transactions.push({ from: currentUser.username, to: recipientUser.username, amount });
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('transactions', JSON.stringify(transactions));
        document.getElementById('balanceDisplay').textContent = currentUser.balance;
        displayTransactions();
        alert('Перевод успешен!');
    } else {
        alert('Ошибка перевода. Проверьте данные.');
    }
}

function changeUsername() {
    const newUsername = document.getElementById('newUsername').value;
    if (newUsername) {
        const existingUser = users.find(u => u.username === newUsername);
        if (!existingUser) {
            currentUser.username = newUsername;
            alert('Никнейм изменен!');
            displayUsers();
            localStorage.setItem('users', JSON.stringify(users));
        } else {
            alert('Такое имя пользователя уже занято.');
        }
    } else {
        alert('Введите новый никнейм.');
    }
}
