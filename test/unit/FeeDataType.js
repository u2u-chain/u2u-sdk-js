import * as HashgraphProto from "@u2u/proto";
import { FeeDataType } from "../../src/exports.js";

describe("FeeDataType", function () {
    it("has all variants", function () {
        for (const [s, code] of Object.entries(HashgraphProto.proto.SubType)) {
            expect(FeeDataType._fromCode(code).toString()).to.be.equal(s);
        }
    });
});
