import { Contact } from "../types/contact";

interface ContactParser {

    parse(contact_input: string): Contact
    addTitle(title: string): void

}