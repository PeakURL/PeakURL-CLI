import { ApiClient } from "../api/index.js";
import {
    extractLinks,
    formatLinksTable,
    formatListSummary,
    getQuietLinkValue,
    getAuthConfig,
    writeJson,
    writeStdout,
} from "../lib/index.js";
import type { OutputOptions } from "../types.js";

interface ListOptions extends OutputOptions {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}

/**
 * Lists short links and renders them in human or machine-readable form.
 */
export async function listCommand(options: ListOptions): Promise<void> {
    const config = await getAuthConfig(process.env);
    const response = await new ApiClient(config).listUrls({
        page: options.page,
        limit: options.limit,
        search: options.search,
        sortBy: options.sortBy,
        sortOrder: options.sortOrder,
    });

    const links = extractLinks(response.data);

    if (options.json) {
        writeJson(response);
        return;
    }

    if (options.quiet) {
        for (const link of links) {
            const value = getQuietLinkValue(link);
            if (value) {
                writeStdout(value);
            }
        }
        return;
    }

    writeStdout(response.message);
    writeStdout(formatLinksTable(links));
    writeStdout(formatListSummary(response.data, links.length));
}
