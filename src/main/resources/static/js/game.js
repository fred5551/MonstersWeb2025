// Game State
const gameState = {
    currentUser: null,
    isLoggedIn: false,
    currentPage: '',
    monsters: [],
    activeTeam: [],
    inventory: {
        potions: [
            { id: 1, name: 'Potion de soin', icon: '🧪', effect: 'heal', value: 50, quantity: 5 },
            { id: 2, name: 'Super Potion', icon: '💉', effect: 'heal', value: 100, quantity: 2 },
            { id: 3, name: 'Potion de force', icon: '💪', effect: 'attack', value: 20, quantity: 3 }
        ],
        equipment: [
            { id: 4, name: 'Épée de feu', icon: '🗡️', effect: 'attack', value: 15, quantity: 1 },
            { id: 5, name: 'Bouclier magique', icon: '🛡️', effect: 'defense', value: 20, quantity: 1 }
        ],
        items: [
            { id: 6, name: 'Pokéball', icon: '⚾', effect: 'capture', value: 50, quantity: 10 },
            { id: 7, name: 'Super Ball', icon: '🔴', effect: 'capture', value: 75, quantity: 5 }
        ]
    },
    playerStats: {
        monstersCount: 0,
        wins: 0,
        level: 1,
        gold: 100
    },
    currentCombat: null
};

// Monster templates
const monsterTemplates = [
    { name: 'Dracoflame', sprite: '🐉', type: 'feu', baseHP: 120, baseAttack: 45, baseDefense: 35 },
    { name: 'Aquashark', sprite: '🦈', type: 'eau', baseHP: 100, baseAttack: 40, baseDefense: 40 },
    { name: 'Terravolt', sprite: '🦏', type: 'terre', baseHP: 140, baseAttack: 35, baseDefense: 50 },
    { name: 'Voltflash', sprite: '⚡', type: 'électrique', baseHP: 90, baseAttack: 50, baseDefense: 30 },
    { name: 'Frostbite', sprite: '❄️', type: 'glace', baseHP: 110, baseAttack: 42, baseDefense: 38 },
    { name: 'Shadowclaw', sprite: '🦇', type: 'ténèbres', baseHP: 95, baseAttack: 48, baseDefense: 32 },
    { name: 'Leafstorm', sprite: '🍃', type: 'plante', baseHP: 105, baseAttack: 38, baseDefense: 45 },
    { name: 'Rockbuster', sprite: '🗿', type: 'roche', baseHP: 130, baseAttack: 40, baseDefense: 48 },
    { name: 'Skywing', sprite: '🦅', type: 'vol', baseHP: 85, baseAttack: 52, baseDefense: 28 },
    { name: 'Venomfang', sprite: '🐍', type: 'poison', baseHP: 100, baseAttack: 43, baseDefense: 37 }
];

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    initializeEventListeners();
    updateUI();

    // Start with login if not logged in
    if (!gameState.isLoggedIn) {
        showAuthSection();
    } else {
        showDashboard();
    }
});

// Save and Load
function saveGameState() {
    const dataToSave = {
        currentUser: gameState.currentUser,
        monsters: gameState.monsters,
        activeTeam: gameState.activeTeam,
        inventory: gameState.inventory,
        playerStats: gameState.playerStats
    };
    localStorage.setItem('monstersWebGame', JSON.stringify(dataToSave));
}

function loadGameState() {
    const saved = localStorage.getItem('monstersWebGame');
    if (saved) {
        const data = JSON.parse(saved);
        gameState.currentUser = data.currentUser;
        gameState.monsters = data.monsters || [];
        gameState.activeTeam = data.activeTeam || [];
        gameState.inventory = data.inventory || gameState.inventory;
        gameState.playerStats = data.playerStats || gameState.playerStats;
        gameState.isLoggedIn = !!data.currentUser;
    }

    // Load users
    const users = localStorage.getItem('monstersWebUsers');
    if (!users) {
        localStorage.setItem('monstersWebUsers', JSON.stringify([]));
    }
}

