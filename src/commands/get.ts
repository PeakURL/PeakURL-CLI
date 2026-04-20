import { ApiClient } from "../api/index.js";
import {
    formatLinkDetails,
    getQuietLinkValue,
    getAuthConfig,
    writeJson,
    writeStdout,
} from "../lib/index.js";
import type { OutputOptions } from "../types.js";

/**
 * Loads and prints a single short link by identifier or alias.
 */
export async function getCommand(
    idOrAlias: string,
    options: OutputOptions,
): Promise<void> {
    const config = await getAuthConfig(process.env);
    const response = await new ApiClient(config).getUrl(idOrAlias);

    if (options.json) {
        writeJson(response);
        return;
    }

    if (options.quiet) {
        writeStdout(getQuietLinkValue(response.data));
        return;
    }

    writeStdout(response.message);
    writeStdout(formatLinkDetails(response.data));
}
