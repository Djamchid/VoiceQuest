/**
 * VoiceQuest - Main Application Controller
 * Coordinates all modules and handles UI updates
 */

// Global application state
let appData = null;

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('🎵 Voice Quest - Démarrage de l\'application');
        setupEventListeners();
        initializeApp();
    } catch (e) {
        console.error('Erreur critique au démarrage:', e);
        alert('Une erreur est survenue lors du chargement. Réinitialisation des données...');
        handleResetData();
    }
});

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = e.currentTarget.getAttribute('data-page');
            if (targetPage) showPage(targetPage);
        });
    });

    // Quick action buttons - Modules
    document.querySelectorAll('.action-btn[data-module]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const module = e.currentTarget.getAttribute('data-module');
            showModuleExercises(module, appData);
        });
    });

    // Quick action buttons - Parcours
    document.querySelectorAll('.action-btn[data-parcours]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parcoursName = e.currentTarget.getAttribute('data-parcours');
            showParcoursDetail(parcoursName);
        });
    });

    // Global buttons
    const btnQuest = document.getElementById('generate-quest');
    if (btnQuest) btnQuest.addEventListener('click', handleGenerateQuest);

    const btnExport = document.getElementById('export-btn');
    if (btnExport) btnExport.addEventListener('click', handleExportData);

    const btnReset = document.getElementById('reset-btn');
    if (btnReset) btnReset.addEventListener('click', handleResetData);

    const btnClose = document.getElementById('modal-close');
    if (btnClose) btnClose.addEventListener('click', () => {
        document.getElementById('result-modal').classList.remove('active');
    });
}

/**
 * Initialize application with data
 */
function initializeApp() {
    // Load saved data or use defaults
    appData = loadSavedData();

    // Check daily login
    const isNewDay = checkDailyLogin(appData);
    if (isNewDay) {
        generateDailyQuest();
    }

    // Update all UI components
    updateDashboard();
    renderModules();
    renderParcours();
    updateProfile();
    updateDailyObjectives();

    console.log('✓ Application initialisée');
}

/**
 * Navigate between pages
 * @param {string} pageId - ID of the page to show
 */
function showPage(pageId) {
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Update page visibility
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const activePage = document.getElementById(pageId);
    if (activePage) activePage.classList.add('active');

    // Update profile when viewing profile page
    if (pageId === 'profil') {
        updateProfile();
    }
}

/**
 * Update dashboard display
 */
function updateDashboard() {
    // Update user name
    document.getElementById('user-name').textContent = appData.user.name;

    // Update energy bar
    document.getElementById('energy-fill').style.width = `${appData.user.energy}%`;

    // Update streak
    document.getElementById('current-streak').textContent = appData.user.streak;

    // Update level progress
    const levelProgress = getLevelProgress(appData.user.xp, appData.user.level);
    document.getElementById('next-level-xp').textContent =
        `${levelProgress.remaining} XP restants`;

    // Update recent badges
    updateRecentBadges();
}

/**
 * Update recent badges display on dashboard
 */
function updateRecentBadges() {
    const container = document.getElementById('recent-badges');
    container.innerHTML = '';

    const earnedBadges = Object.values(appData.badges).filter(b => b.earned);

    if (earnedBadges.length === 0) {
        container.innerHTML = '<p>Aucun badge débloqué pour le moment</p>';
        return;
    }

    // Show last 3 earned badges
    earnedBadges.slice(-3).forEach(badge => {
        const badgeEl = document.createElement('div');
        badgeEl.className = 'badge';
        badgeEl.innerHTML = `
            ${badge.icon}
            <div class="badge-tooltip">${badge.name}</div>
        `;
        container.appendChild(badgeEl);
    });
}

/**
 * Update daily objectives display
 */
