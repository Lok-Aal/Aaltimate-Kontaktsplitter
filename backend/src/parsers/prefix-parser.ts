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

    constructor(options: PrefixOptions) {
        this.options = options;
        this.genderStrings = [];
        this.titleStrings = [];
        this.optionsUpdated();
    }

    optionsUpdated() {
        this.genderStrings = Object.keys(this.options.genderStrings).sort((a, b) => b.length - a.length); // longest first
        this.titleStrings = Object.keys(this.options.titleStrings).sort((a, b) => b.length - a.length); // longest first
    }

    parse(input: string, contact_prefix: ContactPrefix = { gender: undefined, titles: [] }): [string, ContactPrefix] {
        for (let genderString of this.genderStrings) {
            let length = startsWithLength(input, genderString);
            if (length > 0) {
                input = input.slice(length).trim();
                return this.parse(input, merge_contact_prefix(contact_prefix, this.options.genderStrings[genderString]));
            }
        }
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
    if (input[input_index] !== " ") {
        return -1;
    }
    return input_index; 
}

function merge_contact_prefix(c1: ContactPrefix, c2: ContactPrefix): ContactPrefix {
    if (c1.gender != null && c2.gender != c1.gender) {
        // TODO: Gender Error
    }
    let titles: Title[] = [];
    if (c1.titles) {
        titles = titles.concat(c1.titles);
    }
    if (c2.titles) {
        titles = titles.concat(c2.titles);
    }
    return {
        gender: c1.gender || c2.gender,
        titles: titles
    };
}