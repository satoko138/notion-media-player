import express from 'express';
import { configure, getLogger } from 'log4js';
import { exit } from 'process';
import { LogSetting } from './config';
import { getMediaList } from './api/get-media-list';

if (!process.env.NOTION_API_KEY) {
    console.error('NOTION_API_KEY not found');
    exit(1);
}
export const NotionApiKey = process.env.NOTION_API_KEY;

if (!process.env.NOTION_MEDIA_DB_ID) {
    console.error('NOTION_MEDIA_DB_ID not found');
    exit(1);
}
export const NotionMediaDbId = process.env.NOTION_MEDIA_DB_ID;

configure(LogSetting);
const logger = getLogger();

const app = express();

app.get('/api/list', async(req, res) => {
    logger.info('[start] api/list')
    const result = await getMediaList();
    logger.debug('result', result);
    res.send(result);
    logger.info('[end] api/list')
})

app.listen(80, () => {
    logger.info('start express server');
});
