import express from 'express';
import { configure, getLogger } from 'log4js';
import { exit } from 'process';
import { LogSetting } from './config';

if (!process.env.NOTION_API_KEY) {
    console.error('NOTION_API_KEY not found');
    exit(1);
}
export const NotionApiKey = process.env.NOTION_API_KEY;

configure(LogSetting);
const logger = getLogger();

const app = express();

app.listen(80, () => {
    logger.info('start express server');
});
