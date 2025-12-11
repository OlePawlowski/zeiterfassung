/**
 * EMAILJS KONFIGURATION
 * 
 * Diese Datei enthält die Konfiguration für EmailJS.
 * 
 * WICHTIG: Bevor Sie die E-Mail-Funktion nutzen können, müssen Sie:
 * 
 * 1. EIN KOSTENLOSES KONTO ERSTELLEN:
 *    - Gehen Sie zu https://www.emailjs.com/
 *    - Registrieren Sie sich kostenlos (200 E-Mails/Monat kostenlos)
 * 
 * 2. E-MAIL-SERVICE VERBINDEN:
 *    - Im Dashboard: "Email Services" → "Add New Service"
 *    - Wählen Sie z.B. "Gmail" oder "Outlook"
 *    - Folgen Sie den Anweisungen zur Authentifizierung
 *    - Kopieren Sie die "Service ID" (z.B. "service_abc123")
 * 
 * 3. E-MAIL-TEMPLATE ERSTELLEN:
 *    - Im Dashboard: "Email Templates" → "Create New Template"
 *    - Template-Name: z.B. "Zeiterfassung"
 *    - "To Email": {{to_email}} (Variable)
 *    - "Subject": {{subject}} (Variable)
 *    - "Content": 
 *        Hallo,
 *        
 *        {{message}}
 *        
 *        CSV-Daten:
 *        {{csv_data}}
 *    - Speichern Sie das Template
 *    - Kopieren Sie die "Template ID" (z.B. "template_xyz789")
 * 
 * 4. PUBLIC KEY KOPIEREN:
 *    - Im Dashboard: "Account" → "General"
 *    - Kopieren Sie die "Public Key" (z.B. "abcdefghijklmnop")
 * 
 * 5. WERTE HIER EINTRAGEN:
 */

const EMAILJS_CONFIG = {
    // Ihre EmailJS Public Key (aus dem Dashboard)
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY_HERE',
    
    // Ihre EmailJS Service ID (aus dem verbundenen E-Mail-Service)
    SERVICE_ID: 'YOUR_SERVICE_ID_HERE',
    
    // Ihre EmailJS Template ID (aus dem erstellten Template)
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID_HERE',
    
    // Empfänger-E-Mail-Adresse
    // Test: ole.p.pawlowski@gmail.com
    // Produktion: karim.bandasch@gmail.com
    RECIPIENT_EMAIL: 'ole.p.pawlowski@gmail.com',
    
    /**
     * ABSENDER-E-MAIL-ADRESSE
     * 
     * WICHTIG: Der technische Absender wird durch den verbundenen E-Mail-Service bestimmt!
     * 
     * Wenn Sie z.B. Gmail verbinden:
     * - Der technische Absender ist die Gmail-Adresse, mit der Sie sich bei EmailJS authentifiziert haben
     * - Beispiel: Wenn Sie sich mit "ihre.firma@gmail.com" authentifizieren,
     *   dann ist das automatisch der technische Absender
     * 
     * MITARBEITER-E-MAIL-ADDRESSEN:
     * - Jeder Mitarbeiter gibt seine eigene E-Mail-Adresse in der App ein (⚙️ Einstellungen)
     * - Diese wird im E-Mail-Betreff und -Text verwendet, damit Karim weiß, von wem die E-Mail kommt
     * - Die Mitarbeiter-E-Mail wird als Variable {{user_email}} im Template verfügbar sein
     * 
     * Sie können im EmailJS-Template auch eine "From Name" setzen:
     * - Im Template: "From Name" = "Zeiterfassung System" oder "Ihre Firma"
     * - Dann sieht der Empfänger: "Zeiterfassung System <ihre.firma@gmail.com>"
     * 
     * Optional: Sie können hier eine Absender-E-Mail setzen, wenn Sie mehrere
     * E-Mail-Adressen verbunden haben und eine bestimmte verwenden möchten.
     * Lassen Sie es leer, um die Standard-Absender-Adresse des Services zu verwenden.
     */
    FROM_EMAIL: '', // Optional: z.B. 'zeiterfassung@ihre-firma.de'
    FROM_NAME: 'Zeiterfassung System' // Optional: Name, der als Absender angezeigt wird
};

