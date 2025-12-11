// Datenverwaltung
let entries = [];
let editingIndex = null;

// LocalStorage Schlüssel
const STORAGE_KEY = 'zeiterfassung_entries';
const USER_EMAIL_KEY = 'zeiterfassung_user_email';
const USER_NAME_KEY = 'zeiterfassung_user_name';
const USER_LOGGED_IN_KEY = 'zeiterfassung_user_logged_in'; // Login-Status
const ALL_ENTRIES_STORAGE_KEY = 'zeiterfassung_all_entries'; // Zentrale Speicherung aller Einträge

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    // Loading-Overlay sicherstellen, dass es versteckt ist
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        loadingOverlay.style.display = 'none';
    }
    
    // Login-Status prüfen
    checkEmployeeLoginStatus();
    setupEventListeners();
});

// Login-Status prüfen
function checkEmployeeLoginStatus() {
    const isLoggedIn = sessionStorage.getItem(USER_LOGGED_IN_KEY) === 'true';
    const userName = getUserName();
    const userEmail = getUserEmail();
    
    if (isLoggedIn && userName && userEmail) {
        showMainApp();
    } else {
        showLoginScreen();
    }
}

// Login-Screen anzeigen
function showLoginScreen() {
    const loginScreen = document.getElementById('employeeLoginScreen');
    const mainApp = document.getElementById('mainApp');
    
    if (loginScreen) {
        loginScreen.classList.remove('hidden');
        loginScreen.style.display = 'flex';
    }
    
    if (mainApp) {
        mainApp.classList.add('hidden');
        mainApp.style.display = 'none';
    }
}

// Haupt-App anzeigen
function showMainApp() {
    const loginScreen = document.getElementById('employeeLoginScreen');
    const mainApp = document.getElementById('mainApp');
    
    if (loginScreen) {
        loginScreen.classList.add('hidden');
        loginScreen.style.display = 'none';
    }
    
    if (mainApp) {
        mainApp.classList.remove('hidden');
        mainApp.style.display = 'block';
    }
    
    // Benutzer-Info anzeigen
    updateUserInfoDisplay();
    
    // Einträge laden und rendern
    loadEntries();
    renderEntries();
    
    // Heutiges Datum als Standard setzen
    const today = new Date().toISOString().split('T')[0];
    const datumInput = document.getElementById('datum');
    if (datumInput) {
        datumInput.value = today;
    }
}

// Benutzer-Info im Header anzeigen
function updateUserInfoDisplay() {
    const userInfoDisplay = document.getElementById('userInfoDisplay');
    if (userInfoDisplay) {
        const userName = getUserName();
        const userEmail = getUserEmail();
        if (userName && userEmail) {
            userInfoDisplay.textContent = `👤 ${userName}`;
            userInfoDisplay.style.color = 'var(--text-secondary)';
            userInfoDisplay.style.fontSize = '0.9rem';
            userInfoDisplay.style.marginRight = '10px';
        }
    }
}

