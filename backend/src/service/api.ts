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
        this.contact_parser = new ContactParserImpl();
    }

    public init() {
        const app = express();
        // Cors for all
        app.use(cors());
        // Body parser for json
        app.use(bodyParser.json());
        var httpWebServer;
        httpWebServer = http.createServer(app);

        httpWebServer.listen(this.port, () => {
            console.log(`API listening to port ${this.port}`);
            this.registerRoutes(app);
        });
    }

    private registerRoutes(app: express.Application) {
        app.get('/parseContact', async (req, res) => {
            let contact_input = req.query.contact;
            if (contact_input === undefined || typeof (contact_input) !== "string") {
                res.status(400).json({ error: "invalid input" });
                return;
            }

            try {
                let contact = this.contact_parser.parse(contact_input);
                res.status(200).json(contact);
            } catch (error) {
                if (error instanceof InputError) {
                    res.status(400).json({
                        error: error.message,
                        partial_contact: error.partial_contact,
                        input_error_range: error.input_error_range
                    });
                }
            }
        });

        app.get('/generateAnrede', async (req, res) => {
            const name = req.query.name;
            const surname = req.query.surname;
            const titles = req.query.titles;
            const gender = req.query.gender;

            if (name === undefined || typeof (name) !== "string") {
                res.status(400).json({ error: "invalid input" });
                return;
            }
            if (surname === undefined || typeof (surname) !== "string") {
                res.status(400).json({ error: "invalid input" });
                return;
            }

            if( titles !== undefined && typeof(titles) !== "string"){
                res.status(400).json({ error: "invalid input" });
                return;
            }

            if(gender !== undefined && typeof(gender) !== "string"){
                res.status(400).json({ error: "invalid input" });
                return; 
            }

            const contact: Contact = {
                name: name,
                surname: surname,
                titles: titles ? [titles] : [],
                gender: gender ? (gender != '' ? gender as Gender : undefined) : undefined
            }

            const formatter = new ContactFormatterImpl(contact);

            const anreden = {
                formal: formatter.formatFormal(),
                informal: formatter.formatInformal(),
                neutral: formatter.formatNeutral()
            }

            res.status(200).json(anreden);
            

        });

        app.post("/addTitle", async (req, res) => {
            let body = req.body;
            let title = body.title;
            let gender = body.gender; // optional

            if (title === undefined || typeof (title) !== "string") {
                res.status(400).json({ error: "invalid input" });
                return;
            }
            if (gender !== undefined && (typeof (gender) !== "string" || !["m", "w", "d"].includes(gender))) {
                res.status(400).json({ error: "invalid input" });
                return;
            }

            this.contact_parser.addTitle(title, gender as Gender | undefined);

            res.status(200).send();
        });
    }
}