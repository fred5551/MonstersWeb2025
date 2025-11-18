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
    currentCombat: null,
    currentEncounter: null
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
        try {
            const data = JSON.parse(saved);
            gameState.currentUser = data.currentUser;
            gameState.monsters = data.monsters || [];
            gameState.activeTeam = data.activeTeam || [];
            gameState.inventory = data.inventory || gameState.inventory;
            gameState.playerStats = data.playerStats || gameState.playerStats;
            gameState.isLoggedIn = !!data.currentUser;
        } catch (e) {
            console.error('Error loading game state:', e);
        }
    }

    const users = localStorage.getItem('monstersWebUsers');
    if (!users) {
        localStorage.setItem('monstersWebUsers', JSON.stringify([]));
    }
}

// Event Listeners
function initializeEventListeners() {
    // Auth tabs
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
    });

    // Login
    const loginBtn = document.getElementById('login-submit');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    // Register
    const registerBtn = document.getElementById('register-submit');
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // RGPD links
    const rgpdLink = document.getElementById('rgpd-link');
    if (rgpdLink) {
        rgpdLink.addEventListener('click', (e) => {
            e.preventDefault();
            showRGPDModal();
        });
    }

    const footerRgpdLink = document.getElementById('footer-rgpd-link');
    if (footerRgpdLink && !footerRgpdLink.href.includes('/rgpd')) {
        footerRgpdLink.addEventListener('click', (e) => {
            e.preventDefault();
            showRGPDModal();
        });
    }

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

    const captureBtn = document.getElementById('capture-btn');
    if (captureBtn) {
        captureBtn.addEventListener('click', captureMonster);
    }

    const fleeBtn = document.getElementById('flee-btn');
    if (fleeBtn) {
        fleeBtn.addEventListener('click', flee);
    }

    // Combat
    document.querySelectorAll('.challenge-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const difficulty = e.target.closest('.opponent-card').dataset.difficulty;
            startCombat(difficulty);
        });
    });

    const attackBtn = document.getElementById('attack-btn');
    if (attackBtn) {
        attackBtn.addEventListener('click', () => combatAction('attack'));
    }

    const defendBtn = document.getElementById('defend-btn');
    if (defendBtn) {
        defendBtn.addEventListener('click', () => combatAction('defend'));
    }

    const surrenderBtn = document.getElementById('surrender-btn');
    if (surrenderBtn) {
        surrenderBtn.addEventListener('click', endCombat);
    }

    const newCombatBtn = document.getElementById('new-combat-btn');
    if (newCombatBtn) {
        newCombatBtn.addEventListener('click', () => {
            const resultDiv = document.getElementById('combat-result');
            const setupDiv = document.getElementById('combat-setup');
            const arenaDiv = document.getElementById('combat-arena');

            if (resultDiv) resultDiv.classList.add('hidden');
            if (setupDiv) setupDiv.classList.remove('hidden');
            if (arenaDiv) arenaDiv.classList.add('hidden');
        });
    }

    // Inventory tabs
    document.querySelectorAll('.inv-tab').forEach(tab => {
        tab.addEventListener('click', () => switchInventoryTab(tab.dataset.invTab));
    });

    // Initialize displays
    const activeTeamDiv = document.getElementById('active-team');
    if (activeTeamDiv) {
        displayTeam();
    }

    const potionsInv = document.getElementById('potions-inv');
    if (potionsInv) {
        displayInventory();
    }
}

// Auth
function showAuthSection() {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');

    if (authSection) authSection.style.display = 'block';
    if (dashboardSection) dashboardSection.classList.add('hidden');
}

function showDashboard() {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');

    if (authSection) authSection.style.display = 'none';
    if (dashboardSection) dashboardSection.classList.remove('hidden');
    updateStats();
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    const selectedTab = document.querySelector(`[data-tab="${tab}"]`);
    const selectedForm = document.getElementById(`${tab}-form`);

    if (selectedTab) selectedTab.classList.add('active');
    if (selectedForm) selectedForm.classList.add('active');
}

function handleLogin() {
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');

    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('monstersWebUsers') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        gameState.currentUser = user;
        gameState.isLoggedIn = true;

        const userNameSpan = document.getElementById('user-name');
        if (userNameSpan) userNameSpan.textContent = user.username;

        showDashboard();
        saveGameState();

        if (gameState.monsters.length === 0) {
            giveStarterMonsters();
        }
    } else {
        alert('Identifiants incorrects.');
    }
}