// Event Listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.page));
    });

    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
    });

    // Login
    document.getElementById('login-submit').addEventListener('click', handleLogin);

    // Register
    document.getElementById('register-submit').addEventListener('click', handleRegister);

    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // RGPD links
    document.getElementById('rgpd-link').addEventListener('click', (e) => {
        e.preventDefault();
        showRGPDModal();
    });

    document.getElementById('footer-rgpd-link').addEventListener('click', (e) => {
        e.preventDefault();
        showRGPDModal();
    });

    // Modal close
    document.querySelectorAll('.close-modal, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', hideRGPDModal);
    });

    // Exploration
    document.querySelectorAll('.explore-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const zone = e.target.closest('.zone-card').dataset.zone;
            exploreZone(zone);
        });
    });

    document.getElementById('capture-btn')?.addEventListener('click', captureMonster);
    document.getElementById('flee-btn')?.addEventListener('click', flee);

    // Combat
    document.querySelectorAll('.challenge-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const difficulty = e.target.closest('.opponent-card').dataset.difficulty;
            startCombat(difficulty);
        });
    });

    document.getElementById('attack-btn')?.addEventListener('click', () => combatAction('attack'));
    document.getElementById('defend-btn')?.addEventListener('click', () => combatAction('defend'));
    document.getElementById('surrender-btn')?.addEventListener('click', endCombat);
    document.getElementById('new-combat-btn')?.addEventListener('click', () => {
        document.getElementById('combat-result').classList.add('hidden');
        document.getElementById('combat-setup').classList.remove('hidden');
        document.getElementById('combat-arena').classList.add('hidden');
    });

    // Inventory tabs
    document.querySelectorAll('.inv-tab').forEach(tab => {
        tab.addEventListener('click', () => switchInventoryTab(tab.dataset.invTab));
    });
}

// Navigation
function navigateTo(page) {
    if (!gameState.isLoggedIn && page !== 'home') {
        alert('Veuillez vous connecter pour accéder à cette page.');
        return;
    }

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`${page}-page`).classList.add('active');
    gameState.currentPage = page;

    // Load page-specific content
    if (page === 'team') {
        displayTeam();
    } else if (page === 'inventory') {
        displayInventory();
    }
}

// Auth
function showAuthSection() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('dashboard-section').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('dashboard-section').classList.remove('hidden');
    updateStats();
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.add('active');
}

function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('monstersWebUsers') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        gameState.currentUser = user;
        gameState.isLoggedIn = true;
        document.getElementById('user-name').textContent = user.username;

        showDashboard();
        saveGameState();

        // Give starter monsters if new player
        if (gameState.monsters.length === 0) {
            giveStarterMonsters();
        }
    } else {
        alert('Identifiants incorrects.');
    }
}

function handleRegister() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const rgpdAccepted = document.getElementById('rgpd-accept').checked;

    if (!username || !email || !password) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    if (!rgpdAccepted) {
        alert('Vous devez accepter la politique de confidentialité.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('monstersWebUsers') || '[]');

    if (users.find(u => u.username === username)) {
        alert('Ce pseudo est déjà pris.');
        return;
    }

    // In production, password should be hashed with bcrypt
    const newUser = { username, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('monstersWebUsers', JSON.stringify(users));

    alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    switchAuthTab('login');

    // Pre-fill login
    document.getElementById('login-username').value = username;
}

function handleLogout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        gameState.isLoggedIn = false;
        gameState.currentUser = null;
        navigateTo('home');
        showAuthSection();
    }
}

// Starter Monsters
function giveStarterMonsters() {
    for (let i = 0; i < 3; i++) {
        const template = monsterTemplates[i];
        const monster = createMonster(template, 5);
        gameState.monsters.push(monster);
        gameState.activeTeam.push(monster.id);
    }
    gameState.playerStats.monstersCount = 3;
    saveGameState();
    updateStats();
}

// Monster Creation
function createMonster(template, level) {
    return {
        id: Date.now() + Math.random(),
        name: template.name,
        sprite: template.sprite,
        type: template.type,
        level: level,
        hp: template.baseHP + (level * 5),
        maxHP: template.baseHP + (level * 5),
        attack: template.baseAttack + (level * 2),
        defense: template.baseDefense + (level * 2),
        isActive: false
    };
}

// Exploration
function exploreZone(zone) {
    const template = monsterTemplates[Math.floor(Math.random() * monsterTemplates.length)];
    const level = getZoneLevel(zone);
    const wildMonster = createMonster(template, level);

    gameState.currentEncounter = wildMonster;

    document.getElementById('wild-monster-name').textContent = wildMonster.name;
    document.getElementById('wild-hp').textContent = wildMonster.hp;
    document.getElementById('wild-attack').textContent = wildMonster.attack;
    document.getElementById('wild-defense').textContent = wildMonster.defense;
    document.querySelector('.wild-monster .monster-sprite').textContent = wildMonster.sprite;

    document.getElementById('encounter-section').classList.remove('hidden');
}

function getZoneLevel(zone) {
    const levels = { forest: 3, mountain: 7, volcano: 12, ocean: 17 };
    return levels[zone] + Math.floor(Math.random() * 3);
}

