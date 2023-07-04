import { expect } from "chai";

import { U2UAllowance, AccountId, U2U } from "../../src/index.js";

describe("U2UAllowance", function () {
    it("toProtobuf()", function () {
        const ownerAccountId = new AccountId(3);
        const spenderAccountId = new AccountId(4);
        const U2UAmount = U2U.fromTinyU2U(100);

        const allowance = new U2UAllowance({
            ownerAccountId,
            spenderAccountId,
            amount: U2UAmount,
        });

        expect(allowance._toProtobuf()).to.deep.equal({
            owner: ownerAccountId._toProtobuf(),
            spender: spenderAccountId._toProtobuf(),
            amount: U2UAmount.toTinyU2U(),
        });
    });
});
