/**
 * API Client für Vercel Backend
 * 
 * Diese Datei zeigt, wie die API verwendet wird.
 * Sie können diese Funktionen in app.js und admin.js verwenden.
 */

const API_BASE = window.location.origin; // Automatisch: https://ihre-app.vercel.app

// ============================================
// AUTHENTIFIZIERUNG
// ============================================

/**
 * Mitarbeiter anmelden
 */
async function loginEmployee(name, password) {
    try {
        const response = await fetch(`${API_BASE}/api/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                password: password,
                action: 'login'
            })
        });

        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error || 'Login fehlgeschlagen');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

/**
 * Mitarbeiter registrieren
 */
async function registerEmployee(name, password) {
    try {
        const response = await fetch(`${API_BASE}/api/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                password: password,
                action: 'register'
            })
        });

        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error || 'Registrierung fehlgeschlagen');
        }
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
}

// ============================================
// EINTRÄGE
// ============================================

/**
 * Alle Einträge abrufen
 * @param {Object} filters - Optional: { employeeName, employeeEmail, dateFrom, dateTo }
 */
async function fetchEntries(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = `${API_BASE}/api/entries${queryParams ? '?' + queryParams : ''}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error || 'Fehler beim Laden der Einträge');
        }
    } catch (error) {
        console.error('Fetch entries error:', error);
        throw error;
    }
}

/**
 * Neuen Eintrag erstellen
 */
async function createEntry(entry) {
    try {
        const response = await fetch(`${API_BASE}/api/entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry)
        });

        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error || 'Fehler beim Erstellen des Eintrags');
        }
    } catch (error) {
        console.error('Create entry error:', error);
        throw error;
    }
}

/**
 * Eintrag aktualisieren
 */
async function updateEntry(entryId, updateData) {
    try {
        const response = await fetch(`${API_BASE}/api/entries`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: entryId,
                ...updateData
            })
        });

        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error || 'Fehler beim Aktualisieren des Eintrags');
        }
    } catch (error) {
        console.error('Update entry error:', error);
        throw error;
    }
}

/**
 * Eintrag löschen
 */
async function deleteEntry(entryId) {
    try {
        const response = await fetch(`${API_BASE}/api/entries?entryId=${entryId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        
        if (result.success) {
            return true;
        } else {
            throw new Error(result.error || 'Fehler beim Löschen des Eintrags');
        }
    } catch (error) {
        console.error('Delete entry error:', error);
        throw error;
    }
}

// ============================================
// EXPORT FÜR VERWENDUNG
// ============================================

// Für Verwendung in anderen Dateien:
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loginEmployee,
        registerEmployee,
        fetchEntries,
        createEntry,
        updateEntry,
        deleteEntry
    };
}

// Oder als globale Funktionen (für direkte Verwendung):
window.apiClient = {
    loginEmployee,
    registerEmployee,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry
};

