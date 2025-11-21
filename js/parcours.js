/**
 * VoiceQuest - Parcours Module
 * Handles guided path execution with sequential exercises
 */

// Current parcours state
let currentParcours = {
    name: null,
    data: null,
    currentStepIndex: 0,
    totalXP: 0,
    startTime: null,
    isActive: false
};

/**
 * Show parcours detail page
 * @param {string} parcoursName - Name of the parcours
 */
function showParcoursDetail(parcoursName) {
    const pData = parcours[parcoursName];
    if (!pData) return;

    let html = `
        <div style="margin-bottom: 20px;">
            <button class="btn btn-secondary" onclick="showPage('parcours')">← Retour aux parcours</button>
        </div>
        <h2>${pData.name}</h2>
        <p><strong>${pData.duration} min • ${pData.difficulty}</strong></p>
        <p>${pData.description}</p>
        <p style="margin-top: 10px;"><em>⭐ Récompense: ${pData.xp} XP</em></p>
        <div class="parcours-steps">
            <h3 style="margin:20px 0;">Étapes:</h3>
    `;

    pData.steps.forEach((step, index) => {
        const exercise = exercises[step.module]?.find(e => e.name === step.exercise);
        const duration = exercise ? Math.ceil(exercise.duration / 60) : Math.ceil(step.duration / 60);
        html += `
            <div class="step">
                <div class="step-number">${index + 1}</div>
                <div>
                    <h4>${step.exercise}</h4>
                    <p><small>Module: ${step.module} • ~${duration} min</small></p>
                </div>
            </div>
        `;
    });

    html += `
        </div>
        <div style="margin-top: 30px; padding: 20px; background: var(--light); border-radius: 10px;">
            <h4>Phrase de validation</h4>
            <p style="font-style: italic; color: var(--primary);">"${pData.validation}"</p>
        </div>
        <div class="controls" style="margin-top:30px;">
            <button class="btn btn-primary" onclick="startParcours('${parcoursName}')">
                ▶ Commencer le Parcours
            </button>
        </div>
    `;

    document.getElementById('parcours-content').innerHTML = html;
    showPage('parcours-detail');
}

/**
 * Start a parcours (sequential exercise execution)
 * @param {string} parcoursName - Name of the parcours to start
 */
function startParcours(parcoursName) {
    const pData = parcours[parcoursName];
    if (!pData || !pData.steps || pData.steps.length === 0) {
        alert("Erreur: Parcours invalide");
        return;
    }

    // Initialize parcours state
    currentParcours = {
        name: parcoursName,
        data: pData,
        currentStepIndex: 0,
        totalXP: 0,
        startTime: Date.now(),
        isActive: true
    };

    console.log(`🗺️ Démarrage du parcours: ${pData.name}`);
    executeNextParcoursStep();
}

/**
 * Execute the next step in the current parcours
 */
function executeNextParcoursStep() {
    if (!currentParcours.isActive || !currentParcours.data) {
        return;
    }

    const step = currentParcours.data.steps[currentParcours.currentStepIndex];

    if (!step) {
        // All steps completed
        completeParcours();
        return;
    }

    // Find the exercise
    const exercise = exercises[step.module]?.find(e => e.name === step.exercise);

    if (!exercise) {
        console.error(`Exercice non trouvé: ${step.exercise} dans ${step.module}`);
        currentParcours.currentStepIndex++;
        executeNextParcoursStep();
        return;
    }

    // Show parcours progress
    const totalSteps = currentParcours.data.steps.length;
    const currentStep = currentParcours.currentStepIndex + 1;

    let html = `
        <div style="margin-bottom: 20px;">
            <h3>📍 Parcours: ${currentParcours.data.name}</h3>
            <p>Étape ${currentStep} sur ${totalSteps}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(currentStep / totalSteps) * 100}%"></div>
            </div>
        </div>
        <div class="exercise-card">
            <h3>${exercise.name}</h3>
            <p>${exercise.instructions}</p>
            <div class="timer">
                <div class="timer-circle" id="exercise-timer">${exercise.duration}</div>
            </div>
            <div class="controls">
                <button class="btn btn-primary" id="start-btn">Démarrer</button>
                <button class="btn btn-secondary" id="pause-btn" disabled>Pause</button>
                <button class="btn btn-warning" id="stop-btn" disabled>Passer</button>
            </div>
            <div id="repetition-counter" style="display: none; text-align: center; margin: 20px 0;">
                <h3>Répétitions: <span id="rep-count">0</span>/<span id="rep-total">${exercise.reps || 0}</span></h3>
                <button class="btn btn-success" id="rep-btn">+1 Répétition</button>
            </div>
        </div>
        <div style="margin-top: 20px; text-align: center;">
            <button class="btn btn-warning" onclick="cancelParcours()">❌ Abandonner le parcours</button>
        </div>
    `;

    document.getElementById('exercise-content').innerHTML = html;
    showPage('exercices');

    // Setup exercise with parcours completion callback
    if (exercise.type === 'timer') {
        setupParcoursTimerExercise(exercise, step.module);
    } else {
        setupParcoursRepetitionExercise(exercise, step.module);
    }
}

/**
 * Setup timer exercise within parcours
 */