// Event Listeners einrichten
function setupEventListeners() {
    // Employee Login Form
    const employeeLoginForm = document.getElementById('employeeLoginForm');
    if (employeeLoginForm) {
        employeeLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleEmployeeLogin();
        });
    }
    
    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            handleEmployeeLogout();
        });
    }
    
    const form = document.getElementById('entryForm');
    const clearBtn = document.getElementById('clearBtn');
    const exportBtn = document.getElementById('exportBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const filterDate = document.getElementById('filterDate');
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    
    if (!form || !clearBtn || !exportBtn || !clearAllBtn) {
        // Elemente existieren noch nicht (Login-Screen ist aktiv)
        return;
    }
    
    // Checkbox-Logik: Nur eine Fahrtart kann ausgewählt sein
    const einfachCheckbox = document.getElementById('einfach');
    const hinZurueckCheckbox = document.getElementById('hinZurueck');
    
    einfachCheckbox.addEventListener('change', () => {
        if (einfachCheckbox.checked) {
            hinZurueckCheckbox.checked = false;
        }
    });
    
    hinZurueckCheckbox.addEventListener('change', () => {
        if (hinZurueckCheckbox.checked) {
            einfachCheckbox.checked = false;
        }
    });
    
    form.addEventListener('submit', handleFormSubmit);
    clearBtn.addEventListener('click', clearForm);
    exportBtn.addEventListener('click', showExportModal);
    clearAllBtn.addEventListener('click', clearAllEntries);
    
    // Export Modal Event Listeners
    const exportModal = document.getElementById('exportModal');
    const closeModal = document.getElementById('closeModal');
    const downloadOption = document.getElementById('downloadOption');
    const emailOption = document.getElementById('emailOption');
    
    closeModal.addEventListener('click', () => {
        exportModal.classList.remove('active');
    });
    
    downloadOption.addEventListener('click', () => {
        exportModal.classList.remove('active');
        downloadEntries();
    });
    
    emailOption.addEventListener('click', () => {
        exportModal.classList.remove('active');
        sendEmail();
    });
    
    // Modal schließen bei Klick außerhalb
    exportModal.addEventListener('click', (e) => {
        if (e.target === exportModal) {
            exportModal.classList.remove('active');
        }
    });
    
    // Employee Login Handler
    function handleEmployeeLogin() {
        const nameInput = document.getElementById('loginName');
        const emailInput = document.getElementById('loginEmail');
        
        if (!nameInput || !emailInput) {
            alert('Login-Formular nicht gefunden!');
            return;
        }
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        
        if (!name) {
            alert('Bitte geben Sie Ihren Namen ein.');
            return;
        }
        
        if (!email || !email.includes('@')) {
            alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return;
        }
        
        // Benutzer-Info speichern
        saveUserName(name);
        saveUserEmail(email);
        sessionStorage.setItem(USER_LOGGED_IN_KEY, 'true');
        
        // Haupt-App anzeigen
        showMainApp();
    }
    
    // Employee Logout Handler
    function handleEmployeeLogout() {
        if (confirm('Möchten Sie sich wirklich abmelden?')) {
            sessionStorage.removeItem(USER_LOGGED_IN_KEY);
            // Einträge nicht löschen, nur ausloggen
            showLoginScreen();
            
            // Login-Formular zurücksetzen
            if (employeeLoginForm) {
                employeeLoginForm.reset();
            }
        }
    }
    filterDate.addEventListener('change', () => renderEntries());
    clearFilterBtn.addEventListener('click', () => {
        filterDate.value = '';
        renderEntries();
    });
}

// Formular absenden
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Mitarbeiter-Info abrufen
    const employeeName = getUserName();
    const employeeEmail = getUserEmail();
    
    // Prüfen ob eingeloggt
    if (!employeeName || !employeeEmail) {
        alert('Bitte melden Sie sich zuerst an.');
        showLoginScreen();
        return;
    }
    
    const formData = {
        datum: document.getElementById('datum').value,
        strecke: document.getElementById('strecke').value.trim(),
        einfach: document.getElementById('einfach').checked,
        hinZurueck: document.getElementById('hinZurueck').checked,
        bemerkung: document.getElementById('bemerkung').value.trim(),
        id: editingIndex !== null ? entries[editingIndex].id : Date.now(),
        // Mitarbeiter-Info hinzufügen (immer aktuelle Info verwenden)
        employeeName: employeeName,
        employeeEmail: employeeEmail,
        createdAt: editingIndex !== null 
            ? (entries[editingIndex].createdAt || new Date().toISOString())
            : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Validierung: Mindestens eine Fahrtart muss ausgewählt sein
    if (!formData.einfach && !formData.hinZurueck) {
        alert('Bitte wählen Sie mindestens eine Fahrtart aus (Einfach oder Hin & zurück).');
        return;
    }
    
    if (editingIndex !== null) {
        // Bearbeitung - alte ID beibehalten
        const oldEntry = entries[editingIndex];
        formData.id = oldEntry.id; // ID beibehalten
        entries[editingIndex] = formData;
        editingIndex = null;
        document.querySelector('.form-section h2').textContent = 'Neuer Eintrag';
        document.querySelector('.btn-primary').textContent = 'Eintrag hinzufügen';
    } else {
        // Neuer Eintrag
        entries.push(formData);
    }
    
    saveEntries();
    saveToCentralStorage(formData); // In zentralen Storage speichern (aktualisiert auch bei Bearbeitung)
    renderEntries();
    clearForm();
}

// Formular leeren
function clearForm() {
    document.getElementById('entryForm').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('datum').value = today;
    editingIndex = null;
    document.querySelector('.form-section h2').textContent = 'Neuer Eintrag';
    document.querySelector('.btn-primary').textContent = 'Eintrag hinzufügen';
}

