let users = {};
let currentUser = null;

// Загрузка данных из Local Storage
function loadUsers() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        users = {}; // Инициализация пустого объекта, если данных нет
    }
}

// Сохранение данных в Local Storage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function register() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username && password && !users[username]) {
        users[username] = { 
            password: password, 
            balance: 1000, 
            transactions: [], 
            registrationDate: new Date() 
        };
        saveUsers(); // Сохранение пользователей
        alert('Пользователь зарегистрирован!');
        showLogin();
        updateUserList(); // Обновление списка пользователей после регистрации
    } else {
        alert('Имя пользователя уже занято или пустое!');
    }
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (users[username] && users[username].password === password) {
        currentUser = username;
        alert('Вы успешно вошли!');
        showDashboard();
    } else {
        alert('Неправильное имя пользователя или пароль!');
    }
}

function showDashboard() {
    document.getElementById('dashboard').style.display = 'flex';
    document.getElementById('userDisplay').innerText = currentUser;
    document.getElementById('balanceDisplay').innerText = users[currentUser].balance;
    updateTransactionHistory();
    updateUserList(); // Обновление списка пользователей при входе
}

function toggleFunctions() {
    const content = document.getElementById('functionContent');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

function transfer() {
    const recipient = document.getElementById('recipient').value.trim();
    const amount = parseInt(document.getElementById('amount').value, 10);

    if (!recipient || !users[recipient]) {
        alert('Пользователь не найден!');
        return;
    }

    if (amount <= 0) {
        alert('Сумма должна быть больше нуля!');
        return;
    }

    if (users[currentUser].balance >= amount) {
        users[currentUser].balance -= amount;
        users[recipient].balance += amount;
        users[currentUser].transactions.push(`$${amount} переведено пользователю ${recipient}`);
        users[recipient].transactions.push(`$${amount} получено от пользователя ${currentUser}`);
        saveUsers(); // Сохранение пользователей
        alert(`$${amount} переведено пользователю ${recipient}`);
        updateTransactionHistory();
    } else {
        alert('Недостаточно средств для перевода!');
    }
}

function updateTransactionHistory() {
    const historyList = document.getElementById('transactionHistory');
    historyList.innerHTML = '';
    users[currentUser].transactions.forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.innerText = transaction;
        historyList.appendChild(listItem);
    });
}

// Обновление списка пользователей
function updateUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    const sortedUsers = Object.keys(users).sort((a, b) => users[a].registrationDate - users[b].registrationDate);

    sortedUsers.forEach((username, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${index + 1}. ${username}`;
        userList.appendChild(listItem);
    });
}

function logout() {
    currentUser = null;
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('auth').style.display = 'block';
}

// Загрузка пользователей при старте
loadUsers();

