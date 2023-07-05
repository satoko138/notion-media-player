import { Client } from "@notionhq/client";
import { NotionApiKey, NotionMediaDbId, NotionPublishDatePropertyName } from "..";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { GetMediaListParam, GetMediaListResult, MediaInfo } from "../api-types";
import { getLogger } from 'log4js';

type NotionPage = QueryDatabaseResponse['results'][0];

const logger = getLogger();
export async function getMediaList(param: GetMediaListParam): Promise<GetMediaListResult> {
    const notion = new Client({
        auth: NotionApiKey,
    });

    console.log('cursor', param.cursor);
    const medias = [] as MediaInfo[];
    const pages = await notion.databases.query({
        database_id: NotionMediaDbId,
        page_size: 20,
        sorts: [
            {
                property: NotionPublishDatePropertyName,
                direction: 'ascending',
            }
        ],
        start_cursor: param.cursor,
    });
    const next_cursor = pages.next_cursor ?? undefined;

    for (const page of pages.results) {
        const info = await getNotionPageInfo(page);
        if (info) {
            medias.push(info);
        }
    }

    return {
        medias,
        next_cursor,
    };
}

async function getNotionPageInfo(page: NotionPage): Promise<MediaInfo | undefined> {
    if (!('properties' in page)) {
        logger.warn('no property', page.id);
        return;
    }
    const result: MediaInfo = {
        id: page.id,
        title: '',
        publish_date: '',
    }
    Object.entries(page.properties).forEach(entry => {
        const propName = entry[0];
        const property = entry[1];
        if (property.type === 'title') {
            result.title = property.title.map(val => val.plain_text).join('');

        } else if (property.type === 'date' && propName === NotionPublishDatePropertyName) {
            result.publish_date = property.date?.start ?? '';
        }
    })
    return result;
}