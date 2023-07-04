import * as HashgraphProto from "@u2u/proto";
import { Status } from "../../src/exports.js";

describe("Status", function () {
    it("has all the response codes", function () {
        for (const [s, code] of Object.entries(
            HashgraphProto.proto.ResponseCodeEnum
        )) {
            expect(Status._fromCode(code).toString()).to.be.equal(s);
        }
    });
});
