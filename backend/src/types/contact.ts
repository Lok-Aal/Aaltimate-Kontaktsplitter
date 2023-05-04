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