import { Database, DatabaseImpl } from "../data/database";
import InputError from "../errors/input-error";
import { Contact, Gender, Title } from "../types/contact";
import { PrefixParser, PrefixParserImpl } from "./prefix-parser";
import { SurnameParser, SurnameParserImpl } from "./surname-parser";

export interface ContactParser {
    parse(contact_input: string): Contact;
    addTitle(title: Title, gender?: Gender): void;
    getTitles(): Title[];
}

export class ContactParserImpl implements ContactParser {
    database: Database;
    prefix_parser: PrefixParser;
    surname_parser: SurnameParser;

    constructor() {
        this.database = new DatabaseImpl();

        // PrefixParser und SurnameParser initialisieren
        this.prefix_parser = new PrefixParserImpl(this.database.getPrefixOptions());
        this.surname_parser = new SurnameParserImpl(this.database.getSurnamePrefixes());
    }

    /**
     * @param contact_input Eingabe-String des Kontakts
     * @returns Kontakt mit Name, Nachname, Titel und Geschlecht
     */
    parse(contact_input: string): Contact {
        // Überprüfung auf zulässige Zeichen
        let regex = /^[a-zA-ZäöüÄÖÜßâêîôûáéíóúàèìòù\-. ]*$/g;
        if (!regex.test(contact_input)) {
            let empty_contact: Contact = {
                name: "",
                surname: "",
                titles: [],
                gender: undefined
            };
            throw new InputError("Die Eingabe enthält ungültige Zeichen.", "", empty_contact, { start: 0, end: contact_input.length });
        }

        // Parsing Schritt mit PrefixParser und SurnameParser
        // Alles was kein Prefix und kein Nachname ist, wird als Name interpretiert
        let [contact_rest, contact_prefix] = this.prefix_parser.parse(contact_input);
        let [name, surname] = this.surname_parser.parse(contact_rest);

        let contact: Contact = {
            name: name,
            surname: surname,
            ...contact_prefix
        };

        // Möglicher Titel im Namen erkennen
        if (name.includes(".")) {
            // Titel aus dem Namen entfernen
            let last_dot = name.lastIndexOf(".");
            contact.name = name.slice(last_dot + 1).trim();

            // Bereich der Fehleingabe bestimmen
            let error_start = contact_input.length - contact_rest.length;
            let error_end = error_start + last_dot + 1;

            if (contact.gender === "error") {
                contact.gender = undefined;
            }

            throw new InputError("Die Eingabe konnte nicht vollständig verarbeitet werden.", "Fügen sie ggf. einen neuen Titel zum Parser hinzu", contact, { start: error_start, end: error_end });
        }

        if (contact.gender === "error") {
            contact.gender = undefined;
            throw new InputError("Geschlechter der Präfixe stimmen nicht überein.", "", contact, { start: 0, end: 0 });
        }

        return contact;
    }

    addTitle(title: Title, gender?: Gender): void {
        this.database.getPrefixOptions().titleStrings[title] = { titles: [title], gender: gender };
        this.prefix_parser.optionsUpdated();
    }

    getTitles(): Title[] {
        return Object.keys(this.database.getPrefixOptions().titleStrings);
    }
}