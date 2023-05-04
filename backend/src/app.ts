import { ApiService } from "./service/api";
import { parse_contact } from "./parsers/contact-parser";
// const api = new ApiService("127.0.0.1", 8080);
// api.init();

// let test = "Frau Prof. Dr. rer. nat. Maria von der Leuthäuser-Schnarrenberger";
let test = "Professorin Raphael Sack";

console.log(test);
console.log(parse_contact(test));