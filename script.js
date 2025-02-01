let users = {};
let currentUser = null;

function register() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username && password && !users[username]) {
        users[username] = { password: password, balance: 1000, messages: [], transactions: [] };
        alert('Пользователь зарегистрирован!');
        document.getElementById('registration').style.display = 'none';
        showLogin();
    } else {
        alert('Имя пользователя уже занято или пустое!');
    }
}

function showLogin() {
    document.getElementById('login').style.display = 'block';
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (users[username] && users[username].password === password) {
        currentUser = username;
        alert('Вы успешно вошли!');
        document.getElementById('login').style.display = 'none';
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
}

function changeName() {
    const newUsername = document.getElementById('newUsername').value.trim();
    if (newUsername && !users[newUsername]) {
        users[newUsername] = users[currentUser];
        delete users[currentUser];
        currentUser = newUsername;
        alert('Имя изменено!');
        showDashboard();
    } else {
        alert('Имя пользователя уже занято или пустое!');
    }
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
        alert(`$${amount} переведено пользователю ${recipient}`);
        showDashboard();
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
        alert(`Сообщение отправлено пользователю ${recipient}`);
    } else {
        alert('Пользователь не найден!');
    }
}

function viewProfile() {
    const profileUsername = document.getElementById('profileUsername').value.trim();

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
    document.getElementById('registration').style.display = 'block';
}