function captureMonster() {
    const monster = gameState.currentEncounter;
    const captureChance = Math.random();

    if (captureChance > 0.5) {
        gameState.monsters.push(monster);
        gameState.playerStats.monstersCount++;
        alert(`${monster.name} a été capturé !`);
        saveGameState();
        updateStats();
        document.getElementById('encounter-section').classList.add('hidden');
    } else {
        alert(`${monster.name} s'est échappé !`);
        document.getElementById('encounter-section').classList.add('hidden');
    }
}

function flee() {
    document.getElementById('encounter-section').classList.add('hidden');
    alert('Vous avez fui le combat.');
}

// Team Management
function displayTeam() {
    const activeContainer = document.getElementById('active-team');
    const reserveContainer = document.getElementById('reserve-monsters');

    activeContainer.innerHTML = '';
    reserveContainer.innerHTML = '';

    gameState.monsters.forEach(monster => {
        const card = createMonsterCard(monster);

        if (gameState.activeTeam.includes(monster.id)) {
            activeContainer.appendChild(card);
        } else {
            reserveContainer.appendChild(card);
        }
    });

    if (activeContainer.children.length === 0) {
        activeContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #b0b0b0;">Aucun monstre dans l\'équipe active</p>';
    }

    if (reserveContainer.children.length === 0) {
        reserveContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #b0b0b0;">Aucun monstre en réserve</p>';
    }
}

function createMonsterCard(monster) {
    const card = document.createElement('div');
    card.className = 'monster-card';

    const isActive = gameState.activeTeam.includes(monster.id);
    const canActivate = gameState.activeTeam.length < 6;

    card.innerHTML = `
        <div class="monster-sprite">${monster.sprite}</div>
        <h3>${monster.name}</h3>
        <p class="level">Niveau ${monster.level}</p>
        <div class="stats">
            <p>PV: ${monster.hp}/${monster.maxHP}</p>
            <p>Attaque: ${monster.attack}</p>
            <p>Défense: ${monster.defense}</p>
            <p>Type: ${monster.type}</p>
        </div>
        <div class="monster-actions">
            ${isActive ?
        '<button class="btn-deactivate">Retirer</button>' :
        (canActivate ? '<button class="btn-activate">Activer</button>' : '')
    }
        </div>
    `;

    const actionBtn = card.querySelector('button');
    if (actionBtn) {
        actionBtn.addEventListener('click', () => toggleMonsterActive(monster.id));
    }

    return card;
}

function toggleMonsterActive(monsterId) {
    const index = gameState.activeTeam.indexOf(monsterId);

    if (index > -1) {
        gameState.activeTeam.splice(index, 1);
    } else {
        if (gameState.activeTeam.length < 6) {
            gameState.activeTeam.push(monsterId);
        }
    }

    saveGameState();
    displayTeam();
}

// Inventory
function displayInventory() {
    displayInventoryCategory('potions');
    displayInventoryCategory('equipment');
    displayInventoryCategory('items');
}

function displayInventoryCategory(category) {
    const container = document.getElementById(`${category}-inv`);
    container.innerHTML = '';

    gameState.inventory[category].forEach(item => {
        const card = createItemCard(item);
        container.appendChild(card);
    });
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';

    card.innerHTML = `
        <div class="item-icon">${item.icon}</div>
        <h4>${item.name}</h4>
        <p class="item-quantity">Quantité: ${item.quantity}</p>
        <button class="use-item-btn" ${item.quantity === 0 ? 'disabled' : ''}>Utiliser</button>
    `;

    card.querySelector('.use-item-btn').addEventListener('click', () => useItem(item));

    return card;
}

function useItem(item) {
    if (item.quantity > 0) {
        alert(`Vous avez utilisé ${item.name}`);
        item.quantity--;
        saveGameState();
        displayInventory();
    }
}

function switchInventoryTab(tab) {
    document.querySelectorAll('.inv-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.inventory-grid').forEach(g => g.classList.remove('active'));

    document.querySelector(`[data-inv-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}-inv`).classList.add('active');
}

