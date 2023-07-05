import express from 'express';
import { configure, getLogger } from 'log4js';
import { exit } from 'process';
import { LogSetting } from './config';
import { getMediaList } from './api/get-media-list';
import { GetMediaListParam, GetMediaPathParam } from './api-types';
import { getMediaPath } from './api/get-media-path';

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

/**
 * メディア一覧を取得
 */
app.get('/api/list', async(req, res) => {
    const param = req.query as GetMediaListParam;
    logger.info('[start] api/list', param);
    const result = await getMediaList(param);
    // logger.debug('result', result);
    res.send(result);
    logger.info('[end] api/list')
})

/**
 * メディアファイルパスを取得
 */
app.get('/api/mediapath', async(req, res) => {
    try {
        const param = req.query as GetMediaPathParam;
        logger.info('[start] api/mediapath', param);
        const result = await getMediaPath(param);
        res.send(result);
    
    } catch(e) {
        logger.warn('medipath error', e);
        res.status(500).send(e);

    } finally {
        logger.info('[end] api/mediapth');
    }
})

app.listen(80, () => {
    logger.info('start express server');
});
