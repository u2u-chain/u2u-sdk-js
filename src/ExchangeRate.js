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

import Long from "long";

export default class ExchangeRate {
    /**
     * @private
     * @param {object} props
     * @param {number} props.u2us
     * @param {number} props.cents
     * @param {Date} props.expirationTime
     */
    constructor(props) {
        /**
         * Denotes U2U equivalent to cents (USD)
         *
         * @readonly
         * @type {number}
         */
        this.u2us = props.u2us;

        /**
         * Denotes cents (USD) equivalent to U2U
         *
         * @readonly
         * @type {number}
         */
        this.cents = props.cents;

        /**
         * Expiration time of this exchange rate
         *
         * @readonly
         * @type {Date}
         */
        this.expirationTime = props.expirationTime;

        /**
         * Calculated exchange rate
         *
         * @readonly
         * @type {number}
         */
        this.exchangeRateInCents = props.cents / props.u2us;

        Object.freeze(this);
    }

    /**
     * @internal
     * @param {import("@u2u/proto").proto.IExchangeRate} rate
     * @returns {ExchangeRate}
     */
    static _fromProtobuf(rate) {
        return new ExchangeRate({
            u2us: /** @type {number} */ (rate.u2uEquiv),
            cents: /** @type {number} */ (rate.centEquiv),
            expirationTime: new Date(
                rate.expirationTime != null
                    ? rate.expirationTime.seconds != null
                        ? Long.isLong(rate.expirationTime.seconds)
                            ? rate.expirationTime.seconds.toInt() * 1000
                            : rate.expirationTime.seconds
                        : 0
                    : 0
            ),
        });
    }

    /**
     * @internal
     * @returns {import("@u2u/proto").proto.IExchangeRate}
     */
    _toProtobuf() {
        // TODO: convert hbar equiv
        return {
            u2uEquiv: this.u2us,
            centEquiv: this.cents,
            expirationTime: {
                seconds: Long.fromNumber(
                    Math.trunc(this.expirationTime.getTime() / 1000)
                ),
            },
        };
    }
}
