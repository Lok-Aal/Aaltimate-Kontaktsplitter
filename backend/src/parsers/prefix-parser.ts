import { Contact, ContactPrefix, Gender, Title } from "../types/contact";

export interface PrefixOptions {
    genderStrings: {
        [key: string]: ContactPrefix
    }
    titleStrings: {
        [key: string]: ContactPrefix
    }
}

export interface PrefixParser {
    optionsUpdated(): void;
    parse(input: string, contact_prefix?: ContactPrefix): [string, ContactPrefix];
}

export class PrefixParserImpl implements PrefixParser {

    options: PrefixOptions;
    genderStrings: string[];
    titleStrings: string[];

    /**
     * @param options Optionen für PrefixParser, welche Präfixe enthalten
     */
    constructor(options: PrefixOptions) {
        this.options = options;
        this.genderStrings = [];
        this.titleStrings = [];
        this.optionsUpdated();
    }

    /**
     * Aktualisiert genderStrings und titleStrings
     * Wird bei Änderungen an PrefixOptions aufgerufen
     */
    optionsUpdated() {
        this.genderStrings = Object.keys(this.options.genderStrings).sort((a, b) => b.length - a.length); // longest first
        this.titleStrings = Object.keys(this.options.titleStrings).sort((a, b) => b.length - a.length); // longest first
    }

    /**
     * @param input String, der Präfixe enthält
     * @param contact_prefix Temporärer Kontakt, der mit Präfixen erweitert wird (Wird für Rekursion benötigt)
     * @returns Rest des Strings nach dem Präfix und Kontakt mit Präfixen
     */
    parse(input: string, contact_prefix: ContactPrefix = { gender: undefined, titles: [] }): [string, ContactPrefix] {
        
        // genderStrings ("Herr", "Frau") müssen am Anfang stehen, also vor titleStrings
        if (contact_prefix.gender === undefined && contact_prefix.titles!.length == 0) {
            // Nach genderString suchen
            for (let genderString of this.genderStrings) {
                let length = startsWithLength(input, genderString);
                if (length > 0) {
                    input = input.slice(length).trim();
                    return this.parse(input, merge_contact_prefix(contact_prefix, this.options.genderStrings[genderString]));
                }
            }
        }

        // Durch Titel iterieren und rekursiv nach Titeln suchen
        // titleStrings ist absteigend nach Länge sortiert, damit z.B. "Dr. med." vor "Dr." erkannt wird
        for (let titleString of this.titleStrings) {
            let length = startsWithLength(input, titleString);
            if (length > 0) {
                input = input.slice(length).trim();
                return this.parse(input, merge_contact_prefix(contact_prefix, this.options.titleStrings[titleString]));
            }
        }
        return [input, contact_prefix];
    }
}

/**
 * Erkennt Prefix in Input String und gibt dessen Länge zurück.
 * - Groß und Kleinschreibung wird ignoriert
 * - Leerzeichen werden ignoriert
 * - Punkte werden teilweise ignoriert
 * @param input String in dem nach Prefix gesucht wird
 * @param prefix Präfix nach dem gesucht wird
 * @returns Länge des Präfixes im Input String oder -1, falls kein Präfix gefunden wurde
 */
function startsWithLength(input: string, prefix: string): number {
    input = input.toLocaleLowerCase();
    // ignoriere Leerzeichen und Punkte im Prefix
    prefix = prefix.replace(/ /g, "").replace(/\./g, "").toLowerCase();

    let input_index = 0;
    let prefix_index = 0;
    while (prefix_index < prefix.length) {
        // input zu Ende
        if (input_index >= input.length) {
            return -1;
        }
        // ignoriere Leerzeichen und Punkte im Input
        if (input[input_index] === " " || input[input_index] === ".") {
            input_index++;
            continue;
        }
        // Zeichen stimmen nicht überein
        if (input[input_index] != prefix[prefix_index]) {
            return -1;
        }

        input_index++;
        prefix_index++;
    }
    // Punkt am Ende des Präfixes im Input
    if (input[input_index] === ".") {
        input_index++;
    }
    // Falls kein Leerzeichen am Ende des Präfixes im Input = kein Prefix
    if (input_index < input.length && input[input_index] !== " ") {
        return -1;
    }
    return input_index; 
}

/**
 * Führt zwei ContactPrefix Objekte zusammen
 * @param c1 Erstes ContactPrefix Objekt
 * @param c2 Zweites ContactPrefix Objekt
 * @returns Zusammengeführtes ContactPrefix Objekt
 */
function merge_contact_prefix(c1: ContactPrefix, c2: ContactPrefix): ContactPrefix {
    if (c1.gender != null && c2.gender != c1.gender) {
        // TODO: Gender Error
    }

    // Führe Titel zusammen
    let titles: Title[] = [];
    if (c1.titles) {
        titles = titles.concat(c1.titles);
    }
    if (c2.titles) {
        titles = titles.concat(c2.titles);
    }
    
    // Gender wird von c1 übernommen, falls vorhanden, sonst von c2
    let gender = c1.gender || c2.gender;

    return {
        gender: gender,
        titles: titles
    };
}