import { getLogger } from "log4js";
import { GetMediaPathParam, GetMediaPathResult } from "../api-types";
import { Client } from "@notionhq/client";
import { NotionApiKey } from "..";

const logger = getLogger();

export async function getMediaPath(param: GetMediaPathParam): Promise<GetMediaPathResult> {
    const notion = new Client({
        auth: NotionApiKey,
    });

    const res = await notion.blocks.children.list({
        block_id: param.id,
    });
    const mediaBlock = res.results.find(block => {
        if (!('type' in block)) return false;
        return block.type === 'file' || block.type === 'audio';
    });
    if (!mediaBlock || !('type' in mediaBlock) || mediaBlock.type !== 'audio') {
        throw new Error('no media');
    }
    if (mediaBlock.audio.type === 'external') {
        return {
            path: mediaBlock.audio.external.url,
        }
    } else {
        return {
            path: mediaBlock.audio.file.url

        }
    }
}