function handleRegister() {
    const usernameInput = document.getElementById('register-username');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const rgpdAcceptInput = document.getElementById('rgpd-accept');

    if (!usernameInput || !emailInput || !passwordInput || !rgpdAcceptInput) return;

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const rgpdAccepted = rgpdAcceptInput.checked;

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

    const newUser = { username, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('monstersWebUsers', JSON.stringify(users));

    alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    switchAuthTab('login');

    const loginUsername = document.getElementById('login-username');
    if (loginUsername) loginUsername.value = username;
}

function handleLogout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        gameState.isLoggedIn = false;
        gameState.currentUser = null;
        window.location.href = '/';
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

    const encounterSection = document.getElementById('encounter-section');
    const wildMonsterName = document.getElementById('wild-monster-name');
    const wildHp = document.getElementById('wild-hp');
    const wildAttack = document.getElementById('wild-attack');
    const wildDefense = document.getElementById('wild-defense');
    const monsterSprite = document.querySelector('.wild-monster .monster-sprite');

    if (wildMonsterName) wildMonsterName.textContent = wildMonster.name;
    if (wildHp) wildHp.textContent = wildMonster.hp;
    if (wildAttack) wildAttack.textContent = wildMonster.attack;
    if (wildDefense) wildDefense.textContent = wildMonster.defense;
    if (monsterSprite) monsterSprite.textContent = wildMonster.sprite;
    if (encounterSection) encounterSection.classList.remove('hidden');
}

function getZoneLevel(zone) {
    const levels = { forest: 3, mountain: 7, volcano: 12, ocean: 17 };
    return (levels[zone] || 3) + Math.floor(Math.random() * 3);
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

        const encounterSection = document.getElementById('encounter-section');
        if (encounterSection) encounterSection.classList.add('hidden');
    } else {
        alert(`${monster.name} s'est échappé !`);
        const encounterSection = document.getElementById('encounter-section');
        if (encounterSection) encounterSection.classList.add('hidden');
    }
}

function flee() {
    const encounterSection = document.getElementById('encounter-section');
    if (encounterSection) encounterSection.classList.add('hidden');
    alert('Vous avez fui le combat.');
}

