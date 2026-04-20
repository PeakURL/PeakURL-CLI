/**
 * Command-level error with a stable exit code for CLI flows.
 */
type CliErrorKind = "auth_required";

interface CliErrorOptions extends ErrorOptions {
    kind?: CliErrorKind;
}

export class CliError extends Error {
    readonly exitCode: number;
    readonly kind?: CliErrorKind;

    constructor(message: string, exitCode = 1, options?: CliErrorOptions) {
        super(message, options);
        this.name = "CliError";
        this.exitCode = exitCode;
        this.kind = options?.kind;
    }
}

/**
 * Normalizes unknown failures into a CLI-safe error instance.
 */
export function ensureCliError(error: unknown): CliError {
    if (error instanceof CliError) {
        return error;
    }

    if (error instanceof Error) {
        return new CliError(error.message, 1, { cause: error });
    }

    return new CliError("Unexpected error.");
}
