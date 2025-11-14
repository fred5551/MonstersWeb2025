/* ========================================
   GAME DATA & STATE
   ======================================== */

// Types de monstres disponibles
const MONSTER_TYPES = {
    forest: [
        { name: 'Leafeon', sprite: '🌿', type: 'Plante', baseHp: 80, baseAttack: 25, baseDefense: 20 },
        { name: 'Treeko', sprite: '🦎', type: 'Plante', baseHp: 70, baseAttack: 30, baseDefense: 15 },
        { name: 'Bulbizarre', sprite: '🐸', type: 'Plante', baseHp: 90, baseAttack: 22, baseDefense: 25 }
    ],
    mountain: [
        { name: 'Frostbite', sprite: '❄️', type: 'Glace', baseHp: 85, baseAttack: 28, baseDefense: 22 },
        { name: 'Icewing', sprite: '🐧', type: 'Glace', baseHp: 95, baseAttack: 24, baseDefense: 28 },
        { name: 'Snowpaw', sprite: '🐻‍❄️', type: 'Glace', baseHp: 100, baseAttack: 26, baseDefense: 24 }
    ],
    volcano: [
        { name: 'Inferno', sprite: '🔥', type: 'Feu', baseHp: 88, baseAttack: 35, baseDefense: 18 },
        { name: 'Magmar', sprite: '🦎', type: 'Feu', baseHp: 82, baseAttack: 38, baseDefense: 16 },
        { name: 'Salamandre', sprite: '🐉', type: 'Feu', baseHp: 92, baseAttack: 32, baseDefense: 20 }
    ],
    ocean: [
        { name: 'Aqualis', sprite: '🐋', type: 'Eau', baseHp: 110, baseAttack: 30, baseDefense: 30 },
        { name: 'Tidal', sprite: '🦈', type: 'Eau', baseHp: 95, baseAttack: 36, baseDefense: 24 },
        { name: 'Nautilus', sprite: '🐙', type: 'Eau', baseHp: 105, baseAttack: 28, baseDefense: 32 }
    ]
};

// Objets de l'inventaire
const ITEMS_DATABASE = {
    potions: [
        { id: 'potion-small', name: 'Petite Potion', icon: '🧪', effect: 30, price: 50 },
        { id: 'potion-medium', name: 'Potion Moyenne', icon: '🍾', effect: 60, price: 100 },
        { id: 'potion-large', name: 'Grande Potion', icon: '⚗️', effect: 100, price: 200 }
    ],
    equipment: [
        { id: 'sword-basic', name: 'Épée Basique', icon: '🗡️', attackBonus: 5, price: 150 },
        { id: 'armor-basic', name: 'Armure Basique', icon: '🛡️', defenseBonus: 5, price: 150 },
        { id: 'sword-advanced', name: 'Épée Avancée', icon: '⚔️', attackBonus: 10, price: 300 }
    ],
    items: [
        { id: 'monster-ball', name: 'Monster Ball', icon: '⚾', effect: 'capture', price: 100 },
        { id: 'revive', name: 'Revive', icon: '💊', effect: 'revive', price: 250 },
        { id: 'xp-boost', name: 'Boost XP', icon: '⭐', effect: 'xp-boost', price: 500 }
    ]
};

// État du jeu
let gameState = {
    player: {
        username: null,
        email: null,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        gold: 100,
        wins: 0,
        losses: 0,
        monstersCount: 0
    },
    team: [],
    reserve: [],
    inventory: {
        potions: [],
        equipment: [],
        items: []
    },
    currentCombat: null,
    isLoggedIn: false
};

/* ========================================
   INITIALIZATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadGameState();
    setupEventListeners();
    updateUI();
});

function initializeApp() {
    console.log('🎮 Monsters Web - Initialisation');

    // Initialiser l'inventaire avec quelques objets de départ
    if (gameState.inventory.potions.length === 0) {
        gameState.inventory.potions.push({ ...ITEMS_DATABASE.potions[0], quantity: 3 });
        gameState.inventory.items.push({ ...ITEMS_DATABASE.items[0], quantity: 5 });
    }
}

function loadGameState() {
    const saved = localStorage.getItem('monstersWebGameState');
    if (saved) {
        try {
            gameState = JSON.parse(saved);
            console.log('✅ État du jeu chargé');
        } catch (e) {
            console.error('❌ Erreur lors du chargement:', e);
        }
    }
}

function saveGameState() {
    try {
        localStorage.setItem('monstersWebGameState', JSON.stringify(gameState));
        console.log('💾 État du jeu sauvegardé');
    } catch (e) {
        console.error('❌ Erreur lors de la sauvegarde:', e);
    }
}

/* ========================================
   EVENT LISTENERS
   ======================================== */

