import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { runCli } from "./cli-test-harness.js";

describe("PeakURL CLI Link Management", () => {
    it("creates a short link", async () => {
        const result = await runCli([
            "create",
            "https://example.com/launch",
            "--alias",
            "launch",
        ]);

        assert.equal(result.code, 0);
        assert.match(result.stdout, /Short URL created/);
        assert.match(result.stdout, /https:\/\/peakurl\.test\/launch/);
    });

    it("lists short links in human-readable output", async () => {
        const result = await runCli(["list"]);

        assert.equal(result.code, 0);
        assert.match(result.stdout, /URLs loaded/);
        assert.match(result.stdout, /launch/);
        assert.match(result.stdout, /https:\/\/example\.com\/launch/);
        assert.match(result.stdout, /Page 1 of 1\. 1 total link\./);
    });

    it("deletes a short link by alias after resolving its identifier", async () => {
        const result = await runCli(["delete", "launch"]);

        assert.equal(result.code, 0);
        assert.match(result.stdout, /URL deleted/);
    });
});
