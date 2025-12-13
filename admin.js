// Admin-Konfiguration
const ADMIN_PASSWORD = 'admin123'; // BITTE IN PRODUKTION ÄNDERN!
const ADMIN_STORAGE_KEY = 'zeiterfassung_admin_logged_in';
const ALL_ENTRIES_STORAGE_KEY = 'zeiterfassung_all_entries'; // Zentrale Speicherung aller Einträge

// Login-Funktionalität
async function initAdmin() {
    console.log('Admin initialisiert'); // Debug
    checkLoginStatus();
    setupAdminListeners();
    // Einträge werden in renderAdminDashboard geladen
}

// Warten bis DOM vollständig geladen ist
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
} else {
    // DOM ist bereits geladen
    initAdmin();
}

async function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    if (isLoggedIn) {
        await showAdminDashboard();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    
    if (loginScreen) {
        loginScreen.classList.remove('hidden');
        loginScreen.style.display = 'flex';
    }
    
    if (adminDashboard) {
        adminDashboard.classList.add('hidden');
        adminDashboard.style.display = 'none';
    }
}

async function showAdminDashboard() {
    console.log('showAdminDashboard aufgerufen'); // Debug
    
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    
    if (!loginScreen) {
        console.error('loginScreen Element nicht gefunden!');
        return;
    }
    
    if (!adminDashboard) {
        console.error('adminDashboard Element nicht gefunden!');
        return;
    }
    
    console.log('Elemente gefunden, wechsle Ansicht...'); // Debug
    
    // Login-Screen verstecken
    loginScreen.classList.add('hidden');
    loginScreen.style.display = 'none';
    
    // Admin-Dashboard anzeigen
    adminDashboard.classList.remove('hidden');
    adminDashboard.style.display = 'block';
    
    console.log('Ansicht gewechselt, rendere Dashboard...'); // Debug
    console.log('loginScreen display:', loginScreen.style.display); // Debug
    console.log('adminDashboard display:', adminDashboard.style.display); // Debug
    
    try {
        await renderAdminDashboard();
        console.log('Dashboard erfolgreich gerendert'); // Debug
    } catch (error) {
        console.error('Fehler beim Rendern des Dashboards:', error);
        alert('Fehler beim Laden des Dashboards. Bitte Seite neu laden.');
    }
}

function setupAdminListeners() {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const adminExportBtn = document.getElementById('adminExportBtn');

    // Debug: Prüfen ob Elemente gefunden wurden
    if (!loginForm) {
        console.error('Login-Formular nicht gefunden!');
        return;
    }

    // Login-Funktion
    function handleLogin() {
        const passwordInput = document.getElementById('adminPassword');
        if (!passwordInput) {
            alert('Passwort-Eingabefeld nicht gefunden!');
            return;
        }
        
        const password = passwordInput.value.trim();
        console.log('Eingegebenes Passwort:', password); // Debug
        console.log('Erwartetes Passwort:', ADMIN_PASSWORD); // Debug
        
        if (password === ADMIN_PASSWORD) {
            console.log('Passwort korrekt! Speichere Login-Status...'); // Debug
            sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
            console.log('Login-Status gespeichert:', sessionStorage.getItem(ADMIN_STORAGE_KEY)); // Debug
            showAdminDashboard();
        } else {
            console.log('Passwort falsch!'); // Debug
            alert('Falsches Passwort! Bitte versuchen Sie es erneut.\n\nStandard-Passwort: admin123');
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    // Form Submit Handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLogin();
        return false;
    });
    
    // Fallback: Direkter Button-Click Handler
    const loginButton = loginForm.querySelector('button[type="submit"]');
    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        showLoginScreen();
        document.getElementById('loginForm').reset();
    });

    applyFilterBtn.addEventListener('click', async () => {
        await renderAdminDashboard();
    });

    resetFilterBtn.addEventListener('click', async () => {
        document.getElementById('filterEmployee').value = '';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        await renderAdminDashboard();
    });

    adminExportBtn.addEventListener('click', () => {
        exportAllEntries();
    });
}

// Alle Einträge laden (von API)
async function loadAllEntries() {
    try {
        const allEntries = await window.apiClient.fetchEntries();
        return allEntries || [];
    } catch (error) {
        console.error('Fehler beim Laden der Einträge:', error);
        return [];
    }
}

