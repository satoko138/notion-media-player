import { Configuration } from "log4js";
import path from 'path';

export const LogSetting = {
    "appenders" : {
        "file" : {
            type : "file",
            filename : path.join(process.env.LOG_DIR_PATH ?? './', "system.log"),
            maxLogSize: 3 * 1024 * 1024,
            backups: 5,
        },
        "console": {
            type: 'console',
        }
    },
    "categories" : {
        "default" : {
            "appenders" : process.env.ENV === 'dev' ? ["file", "console"] : ["file"],
            level : process.env.LOG_LEVEL as string,
        },
    }
} as Configuration;