function setupEventListeners() {
    // Authentication tabs
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

    // RGPD Modal
    const rgpdLink = document.getElementById('rgpd-link');
    const footerRgpdLink = document.getElementById('footer-rgpd-link');
    const rgpdModal = document.getElementById('rgpd-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    if (rgpdLink) rgpdLink.addEventListener('click', (e) => {
        e.preventDefault();
        rgpdModal.classList.add('active');
    });

    if (footerRgpdLink && window.location.pathname === '/') {
        footerRgpdLink.addEventListener('click', (e) => {
            e.preventDefault();
            rgpdModal.classList.add('active');
        });
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', () => {
        rgpdModal.classList.remove('active');
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => {
        rgpdModal.classList.remove('active');
    });

    // Exploration
    const exploreBtns = document.querySelectorAll('.explore-btn');
    exploreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const zone = e.target.closest('.zone-card').dataset.zone;
            exploreZone(zone);
        });
    });

    const captureBtn = document.getElementById('capture-btn');
    const fleeBtn = document.getElementById('flee-btn');
    if (captureBtn) captureBtn.addEventListener('click', captureMonster);
    if (fleeBtn) fleeBtn.addEventListener('click', fleeEncounter);

    // Combat
    const challengeBtns = document.querySelectorAll('.challenge-btn');
    challengeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const difficulty = e.target.closest('.opponent-card').dataset.difficulty;
            startCombat(difficulty);
        });
    });

    const attackBtn = document.getElementById('attack-btn');
    const defendBtn = document.getElementById('defend-btn');
    const surrenderBtn = document.getElementById('surrender-btn');
    const newCombatBtn = document.getElementById('new-combat-btn');

    if (attackBtn) attackBtn.addEventListener('click', () => performCombatAction('attack'));
    if (defendBtn) defendBtn.addEventListener('click', () => performCombatAction('defend'));
    if (surrenderBtn) surrenderBtn.addEventListener('click', endCombat);
    if (newCombatBtn) newCombatBtn.addEventListener('click', resetCombat);

    // Inventory tabs
    const invTabs = document.querySelectorAll('.inv-tab');
    invTabs.forEach(tab => {
        tab.addEventListener('click', () => switchInventoryTab(tab.dataset.invTab));
    });
}

/* ========================================
   AUTHENTICATION
   ======================================== */

function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-form`).classList.add('active');
}

function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert('⚠️ Veuillez remplir tous les champs');
        return;
    }

    // Simulation de connexion
    gameState.player.username = username;
    gameState.isLoggedIn = true;

    // Ajouter un monstre de départ si le joueur n'en a pas
    if (gameState.team.length === 0) {
        const starterMonster = createMonster(MONSTER_TYPES.forest[0], 1);
        gameState.team.push(starterMonster);
        gameState.player.monstersCount = 1;
    }

    saveGameState();
    updateUI();
    showNotification('✅ Connexion réussie!', 'success');
}

function handleRegister() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const rgpdAccept = document.getElementById('rgpd-accept').checked;

    if (!username || !email || !password) {
        alert('⚠️ Veuillez remplir tous les champs');
        return;
    }

    if (!rgpdAccept) {
        alert('⚠️ Vous devez accepter la politique de confidentialité');
        return;
    }

    // Simulation d'inscription
    gameState.player.username = username;
    gameState.player.email = email;
    gameState.isLoggedIn = true;

    // Monstre de départ
    const starterMonster = createMonster(MONSTER_TYPES.forest[0], 1);
    gameState.team.push(starterMonster);
    gameState.player.monstersCount = 1;

    saveGameState();
    updateUI();
    showNotification('✅ Inscription réussie! Bienvenue!', 'success');
}

function handleLogout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
        gameState.isLoggedIn = false;
        saveGameState();
        window.location.reload();
    }
}

/* ========================================
   UI UPDATES
   ======================================== */

function updateUI() {
    updateAuthSection();
    updateDashboard();
    updateTeamDisplay();
    updateInventoryDisplay();
    updateUserInfo();
}

function updateAuthSection() {
    const authSection = document.getElementById('auth-section');
    const dashboard = document.getElementById('dashboard-section');

    if (!authSection || !dashboard) return;

    if (gameState.isLoggedIn) {
        authSection.classList.add('hidden');
        dashboard.classList.remove('hidden');
    } else {
        authSection.classList.remove('hidden');
        dashboard.classList.add('hidden');
    }
}

function updateDashboard() {
    const monstersCount = document.getElementById('monsters-count');
    const winsCount = document.getElementById('wins-count');
    const playerLevel = document.getElementById('player-level');
    const goldCount = document.getElementById('gold-count');

    if (monstersCount) monstersCount.textContent = gameState.player.monstersCount;
    if (winsCount) winsCount.textContent = gameState.player.wins;
    if (playerLevel) playerLevel.textContent = gameState.player.level;
    if (goldCount) goldCount.textContent = gameState.player.gold;

    updatePlayerXPBar();
}

function updatePlayerXPBar() {
    const xpBarContainer = document.getElementById('player-xp-bar');
    if (!xpBarContainer) return;

    const xpPercentage = (gameState.player.xp / gameState.player.xpToNextLevel) * 100;

    xpBarContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-gray); margin-bottom: 0.5rem;">
            <strong>XP: ${gameState.player.xp} / ${gameState.player.xpToNextLevel}</strong>
        </div>
        <div class="hp-bar">
            <div class="hp-fill" style="width: ${xpPercentage}%; background: linear-gradient(90deg, #7FFF00 0%, #6bdb00 100%);"></div>
        </div>
    `;
}

