import { Client } from "@notionhq/client";
import { NotionApiKey, NotionMediaDbId } from "..";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { GetMediaListResult, MediaInfo } from "../api-types";
import { getLogger } from 'log4js';

type NotionPage = QueryDatabaseResponse['results'][0];

const logger = getLogger();
export async function getMediaList(): Promise<GetMediaListResult> {
    const notion = new Client({
        auth: NotionApiKey,
    });

    const medias = [] as MediaInfo[];
    const pages = await notion.databases.query({
        database_id: NotionMediaDbId,
        page_size: 20,
        // start_cursor,
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

        } else if (property.type === 'date' && propName === process.env.NOTION_PUBLISH_DATE_PROPERTY_NAME) {
            result.publish_date = property.date?.start ?? '';
        }
    })
    return result;
}