// Combat
function startCombat(difficulty) {
    if (gameState.activeTeam.length === 0) {
        alert('Vous devez avoir au moins un monstre dans votre équipe active !');
        return;
    }

    const playerMonster = gameState.monsters.find(m => m.id === gameState.activeTeam[0]);
    const enemyLevel = { easy: 3, medium: 7, hard: 12 }[difficulty];
    const enemyTemplate = monsterTemplates[Math.floor(Math.random() * monsterTemplates.length)];
    const enemyMonster = createMonster(enemyTemplate, enemyLevel);

    gameState.currentCombat = {
        player: { ...playerMonster },
        enemy: enemyMonster,
        turn: 'player',
        log: []
    };

    document.getElementById('combat-setup').classList.add('hidden');
    document.getElementById('combat-arena').classList.remove('hidden');

    updateCombatDisplay();
    addCombatLog('Le combat commence !');
}

function updateCombatDisplay() {
    const combat = gameState.currentCombat;

    document.getElementById('player-monster-name').textContent = combat.player.name;
    document.querySelector('#player-monster .monster-sprite').textContent = combat.player.sprite;
    updateHP('player', combat.player.hp, combat.player.maxHP);

    document.getElementById('enemy-monster-name').textContent = combat.enemy.name;
    document.querySelector('#enemy-monster .monster-sprite').textContent = combat.enemy.sprite;
    updateHP('enemy', combat.enemy.hp, combat.enemy.maxHP);
}

function updateHP(side, hp, maxHP) {
    const percentage = (hp / maxHP) * 100;
    document.getElementById(`${side}-hp-fill`).style.width = `${percentage}%`;
    document.getElementById(`${side}-hp-text`).textContent = `PV: ${Math.max(0, hp)}/${maxHP}`;
}

function addCombatLog(message) {
    const log = document.getElementById('combat-log');
    const p = document.createElement('p');
    p.textContent = message;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

function combatAction(action) {
    const combat = gameState.currentCombat;

    if (action === 'attack') {
        const damage = Math.max(1, combat.player.attack - combat.enemy.defense / 2);
        combat.enemy.hp -= damage;
        addCombatLog(`${combat.player.name} attaque et inflige ${Math.floor(damage)} dégâts !`);
    } else if (action === 'defend') {
        addCombatLog(`${combat.player.name} se défend !`);
        combat.player.tempDefense = combat.player.defense * 1.5;
    }

    updateCombatDisplay();

    if (combat.enemy.hp <= 0) {
        winCombat();
        return;
    }

    // Enemy turn
    setTimeout(() => {
        const enemyDamage = Math.max(1, combat.enemy.attack - (combat.player.tempDefense || combat.player.defense) / 2);
        combat.player.hp -= enemyDamage;
        addCombatLog(`${combat.enemy.name} attaque et inflige ${Math.floor(enemyDamage)} dégâts !`);
        combat.player.tempDefense = null;

        updateCombatDisplay();

        if (combat.player.hp <= 0) {
            loseCombat();
        }
    }, 1000);
}

function winCombat() {
    gameState.playerStats.wins++;
    gameState.playerStats.gold += 50;

    document.getElementById('combat-actions').style.display = 'none';
    document.getElementById('combat-result').classList.remove('hidden');
    document.getElementById('result-title').textContent = 'Victoire !';
    document.getElementById('result-message').textContent = 'Vous avez gagné 50 pièces d\'or !';

    saveGameState();
    updateStats();
}

function loseCombat() {
    document.getElementById('combat-actions').style.display = 'none';
    document.getElementById('combat-result').classList.remove('hidden');
    document.getElementById('result-title').textContent = 'Défaite...';
    document.getElementById('result-message').textContent = 'Votre monstre est K.O. Réessayez !';
}

function endCombat() {
    document.getElementById('combat-arena').classList.add('hidden');
    document.getElementById('combat-setup').classList.remove('hidden');
    document.getElementById('combat-actions').style.display = 'flex';
    document.getElementById('combat-result').classList.add('hidden');
    document.getElementById('combat-log').innerHTML = '';
    gameState.currentCombat = null;
}

// UI Updates
function updateUI() {
    if (gameState.isLoggedIn) {
        document.getElementById('user-name').textContent = gameState.currentUser.username;
    }
}

function updateStats() {
    document.getElementById('monsters-count').textContent = gameState.playerStats.monstersCount;
    document.getElementById('wins-count').textContent = gameState.playerStats.wins;
    document.getElementById('player-level').textContent = gameState.playerStats.level;
    document.getElementById('gold-count').textContent = gameState.playerStats.gold;
}

// RGPD Modal
function showRGPDModal() {
    document.getElementById('rgpd-modal').classList.remove('hidden');
}

function hideRGPDModal() {
    document.getElementById('rgpd-modal').classList.add('hidden');
}

// Close modal when clicking outside
document.getElementById('rgpd-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'rgpd-modal') {
        hideRGPDModal();
    }
});