export interface SurnameParser {
    parse(input: string): [string, string];
}

export class SurnameParserImpl implements SurnameParser {

    surname_prefixes: string[];

    constructor(surname_prefixes: string[]) {
        this.surname_prefixes = surname_prefixes;
    }

    /**
     * @param input String, der den Vornamen und Nachnamen enthält
     * @returns Vorname und Nachname
     */
    parse(input: string): [string, string] {
        let words = input.split(" ");
        
        // letztes Wort ist Nachname, wenn es kein Punkt enthält
        // Mit Punkt ist es möglicherweise ein Titel
        let surname = words[words.length - 1];
        if (surname.includes(".")) {
            return [input, ""];
        }

        // Nachname kann aus mehreren Wörtern bestehen
        // Nachname Präfixe werden erkannt und mit dem Nachnamen verbunden
        for (let word of words.slice(0, words.length - 1).reverse()) {
            if (!this.surname_prefixes.includes(word)) {
                break;
            }
            surname = word + " " + surname;
        }

        // Vorname ist alles, was vor dem Nachnamen steht
        let name = input.slice(0, input.length - surname.length).trim();
        
        return [name, surname];
    }
}