/**
 * Writes a single line to stdout.
 */
export function writeStdout(message = ""): void {
    process.stdout.write(`${message}\n`);
}

/**
 * Writes a single line to stderr.
 */
export function writeStderr(message = ""): void {
    process.stderr.write(`${message}\n`);
}

/**
 * Writes a boxed block to stderr for notices that should stand out in the TUI.
 *
 * @param title Short heading shown in the top border.
 * @param lines Content lines rendered inside the box.
 * @param target Output stream target.
 */
export function writeNoticeBox(
    title: string,
    lines: string[],
    target: "stdout" | "stderr" = "stderr",
): void {
    const contentLines = lines.length > 0 ? lines : [""];
    const width = Math.max(
        title.length,
        ...contentLines.map((line) => line.length),
    );
    const stream = target === "stdout" ? process.stdout : process.stderr;
    const useTuiBox = stream.isTTY;
    const border = useTuiBox
        ? {
              topLeft: "┌",
              topRight: "┐",
              bottomLeft: "└",
              bottomRight: "┘",
              horizontal: "─",
              vertical: "│",
              separatorLeft: "├",
              separatorRight: "┤",
          }
        : {
              topLeft: "+",
              topRight: "+",
              bottomLeft: "+",
              bottomRight: "+",
              horizontal: "-",
              vertical: "|",
              separatorLeft: "+",
              separatorRight: "+",
          };
    const topBorder = `${border.topLeft}${border.horizontal.repeat(width + 2)}${border.topRight}`;
    const separator = `${border.separatorLeft}${border.horizontal.repeat(width + 2)}${border.separatorRight}`;
    const bottomBorder = `${border.bottomLeft}${border.horizontal.repeat(width + 2)}${border.bottomRight}`;
    const writeLine = target === "stdout" ? writeStdout : writeStderr;

    writeLine(topBorder);
    writeLine(`${border.vertical} ${title.padEnd(width)} ${border.vertical}`);
    writeLine(separator);

    for (const line of contentLines) {
        writeLine(
            `${border.vertical} ${line.padEnd(width)} ${border.vertical}`,
        );
    }

    writeLine(bottomBorder);
}

/**
 * Renders a plain-text table with a boxed header/body layout.
 *
 * Unicode borders are used in interactive terminals. Non-TTY output falls back
 * to ASCII so logs and captured output remain readable everywhere.
 *
 * @param headers Header labels shown in the first row.
 * @param rows Body rows shown below the header separator.
 * @param target Output stream target.
 * @returns Table string ready to write as a single block.
 */
export function formatTable(
    headers: string[],
    rows: string[][],
    target: "stdout" | "stderr" = "stdout",
): string {
    const stream = target === "stdout" ? process.stdout : process.stderr;
    const useTuiBox = stream.isTTY;
    const border = useTuiBox
        ? {
              topLeft: "┌",
              topRight: "┐",
              bottomLeft: "└",
              bottomRight: "┘",
              horizontal: "─",
              vertical: "│",
              separatorLeft: "├",
              separatorRight: "┤",
              topJunction: "┬",
              middleJunction: "┼",
              bottomJunction: "┴",
          }
        : {
              topLeft: "+",
              topRight: "+",
              bottomLeft: "+",
              bottomRight: "+",
              horizontal: "-",
              vertical: "|",
              separatorLeft: "+",
              separatorRight: "+",
              topJunction: "+",
              middleJunction: "+",
              bottomJunction: "+",
          };
    const widths = headers.map((header, index) =>
        Math.max(
            header.length,
            ...rows.map((row) => (row[index] ?? "").length),
        ),
    );

    const formatTableBorder = (
        left: string,
        join: string,
        right: string,
    ): string =>
        `${left}${widths
            .map((width) => border.horizontal.repeat(width + 2))
            .join(join)}${right}`;

    const formatTableRow = (cells: string[]): string =>
        `${border.vertical}${cells
            .map((cell, index) => ` ${(cell ?? "").padEnd(widths[index])} `)
            .join(border.vertical)}${border.vertical}`;

    return [
        formatTableBorder(border.topLeft, border.topJunction, border.topRight),
        formatTableRow(headers),
        formatTableBorder(
            border.separatorLeft,
            border.middleJunction,
            border.separatorRight,
        ),
        ...rows.map(formatTableRow),
        formatTableBorder(
            border.bottomLeft,
            border.bottomJunction,
            border.bottomRight,
        ),
    ].join("\n");
}

/**
 * Serializes a value as pretty JSON and writes it to stdout.
 */
export function writeJson(value: unknown): void {
    writeStdout(JSON.stringify(value, null, 2));
}
