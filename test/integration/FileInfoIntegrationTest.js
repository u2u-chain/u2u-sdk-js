import {
    FileCreateTransaction,
    FileDeleteTransaction,
    FileInfoQuery,
    U2U,
} from "../../src/exports.js";
import IntegrationTestEnv from "./client/NodeIntegrationTestEnv.js";

describe("FileInfo", function () {
    let env;

    before(async function () {
        env = await IntegrationTestEnv.new();
    });
    it("should be executable", async function () {
        this.timeout(120000);

        const operatorKey = env.operatorKey.publicKey;

        let response = await new FileCreateTransaction()
            .setKeys([operatorKey])
            .setContents("[e2e::FileCreateTransaction]")
            .execute(env.client);

        let receipt = await response.getReceipt(env.client);

        expect(receipt.fileId).to.not.be.null;
        expect(receipt.fileId != null ? receipt.fileId.num > 0 : false).to.be
            .true;

        const file = receipt.fileId;

        const info = await new FileInfoQuery()
            .setFileId(file)
            .setQueryPayment(new U2U(22))
            .execute(env.client);

        expect(info.fileId.toString()).to.be.equal(file.toString());
        expect(info.size.toInt()).to.be.equal(28);
        expect(info.isDeleted).to.be.false;

        // There should only be one key
        for (const key of info.keys) {
            expect(key.toString()).to.be.equal(operatorKey.toString());
        }

        await (
            await new FileDeleteTransaction()
                .setFileId(file)
                .execute(env.client)
        ).getReceipt(env.client);
    });

    it("should be executable with empty contents", async function () {
        this.timeout(120000);

        const operatorKey = env.operatorKey.publicKey;

        const response = await new FileCreateTransaction()
            .setKeys([operatorKey])
            .execute(env.client);

        const receipt = await response.getReceipt(env.client);

        expect(receipt.fileId).to.not.be.null;
        expect(receipt.fileId != null ? receipt.fileId.num > 0 : false).to.be
            .true;

        const file = receipt.fileId;

        const info = await new FileInfoQuery()
            .setFileId(file)
            .setQueryPayment(new U2U(22))
            .execute(env.client);

        expect(info.fileId.toString()).to.be.equal(file.toString());
        expect(info.size.toInt()).to.be.equal(0);
        expect(info.isDeleted).to.be.false;

        // There should only be one key
        for (const key of info.keys) {
            expect(key.toString()).to.be.equal(operatorKey.toString());
        }

        await (
            await new FileDeleteTransaction()
                .setFileId(file)
                .execute(env.client)
        ).getReceipt(env.client);
    });

    it("should be executable with no keys", async function () {
        this.timeout(120000);

        const response = await new FileCreateTransaction().execute(env.client);

        const receipt = await response.getReceipt(env.client);

        expect(receipt.fileId).to.not.be.null;
        expect(receipt.fileId != null ? receipt.fileId.num > 0 : false).to.be
            .true;

        const file = receipt.fileId;

        const info = await new FileInfoQuery()
            .setFileId(file)
            .setQueryPayment(new U2U(22))
            .execute(env.client);

        expect(info.fileId.toString()).to.be.equal(file.toString());
        expect(info.size.toInt()).to.be.equal(0);
        expect(info.isDeleted).to.be.false;
        expect(info.keys.toArray().length).to.be.equal(0);
    });

    it("should be able to query cost", async function () {
        this.timeout(120000);
        const operatorKey = env.operatorKey.publicKey;

        const response = await new FileCreateTransaction()
            .setKeys([operatorKey])
            .execute(env.client);

        let receipt = await response.getReceipt(env.client);
        let file = receipt.fileId;

        const cost = await new FileInfoQuery()
            .setFileId(file)
            .getCost(env.client);

        expect(cost.toTinyU2U().toInt()).to.be.at.least(1);
    });

    after(async function () {
        await env.close();
    });
});
