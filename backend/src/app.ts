import { ApiService } from "./service/api";

const api = new ApiService(8080);
api.init();