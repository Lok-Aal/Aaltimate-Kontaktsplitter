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
    prefix_options: PrefixOptions;

    surname_prefixes: string[];

    /**
     * Standard Präfixe initialisieren
     */
    constructor() {
        this.prefix_options = {
            genderStrings: {
                "Herr": { gender: "m" },
                "Frau": { gender: "w" },
            },
            titleStrings: {
                // Akademische Titel
                "Professor": { gender: "m", titles: ["Prof."] },
                "Professorin": { gender: "w", titles: ["Prof."] },
                // Adels-Titel
                "Prinz": {gender: "m", titles: ["Prinz"]},
                "Prinzessin": {gender: "w", titles: ["Prinzessin"]},
                "Kaiser": {gender: "m", titles: ["Kaiser"]},
                "Kaiserin": {gender: "w", titles: ["Kaiserin"]},
                "König": {gender: "m", titles: ["König"]},
                "Königin": {gender: "w", titles: ["Königin"]},
                "Erzherzog": {gender: "m", titles: ["Erzherzog"]},
                "Erzherzogin": {gender: "w", titles: ["Erzherzogin"]},
                "Großherzog": {gender: "m", titles: ["Großherzog"]},
                "Großherzogin": {gender: "w", titles: ["Großherzogin"]},
                "Kurfürst": {gender: "m", titles: ["Kurfürst"]},
                "Kurfürstin": {gender: "w", titles: ["Kurfürstin"]},
                "Herzog": {gender: "m", titles: ["Herzog"]},
                "Herzogin": {gender: "w", titles: ["Herzogin"]},
                "Landgraf": {gender: "m", titles: ["Landgraf"]},
                "Landgräfin": {gender: "w", titles: ["Landgräfin"]},
                "Pfalzgraf": {gender: "m", titles: ["Pfalzgraf"]},
                "Pfalzgräfin": {gender: "w", titles: ["Pfalzgräfin"]},
                "Markgraf": {gender: "m", titles: ["Markgraf"]},
                "Markgräfin": {gender: "w", titles: ["Markgräfin"]},
                "Fürst": {gender: "m", titles: ["Fürst"]},
                "Fürstin": {gender: "w", titles: ["Fürstin"]},
                "Graf": {gender: "m", titles: ["Graf"]},
                "Gräfin": {gender: "w", titles: ["Gräfin"]},
                "Freiherr": {gender: "m", titles: ["Freiherr"]},
                "Freifrau": {gender: "w", titles: ["Freifrau"]},
                "Baron": {gender: "m", titles: ["Baron"]},
                "Baronin": {gender: "w", titles: ["Baronin"]},
            }
        };

        // Akademische TItel Geschlechterneutral
        let titles: string[] = [
            "Dipl.-Ing.",
            "B.A.",
            "B.Ed.",
            "B.Eng.",
            "B.Sc.",
            "M.A.",
            "M.Ed.",
            "M.Eng.",
            "M.Sc.",
            "Dr.",
            "Dr. med.",
            "Dr.-Ing.",
            "Dr. rer. nat.",
            "Dr. h.c. mult.",
            "Prof.",
        ];
        for (let title of titles) {
            this.prefix_options.titleStrings[title] = { titles: [title] };
        }

        this.surname_prefixes = [
            "von",
            "vom",
            "van",
            "der",
            "dem",
            "de",
            "zu",
            "zur",
        ];
    }

    getPrefixOptions(): PrefixOptions {
        return this.prefix_options;
    }

    getSurnamePrefixes(): string[] {
        return this.surname_prefixes;
    }
}