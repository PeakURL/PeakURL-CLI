import type { PeakUrlUser } from "../types.js";

function stringValue(value: unknown): string | undefined {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * Returns the best human-readable label for a PeakURL user.
 */
export function getUserLabel(user: PeakUrlUser): string {
    const fullName = [stringValue(user.firstName), stringValue(user.lastName)]
        .filter(Boolean)
        .join(" ");
    return (
        fullName ||
        stringValue(user.username) ||
        stringValue(user.email) ||
        String(user.id ?? "unknown")
    );
}

/**
 * Returns a compact identifier for quiet user output.
 */
export function getQuietUserValue(user: PeakUrlUser): string {
    return (
        stringValue(user.username) ||
        stringValue(user.email) ||
        String(user.id ?? "")
    );
}

/**
 * Formats user fields for the default human-readable CLI output.
 */
export function formatUserDetails(user: PeakUrlUser): string {
    const lines = [
        ["Name", getUserLabel(user)],
        ["Username", stringValue(user.username)],
        ["Email", stringValue(user.email)],
        ["Role", stringValue(user.role)],
        ["ID", user.id === undefined ? undefined : String(user.id)],
    ].filter((entry): entry is [string, string] => Boolean(entry[1]));

    return lines.map(([label, value]) => `${label}: ${value}`).join("\n");
}
