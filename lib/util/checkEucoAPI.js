import { exit } from "process";
import { ENVchecked, Argvchecked, logger } from "../../monitoring.js";

export default async function checkEucoAPI() {
    if(!ENVchecked || !Argvchecked) {logger.error("Something went wrong while checking Environment Variables or Program Arguments"); exit(1);}
    try {
        console.time("Ping to EucoAPI");
        const resp = await fetch(process.env.FETCH_URL)
        if(resp.status !== 401) {
            return false;
        }
        console.timeEnd("Ping to EucoAPI");
        return true;
    } catch(e) {
        return false;
    }
}
