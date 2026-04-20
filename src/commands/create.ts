import { ApiClient } from "../api/index.js";
import {
    CliError,
    formatLinkDetails,
    getQuietLinkValue,
    normalizeDestinationUrl,
    getAuthConfig,
    writeJson,
    writeStdout,
} from "../lib/index.js";
import type { OutputOptions } from "../types.js";

interface CreateOptions extends OutputOptions {
    alias?: string;
    title?: string;
    password?: string;
    status?: string;
    expiresAt?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
}

function normalizeExpiresAt(value?: string): string | undefined {
    if (!value) {
        return undefined;
    }

    if (Number.isNaN(Date.parse(value))) {
        throw new CliError(`Invalid expiration timestamp: ${value}`);
    }

    return value;
}

/**
 * Creates a short link for the provided destination URL.
 */
export async function createCommand(
    destinationUrl: string,
    options: CreateOptions,
): Promise<void> {
    const config = await getAuthConfig(process.env);
    const response = await new ApiClient(config).createUrl({
        destinationUrl: normalizeDestinationUrl(destinationUrl),
        ...(options.alias ? { alias: options.alias } : {}),
        ...(options.title ? { title: options.title } : {}),
        ...(options.password ? { password: options.password } : {}),
        ...(options.status ? { status: options.status } : {}),
        ...(options.expiresAt
            ? { expiresAt: normalizeExpiresAt(options.expiresAt) }
            : {}),
        ...(options.utmSource ? { utmSource: options.utmSource } : {}),
        ...(options.utmMedium ? { utmMedium: options.utmMedium } : {}),
        ...(options.utmCampaign ? { utmCampaign: options.utmCampaign } : {}),
        ...(options.utmTerm ? { utmTerm: options.utmTerm } : {}),
        ...(options.utmContent ? { utmContent: options.utmContent } : {}),
    });

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
