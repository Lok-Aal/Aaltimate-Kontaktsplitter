import { Contact, ContactPrefix } from "../types/contact";
import { PrefixOptions, PrefixParser } from "./prefix-parser";

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

export function parse_contact(contact_input: string): Contact | null {
    
    const prefix_parser: PrefixParser = new PrefixParser(prefix_options);
    let [contact_rest, contact_prefix] = prefix_parser.parse_prefix(contact_input);

    let contact_rest_split = contact_rest.split(" ");

    let contact: Contact = {
        name: contact_rest_split[0],
        surname: contact_rest_split.slice(1).join(" "),
        ...contact_prefix
    };

    return contact;
}