function updateDailyObjectives() {
    const container = document.getElementById('daily-objectives');
    container.innerHTML = '';

    if (!appData.user.objectives || appData.user.objectives.length === 0) {
        container.innerHTML = '<p>Aucun objectif aujourd\'hui. Cliquez pour en générer !</p>';
        return;
    }

    appData.user.objectives.forEach(obj => {
        const completed = obj.completed ? '✅' : '';
        const progressBar = `
            <div class="progress-bar" style="margin: 5px 0;">
                <div class="progress-fill" style="width: ${Math.min((obj.progress / obj.required) * 100, 100)}%"></div>
            </div>
        `;

        container.innerHTML += `
            <div style="margin-bottom: 15px;">
                <p>${completed} ${obj.description}</p>
                ${progressBar}
                <small>${obj.progress}/${obj.required}</small>
            </div>
        `;
    });
}

/**
 * Update profile page display
 */
function updateProfile() {
    // Update header info
    document.getElementById('profile-name').textContent = appData.user.name;
    document.getElementById('user-level').textContent = appData.user.level;
    document.getElementById('user-xp').textContent = appData.user.xp;
    document.getElementById('user-coins').textContent = appData.user.coins;

    // Update stats
    document.getElementById('profile-streak').textContent = `${appData.user.streak} jours`;
    document.getElementById('profile-time').textContent = `${appData.user.totalTime} min`;
    document.getElementById('profile-coins').textContent = appData.user.coins;
    document.getElementById('profile-sessions').textContent = appData.user.sessionCount;

    // Update badges display
    const badgesContainer = document.getElementById('profile-badges');
    badgesContainer.innerHTML = '';

    Object.values(appData.badges).forEach(badge => {
        const badgeEl = document.createElement('div');
        badgeEl.className = badge.earned ? 'badge' : 'badge locked';
        badgeEl.innerHTML = `
            ${badge.icon}
            <div class="badge-tooltip">${badge.name}: ${badge.description}</div>
        `;
        badgesContainer.innerHTML += badgeEl.outerHTML;
    });

    // Render history chart (simplified)
    renderHistoryChart();
}

/**
 * Render 7-day history chart
 */
function renderHistoryChart() {
    const container = document.getElementById('history-chart');
    if (!container) return;

    const stats = getLast7DaysStats(appData.history);
    const maxXP = Math.max(...stats.map(s => s.xp), 1);

    let html = '<div style="display: flex; align-items: flex-end; gap: 10px; height: 150px;">';

    stats.forEach(day => {
        const height = (day.xp / maxXP) * 120;
        html += `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 100%; background: var(--primary); height: ${height}px; border-radius: 5px 5px 0 0;"></div>
                <small style="margin-top: 5px; font-size: 0.7rem;">${day.date.split('/')[0]}/${day.date.split('/')[1]}</small>
                <small style="font-size: 0.7rem; color: var(--primary);">${day.xp} XP</small>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

/**
 * Render modules grid
 */
function renderModules() {
    const grid = document.getElementById('modules-grid');
    grid.innerHTML = '';

    const icons = {
        souffle: '💨',
        voix: '🎵',
        articulation: '🗣️',
        renforcement: '👄',
        deglutition: '🧏'
    };

    Object.entries(appData.modules).forEach(([key, module]) => {
        const card = document.createElement('div');
        card.className = 'module-card';
        card.innerHTML = `
            <div class="module-icon">${icons[key]}</div>
            <h3>${module.name}</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${module.progress}%"></div>
            </div>
            <p><small>${module.progress}% complété</small></p>
        `;
        card.addEventListener('click', () => showModuleExercises(key, appData));
        grid.appendChild(card);
    });
}

/**
 * Handle generate quest button
 */
function handleGenerateQuest() {
    appData.user.objectives = generateDailyObjectives(appData);
    updateDailyObjectives();
    saveData(appData);
    console.log('✓ Nouveaux objectifs générés');
}

/**
 * Handle export data button
 */
function handleExportData() {
    exportData(appData);
}

/**
 * Handle reset data button
 */
function handleResetData() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toutes vos données ? Cette action est irréversible.')) {
        resetData();
        location.reload();
    }
}

/**
 * Make functions globally accessible
 */
window.showPage = showPage;
window.showModuleExercises = showModuleExercises;
window.startExercise = startExercise;
window.showParcoursDetail = showParcoursDetail;
window.startParcours = startParcours;
window.cancelParcours = cancelParcours;
window.updateDashboard = updateDashboard;
window.updateProfile = updateProfile;
window.appData = appData;