// Team Management
function displayTeam() {
    const activeContainer = document.getElementById('active-team');
    const reserveContainer = document.getElementById('reserve-monsters');

    if (!activeContainer || !reserveContainer) return;

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
        <h4>${monster.name}</h4>
        <span class="monster-level">Niveau ${monster.level}</span>
        <div class="monster-stats-mini">
            <div class="stat-mini">
                <p>PV</p>
                <strong>${monster.hp}/${monster.maxHP}</strong>
            </div>
            <div class="stat-mini">
                <p>ATK</p>
                <strong>${monster.attack}</strong>
            </div>
            <div class="stat-mini">
                <p>DEF</p>
                <strong>${monster.defense}</strong>
            </div>
        </div>
        <div class="monster-actions" style="margin-top: 1rem;">
            ${isActive ?
        '<button class="btn-deactivate" style="padding: 0.5rem 1rem; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">Retirer</button>' :
        (canActivate ? '<button class="btn-activate" style="padding: 0.5rem 1rem; background: #7FFF00; color: #1C1E26; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Activer</button>' : '')
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
    if (!container) return;

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
        <button class="use-item-btn" ${item.quantity === 0 ? 'disabled' : ''} style="margin-top: 1rem; padding: 0.5rem 1rem; background: ${item.quantity > 0 ? '#7FFF00' : '#666'}; color: ${item.quantity > 0 ? '#1C1E26' : '#999'}; border: none; border-radius: 6px; cursor: ${item.quantity > 0 ? 'pointer' : 'not-allowed'}; font-weight: 600;">Utiliser</button>
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

    const selectedTab = document.querySelector(`[data-inv-tab="${tab}"]`);
    const selectedGrid = document.getElementById(`${tab}-inv`);

    if (selectedTab) selectedTab.classList.add('active');
    if (selectedGrid) selectedGrid.classList.add('active');
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

    const setupDiv = document.getElementById('combat-setup');
    const arenaDiv = document.getElementById('combat-arena');

    if (setupDiv) setupDiv.classList.add('hidden');
    if (arenaDiv) arenaDiv.classList.remove('hidden');

    updateCombatDisplay();
    addCombatLog('Le combat commence !');
}

function updateCombatDisplay() {
    const combat = gameState.currentCombat;
    if (!combat) return;

    const playerMonsterName = document.getElementById('player-monster-name');
    const playerSprite = document.querySelector('#player-monster .monster-sprite');

    const enemyMonsterName = document.getElementById('enemy-monster-name');
    const enemySprite = document.querySelector('#enemy-monster .monster-sprite');

    if (playerMonsterName) playerMonsterName.textContent = combat.player.name;
    if (playerSprite) playerSprite.textContent = combat.player.sprite;
    updateHP('player', combat.player.hp, combat.player.maxHP);

    if (enemyMonsterName) enemyMonsterName.textContent = combat.enemy.name;
    if (enemySprite) enemySprite.textContent = combat.enemy.sprite;
    updateHP('enemy', combat.enemy.hp, combat.enemy.maxHP);
}

function updateHP(side, hp, maxHP) {
    const percentage = (hp / maxHP) * 100;
    const hpFill = document.getElementById(`${side}-hp-fill`);
    const hpText = document.getElementById(`${side}-hp-text`);

    if (hpFill) hpFill.style.width = `${Math.max(0, percentage)}%`;
    if (hpText) hpText.textContent = `PV: ${Math.max(0, Math.floor(hp))}/${maxHP}`;
}

function addCombatLog(message) {
    const log = document.getElementById('combat-log');
    if (!log) return;

    const p = document.createElement('p');
    p.textContent = message;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

function combatAction(action) {
    const combat = gameState.currentCombat;
    if (!combat) return;

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

    const actionsDiv = document.getElementById('combat-actions');
    const resultDiv = document.getElementById('combat-result');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');

    if (actionsDiv) actionsDiv.style.display = 'none';
    if (resultDiv) {
        resultDiv.classList.remove('hidden');
        resultDiv.className = 'combat-result victory';
    }
    if (resultTitle) resultTitle.textContent = 'Victoire !';
    if (resultMessage) resultMessage.textContent = 'Vous avez gagné 50 pièces d\'or !';

    saveGameState();
    updateStats();
}

function loseCombat() {
    const actionsDiv = document.getElementById('combat-actions');
    const resultDiv = document.getElementById('combat-result');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');

    if (actionsDiv) actionsDiv.style.display = 'none';
    if (resultDiv) {
        resultDiv.classList.remove('hidden');
        resultDiv.className = 'combat-result defeat';
    }
    if (resultTitle) resultTitle.textContent = 'Défaite...';
    if (resultMessage) resultMessage.textContent = 'Votre monstre est K.O. Réessayez !';
}

function endCombat() {
    const arenaDiv = document.getElementById('combat-arena');
    const setupDiv = document.getElementById('combat-setup');
    const actionsDiv = document.getElementById('combat-actions');
    const resultDiv = document.getElementById('combat-result');
    const logDiv = document.getElementById('combat-log');

    if (arenaDiv) arenaDiv.classList.add('hidden');
    if (setupDiv) setupDiv.classList.remove('hidden');
    if (actionsDiv) actionsDiv.style.display = 'flex';
    if (resultDiv) resultDiv.classList.add('hidden');
    if (logDiv) logDiv.innerHTML = '';

    gameState.currentCombat = null;
}

// UI Updates
function updateUI() {
    if (gameState.isLoggedIn && gameState.currentUser) {
        const userNameSpan = document.getElementById('user-name');
        if (userNameSpan) userNameSpan.textContent = gameState.currentUser.username;
    }
}

function updateStats() {
    const monstersCount = document.getElementById('monsters-count');
    const winsCount = document.getElementById('wins-count');
    const playerLevel = document.getElementById('player-level');
    const goldCount = document.getElementById('gold-count');

    if (monstersCount) monstersCount.textContent = gameState.playerStats.monstersCount;
    if (winsCount) winsCount.textContent = gameState.playerStats.wins;
    if (playerLevel) playerLevel.textContent = gameState.playerStats.level;
    if (goldCount) goldCount.textContent = gameState.playerStats.gold;
}

// RGPD Modal
function showRGPDModal() {
    const modal = document.getElementById('rgpd-modal');
    if (modal) modal.classList.add('active');
}

function hideRGPDModal() {
    const modal = document.getElementById('rgpd-modal');
    if (modal) modal.classList.remove('active');
}

// Close modal when clicking outside
const rgpdModal = document.getElementById('rgpd-modal');
if (rgpdModal) {
    rgpdModal.addEventListener('click', (e) => {
        if (e.target.id === 'rgpd-modal') {
            hideRGPDModal();
        }
    });
}