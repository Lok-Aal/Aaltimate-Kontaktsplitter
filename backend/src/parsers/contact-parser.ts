import InputError from "../errors/input-error";
import { Contact, ContactPrefix } from "../types/contact";
import { PrefixOptions, PrefixParser, PrefixParserImpl } from "./prefix-parser";
import { SurnameParser, SurnameParserImpl } from "./surname-parser";

const prefix_options: PrefixOptions = {
    genderStrings: {
        "Herr": { gender: "m" },
        "Frau": { gender: "w" },
    },
    titleStrings: {
        "Dr.": { titles: ["Dr."] },
        "Dr. med.": { titles: ["Dr. med."] },
        "Dr.-Ing.": { titles: ["Dr.-Ing."] },
        "Dr. rer. nat.": { titles: ["Dr. rer. nat."] },
        "Dr. h.c. mult.": { titles: ["Dr. h.c. mult."] },
        "Prof.": { titles: ["Prof."] },
        "Professor": { gender: "m", titles: ["Prof."] },
        "Professorin": { gender: "w", titles: ["Prof."] },
    }
};

const surname_prefixes: string[] = [
    "von",
    "van",
    "der",
]

export interface ContactParser {
    parse(contact_input: string): Contact;
    addTitle(title: string): void;
}

export class ContactParserImpl implements ContactParser {
    prefix_parser: PrefixParser;
    surname_parser: SurnameParser;

    constructor() {
        this.prefix_parser = new PrefixParserImpl(prefix_options);
        this.surname_parser = new SurnameParserImpl(surname_prefixes);
    }

    parse(contact_input: string): Contact {
        let [contact_rest, contact_prefix] = this.prefix_parser.parse(contact_input);
        let [name, surname] = this.surname_parser.parse(contact_rest);

        let contact: Contact = {
            name: name,
            surname: surname,
            ...contact_prefix
        };

        if (name.includes(".")) { // Titel im Namen
            let last_dot = name.lastIndexOf(".");
            contact.name = name.slice(last_dot + 1).trim();

            let error_start = contact_input.length - contact_rest.length;
            let error_end = contact_input.length - surname.length - contact.name.length - 2;
            throw new InputError("Die Eingabe konnte nicht vollständig verarbeitet werden.", contact, { start: error_start, end: error_end });
        }

        return contact;
    }

    addTitle(title: string): void {
        throw new Error("Method not implemented.");
    }

}