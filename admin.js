// Admin-Konfiguration
const ADMIN_PASSWORD = 'admin123'; // BITTE IN PRODUKTION ÄNDERN!
const ADMIN_STORAGE_KEY = 'zeiterfassung_admin_logged_in';
const ALL_ENTRIES_STORAGE_KEY = 'zeiterfassung_all_entries'; // Zentrale Speicherung aller Einträge

// Login-Funktionalität
function initAdmin() {
    console.log('Admin initialisiert'); // Debug
    checkLoginStatus();
    setupAdminListeners();
    loadAllEntries();
}

// Warten bis DOM vollständig geladen ist
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
} else {
    // DOM ist bereits geladen
    initAdmin();
}

function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    if (isLoggedIn) {
        showAdminDashboard();
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

function showAdminDashboard() {
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
        renderAdminDashboard();
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

    applyFilterBtn.addEventListener('click', () => {
        renderAdminDashboard();
    });

    resetFilterBtn.addEventListener('click', () => {
        document.getElementById('filterEmployee').value = '';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        renderAdminDashboard();
    });

    adminExportBtn.addEventListener('click', () => {
        exportAllEntries();
    });
}

// Alle Einträge laden (aus zentralem Storage)
function loadAllEntries() {
    const stored = localStorage.getItem(ALL_ENTRIES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Alle Einträge speichern
function saveAllEntries(entries) {
    localStorage.setItem(ALL_ENTRIES_STORAGE_KEY, JSON.stringify(entries));
}

// Admin Dashboard rendern
function renderAdminDashboard() {
    console.log('renderAdminDashboard aufgerufen'); // Debug
    
    try {
        const allEntries = loadAllEntries();
        console.log('Einträge geladen:', allEntries.length); // Debug
        
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
    
    // Alle Mitarbeiter-Namen sammeln (nur gültige Namen)
    const employees = [...new Set(
        allEntries
            .map(e => e.employeeName)
            .filter(name => name && name !== 'Unbekannt')
    )].sort();
    
    // Select-Optionen aktualisieren
    employeeSelect.innerHTML = '<option value="">Alle Mitarbeiter</option>';
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee;
        option.textContent = employee;
        employeeSelect.appendChild(option);
    });
    
    // Vorherigen Wert wiederherstellen
    if (currentValue && employees.includes(currentValue)) {
        employeeSelect.value = currentValue;
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
        const employeeEmail = entry.employeeEmail || '-';
        const strecke = entry.strecke || '-';
        const bemerkung = entry.bemerkung || '-';
        
        return `
            <tr>
                <td>${datumFormatted}</td>
                <td>${escapeHtml(employeeName)}</td>
                <td>${escapeHtml(employeeEmail)}</td>
                <td>${escapeHtml(strecke)}</td>
                <td>${entry.einfach ? '<span class="check-icon">✓</span>' : ''}</td>
                <td>${entry.hinZurueck ? '<span class="check-icon">✓</span>' : ''}</td>
                <td>${escapeHtml(bemerkung)}</td>
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

// Export-Funktion
function exportAllEntries() {
    const allEntries = loadAllEntries();
    const filteredEntries = applyFilters(allEntries);
    
    if (filteredEntries.length === 0) {
        alert('Keine Einträge zum Exportieren vorhanden.');
        return;
    }
    
    // CSV-Format erstellen
    const headers = ['Datum', 'Mitarbeiter', 'E-Mail', 'Strecke', 'Einfach', 'Hin & zurück', 'Bemerkung'];
    const rows = filteredEntries.map(entry => [
        formatDate(entry.datum),
        entry.employeeName || 'Unbekannt',
        entry.employeeEmail || '',
        entry.strecke,
        entry.einfach ? 'Ja' : 'Nein',
        entry.hinZurueck ? 'Ja' : 'Nein',
        entry.bemerkung || ''
    ]);
    
    const csvContent = [
        headers.join(';'),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
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

