import path from "path";

const __dirname = path.resolve();

/** 
@async
@function initLogger
@returns {LoggerConfig} Configuration of the logger
@version 0.0.3
@author Creative-Difficulty
*/

var calledCounter = 0;
export default async function initLogger() {
    var currentDate = new Date();
    var LogName = currentDate.getDate() + "." + (parseInt(currentDate.getMonth()) + 1) + "." + currentDate.getFullYear() + "@" + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    
    return {
        appenders: {
            fileAppender: { type: 'file', filename: path.join(__dirname, "logs", LogName + ".log") },
            console: { type: 'console' }
        },
        categories: {
            default: { appenders: ['fileAppender', 'console'], level: process.env.LOGLEVEL }
        }
    };
}