function updateUserInfo() {
    const userName = document.getElementById('user-name');
    if (userName && gameState.player.username) {
        userName.textContent = gameState.player.username;
    }
}

function updateTeamDisplay() {
    const activeTeam = document.getElementById('active-team');
    const reserveMonsters = document.getElementById('reserve-monsters');

    if (activeTeam) {
        activeTeam.innerHTML = gameState.team.length === 0
            ? '<p style="grid-column:1/-1; text-align:center; color:#b0b0b0;">Aucun monstre dans l\'équipe active</p>'
            : gameState.team.map(monster => createMonsterCard(monster)).join('');
    }

    if (reserveMonsters) {
        reserveMonsters.innerHTML = gameState.reserve.length === 0
            ? '<p style="grid-column:1/-1; text-align:center; color:#b0b0b0;">Aucun monstre en réserve</p>'
            : gameState.reserve.map(monster => createMonsterCard(monster)).join('');
    }
}

function updateInventoryDisplay() {
    updateInventoryGrid('potions');
    updateInventoryGrid('equipment');
    updateInventoryGrid('items');
}

function updateInventoryGrid(category) {
    const grid = document.getElementById(`${category}-inv`);
    if (!grid) return;

    const items = gameState.inventory[category];

    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#b0b0b0;">Aucun objet</p>';
        return;
    }

    grid.innerHTML = items.map(item => `
        <div class="item-card">
            <div class="item-icon">${item.icon}</div>
            <h4>${item.name}</h4>
            <p class="item-quantity">x${item.quantity || 1}</p>
        </div>
    `).join('');
}

function switchInventoryTab(tabName) {
    document.querySelectorAll('.inv-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.inventory-grid').forEach(g => g.classList.remove('active'));

    document.querySelector(`[data-inv-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-inv`).classList.add('active');
}

/* ========================================
   MONSTER CREATION & MANAGEMENT
   ======================================== */

function createMonster(template, level) {
    return {
        id: Date.now() + Math.random(),
        name: template.name,
        sprite: template.sprite,
        type: template.type,
        level: level,
        xp: 0,
        xpToNextLevel: level * 50,
        hp: template.baseHp + (level - 1) * 5,
        maxHp: template.baseHp + (level - 1) * 5,
        attack: template.baseAttack + (level - 1) * 2,
        defense: template.baseDefense + (level - 1) * 2
    };
}

function createMonsterCard(monster) {
    return `
        <div class="monster-card" data-monster-id="${monster.id}">
            <div class="monster-sprite">${monster.sprite}</div>
            <h4>${monster.name}</h4>
            <span class="monster-level">Niv. ${monster.level}</span>
            <div class="monster-stats-mini">
                <div class="stat-mini">
                    <p>PV</p>
                    <strong>${monster.hp}/${monster.maxHp}</strong>
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
        </div>
    `;
}

/* ========================================
   EXPLORATION
   ======================================== */

