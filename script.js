let users = {};
let currentUser = null;

// Загрузка данных из Local Storage
function loadUsers() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
}

// Сохранение данных в Local Storage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function showRegistration() {
    document.getElementById('registration').style.display = 'block';
    document.getElementById('login').style.display = 'none';
}

function showLogin() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('registration').style.display = 'none';
}

function register() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username && password && !users[username]) {
        users[username] = { 
            password: password, 
            balance: 1000, 
            messages: [], 
            transactions: [], 
            registrationDate: new Date() 
        };
        saveUsers(); // Сохранение пользователей
        alert('Пользователь зарегистрирован!');
        showLogin();
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
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('userDisplay').innerText = currentUser;
    document.getElementById('balanceDisplay').innerText = users[currentUser].balance;
    updateTransactionHistory();
    updateUserList();
}

function transfer() {
    const recipient = document.getElementById('recipient').value.trim();
    const amount = parseInt(document.getElementById('amount').value, 10);

    const recipientUser = recipient.startsWith('@') ? recipient.slice(1) : recipient;

    if (!recipientUser || !users[recipientUser]) {
        alert('Пользователь не найден!');
        return;
    }

    if (amount <= 0) {
        alert('Сумма должна быть больше нуля!');
        return;
    }

    if (users[currentUser].balance >= amount) {
        users[currentUser].balance -= amount;
        users[recipientUser].balance += amount;
        users[currentUser].transactions.push(`$${amount} переведено пользователю ${recipientUser}`);
        users[recipientUser].transactions.push(`$${amount} получено от пользователя ${currentUser}`);
        saveUsers(); // Сохранение пользователей
        alert(`$${amount} переведено пользователю ${recipientUser}`);
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

function sendMessage() {
    const recipient = document.getElementById('messageRecipient').value.trim();
    const content = document.getElementById('messageContent').value.trim();

    if (recipient in users) {
        users[recipient].messages.push({ from: currentUser, content: content });
        saveUsers(); // Сохранение пользователей
        alert(`Сообщение отправлено пользователю ${recipient}`);
    } else {
        alert('Пользователь не найден!');
    }
}

function viewProfile() {
    const profileLink = document.getElementById('profileLink').value.trim();
    const profileUsername = profileLink.startsWith('@') ? profileLink.slice(1) : profileLink;

    if (profileUsername in users) {
        document.getElementById('profileUserDisplay').innerText = profileUsername;
        document.getElementById('profileBalanceDisplay').innerText = users[profileUsername].balance;

        const messageList = document.getElementById('profileMessages');
        messageList.innerHTML = '';
        users[profileUsername].messages.forEach(msg => {
            const listItem = document.createElement('li');
            listItem.innerText = `${msg.from}: ${msg.content}`;
            messageList.appendChild(listItem);
        });

        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('profile').style.display = 'block';
    } else {
        alert('Пользователь не найден!');
    }
}

function backToDashboard() {
    document.getElementById('profile').style.display = 'none';
    showDashboard();
}

function logout() {
    currentUser = null;
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('registration').style.display = 'none';
    document.getElementById('auth').style.display = 'block';
}

// Обновление списка пользователей
function updateUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    const sortedUsers = Object.keys(users).sort((a, b) => users[a].registrationDate - users[b].registrationDate);

    sortedUsers.forEach((username, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${index + 1}. <a href="#" onclick="viewProfileByUsername('${username}')">${username}</a>`;
        userList.appendChild(listItem);
    });
}

// Загрузка пользователей при старте
loadUsers();