// Alle Einträge speichern (nicht mehr benötigt, da direkt API verwendet wird)
function saveAllEntries(entries) {
    // Diese Funktion wird nicht mehr verwendet
    console.warn('saveAllEntries wird nicht mehr verwendet - API wird direkt verwendet');
}

// Admin Dashboard rendern
async function renderAdminDashboard() {
    console.log('renderAdminDashboard aufgerufen'); // Debug
    
    try {
        const allEntries = await loadAllEntries();
        console.log('Einträge geladen:', allEntries.length); // Debug
        
        // Debug: Zeige alle Mitarbeiter-Namen
        const uniqueEmployees = new Set(
            allEntries
                .filter(e => e.employeeName && e.employeeName !== 'Unbekannt')
                .map(e => e.employeeName)
        );
        console.log('Eindeutige Mitarbeiter gefunden:', Array.from(uniqueEmployees)); // Debug
        console.log('Anzahl eindeutiger Mitarbeiter:', uniqueEmployees.size); // Debug
        
        const filteredEntries = applyFilters(allEntries);
        console.log('Einträge gefiltert:', filteredEntries.length); // Debug
        
        // Statistiken aktualisieren
        updateStatistics(allEntries, filteredEntries);
        console.log('Statistiken aktualisiert'); // Debug
        
        // Mitarbeiter-Liste aktualisieren
        updateEmployeeList(allEntries);
        console.log('Mitarbeiter-Liste aktualisiert'); // Debug
        
        // Tabelle rendern
        renderAdminTable(filteredEntries);
        console.log('Tabelle gerendert'); // Debug
    } catch (error) {
        console.error('Fehler in renderAdminDashboard:', error);
        throw error;
    }
}

function applyFilters(allEntries) {
    const employeeFilter = document.getElementById('filterEmployee').value;
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    
    let filtered = [...allEntries];
    
    // Mitarbeiter-Filter
    if (employeeFilter) {
        filtered = filtered.filter(entry => entry.employeeName === employeeFilter);
    }
    
    // Datum-Filter
    if (dateFrom) {
        filtered = filtered.filter(entry => entry.datum >= dateFrom);
    }
    
    if (dateTo) {
        filtered = filtered.filter(entry => entry.datum <= dateTo);
    }
    
    // Nach Datum sortieren (neueste zuerst)
    filtered.sort((a, b) => new Date(b.datum) - new Date(a.datum));
    
    return filtered;
}

function updateStatistics(allEntries, filteredEntries) {
    // Gesamt Einträge
    const totalEntriesEl = document.getElementById('totalEntries');
    if (totalEntriesEl) {
        totalEntriesEl.textContent = allEntries.length;
    }
    
    // Anzahl Mitarbeiter (nur Einträge mit Mitarbeiter-Name)
    const employeesWithName = allEntries.filter(e => e.employeeName && e.employeeName !== 'Unbekannt');
    const uniqueEmployees = new Set(employeesWithName.map(e => e.employeeName)).size;
    const totalEmployeesEl = document.getElementById('totalEmployees');
    if (totalEmployeesEl) {
        totalEmployeesEl.textContent = uniqueEmployees;
    }
    
    // Einträge diesen Monat
    const now = new Date();
    const thisMonth = allEntries.filter(entry => {
        if (!entry.datum) return false;
        try {
            const entryDate = new Date(entry.datum);
            return entryDate.getMonth() === now.getMonth() && 
                   entryDate.getFullYear() === now.getFullYear();
        } catch (e) {
            return false;
        }
    }).length;
    const thisMonthEl = document.getElementById('thisMonthEntries');
    if (thisMonthEl) {
        thisMonthEl.textContent = thisMonth;
    }
}

