import { Contact } from "../types/contact";

export default interface ContactParser {

    parse(contact_input: string): Contact
    addTitle(title: string): void

}