function setupParcoursTimerExercise(exercise, moduleName) {
    let timeLeft = exercise.duration;
    let timerInterval;
    let isRunning = false;

    const btnStart = document.getElementById('start-btn');
    const btnPause = document.getElementById('pause-btn');
    const btnStop = document.getElementById('stop-btn');
    const timerDisplay = document.getElementById('exercise-timer');

    btnStart.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            btnStart.disabled = true;
            btnPause.disabled = false;
            btnStop.disabled = false;

            timerInterval = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = timeLeft;

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    onParcoursExerciseComplete(exercise, moduleName, exercise.duration);
                }
            }, 1000);
        }
    });

    btnPause.addEventListener('click', () => {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            btnStart.disabled = false;
            btnPause.disabled = true;
            btnStart.textContent = 'Reprendre';
        }
    });

    btnStop.addEventListener('click', () => {
        clearInterval(timerInterval);
        const actualDuration = exercise.duration - timeLeft;
        onParcoursExerciseComplete(exercise, moduleName, actualDuration);
    });
}

/**
 * Setup repetition exercise within parcours
 */
function setupParcoursRepetitionExercise(exercise, moduleName) {
    document.getElementById('repetition-counter').style.display = 'block';
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('pause-btn').style.display = 'none';
    document.getElementById('stop-btn').disabled = false;
    document.getElementById('stop-btn').textContent = "Terminer";

    let repCount = 0;
    const totalReps = exercise.reps;

    document.getElementById('rep-btn').addEventListener('click', () => {
        repCount++;
        document.getElementById('rep-count').textContent = repCount;

        if (repCount >= totalReps) {
            onParcoursExerciseComplete(exercise, moduleName, exercise.duration, repCount);
        }
    });

    document.getElementById('stop-btn').addEventListener('click', () => {
        onParcoursExerciseComplete(exercise, moduleName, exercise.duration, repCount);
    });
}

/**
 * Handle exercise completion within parcours
 */
function onParcoursExerciseComplete(exercise, moduleName, actualDuration, actualReps = null) {
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

    // Accumulate XP for parcours
    currentParcours.totalXP += xpEarned;

    // Update history (light version for parcours steps)
    appData.history.push({
        date: new Date().toISOString(),
        module: moduleName,
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        xp: xpEarned,
        parcours: currentParcours.name
    });

    // Update objectives progress
    updateObjectivesProgress(appData, moduleName, xpEarned);

    console.log(`✓ Étape ${currentParcours.currentStepIndex + 1} terminée: ${exercise.name} (+${xpEarned} XP)`);

    // Move to next step
    currentParcours.currentStepIndex++;
    setTimeout(() => {
        executeNextParcoursStep();
    }, 1000);
}

/**
 * Complete the entire parcours
 */
function completeParcours() {
    if (!currentParcours.isActive) return;

    const totalDuration = Math.round((Date.now() - currentParcours.startTime) / 60000); // minutes
    const bonusXP = currentParcours.data.xp;
    const totalXP = currentParcours.totalXP + bonusXP;
    const coinsEarned = Math.round(totalXP / 5);

    // Update user stats
    appData.user.xp += totalXP;
    appData.user.coins += coinsEarned;
    appData.user.totalTime += totalDuration;
    appData.user.sessionCount++;

    // Update level
    const oldLevel = appData.user.level;
    appData.user.level = calculateLevel(appData.user.xp);

    // Check for Marathonien badge (45min parcours)
    if (currentParcours.name === 'complet' && !appData.badges.marathonien.earned) {
        appData.badges.marathonien.earned = true;
        console.log('🏆 Badge Marathonien débloqué!');
    }

    // Check other badges
    checkBadges(appData);

    // Save data
    saveData(appData);
    updateDashboard();
    updateProfile();

    // Show completion modal
    const modal = document.getElementById('result-modal');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <h2>🎊 Parcours Terminé !</h2>
        <p style="font-size:1.2rem;"><strong>${currentParcours.data.name}</strong></p>
        <p>⏱️ Durée: ${totalDuration} minutes</p>
        <p>🎯 XP total gagné: +${totalXP}</p>
        <p>💰 Pièces: +${coinsEarned}</p>
        ${oldLevel < appData.user.level ? `<p style="color: var(--accent); font-weight: bold;">🎉 Niveau ${appData.user.level} atteint!</p>` : ''}
        <div style="margin-top: 20px; padding: 15px; background: var(--light); border-radius: 10px;">
            <p style="font-style: italic;">"${currentParcours.data.validation}"</p>
        </div>
    `;
    modal.classList.add('active');

    // Reset parcours state
    currentParcours = {
        name: null,
        data: null,
        currentStepIndex: 0,
        totalXP: 0,
        startTime: null,
        isActive: false
    };
}

/**
 * Cancel the current parcours
 */
function cancelParcours() {
    if (confirm('Êtes-vous sûr de vouloir abandonner ce parcours ?')) {
        console.log('Parcours abandonné');
        currentParcours.isActive = false;
        currentParcours = {
            name: null,
            data: null,
            currentStepIndex: 0,
            totalXP: 0,
            startTime: null,
            isActive: false
        };
        showPage('parcours');
    }
}

/**
 * Export for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showParcoursDetail,
        startParcours,
        cancelParcours
    };
}
