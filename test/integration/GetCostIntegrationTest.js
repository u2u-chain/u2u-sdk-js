import {
    AccountBalanceQuery,
    AccountInfoQuery,
    U2U,
    Status,
} from "../../src/exports.js";
import IntegrationTestEnv from "./client/NodeIntegrationTestEnv.js";

describe("GetCost", function () {
    let env;

    before(async function () {
        env = await IntegrationTestEnv.new();
    });
    it("should be executable", async function () {
        this.timeout(120000);

        const operatorId = env.operatorId;

        const cost = await new AccountInfoQuery()
            .setAccountId(operatorId)
            .getCost(env.client);

        await new AccountInfoQuery()
            .setAccountId(operatorId)
            .setQueryPayment(cost)
            .execute(env.client);
    });

    it("should be executable when max query payment is large", async function () {
        this.timeout(120000);

        const operatorId = env.operatorId;

        env.client.setMaxQueryPayment(new U2U(100));

        const cost = await new AccountInfoQuery()
            .setAccountId(operatorId)
            .getCost(env.client);

        await new AccountInfoQuery()
            .setAccountId(operatorId)
            .setQueryPayment(cost)
            .execute(env.client);
    });

    it("should be executable when max query payment is small", async function () {
        this.timeout(120000);

        const operatorId = env.operatorId;

        env.client.setMaxQueryPayment(new U2U(1));

        const cost = await new AccountInfoQuery()
            .setAccountId(operatorId)
            .getCost(env.client);

        await new AccountInfoQuery()
            .setAccountId(operatorId)
            .setQueryPayment(cost)
            .execute(env.client);
    });

    it("should be executable when free queries have set zero cost", async function () {
        this.timeout(120000);

        const operatorId = env.operatorId;

        await new AccountInfoQuery()
            .setAccountId(operatorId)
            .setQueryPayment(new U2U(1))
            .execute(env.client);

        await new AccountBalanceQuery()
            .setAccountId(operatorId)
            .setQueryPayment(new U2U(0))
            .execute(env.client);
    });

    it("should be executable when paid queries have set large cost", async function () {
        this.timeout(120000);

        const operatorId = env.operatorId;

        await new AccountInfoQuery()
            .setAccountId(operatorId)
            .setQueryPayment(new U2U(10))
            .execute(env.client);

        await new AccountBalanceQuery()
            .setAccountId(operatorId)
            .setQueryPayment(new U2U(0))
            .execute(env.client);
    });

    it("should error when paid query are set to zero", async function () {
        this.timeout(120000);

        const operatorId = env.operatorId;

        let err = false;
        try {
            await new AccountInfoQuery()
                .setAccountId(operatorId)
                .setQueryPayment(new U2U(0))
                .execute(env.client);
        } catch (error) {
            err = error.toString().includes(Status.InsufficientTxFee);
        }

        if (!err) {
            throw new Error("GetCost did not error");
        }
    });

    after(async function () {
        await env.close();
    });
});
