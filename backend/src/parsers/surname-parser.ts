export interface SurnameParser {
    parse(input: string): [string, string];
}

export class SurnameParserImpl implements SurnameParser {

    surname_prefixes: string[];

    constructor(surname_prefixes: string[]) {
        this.surname_prefixes = surname_prefixes;
    }

    parse(input: string): [string, string] {
        let words = input.split(" ");
        let surname = words[words.length - 1];
        if (surname.includes(".")) {
            return [input, ""];
        }
        for (let word of words.slice(0, words.length - 1).reverse()) {
            if (!this.surname_prefixes.includes(word)) {
                break;
            }
            surname = word + " " + surname;
        }
        let name = input.slice(0, input.length - surname.length).trim();
        return [name, surname];
    }
}