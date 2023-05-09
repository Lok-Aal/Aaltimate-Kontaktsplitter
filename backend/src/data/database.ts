import { PrefixOptions } from "../parsers/prefix-parser";

export interface Database {
    getPrefixOptions(): PrefixOptions;
    getSurnamePrefixes(): string[];
}

/**
 * Prototyp Datenbank mit Prefix-Optionen und Nachnamens-Präfixen
 * Kann zu einem späteren Zeitpunkt mit einem CRM System verküpft werden
 */
export class DatabaseImpl {
    prefix_options: PrefixOptions = {
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

    surname_prefixes: string[] = [
        "von",
        "van",
        "der",
    ]

    getPrefixOptions(): PrefixOptions {
        return this.prefix_options;
    }

    getSurnamePrefixes(): string[] {
        return this.surname_prefixes;
    }
}