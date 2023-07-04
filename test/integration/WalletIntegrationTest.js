import {
    AccountCreateTransaction,
    U2U,
    PrivateKey,
    TransferTransaction,
} from "../../src/exports.js";
import { Wallet, LocalProvider } from "../../src/index.js";
import IntegrationTestEnv from "./client/NodeIntegrationTestEnv.js";

describe("WalletIntegration", function () {
    it("issue-1530", async function () {
        this.timeout(30000);
        const env = await IntegrationTestEnv.new();

        // Generate a key for the signer
        const signerKey = PrivateKey.generateED25519();

        // Create account id for the signer
        let createTransaction = await new AccountCreateTransaction()
            .setKey(signerKey)
            .setInitialBalance(new U2U(5))
            .signWithOperator(env.client);

        const response = await createTransaction.execute(env.client);
        const record = await response.getRecord(env.client);
        const signerId = record.receipt.accountId;

        const wallet = new Wallet(signerId, signerKey, new LocalProvider());

        // The operator and the signer are different
        expect(env.operatorId).not.to.eql(signerId);

        let transferTx = new TransferTransaction()
            .addU2UTransfer(signerId, new U2U(-1))
            .addU2UTransfer(env.operatorId, new U2U(1));

        wallet.populateTransaction(transferTx);

        const tx = await wallet.call(transferTx);
        const transferRecord = await tx.getRecord(env.client);
        expect(transferRecord.transactionId.accountId).to.eql(signerId);

        await env.close();
    });
});
