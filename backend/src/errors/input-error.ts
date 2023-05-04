import { Contact } from "../types/contact";

export interface InputErrorRange {
    start: number;
    end: number;
}

export default class InputError extends Error {

    partial_contact?: Contact;
    input_error_range?: InputErrorRange;

    constructor(message: string, partial_contact?: Contact, input_error_range?: InputErrorRange) {
        super(message);
        this.partial_contact = partial_contact;
        this.input_error_range = input_error_range;
        this.name = "InputError";
    }
}