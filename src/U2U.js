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
import { valueToLong } from "./long.js";
import U2UUnit from "./U2UUnit.js";

import Long from "long";

/**
 * @typedef {import("./long.js").LongObject} LongObject
 */

export default class U2U {
    /**
     * @param {number | string | Long | LongObject | BigNumber} amount
     * @param {U2UUnit=} unit
     */
    constructor(amount, unit = U2UUnit.U2U) {
        if (unit === U2UUnit.TinyU2U) {
            this._valueInTinybar = valueToLong(amount);
        } else {
            /** @type {BigNumber} */
            let bigAmount;

            if (Long.isLong(amount)) {
                bigAmount = new BigNumber(amount.toString(10));
            } else if (
                BigNumber.isBigNumber(amount) ||
                typeof amount === "string" ||
                typeof amount === "number"
            ) {
                bigAmount = new BigNumber(amount);
            } else {
                bigAmount = new BigNumber(0);
            }

            /**
             * @type {BigNumber}
             */
            this._valueInTinybar = bigAmount.multipliedBy(unit._tinybar);
        }
        if (!this._valueInTinybar.isInteger()) {
            throw new Error("U2U in tinybars contains decimals");
        }
    }

    /**
     * @param {number | Long | BigNumber} amount
     * @param {U2UUnit} unit
     * @returns {U2U}
     */
    static from(amount, unit) {
        return new U2U(amount, unit);
    }

    /**
     * @param {number | Long | string | BigNumber} amount
     * @returns {U2U}
     */
    static fromTinyU2U(amount) {
        if (typeof amount === "string") {
            return this.fromString(amount, U2UUnit.TinyU2U);
        }
        return new U2U(amount, U2UUnit.TinyU2U);
    }

    /**
     * @param {string} str
     * @param {U2UUnit=} unit
     * @returns {U2U}
     */
    static fromString(str, unit = U2UUnit.U2U) {
        const pattern = /^((?:\+|-)?\d+(?:\.\d+)?)(?: (tℏ|μℏ|mℏ|ℏ|kℏ|Mℏ|Gℏ))?$/;
        if (pattern.test(str)) {
            let [amount, symbol] = str.split(" ");
            if (symbol != null) {
                unit = U2UUnit.fromString(symbol);
            }
            return new U2U(new BigNumber(amount), unit);
        } else {
            throw new Error("invalid argument provided");
        }
    }

    /**
     * @param {U2UUnit} unit
     * @returns {BigNumber}
     */
    to(unit) {
        return this._valueInTinybar.dividedBy(unit._tinybar);
    }

    /**
     * @returns {BigNumber}
     */
    toBigNumber() {
        return this.to(U2UUnit.U2U);
    }

    /**
     * @returns {Long}
     */
    toTinyU2U() {
        return Long.fromValue(this._valueInTinybar.toFixed());
    }

    /**
     * @returns {U2U}
     */
    negated() {
        return U2U.fromTinyU2U(this._valueInTinybar.negated());
    }

    /**
     * @returns {boolean}
     */
    isNegative() {
        return this._valueInTinybar.isNegative();
    }

    /**
     * @param {U2UUnit=} unit
     * @returns {string}
     */
    toString(unit) {
        if (unit != null) {
            return `${this._valueInTinybar
                .dividedBy(unit._tinybar)
                .toString()} ${unit._symbol}`;
        }

        if (
            this._valueInTinybar.isLessThan(10000) &&
            this._valueInTinybar.isGreaterThan(-10000)
        ) {
            return `${this._valueInTinybar.toFixed()} ${
                U2UUnit.TinyU2U._symbol
            }`;
        }

        return `${this.to(U2UUnit.U2U).toString()} ${U2UUnit.U2U._symbol}`;
    }
}
