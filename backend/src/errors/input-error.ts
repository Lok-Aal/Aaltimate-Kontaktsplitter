import { Contact } from "../types/contact";

export interface InputErrorRange {
    start: number;
    end: number;
}

export default class InputError extends Error {

    hint?: string;
    partial_contact?: Contact;
    input_error_range?: InputErrorRange;

    constructor(message: string, hint?: string, partial_contact?: Contact, input_error_range?: InputErrorRange) {
        super(message);
        this.hint = hint;
        this.partial_contact = partial_contact;
        this.input_error_range = input_error_range;
        this.name = "InputError";
    }
}