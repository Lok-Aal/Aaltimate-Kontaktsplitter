import { Contact, ContactPrefix, Gender, Title } from "../types/contact";

export interface PrefixOptions {
    genderStrings: {
        [key: string]: ContactPrefix
    }
    titleStrings: {
        [key: string]: ContactPrefix
    }
}

export class PrefixParser {

    options: PrefixOptions;
    genderStrings: string[];
    titleStrings: string[];

    constructor(options: PrefixOptions) {
        this.options = options;
        this.genderStrings = Object.keys(this.options.genderStrings).sort((a, b) => b.length - a.length); // longest first
        this.titleStrings = Object.keys(this.options.titleStrings).sort((a, b) => b.length - a.length); // longest first
    }

    parse_prefix(input: string, contact_prefix: ContactPrefix = { titles: [] }): [string, ContactPrefix] {
        for (let genderString of this.genderStrings) {
            if (input.startsWith(genderString)) {
                input = input.slice(genderString.length).trim();
                return this.parse_prefix(input, merge_contact_prefix(contact_prefix, this.options.genderStrings[genderString]));
            }
        }
        for (let titleString of this.titleStrings) {
            if (input.startsWith(titleString)) {
                input = input.slice(titleString.length).trim();
                return this.parse_prefix(input, merge_contact_prefix(contact_prefix, this.options.titleStrings[titleString]));
            }
        }
        return [input, contact_prefix];
    }
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