function updateEmployeeList(allEntries) {
    const employeeSelect = document.getElementById('filterEmployee');
    if (!employeeSelect) return;
    
    const currentValue = employeeSelect.value;
    
    // Alle eindeutigen Mitarbeiter sammeln (Name + E-Mail Kombination)
    // Verwende ein Set mit einem eindeutigen Schlüssel (Name + E-Mail)
    const employeeMap = new Map();
    
    allEntries.forEach(entry => {
        if (entry.employeeName && entry.employeeName !== 'Unbekannt') {
            // Verwende nur den Namen als Schlüssel
            const key = entry.employeeName;
            
            // Speichere den Namen für die Anzeige
            if (!employeeMap.has(key)) {
                employeeMap.set(key, {
                    displayName: entry.employeeName,
                    filterName: entry.employeeName // Für Filter verwenden wir den Namen
                });
            }
        }
    });
    
    // Sortiere nach Anzeigename
    const employees = Array.from(employeeMap.values())
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
    
    // Select-Optionen aktualisieren
    employeeSelect.innerHTML = '<option value="">Alle Mitarbeiter</option>';
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.filterName; // Filter verwendet nur den Namen
        option.textContent = employee.displayName; // Anzeige zeigt Name + E-Mail
        employeeSelect.appendChild(option);
    });
    
    // Vorherigen Wert wiederherstellen
    if (currentValue) {
        const matchingOption = Array.from(employeeSelect.options).find(
            opt => opt.value === currentValue
        );
        if (matchingOption) {
            employeeSelect.value = currentValue;
        }
    }
}

function renderAdminTable(entries) {
    const tbody = document.getElementById('adminEntriesBody');
    const noEntries = document.getElementById('adminNoEntries');
    
    if (!tbody || !noEntries) {
        console.error('Tabelle-Elemente nicht gefunden!');
        return;
    }
    
    if (entries.length === 0) {
        tbody.innerHTML = '';
        noEntries.classList.remove('hidden');
        return;
    }
    
    noEntries.classList.add('hidden');
    tbody.innerHTML = entries.map(entry => {
        // Sicherstellen, dass alle Felder vorhanden sind
        const datumFormatted = entry.datum ? formatDate(entry.datum) : '-';
        const employeeName = entry.employeeName || 'Unbekannt';
        const strecke = entry.strecke || '-';
        const bemerkung = entry.bemerkung || '-';
        const entryId = entry.id || entry._id;
        
        return `
            <tr>
                <td>${datumFormatted}</td>
                <td>${escapeHtml(employeeName)}</td>
                <td>${escapeHtml(strecke)}</td>
                <td>${entry.einfach ? '<span class="check-icon">✓</span>' : ''}</td>
                <td>${entry.hinZurueck ? '<span class="check-icon">✓</span>' : ''}</td>
                <td>${escapeHtml(bemerkung)}</td>
                <td>
                    <button class="btn-icon btn-delete" onclick="deleteAdminEntry('${entryId}')" title="Eintrag löschen">
                        Löschen
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Admin: Eintrag löschen (global verfügbar für onclick)
window.deleteAdminEntry = async function(entryId) {
    if (!entryId) {
        alert('Fehler: Eintrag-ID nicht gefunden.');
        return;
    }
    
    if (confirm('Möchten Sie diesen Eintrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
        try {
            await window.apiClient.deleteEntry(entryId);
            // Dashboard neu laden
            await renderAdminDashboard();
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
            alert('Fehler beim Löschen: ' + error.message);
        }
    }
}

// Export-Funktion
async function exportAllEntries() {
    const allEntries = await loadAllEntries();
    const filteredEntries = applyFilters(allEntries);
    
    if (filteredEntries.length === 0) {
        alert('Keine Einträge zum Exportieren vorhanden.');
        return;
    }
    
    // CSV-Format erstellen
    const headers = ['Datum', 'Strecke', 'Einfach', 'Hin & zurück', 'Bemerkung'];
    
    // Hilfsfunktion zum Escapen von CSV-Werten
    function escapeCSV(value) {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // Wenn der Wert Kommas, Anführungszeichen oder Zeilenumbrüche enthält, in Anführungszeichen setzen
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return '"' + stringValue.replace(/"/g, '""') + '"';
        }
        return stringValue;
    }
    
    const rows = filteredEntries.map(entry => [
        formatDate(entry.datum),
        entry.strecke || '',
        entry.einfach ? 'x' : '',
        entry.hinZurueck ? 'x' : '',
        entry.bemerkung || ''
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => escapeCSV(cell)).join(','))
    ].join('\n');
    
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const dateRange = filteredEntries.length === allEntries.length 
        ? 'alle' 
        : `gefiltert_${new Date().toISOString().split('T')[0]}`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', `zeiterfassung_${dateRange}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

