import { Contact } from "../types/contact";

export interface ContactFormatter{
    contact: Contact;
    formatFormal(): string;
    formatInformal(): string;
    formatNeutral(): string;
}

export class ContactFormatterImpl implements ContactFormatter{

    constructor(public contact: Contact){}

    formatFormal(): string {

        let genderedPrefix = this.contact.name;
        let genderedGeehrte = 'geehrte*r';
        if (this.contact.gender === "m") {
            genderedPrefix = "Herr";
            genderedGeehrte = "geehrter";
        } else if (this.contact.gender === "w") {
            genderedPrefix = "Frau";
            genderedGeehrte = "geehrte";
        }

        switch(this.contact.gender){
            case "m":
            case "w":
                return `Sehr ${genderedGeehrte} ${genderedPrefix} ${this.contact.titles ? this.contact.titles?.join("")+" " : ""}${this.contact.surname}`;
            default:
                return `Sehr ${genderedGeehrte} ${this.contact.titles ? this.contact.titles?.join("") + " " : ""}${genderedPrefix} ${this.contact.surname}`;
        }
    }

    formatInformal(): string {
        return `Hallo ${this.contact.name}`
    }

    formatNeutral(): string {

        let genderedPrefix = this.contact.name;
        if(this.contact.gender === "m"){
            genderedPrefix = "Herr";
        }else if(this.contact.gender === "w"){
            genderedPrefix = "Frau";
        }

        return `Guten Tag ${genderedPrefix} ${this.contact.surname}`
    }

}