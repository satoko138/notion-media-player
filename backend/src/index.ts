import express from 'express';
import { configure, getLogger } from 'log4js';
import { exit } from 'process';
import { LogSetting } from './config';
import { getMediaList } from './api/get-media-list';
import { GetMediaListParam, GetMediaPathParam } from './api-types';
import { getMediaPath } from './api/get-media-path';

['NOTION_API_KEY', 'NOTION_MEDIA_DB_ID', 'NOTION_TITLE_PROPERTY_NAME', 'NOTION_SORT_PROPERTY_NAME'].forEach(key => {
    if (!process.env[key]) {
        console.error(`${key} not found`);
        exit(1);
    }    
})
export const NotionApiKey = process.env.NOTION_API_KEY as string;
export const NotionMediaDbId = process.env.NOTION_MEDIA_DB_ID as string;
export const NotionTitlePropertyName = process.env.NOTION_TITLE_PROPERTY_NAME as string;
export const NotionSortPropertyName = process.env.NOTION_SORT_PROPERTY_NAME as string;

configure(LogSetting);
const logger = getLogger();

const app = express();

// フロントエンド資源
// 本番では./htdocs、開発環境では../buildを参照する
const static_path = process.env.NODE_ENV === 'dev' ? '../build' : './htdocs';
logger.info('static path', static_path);
app.use(express.static(static_path));

/**
 * メディア一覧を取得
 */
app.get('/api/list', async(req, res) => {
    try {
        const param = req.query as GetMediaListParam;
        logger.info('[start] api/list', param);
        const result = await getMediaList(param);
        // logger.debug('result', result);
        res.send(result);

    } catch(e) {
        logger.warn('list error', e);
        res.status(500).send(e);

    } finally {
        logger.info('[end] api/list')
    }
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