function exploreZone(zoneName) {
    const encounterSection = document.getElementById('encounter-section');
    if (!encounterSection) return;

    const monsters = MONSTER_TYPES[zoneName];
    const randomMonster = monsters[Math.floor(Math.random() * monsters.length)];
    const level = Math.floor(Math.random() * 3) + 1;

    const wildMonster = createMonster(randomMonster, level);
    gameState.currentEncounter = wildMonster;

    document.getElementById('wild-monster-name').textContent = wildMonster.name;
    document.querySelector('#wild-monster .monster-sprite').textContent = wildMonster.sprite;
    document.getElementById('wild-hp').textContent = wildMonster.hp;
    document.getElementById('wild-attack').textContent = wildMonster.attack;
    document.getElementById('wild-defense').textContent = wildMonster.defense;

    encounterSection.classList.remove('hidden');
    encounterSection.scrollIntoView({ behavior: 'smooth' });

    showNotification(`💥 Un ${wildMonster.name} sauvage apparaît!`, 'info');
}

function captureMonster() {
    const monster = gameState.currentEncounter;
    if (!monster) return;

    // Vérifier si le joueur a des Monster Balls
    const monsterBalls = gameState.inventory.items.find(i => i.id === 'monster-ball');
    if (!monsterBalls || monsterBalls.quantity <= 0) {
        showNotification('❌ Vous n\'avez pas de Monster Ball!', 'error');
        return;
    }

    // Réduire le nombre de Monster Balls
    monsterBalls.quantity--;
    if (monsterBalls.quantity === 0) {
        gameState.inventory.items = gameState.inventory.items.filter(i => i.id !== 'monster-ball');
    }

    // Chance de capture (80%)
    if (Math.random() < 0.8) {
        if (gameState.team.length < 6) {
            gameState.team.push(monster);
        } else {
            gameState.reserve.push(monster);
        }

        gameState.player.monstersCount++;
        gameState.player.xp += 20;
        checkLevelUp();

        showNotification(`✅ ${monster.name} a été capturé!`, 'success');
        updateUI();
        fleeEncounter();
    } else {
        showNotification(`❌ ${monster.name} s'est échappé!`, 'error');
    }

    saveGameState();
}

function fleeEncounter() {
    const encounterSection = document.getElementById('encounter-section');
    if (encounterSection) {
        encounterSection.classList.add('hidden');
    }
    gameState.currentEncounter = null;
}

/* ========================================
   COMBAT SYSTEM
   ======================================== */

function startCombat(difficulty) {
    if (gameState.team.length === 0) {
        showNotification('❌ Vous devez avoir au moins un monstre dans votre équipe!', 'error');
        return;
    }

    const combatSetup = document.getElementById('combat-setup');
    const combatArena = document.getElementById('combat-arena');

    if (!combatSetup || !combatArena) return;

    // Générer l'adversaire
    const enemyLevel = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 5 : 8;
    const allMonsters = Object.values(MONSTER_TYPES).flat();
    const randomTemplate = allMonsters[Math.floor(Math.random() * allMonsters.length)];
    const enemy = createMonster(randomTemplate, enemyLevel);

    // Sélectionner le premier monstre de l'équipe
    const playerMonster = gameState.team[0];

    gameState.currentCombat = {
        playerMonster: { ...playerMonster },
        enemyMonster: enemy,
        turn: 'player',
        defending: false
    };

    // Afficher l'arène
    combatSetup.classList.add('hidden');
    combatArena.classList.remove('hidden');

    updateCombatDisplay();
    addCombatLog('⚔️ Le combat commence!');
}

function updateCombatDisplay() {
    const combat = gameState.currentCombat;
    if (!combat) return;

    // Joueur
    document.getElementById('player-monster-name').textContent = combat.playerMonster.name;
    document.querySelector('#player-monster .monster-sprite').textContent = combat.playerMonster.sprite;
    document.getElementById('player-hp-text').textContent = `PV: ${combat.playerMonster.hp}/${combat.playerMonster.maxHp}`;

    const playerHpPercent = (combat.playerMonster.hp / combat.playerMonster.maxHp) * 100;
    document.getElementById('player-hp-fill').style.width = `${playerHpPercent}%`;

    // Ennemi
    document.getElementById('enemy-monster-name').textContent = combat.enemyMonster.name;
    document.querySelector('#enemy-monster .monster-sprite').textContent = combat.enemyMonster.sprite;
    document.getElementById('enemy-hp-text').textContent = `PV: ${combat.enemyMonster.hp}/${combat.enemyMonster.maxHp}`;

    const enemyHpPercent = (combat.enemyMonster.hp / combat.enemyMonster.maxHp) * 100;
    document.getElementById('enemy-hp-fill').style.width = `${enemyHpPercent}%`;
}

