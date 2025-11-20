/**
 * VoiceQuest - Export Module
 * Handles data export to CSV format
 */

/**
 * Export user data to CSV file
 * @param {Object} appData - Application data to export
 */
function exportData(appData) {
    try {
        const csvContent = generateCSV(appData);
        const filename = `voicequest_export_${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(csvContent, filename);
        console.log('✓ Données exportées avec succès');
    } catch (e) {
        console.error('Erreur lors de l\'export:', e);
        alert('Erreur lors de l\'export des données');
    }
}

/**
 * Generate CSV content from application data
 * @param {Object} appData - Application data
 * @returns {string} - CSV formatted string
 */
function generateCSV(appData) {
    let csv = '';

    // Section 1: User Profile
    csv += '=== PROFIL UTILISATEUR ===\n';
    csv += 'Nom,Niveau,XP Total,Pièces,Série (jours),Sessions Totales,Temps Total (min)\n';
    csv += `${appData.user.name},${appData.user.level},${appData.user.xp},${appData.user.coins},${appData.user.streak},${appData.user.sessionCount},${appData.user.totalTime}\n`;
    csv += '\n';

    // Section 2: Modules Progress
    csv += '=== PROGRESSION PAR MODULE ===\n';
    csv += 'Module,Nom,Progression (%),Exercices Complétés,Exercices Totaux,Complété\n';
    Object.entries(appData.modules).forEach(([key, module]) => {
        csv += `${key},${module.name},${module.progress},${module.exercisesCompleted},${module.totalExercises},${module.completed ? 'Oui' : 'Non'}\n`;
    });
    csv += '\n';

    // Section 3: Badges Earned
    csv += '=== BADGES DÉBLOQUÉS ===\n';
    csv += 'Badge,Nom,Description,Débloqué\n';
    Object.entries(appData.badges).forEach(([key, badge]) => {
        csv += `${key},${badge.name},"${badge.description}",${badge.earned ? 'Oui' : 'Non'}\n`;
    });
    csv += '\n';

    // Section 4: Session History
    csv += '=== HISTORIQUE DES SESSIONS ===\n';
    csv += 'Date,Module,Exercice,XP Gagné,Durée (min),Parcours\n';

    // Group history by date for better readability
    const historyByDate = {};
    appData.history.forEach(entry => {
        const dateStr = new Date(entry.date).toLocaleDateString('fr-FR');
        if (!historyByDate[dateStr]) {
            historyByDate[dateStr] = [];
        }
        historyByDate[dateStr].push(entry);
    });

    Object.entries(historyByDate).forEach(([date, entries]) => {
        entries.forEach(entry => {
            const exerciseName = entry.exerciseName || `Exercice ${entry.exerciseId}`;
            const duration = entry.duration || 0;
            const parcours = entry.parcours || '-';
            csv += `${date},${entry.module},${exerciseName},${entry.xp},${duration},${parcours}\n`;
        });
    });
    csv += '\n';

    // Section 5: Daily Statistics
    csv += '=== STATISTIQUES PAR JOUR (7 derniers jours) ===\n';
    csv += 'Date,Sessions,XP Total,Temps Total (min)\n';

    const last7Days = getLast7DaysStats(appData.history);
    last7Days.forEach(day => {
        csv += `${day.date},${day.sessions},${day.xp},${day.duration}\n`;
    });
    csv += '\n';

    // Section 6: Summary
    csv += '=== RÉSUMÉ ===\n';
    const totalExercises = appData.history.length;
    const totalModules = Object.values(appData.modules).filter(m => m.completed).length;
    const totalBadges = Object.values(appData.badges).filter(b => b.earned).length;
    const avgSessionTime = appData.user.sessionCount > 0
        ? Math.round(appData.user.totalTime / appData.user.sessionCount)
        : 0;

    csv += `Exercices Complétés,${totalExercises}\n`;
    csv += `Modules Complétés,${totalModules}/5\n`;
    csv += `Badges Débloqués,${totalBadges}/7\n`;
    csv += `Temps Moyen par Session,${avgSessionTime} min\n`;
    csv += `Dernier Login,${appData.user.lastLogin || 'Jamais'}\n`;

    return csv;
}

/**
 * Get statistics for the last 7 days
 * @param {Array} history - Exercise history
 * @returns {Array} - Array of daily stats
 */
function getLast7DaysStats(history) {
    const stats = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('fr-FR');

        const dayEntries = history.filter(entry => {
            const entryDate = new Date(entry.date).toLocaleDateString('fr-FR');
            return entryDate === dateStr;
        });

        stats.push({
            date: dateStr,
            sessions: dayEntries.length,
            xp: dayEntries.reduce((sum, e) => sum + (e.xp || 0), 0),
            duration: dayEntries.reduce((sum, e) => sum + (e.duration || 0), 0)
        });
    }

    return stats;
}

/**
 * Trigger CSV file download
 * @param {string} content - CSV content
 * @param {string} filename - Filename for download
 */
function downloadCSV(content, filename) {
    // Create a Blob with UTF-8 BOM for proper Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });

    // Create download link and trigger click
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } else {
        alert('Votre navigateur ne supporte pas le téléchargement de fichiers');
    }
}

/**
 * Export for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exportData,
        generateCSV,
        getLast7DaysStats,
        downloadCSV
    };
}
