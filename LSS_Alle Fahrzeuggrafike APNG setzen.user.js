// ==UserScript==
// @name         LSS_Alle Fahrzeuggrafike APNG setzen
// @version      1.0
// @description  Aktiviert die Checkboxen und speichert die Fahrzeuggrafiken auf allen Detailseiten
// @match        https://www.leitstellenspiel.de/vehicle_graphics/*/edit
// @grant        none
// @author       MissSobol
// ==/UserScript==

(function() {
    'use strict';

    // Funktion zum Aktivieren und Speichern der Fahrzeuggrafik auf einer Detailseite
    function activateAndSaveVehicleGraphic() {
        // Checkbox-Element für die Fahrzeuggrafik auswählen
        var checkbox = document.getElementById('vehicle_graphic_image_apng');
        if (checkbox) {
            // Checkbox aktivieren
            checkbox.checked = true;

            // Speicherbutton-Element auswählen
            var saveButton = document.querySelector('input[type="submit"]');
            if (saveButton) {
                // Formular speichern (submit)
                saveButton.click();
            }
        }
    }

    // Funktion zum Öffnen der Detailseiten und Aktivieren/Speichern der Fahrzeuggrafiken
    function processDetailPages() {
        // Alle Detailseiten-Links sammeln
        var detailLinks = document.querySelectorAll('.btn.btn-default[href^="/vehicle_graphics/"][href$="/edit"]');
        if (detailLinks.length > 0) {
            // Rekursive Funktion für die Verarbeitung der Detailseiten
            var processPage = function(index) {
                // Überprüfen, ob der Index innerhalb des Bereichs der Detailseiten liegt
                if (index >= detailLinks.length) {
                    return; // Verarbeitung abbrechen
                }

                // Detailseite öffnen
                var detailLink = detailLinks[index];
                var detailUrl = detailLink.getAttribute('href');
                var detailWindow = window.open(detailUrl, '_blank');

                // Funktion zum Aktivieren und Speichern der Fahrzeuggrafik auf der Detailseite
                var activateAndSave = function() {
                    if (detailWindow) {
                        // Funktion im Kontext des Detailfensters ausführen
                        detailWindow.eval('(' + activateAndSaveVehicleGraphic.toString() + ')()');

                        // Nächste Detailseite nach einer halben Sekunde öffnen
                        setTimeout(function() {
                            detailWindow.close(); // Detailseite schließen
                            processPage(index + 1); // Nächste Detailseite verarbeiten
                        }, 500);
                    }
                };

                // Warten, bis das Detailfenster geladen ist, und dann Aktivierung/Speicherung durchführen
                if (detailWindow) {
                    detailWindow.addEventListener('load', activateAndSave);
                }
            };

            // Erste Detailseite verarbeiten
            processPage(0);
        }
    }

    // Funktion zum Klicken des Buttons auf der Hauptseite
    function clickButton() {
        // Tabelle auswählen
        var table = document.querySelector('table.table-striped');
        if (table) {
            // Button-Element erstellen
            var button = document.createElement('button');
            button.textContent = 'Aktiviere Fahrzeuggrafiken';
            button.style.marginBottom = '10px';
            button.addEventListener('click', function() {
                // Button-Klick auf der Hauptseite
                processDetailPages(); // Detailseiten verarbeiten
            });

            // Button über der Tabelle einfügen
            table.parentNode.insertBefore(button, table);
        }
    }

    // Button-Klick auf der Hauptseite
    clickButton();
})();
