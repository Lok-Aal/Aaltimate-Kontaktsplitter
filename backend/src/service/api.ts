import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { ContactParser, ContactParserImpl } from "../parsers/contact-parser";
import InputError from "../errors/input-error";
import { Contact, Gender, Title } from "../types/contact";
import { ContactFormatterImpl } from "../parsers/contact-formatter";

export class ApiService {

    private port: number;
    private contact_parser: ContactParser;


    constructor(port: number) {
        this.port = port;

        // ContactParser initialisieren
        this.contact_parser = new ContactParserImpl();
    }

    /**
     * API initialisieren
     */
    public init() {
        const app = express();
        // Cors for all
        app.use(cors());
        // Body parser for json
        app.use(bodyParser.json());
        var httpWebServer;
        httpWebServer = http.createServer(app);

        // API starten
        httpWebServer.listen(this.port, () => {
            console.log(`API listening to port ${this.port}`);
            this.registerRoutes(app);
        });
    }

    /**
     * parseContact, generateAnrede und addTitle als Routen registrieren
     * @param app Express-App
     */
    private registerRoutes(app: express.Application) {

        // parseContact registrieren
        app.get('/parseContact', async (req, res) => {
            let contact_input = req.query.contact;
            // Überprüfung auf richtiges Format der Eingabe
            if (contact_input === undefined || typeof (contact_input) !== "string") {
                res.status(400).json({ error: "invalid input" });
                return;
            }

            try {
                // Kontakt parsen
                let contact = this.contact_parser.parse(contact_input);
                res.status(200).json(contact);
            } catch (error) {
                if (error instanceof InputError) {
                    // Fehler bei der Eingabe
                    res.status(400).json({
                        error: error.message,
                        partial_contact: error.partial_contact,
                        input_error_range: error.input_error_range
                    });
                }
            }
        });

        // generateAnrede registrieren
        app.get('/generateAnrede', async (req, res) => {
            const name = req.query.name;
            const surname = req.query.surname;
            const titles = req.query.titles;
            const gender = req.query.gender;

            let paramsIvalid = (name === undefined || typeof (name) !== "string");
            paramsIvalid = paramsIvalid || (surname === undefined || typeof (surname) !== "string");
            paramsIvalid = paramsIvalid || (titles !== undefined && typeof (titles) !== "string");
            paramsIvalid = paramsIvalid || (gender !== undefined && typeof (gender) !== "string")


            if(paramsIvalid){
                res.status(400).json({ error: "invalid input" });
                return; 
            }

            // Check um sicherzugehen ob das Geschlecht wirklich m, w oder d oder undefined ist.
            const determinedGender = gender ? (gender != '' ? gender as Gender : undefined) : undefined;

            const contact: Contact = {
                name: name as string,
                surname: surname as string,
                titles: titles ? [titles as string] : [],
                gender: determinedGender
            }

            // Anreden generieren
            const formatter = new ContactFormatterImpl(contact);
            const anreden = {
                formal: formatter.formatFormal(),
                informal: formatter.formatInformal(),
                neutral: formatter.formatNeutral()
            }

            res.status(200).json(anreden);
        });
        
        app.get("/getTitles", async (req, res) => {
            res.status(200).json(this.contact_parser.getTitles());
        });

        // addTitle registrieren
        app.post("/addTitle", async (req, res) => {
            let body = req.body;
            let title = body.title;
            let gender = body.gender; // optional

            // Überprüfung auf richtiges Format der Eingabe
            if (title === undefined || typeof (title) !== "string") {
                res.status(400).json({ error: "invalid input" });
                return;
            }
            if (gender !== undefined && (typeof (gender) !== "string" || !["m", "w", "d"].includes(gender))) {
                res.status(400).json({ error: "invalid input" });
                return;
            }

            // Titel hinzufügen
            this.contact_parser.addTitle(title, gender as Gender | undefined);

            res.status(200).send();
        });
    }
}