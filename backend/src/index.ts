import express from 'express';
import { configure, getLogger } from 'log4js';
import { exit } from 'process';
import { LogSetting } from './config';
import { getMediaList } from './api/get-media-list';
import { GetMediaListParam } from './api-types';

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

if (!process.env.NOTION_PUBLISH_DATE_PROPERTY_NAME) {
    console.error('NOTION_PUBLISH_DATE_PROPERTY_NAME not found');
    exit(1);
}
export const NotionPublishDatePropertyName = process.env.NOTION_PUBLISH_DATE_PROPERTY_NAME;

configure(LogSetting);
const logger = getLogger();

const app = express();

app.get('/api/list', async(req, res) => {
    const param = req.query as GetMediaListParam;
    logger.info('[start] api/list', param);
    const result = await getMediaList(param);
    // logger.debug('result', result);
    res.send(result);
    logger.info('[end] api/list')
})

app.listen(80, () => {
    logger.info('start express server');
});