// Eintrag bearbeiten
function editEntry(index) {
    const entry = entries[index];
    editingIndex = index;
    
    document.getElementById('datum').value = entry.datum;
    document.getElementById('strecke').value = entry.strecke;
    document.getElementById('einfach').checked = entry.einfach;
    document.getElementById('hinZurueck').checked = entry.hinZurueck;
    document.getElementById('bemerkung').value = entry.bemerkung;
    
    document.querySelector('.form-section h2').textContent = 'Eintrag bearbeiten';
    document.querySelector('.btn-primary').textContent = 'Änderungen speichern';
    
    // Zum Formular scrollen
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Eintrag löschen
function deleteEntry(index) {
    if (confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
        const entryToDelete = entries[index];
        entries.splice(index, 1);
        saveEntries();
        
        // Auch aus zentralem Storage löschen
        const allEntries = loadAllEntries();
        const centralIndex = allEntries.findIndex(e => e.id === entryToDelete.id);
        if (centralIndex !== -1) {
            allEntries.splice(centralIndex, 1);
            localStorage.setItem(ALL_ENTRIES_STORAGE_KEY, JSON.stringify(allEntries));
        }
        
        renderEntries();
    }
}

// Alle Einträge löschen
function clearAllEntries() {
    if (confirm('Möchten Sie wirklich alle Einträge löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
        entries = [];
        saveEntries();
        
        // Auch zentrale Einträge löschen (nur die des aktuellen Mitarbeiters)
        const allEntries = loadAllEntries();
        const currentEmployeeName = getUserName();
        const currentEmployeeEmail = getUserEmail();
        
        // Nur Einträge des aktuellen Mitarbeiters aus zentralem Storage entfernen
        const filteredEntries = allEntries.filter(entry => 
            entry.employeeName !== currentEmployeeName || 
            entry.employeeEmail !== currentEmployeeEmail
        );
        
        localStorage.setItem(ALL_ENTRIES_STORAGE_KEY, JSON.stringify(filteredEntries));
        
        renderEntries();
    }
}

// Einträge rendern
function renderEntries() {
    const tbody = document.getElementById('entriesBody');
    const noEntries = document.getElementById('noEntries');
    const filterDate = document.getElementById('filterDate').value;
    
    // Filtern nach Datum
    let filteredEntries = entries;
    if (filterDate) {
        filteredEntries = entries.filter(entry => entry.datum === filterDate);
    }
    
    // Nach Datum sortieren (neueste zuerst)
    filteredEntries = [...filteredEntries].sort((a, b) => {
        return new Date(b.datum) - new Date(a.datum);
    });
    
    if (filteredEntries.length === 0) {
        tbody.innerHTML = '';
        noEntries.classList.remove('hidden');
        return;
    }
    
    noEntries.classList.add('hidden');
    tbody.innerHTML = filteredEntries.map((entry, displayIndex) => {
        const actualIndex = entries.findIndex(e => e.id === entry.id);
        const datumFormatted = formatDate(entry.datum);
        
        return `
            <tr>
                <td>${datumFormatted}</td>
                <td>${escapeHtml(entry.strecke)}</td>
                <td>${entry.einfach ? '<span class="check-icon">✓</span>' : ''}</td>
                <td>${entry.hinZurueck ? '<span class="check-icon">✓</span>' : ''}</td>
                <td>${escapeHtml(entry.bemerkung || '-')}</td>
                <td>
                    <div class="action-buttons-cell">
                        <button class="btn-icon btn-edit" onclick="editEntry(${actualIndex})">Bearbeiten</button>
                        <button class="btn-icon btn-delete" onclick="deleteEntry(${actualIndex})">Löschen</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Datum formatieren
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// HTML-Escape für Sicherheit
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Einträge speichern
function saveEntries() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// Einträge laden
function loadEntries() {
    // Zuerst versuchen, lokale Einträge zu laden (für Rückwärtskompatibilität)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        entries = JSON.parse(stored);
    }
    
    // Dann Einträge des aktuellen Benutzers aus zentralem Storage laden
    const userName = getUserName();
    const userEmail = getUserEmail();
    
    if (userName && userEmail) {
        // Einträge des aktuellen Benutzers aus zentralem Storage filtern
        const allEntries = loadAllEntries();
        const userEntries = allEntries.filter(entry => 
            entry.employeeName === userName && entry.employeeEmail === userEmail
        );
        
        // Wenn Einträge im zentralen Storage gefunden wurden, diese verwenden
        if (userEntries.length > 0) {
            entries = userEntries;
            // Lokale Einträge synchronisieren
            saveEntries();
        }
    }
}

// Benutzer-E-Mail-Adresse laden
function loadUserEmail() {
    const stored = localStorage.getItem(USER_EMAIL_KEY);
    return stored || null;
}

// Benutzer-E-Mail-Adresse abrufen
function getUserEmail() {
    return localStorage.getItem(USER_EMAIL_KEY);
}

// Benutzer-E-Mail-Adresse speichern
function saveUserEmail(email) {
    localStorage.setItem(USER_EMAIL_KEY, email);
}

// Benutzer-Name speichern
function saveUserName(name) {
    localStorage.setItem(USER_NAME_KEY, name);
}

// Benutzer-Name abrufen
function getUserName() {
    return localStorage.getItem(USER_NAME_KEY);
}

// In zentralen Storage speichern (für Admin)
function saveToCentralStorage(entry) {
    const allEntries = loadAllEntries();
    
    // Prüfen, ob Eintrag bereits existiert (bei Bearbeitung)
    const existingIndex = allEntries.findIndex(e => e.id === entry.id);
    if (existingIndex !== -1) {
        allEntries[existingIndex] = entry;
    } else {
        allEntries.push(entry);
    }
    
    localStorage.setItem(ALL_ENTRIES_STORAGE_KEY, JSON.stringify(allEntries));
}

// Alle Einträge laden (aus zentralem Storage)
function loadAllEntries() {
    const stored = localStorage.getItem(ALL_ENTRIES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Diese Funktion wird nicht mehr benötigt, da Login-System implementiert ist

// Export Modal anzeigen
function showExportModal() {
    if (entries.length === 0) {
        alert('Keine Einträge zum Exportieren vorhanden.');
        return;
    }
    document.getElementById('exportModal').classList.add('active');
}

// CSV-Datei erstellen
function createCSVBlob() {
    const headers = ['Datum', 'Strecke', 'Einfach', 'Hin & zurück', 'Bemerkung'];
    const rows = entries.map(entry => [
        formatDate(entry.datum),
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
    return new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
}

// Einträge herunterladen
function downloadEntries() {
    const blob = createCSVBlob();
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `zeiterfassung_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * E-MAIL MIT EMAILJS VERSENDEN
 * 
 * Wie EmailJS funktioniert:
 * 
 * 1. EMAILJS ALS VERMITTLER:
 *    - EmailJS ist ein Service, der zwischen Ihrer Web-App und dem E-Mail-Server steht
 *    - Sie senden eine Anfrage von Ihrer Web-App an EmailJS
 *    - EmailJS leitet die E-Mail dann an den tatsächlichen E-Mail-Server weiter (z.B. Gmail)
 * 
 * 2. WARUM KEIN BACKEND NÖTIG IST:
 *    - Normalerweise bräuchte man einen Server, um E-Mails zu versenden
 *    - EmailJS stellt diesen Server für Sie bereit
 *    - Ihre Web-App kommuniziert direkt mit EmailJS (Client-to-Client)
 * 
 * 3. SICHERHEIT:
 *    - Die Public Key kann öffentlich sein (im Code sichtbar)
 *    - Sie authentifiziert nur, dass Sie ein EmailJS-Konto haben
 *    - Die eigentliche E-Mail-Authentifizierung passiert auf EmailJS-Seite
 *    - Sie müssen Ihren E-Mail-Service (z.B. Gmail) nur einmal bei EmailJS verbinden
 * 
 * 4. ABLAUF BEIM VERSENDEN:
 *    a) Ihre App ruft emailjs.send() auf
 *    b) EmailJS empfängt die Anfrage mit Template-Variablen
 *    c) EmailJS füllt das Template mit den Variablen aus
 *    d) EmailJS sendet die E-Mail über den verbundenen Service
 *    e) Die E-Mail landet im Postfach des Empfängers
 * 
 * 5. TEMPLATE-VARIABLEN:
 *    - Im EmailJS-Dashboard erstellen Sie ein Template
 *    - Im Template können Sie Variablen verwenden: {{variable_name}}
 *    - Diese Variablen werden beim Versenden durch echte Werte ersetzt
 * 
 * 6. WER IST DER ABSENDER?
 *    - Der Absender ist die E-Mail-Adresse, mit der Sie sich bei EmailJS authentifiziert haben
 *    - Beispiel: Wenn Sie Gmail verbinden und sich mit "ihre.firma@gmail.com" anmelden,
 *      dann ist "ihre.firma@gmail.com" automatisch der Absender
 *    - Im EmailJS-Template können Sie einen "From Name" setzen:
 *      z.B. "From Name" = "Zeiterfassung System"
 *      → Der Empfänger sieht dann: "Zeiterfassung System <ihre.firma@gmail.com>"
 *    - Die Absender-Adresse wird also durch den verbundenen E-Mail-Service bestimmt,
 *      nicht durch Ihren Code!
 */
