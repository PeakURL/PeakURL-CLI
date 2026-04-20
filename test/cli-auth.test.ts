import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
    configPathForHome,
    mockBaseUrl,
    runCli,
    VALID_TOKEN,
} from "./cli-test-harness.js";

describe("PeakURL CLI Authentication", () => {
    it("prints the global help output", async () => {
        const result = await runCli(["--help"]);

        assert.equal(result.code, 0);
        assert.match(result.stdout, /PeakURL command-line interface/);
        assert.match(result.stdout, /login/);
        assert.match(result.stdout, /create/);
    });

    it("persists verified credentials to the config file", async () => {
        const result = await runCli(["login"]);

        assert.equal(result.code, 0);
        assert.match(result.stdout, /Saved credentials/);
        assert.match(result.stdout, /Authenticated as Peak URL/);

        const configPath = configPathForHome(result.homeDir);
        const savedConfig = JSON.parse(await readFile(configPath, "utf8")) as {
            baseUrl: string;
            apiKey: string;
        };

        assert.equal(savedConfig.baseUrl, mockBaseUrl());
        assert.equal(savedConfig.apiKey, VALID_TOKEN);
    });

    it("normalizes dashboard API URLs during login", async () => {
        const result = await runCli([
            "login",
            "--base-url",
            `${mockBaseUrl()}/api/v1`,
        ]);

        assert.equal(result.code, 0);

        const configPath = configPathForHome(result.homeDir);
        const savedConfig = JSON.parse(await readFile(configPath, "utf8")) as {
            baseUrl: string;
            apiKey: string;
        };

        assert.equal(savedConfig.baseUrl, mockBaseUrl());
    });

    it("returns the authenticated user as JSON", async () => {
        const result = await runCli(["whoami", "--json"]);

        assert.equal(result.code, 0);

        const parsed = JSON.parse(result.stdout) as {
            success: boolean;
            data: { username: string };
        };

        assert.equal(parsed.success, true);
        assert.equal(parsed.data.username, "peak");
    });
});
