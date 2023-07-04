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

import BigNumber from "bignumber.js";

export default class U2UUnit {
    /**
     * @internal
     * @param {string} name
     * @param {string} symbol
     * @param {BigNumber} tinyu2u
     */
    constructor(name, symbol, tinyu2u) {
        /**
         * @internal
         * @readonly
         */
        this._name = name;

        /**
         * @internal
         * @readonly
         */
        this._symbol = symbol;

        /**
         * @internal
         * @readonly
         */
        this._tinybar = tinyu2u;

        Object.freeze(this);
    }

    /**
     * @param {string} unit
     * @returns {U2UUnit}
     */
    static fromString(unit) {
        switch (unit) {
            case U2UUnit.U2U._symbol:
                return U2UUnit.U2U;
            case U2UUnit.TinyU2U._symbol:
                return U2UUnit.TinyU2U;
            case U2UUnit.MicroU2U._symbol:
                return U2UUnit.MicroU2U;
            case U2UUnit.MilliU2U._symbol:
                return U2UUnit.MilliU2U;
            case U2UUnit.KiloU2U._symbol:
                return U2UUnit.KiloU2U;
            case U2UUnit.MegaU2U._symbol:
                return U2UUnit.MegaU2U;
            case U2UUnit.GigaU2U._symbol:
                return U2UUnit.GigaU2U;
            default:
                throw new Error("Unknown unit.");
        }
    }
}

U2UUnit.TinyU2U = new U2UUnit("tinyu2u", "tu2u", new BigNumber(1));

U2UUnit.MicroU2U = new U2UUnit("microu2u", "μu2u", new BigNumber(100));

U2UUnit.MilliU2U = new U2UUnit("milliu2u", "mu2u", new BigNumber(100000));

U2UUnit.U2U = new U2UUnit("u2u", "u2u", new BigNumber("100000000"));

U2UUnit.KiloU2U = new U2UUnit(
    "kilou2u",
    "ku2u",
    new BigNumber(1000).multipliedBy(new BigNumber("100000000"))
);

U2UUnit.MegaU2U = new U2UUnit(
    "megau2u",
    "Mu2u",
    new BigNumber(1000000).multipliedBy(new BigNumber("100000000"))
);

U2UUnit.GigaU2U = new U2UUnit(
    "gigau2u",
    "Gu2u",
    new BigNumber("1000000000").multipliedBy(new BigNumber("100000000"))
);
