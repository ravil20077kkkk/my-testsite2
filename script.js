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
        showLogin(); // Убедитесь, что эта функция определена
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

function showLogin() {
    document.getElementById('auth').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('dashboard').style.display = 'flex';
    document.getElementById('userDisplay').innerText = currentUser;
    document.getElementById('balanceDisplay').innerText = users[currentUser].balance;
    updateTransactionHistory();
    updateUserList(); // Обновление списка пользователей при входе

    // Скрытие формы входа и регистрации
    document.getElementById('auth').style.display = 'none'; // Убедитесь, что эта строка выполняется
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

    sortedUsers.forEach((username) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span class="username" onclick="viewProfile('${username}')">${username}</span>`;
        userList.appendChild(listItem);
    });
}

function viewProfile(username) {
    document.getElementById('profileUsername').innerText = username;
    document.getElementById('profileBalance').innerText = users[username].balance;
    document.getElementById('profile').style.display = 'block';
}

function closeProfile() {
    document.getElementById('profile').style.display = 'none';
}

function logout() {
    currentUser = null;
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('auth').style.display = 'block'; // Показываем форму аутентификации
}

// Функция для изменения никнейма
function changeUsername() {
    const newUsername = document.getElementById('newUsername').value.trim();
    
    if (newUsername && !users[newUsername]) {
        users[newUsername] = { 
            password: users[currentUser].password, 
            balance: users[currentUser].balance, 
            transactions: users[currentUser].transactions, 
            registrationDate: users[currentUser].registrationDate 
        };
        
        delete users[currentUser]; // Удаляем старое имя пользователя
        saveUsers(); // Сохраняем изменения
        currentUser = newUsername; // Обновляем текущего пользователя
        document.getElementById('userDisplay').innerText = currentUser;
        document.getElementById('profileUsername').innerText = currentUser;
        document.getElementById('newUsername').value = ''; // Очистить поле
        alert('Никнейм успешно изменён!');
        updateUserList(); // Обновляем список пользователей
    } else {
        alert('Введите уникальный никнейм.');
    }
}

// Привязка событий к кнопкам
document.getElementById('registerButton').addEventListener('click', register);
document.getElementById('loginButton').addEventListener('click', login);

// Загрузка пользователей при старте
loadUsers();
