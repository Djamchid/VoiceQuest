/**
 * VoiceQuest - Exercises Module
 * Handles exercise display and execution logic
 */

// Current exercise state
let currentExercise = {
    data: null,
    moduleName: null,
    timerInterval: null,
    timeLeft: 0,
    repCount: 0,
    isRunning: false
};

/**
 * Show module exercises list
 * @param {string} moduleName - Name of the module
 * @param {Object} appData - Application data
 */
function showModuleExercises(moduleName, appData) {
    const module = appData.modules[moduleName];
    const moduleExercises = exercises[moduleName];

    if (!module || !moduleExercises) return;

    let html = `
        <h2>${module.name}</h2>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${module.progress}%"></div>
        </div>
        <p style="margin-bottom:20px;">${module.progress}% complété</p>
        <div class="exercise-container">
    `;

    moduleExercises.forEach(exercise => {
        const isCompleted = appData.history.some(
            h => h.module === moduleName && h.exerciseId === exercise.id
        );
        html += `
            <div class="exercise-card">
                <h3>${exercise.name} ${isCompleted ? '✅' : ''}</h3>
                <p>${exercise.instructions}</p>
                <p><small>⏱️ ${exercise.duration}s | ⭐ ${exercise.xp} XP</small></p>
                <div class="controls">
                    <button class="btn btn-primary" onclick="startExercise('${moduleName}', ${exercise.id})">
                        ${isCompleted ? 'Refaire' : 'Commencer'}
                    </button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    document.getElementById('exercise-content').innerHTML = html;
    showPage('exercices');
}

/**
 * Start an exercise
 * @param {string} moduleName - Module name
 * @param {number} exerciseId - Exercise ID
 */
function startExercise(moduleName, exerciseId) {
    const exercise = exercises[moduleName].find(e => e.id === exerciseId);
    if (!exercise) return;

    currentExercise.data = exercise;
    currentExercise.moduleName = moduleName;
    currentExercise.timeLeft = exercise.duration;
    currentExercise.repCount = 0;

    let html = `
        <div class="exercise-card">
            <h3>${exercise.name}</h3>
            <p>${exercise.instructions}</p>
            <div class="timer">
                <div class="timer-circle" id="exercise-timer">${exercise.duration}</div>
            </div>
            <div class="controls">
                <button class="btn btn-primary" id="start-btn">Démarrer</button>
                <button class="btn btn-secondary" id="pause-btn" disabled>Pause</button>
                <button class="btn btn-warning" id="stop-btn" disabled>Arrêter</button>
            </div>
            <div id="repetition-counter" style="display: none; text-align: center; margin: 20px 0;">
                <h3>Répétitions: <span id="rep-count">0</span>/<span id="rep-total">${exercise.reps || 0}</span></h3>
                <button class="btn btn-success" id="rep-btn">+1 Répétition</button>
            </div>
        </div>
    `;

    document.getElementById('exercise-content').innerHTML = html;

    if (exercise.type === 'timer') {
        setupTimerExercise();
    } else {
        setupRepetitionExercise();
    }
}

/**
 * Setup timer-based exercise
 */
function setupTimerExercise() {
    const btnStart = document.getElementById('start-btn');
    const btnPause = document.getElementById('pause-btn');
    const btnStop = document.getElementById('stop-btn');
    const timerDisplay = document.getElementById('exercise-timer');

    btnStart.addEventListener('click', () => {
        if (!currentExercise.isRunning) {
            currentExercise.isRunning = true;
            btnStart.disabled = true;
            btnPause.disabled = false;
            btnStop.disabled = false;

            currentExercise.timerInterval = setInterval(() => {
                currentExercise.timeLeft--;
                timerDisplay.textContent = currentExercise.timeLeft;

                if (currentExercise.timeLeft <= 0) {
                    clearInterval(currentExercise.timerInterval);
                    completeExercise(currentExercise.data.duration);
                }
            }, 1000);
        }
    });

    btnPause.addEventListener('click', () => {
        if (currentExercise.isRunning) {
            clearInterval(currentExercise.timerInterval);
            currentExercise.isRunning = false;
            btnStart.disabled = false;
            btnPause.disabled = true;
            btnStart.textContent = 'Reprendre';
        }
    });

    btnStop.addEventListener('click', () => {
        clearInterval(currentExercise.timerInterval);
        const actualDuration = currentExercise.data.duration - currentExercise.timeLeft;
        completeExercise(actualDuration);
    });
}

/**
 * Setup repetition-based exercise
 */
function setupRepetitionExercise() {
    document.getElementById('repetition-counter').style.display = 'block';
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('pause-btn').style.display = 'none';
    document.getElementById('stop-btn').disabled = false;
    document.getElementById('stop-btn').textContent = "Terminer";

    const totalReps = currentExercise.data.reps;

    document.getElementById('rep-btn').addEventListener('click', () => {
        currentExercise.repCount++;
        document.getElementById('rep-count').textContent = currentExercise.repCount;

        if (currentExercise.repCount >= totalReps) {
            completeExercise(null, currentExercise.repCount);
        }
    });

    document.getElementById('stop-btn').addEventListener('click', () => {
        completeExercise(null, currentExercise.repCount);
    });
}

/**
 * Complete an exercise and update progress
 * @param {number} actualDuration - Actual time spent (for timer exercises)
 * @param {number} actualReps - Actual reps completed (for repetition exercises)
 */
function completeExercise(actualDuration, actualReps = null) {
    const exercise = currentExercise.data;
    const moduleName = currentExercise.moduleName;

    // Calculate completion ratio
    let completionRatio = 1;
    if (exercise.type === 'timer') {
        completionRatio = Math.min(actualDuration / exercise.duration, 1);
    } else {
        completionRatio = Math.min((actualReps || 0) / exercise.reps, 1);
    }

    // Calculate rewards
    const rewards = calculateRewards(exercise, completionRatio);
    const xpEarned = rewards.xp;
    const coinsEarned = rewards.coins;

    // Update user stats
    appData.user.xp += xpEarned;
    appData.user.coins += coinsEarned;
    appData.user.energy = Math.max(0, appData.user.energy - 5);
    appData.user.totalTime += Math.ceil((actualDuration || exercise.duration) / 60);
    appData.user.sessionCount++;

    // Update user level
    const oldLevel = appData.user.level;
    appData.user.level = calculateLevel(appData.user.xp);
    if (appData.user.level > oldLevel) {
        console.log(`🎉 Niveau supérieur! Vous êtes maintenant niveau ${appData.user.level}`);
    }

    // Update module progress
    const module = appData.modules[moduleName];
    const alreadyCompleted = appData.history.some(
        h => h.module === moduleName && h.exerciseId === exercise.id
    );

    if (!alreadyCompleted) {
        module.exercisesCompleted++;
        module.progress = Math.round((module.exercisesCompleted / module.totalExercises) * 100);

        if (module.exercisesCompleted === module.totalExercises) {
            module.completed = true;
            console.log(`🎊 Module ${module.name} complété!`);
        }
    }

    // Add to history
    appData.history.push({
        date: new Date().toISOString(),
        module: moduleName,
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        xp: xpEarned,
        duration: Math.ceil((actualDuration || exercise.duration) / 60)
    });

    // Update objectives
    updateObjectivesProgress(appData, moduleName, xpEarned);

    // Check for new badges
    checkBadges(appData);

    // Update UI and save
    updateDashboard();
    updateProfile();
    saveData(appData);

    // Show result modal
    showResultModal(exercise.name, xpEarned, coinsEarned);

    // Reset current exercise state
    currentExercise = {
        data: null,
        moduleName: null,
        timerInterval: null,
        timeLeft: 0,
        repCount: 0,
        isRunning: false
    };
}

/**
 * Show result modal after exercise completion
 * @param {string} title - Exercise name
 * @param {number} xp - XP earned
 * @param {number} coins - Coins earned
 */
function showResultModal(title, xp, coins) {
    const modal = document.getElementById('result-modal');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <p style="font-size:1.2rem;">Bravo !</p>
        <p><strong>${title}</strong></p>
        <p>🎯 XP gagné: +${xp}</p>
        <p>💰 Pièces: +${coins}</p>
    `;
    modal.classList.add('active');
}

/**
 * Export for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showModuleExercises,
        startExercise,
        completeExercise,
        showResultModal
    };
}
