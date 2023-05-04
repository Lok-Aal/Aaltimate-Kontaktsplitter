import { Contact, ContactPrefix } from "../types/contact";
import { PrefixOptions, PrefixParser } from "./prefix-parser";
import { SurnameParser } from "./surname-parser";

const prefix_options: PrefixOptions = {
    genderStrings: {
        "Herr": { gender: "m" },
        "Frau": { gender: "w" },
    },
    titleStrings: {
        "Dr.": { titles: ["Dr."] },
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
    
export function parse_contact(contact_input: string): Contact | null {
    
    const prefix_parser: PrefixParser = new PrefixParser(prefix_options);
    const surname_parser: SurnameParser = new SurnameParser(surname_prefixes);

    let [contact_rest, contact_prefix] = prefix_parser.parse_prefix(contact_input);
    let [name, surname] = surname_parser.parse_surname(contact_rest);

    let contact: Contact = {
        name: name,
        surname: surname,
        ...contact_prefix
    };

    return contact;
}