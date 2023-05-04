export type Gender = "m" | "w" | "d";

export type Title = string;

export interface ContactPrefix {
    gender?: Gender;
    titles?: Title[];
}

export interface Contact extends ContactPrefix {
    name?: string;
    surname?: String;
} 

export interface InputErrorRange {
    start: number;
    end: number;
}

export interface InputError extends Error {
    error: string;
    partial_contact?: Contact;
    input_error_range?: InputErrorRange;
}