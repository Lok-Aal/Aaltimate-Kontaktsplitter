import { ApiService } from "./service/api";
const api = new ApiService("127.0.0.1", 8080);
api.init();
