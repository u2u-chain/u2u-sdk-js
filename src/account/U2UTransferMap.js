/*-
 * ‌
 * Hedera JavaScript SDK
 * ​
 * Copyright (C) 2020 - 2022 Hedera Hashgraph, LLC
 * ​
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ‍
 */

import AccountId from "./AccountId.js";
import U2U from "../U2U.js";
import ObjectMap from "../ObjectMap.js";

/**
 * @namespace proto
 * @typedef {import("@u2u/proto").proto.ITransferList} HashgraphProto.proto.ITransferList
 * @typedef {import("@u2u/proto").proto.IAccountID} HashgraphProto.proto.IAccountID
 */

/**
 * @typedef {import("../long.js").LongObject} LongObject
 * @typedef {import("bignumber.js").default} BigNumber
 */

/**
 * @augments {ObjectMap<AccountId, U2U>}
 */
export default class U2UTransferMap extends ObjectMap {
    constructor() {
        super((s) => AccountId.fromString(s));
    }

    /**
     * @param {HashgraphProto.proto.ITransferList} transfers
     * @returns {U2UTransferMap}
     */
    static _fromProtobuf(transfers) {
        const accountTransfers = new U2UTransferMap();

        for (const transfer of transfers.accountAmounts != null
            ? transfers.accountAmounts
            : []) {
            const account = AccountId._fromProtobuf(
                /** @type {HashgraphProto.proto.IAccountID} */ (
                    transfer.accountID
                )
            );

            accountTransfers._set(
                account,
                U2U.fromTinyU2U(/** @type {Long} */ (transfer.amount))
            );
        }

        return accountTransfers;
    }
}
