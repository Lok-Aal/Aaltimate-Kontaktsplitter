import express from "express";
import http from "http";
import cors from "cors";

export class ApiService {
    private origin: string;
    private port: number;

    constructor(origin: string, port: number) {
        this.origin = origin;
        this.port = port;
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
            res.status(501).json({ error: "Not Implemented" });
        });
    }
}