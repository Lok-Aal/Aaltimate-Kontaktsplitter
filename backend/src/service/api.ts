import express from "express";
import http from "http";
import cors from "cors";
import { ContactParser, ContactParserImpl } from "../parsers/contact-parser";

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
            if (contact_input === undefined || typeof(contact_input) !== "string") {
                res.status(400).json({ error: "invalid input" });
                return;
            }

            let contact = this.contact_parser.parse(contact_input);

            if (contact === null) {
                res.status(400).json({ error: "invalid contact" });
            }

            res.status(200).json( contact );
        });
    }
}