function performCombatAction(action) {
    const combat = gameState.currentCombat;
    if (!combat || combat.turn !== 'player') return;

    if (action === 'attack') {
        const damage = Math.max(1, combat.playerMonster.attack - combat.enemyMonster.defense / 2);
        combat.enemyMonster.hp -= damage;
        addCombatLog(`💥 Votre ${combat.playerMonster.name} inflige ${damage} dégâts!`);
        combat.defending = false;
    } else if (action === 'defend') {
        combat.defending = true;
        addCombatLog(`🛡️ Votre ${combat.playerMonster.name} se défend!`);
    }

    updateCombatDisplay();

    // Vérifier la victoire
    if (combat.enemyMonster.hp <= 0) {
        endCombatVictory();
        return;
    }

    // Tour de l'ennemi
    combat.turn = 'enemy';
    setTimeout(enemyTurn, 1500);
}

function enemyTurn() {
    const combat = gameState.currentCombat;
    if (!combat) return;

    const damage = Math.max(1, combat.enemyMonster.attack - combat.playerMonster.defense / 2);
    const actualDamage = combat.defending ? Math.floor(damage / 2) : damage;

    combat.playerMonster.hp -= actualDamage;
    addCombatLog(`💢 ${combat.enemyMonster.name} attaque et inflige ${actualDamage} dégâts!`);

    updateCombatDisplay();

    // Vérifier la défaite
    if (combat.playerMonster.hp <= 0) {
        endCombatDefeat();
        return;
    }

    combat.turn = 'player';
    combat.defending = false;
}

function endCombatVictory() {
    const combat = gameState.currentCombat;

    gameState.player.wins++;
    gameState.player.gold += 50;
    gameState.player.xp += 50;

    // Donner XP au monstre
    const monsterInTeam = gameState.team.find(m => m.id === combat.playerMonster.id);
    if (monsterInTeam) {
        monsterInTeam.xp += 30;
        if (monsterInTeam.xp >= monsterInTeam.xpToNextLevel) {
            levelUpMonster(monsterInTeam);
        }
    }

    checkLevelUp();
    saveGameState();

    showCombatResult('Victoire!', 'Vous avez gagné 50 Monster $ et 50 XP!', 'victory');
}

function endCombatDefeat() {
    gameState.player.losses++;
    saveGameState();

    showCombatResult('Défaite...', 'Votre monstre est KO. Réessayez!', 'defeat');
}

function showCombatResult(title, message, type) {
    const resultDiv = document.getElementById('combat-result');
    const actionsDiv = document.getElementById('combat-actions');

    if (!resultDiv || !actionsDiv) return;

    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;

    resultDiv.classList.remove('hidden', 'victory', 'defeat');
    resultDiv.classList.add(type);
    actionsDiv.classList.add('hidden');
}

function endCombat() {
    resetCombat();
}

function resetCombat() {
    const combatSetup = document.getElementById('combat-setup');
    const combatArena = document.getElementById('combat-arena');
    const resultDiv = document.getElementById('combat-result');
    const actionsDiv = document.getElementById('combat-actions');
    const combatLog = document.getElementById('combat-log');

    if (combatSetup) combatSetup.classList.remove('hidden');
    if (combatArena) combatArena.classList.add('hidden');
    if (resultDiv) resultDiv.classList.add('hidden');
    if (actionsDiv) actionsDiv.classList.remove('hidden');
    if (combatLog) combatLog.innerHTML = '<p>Le combat commence !</p>';

    gameState.currentCombat = null;
    updateUI();
}

function addCombatLog(message) {
    const log = document.getElementById('combat-log');
    if (!log) return;

    const p = document.createElement('p');
    p.textContent = message;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

/* ========================================
   LEVEL UP SYSTEM
   ======================================== */

function checkLevelUp() {
    while (gameState.player.xp >= gameState.player.xpToNextLevel) {
        gameState.player.xp -= gameState.player.xpToNextLevel;
        gameState.player.level++;
        gameState.player.xpToNextLevel = Math.floor(gameState.player.xpToNextLevel * 1.5);

        showNotification(`🎉 Niveau supérieur! Vous êtes maintenant niveau ${gameState.player.level}!`, 'success');
    }

    saveGameState();
    updateDashboard();
}

function levelUpMonster(monster) {
    monster.level++;
    monster.xp = 0;
    monster.xpToNextLevel = Math.floor(monster.xpToNextLevel * 1.3);

    monster.maxHp += 5;
    monster.hp = monster.maxHp;
    monster.attack += 2;
    monster.defense += 2;

    showNotification(`⭐ ${monster.name} passe niveau ${monster.level}!`, 'success');
}

/* ========================================
   NOTIFICATIONS
   ======================================== */

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--info)'};
        color: white;
        border-radius: 8px;
        font-weight: 600;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut'}