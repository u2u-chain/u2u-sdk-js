import { expect } from "chai";

import Long from "long";

import * as hex from "../../src/encoding/hex.js";
import {
    EthereumTransaction,
    AccountId,
    Timestamp,
    FileId,
    Transaction,
    TransactionId,
    U2U,
} from "../../src/index.js";

describe("EthereumTransaction", function () {
    it("toProtobuf with FileId", function () {
        const ethereumData = hex.decode("00112233445566778899");
        const callData = new FileId(1);
        const maxGasAllowance = U2U.fromTinyU2U(Long.fromNumber(10));
        const accountId1 = new AccountId(7);
        const nodeAccountId = new AccountId(10, 11, 12);
        const timestamp1 = new Timestamp(14, 15);

        let transaction = new EthereumTransaction()
            .setTransactionId(
                TransactionId.withValidStart(accountId1, timestamp1)
            )
            .setNodeAccountIds([nodeAccountId])
            .setEthereumData(ethereumData)
            .setCallDataFileId(callData)
            .setMaxGasAllowanceU2U(maxGasAllowance)
            .freeze();

        transaction = Transaction.fromBytes(transaction.toBytes());

        const data = transaction._makeTransactionData();

        expect(data).to.deep.equal({
            ethereumData,
            callData: callData._toProtobuf(),
            maxGasAllowance: maxGasAllowance.toTinyU2U(),
        });
    });

    it("toProtobuf with Uint8Array", function () {
        const ethereumData = hex.decode("00112233445566778899");
        const maxGasAllowance = U2U.fromTinyU2U(Long.fromNumber(10));
        const accountId1 = new AccountId(7);
        const nodeAccountId = new AccountId(10, 11, 12);
        const timestamp1 = new Timestamp(14, 15);

        let transaction = new EthereumTransaction()
            .setTransactionId(
                TransactionId.withValidStart(accountId1, timestamp1)
            )
            .setNodeAccountIds([nodeAccountId])
            .setEthereumData(ethereumData)
            .setMaxGasAllowanceU2U(maxGasAllowance)
            .freeze();

        transaction = Transaction.fromBytes(transaction.toBytes());

        const data = transaction._makeTransactionData();

        expect(data).to.deep.equal({
            ethereumData,
            callData: null,
            maxGasAllowance: maxGasAllowance.toTinyU2U(),
        });
    });
});
