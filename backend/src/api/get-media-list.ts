import { Client } from "@notionhq/client";
import { NotionApiKey, NotionMediaDbId, NotionSortPropertyName, NotionTitlePropertyName } from "..";
import { QueryDatabaseParameters, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { GetMediaListParam, GetMediaListResult, MediaInfo } from "../api-types";
import { getLogger } from 'log4js';
import dayjs from "dayjs";

type NotionPage = QueryDatabaseResponse['results'][0];

const logger = getLogger();
type Filter = QueryDatabaseParameters['filter'];
export async function getMediaList(param: GetMediaListParam): Promise<GetMediaListResult> {
    const notion = new Client({
        auth: NotionApiKey,
    });

    const filter: Filter = {
        and: []
    };
    if (param.keyword) {
        filter.and.push({
            property: NotionTitlePropertyName,
            title: {
                contains: param.keyword
            },
        })
    }
    if (process.env.NOTION_PUBLISH_FLAG_PROPERTY_NAME) {
        filter.and.push({
            property: process.env.NOTION_PUBLISH_FLAG_PROPERTY_NAME,
            checkbox: {
                equals: true,
            }
        })
    }
    
    const medias = [] as MediaInfo[];
    const pages = await notion.databases.query({
        database_id: NotionMediaDbId,
        page_size: 20,
        filter: filter.and.length > 0 ? filter : undefined,
        sorts: [
            {
                property: NotionSortPropertyName,
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

        } else if (property.type === 'date' && propName === NotionSortPropertyName) {
            if (property.date?.start) {
                result.publish_date = dayjs(property.date.start).format('YYYY-MM-DD');
            }
        }
    })
    return result;
}