async function sendEmail() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('hidden');
    
    try {
        // Prüfen, ob EmailJS konfiguriert ist
        if (!EMAILJS_CONFIG || 
            EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE' ||
            EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID_HERE' ||
            EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID_HERE') {
            loadingOverlay.classList.add('hidden');
            alert('EmailJS ist noch nicht konfiguriert!\n\nBitte öffnen Sie die Datei "emailjs-config.js" und tragen Sie Ihre EmailJS-Daten ein.\n\nSiehe auch die Anleitung in der Datei.');
            return;
        }
        
        // CSV-Datei erstellen
        const blob = createCSVBlob();
        const fileName = `zeiterfassung_${new Date().toISOString().split('T')[0]}.csv`;
        
        // CSV-Inhalt als Text lesen (für E-Mail-Text)
        const csvText = await blob.text();
        
        // EmailJS initialisieren mit Public Key
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        
        // Benutzer-Info abrufen
        const userName = getUserName();
        const userEmail = getUserEmail();
        if (!userName || !userEmail) {
            loadingOverlay.classList.add('hidden');
            alert('Bitte geben Sie zuerst Ihren Namen und Ihre E-Mail-Adresse in den Einstellungen ein (⚙️ oben rechts).');
            document.getElementById('settingsBtn').click();
            return;
        }
        
        // E-Mail-Parameter vorbereiten
        // Diese Variablen werden im EmailJS-Template verwendet
        const templateParams = {
            to_email: EMAILJS_CONFIG.RECIPIENT_EMAIL,
            subject: `Zeiterfassung - ${new Date().toLocaleDateString('de-DE')} (von ${userName})`,
            message: `Hallo Karim,\n\nanbei finden Sie die aktuelle Zeiterfassung mit ${entries.length} Einträgen.\n\nDiese E-Mail wurde gesendet von: ${userName} (${userEmail})\n\nDie CSV-Daten sind im E-Mail-Text enthalten.\n\nMit freundlichen Grüßen`,
            csv_data: csvText,
            entry_count: entries.length.toString(),
            date: new Date().toLocaleDateString('de-DE'),
            // Mitarbeiter-Info für Identifikation
            user_name: userName,
            user_email: userEmail,
            // Optional: From Name (wird im EmailJS-Template verwendet)
            from_name: EMAILJS_CONFIG.FROM_NAME || 'Zeiterfassung System'
        };
        
        // Hinweis: Die technische Absender-E-Mail-Adresse wird automatisch durch den
        // verbundenen E-Mail-Service bestimmt (z.B. die Gmail-Adresse, mit der
        // Sie sich bei EmailJS authentifiziert haben). Die Mitarbeiter-E-Mail-Adresse
        // wird im E-Mail-Text und Betreff verwendet, damit Karim weiß, von wem die E-Mail kommt.
        
        // E-Mail über EmailJS versenden
        // emailjs.send(serviceId, templateId, templateParams)
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        // Erfolgreich versendet
        loadingOverlay.classList.add('hidden');
        
        // Erfolgsmeldung
        alert(`✅ E-Mail wurde erfolgreich an ${EMAILJS_CONFIG.RECIPIENT_EMAIL} gesendet!`);
        
        console.log('E-Mail erfolgreich versendet:', response);
        
    } catch (error) {
        console.error('Fehler beim Senden der E-Mail:', error);
        loadingOverlay.classList.add('hidden');
        
        // Detaillierte Fehlermeldung
        let errorMessage = 'Fehler beim Senden der E-Mail.\n\n';
        
        if (error.text) {
            errorMessage += `Details: ${error.text}\n\n`;
        }
        
        if (error.status === 400) {
            errorMessage += 'Mögliche Ursachen:\n';
            errorMessage += '- EmailJS-Konfiguration fehlt oder ist falsch\n';
            errorMessage += '- Template-Variablen stimmen nicht überein\n';
        } else if (error.status === 401) {
            errorMessage += 'Mögliche Ursachen:\n';
            errorMessage += '- Public Key ist falsch\n';
            errorMessage += '- EmailJS-Konto ist nicht aktiviert\n';
        } else if (error.status === 404) {
            errorMessage += 'Mögliche Ursachen:\n';
            errorMessage += '- Service ID oder Template ID ist falsch\n';
        }
        
        errorMessage += '\nBitte überprüfen Sie die Konfiguration in emailjs-config.js';
        
        alert(errorMessage);
    }
}

// Globale Funktionen für onclick-Handler
window.editEntry = editEntry;
window.deleteEntry = deleteEntry;






