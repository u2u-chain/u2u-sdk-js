import Transaction, { TRANSACTION_REGISTRY } from "../transaction/Transaction.js";
import { keyFromProtobuf, keyToProtobuf } from "../cryptography/protobuf.js";
import Timestamp from "../Timestamp.js";
import * as utf8 from "../encoding/utf8.js";

/**
 * @namespace proto
 * @typedef {import("@hashgraph/proto").ITransaction} proto.ITransaction
 * @typedef {import("@hashgraph/proto").TransactionBody} proto.TransactionBody
 * @typedef {import("@hashgraph/proto").ITransactionBody} proto.ITransactionBody
 * @typedef {import("@hashgraph/proto").ITransactionResponse} proto.ITransactionResponse
 * @typedef {import("@hashgraph/proto").IFileCreateTransactionBody} proto.IFileCreateTransactionBody
 */

/**
 * @typedef {import("@hashgraph/cryptography").Key} Key
 * @typedef {import("../channel/Channel.js").default} Channel
 */

/**
 * Create a new Hedera™ crypto-currency file.
 */
export default class FileCreateTransaction extends Transaction {
    /**
     * @param {object} [props]
     * @param {Key[]} [props.keys]
     * @param {Timestamp} [props.expirationTime]
     * @param {Uint8Array | string} [props.contents]
     */
    constructor(props = {}) {
        super();

        /**
         * @private
         * @type {?Key[]}
         */
        this._keys = null;

        /**
         * @private
         * @type {Timestamp}
         */
        this._expirationTime = new Timestamp(
            Math.floor(Date.now() / 1000) + 7890000,
            0
        );

        /**
         * @private
         * @type {?Uint8Array}
         */
        this._contents = null;

        if (props.keys != null) {
            this.setKeys(props.keys);
        }

        if (props.expirationTime != null) {
            this.setExpirationTime(props.expirationTime);
        }

        if (props.contents != null) {
            this.setContents(props.contents);
        }
    }

    /**
     * @internal
     * @param {proto.TransactionBody} body
     * @returns {FileCreateTransaction}
     */
    static _fromProtobuf(body) {
        const create = /** @type {proto.IFileCreateTransactionBody} */ (body.fileCreate);

        return new FileCreateTransaction({
            keys:
                create.keys != null
                    ? create.keys.keys != null
                        ? create.keys.keys.map((key) => keyFromProtobuf(key))
                        : undefined
                    : undefined,
            expirationTime:
                create.expirationTime != null
                    ? Timestamp._fromProtobuf(create.expirationTime)
                    : undefined,
            contents: create.contents != null ? create.contents : undefined,
        });
    }

    /**
     * @returns {?Key[]}
     */
    get keys() {
        return this._keys;
    }

    /**
     * Set the keys which must sign any transactions modifying this file. Required.
     *
     * All keys must sign to modify the file's contents or keys. No key is required
     * to sign for extending the expiration time (except the one for the operator account
     * paying for the transaction). Only one key must sign to delete the file, however.
     *
     * To require more than one key to sign to delete a file, add them to a
     * KeyList and pass that here.
     *
     * The network currently requires a file to have at least one key (or key list or threshold key)
     * but this requirement may be lifted in the future.
     *
     * @param {Key[]} keys
     * @returns {this}
     */
    setKeys(...keys) {
        this._requireNotFrozen();
        this._keys = keys;

        return this;
    }

    /**
     * @returns {Timestamp}
     */
    get expirationTime() {
        return this._expirationTime;
    }

    /**
     * Set the instant at which this file will expire, after which its contents will no longer be
     * available.
     *
     * Defaults to 1/4 of a Julian year from the instant FileCreateTransaction
     * was invoked.
     *
     * May be extended using FileUpdateTransaction#setExpirationTime(Timestamp).
     *
     * @param {Timestamp} expirationTime
     * @returns {this}
     */
    setExpirationTime(expirationTime) {
        this._requireNotFrozen();
        this._expirationTime = expirationTime;

        return this;
    }

    /**
     * @returns {?Uint8Array}
     */
    get contents() {
        return this._contents;
    }

    /**
     * Set the given byte array as the file's contents.
     *
     * This may be omitted to create an empty file.
     *
     * Note that total size for a given transaction is limited to 6KiB (as of March 2020) by the
     * network; if you exceed this you may receive a HederaPreCheckStatusException
     * with Status#TransactionOversize.
     *
     * In this case, you will need to break the data into chunks of less than ~6KiB and execute this
     * transaction with the first chunk and then use FileAppendTransaction with
     * FileAppendTransaction#setContents(Uint8Array) for the remaining chunks.
     *
     * @param {Uint8Array | string} contents
     * @returns {this}
     */
    setContents(contents) {
        this._requireNotFrozen();
        this._contents =
            contents instanceof Uint8Array ? contents : utf8.encode(contents);

        return this;
    }

    /**
     * @override
     * @internal
     * @param {Channel} channel
     * @param {proto.ITransaction} request
     * @returns {Promise<proto.ITransactionResponse>}
     */
    _execute(channel, request) {
        return channel.file.createFile(request);
    }

    /**
     * @override
     * @protected
     * @returns {NonNullable<proto.TransactionBody["data"]>}
     */
    _getTransactionDataCase() {
        return "fileCreate";
    }

    /**
     * @override
     * @protected
     * @returns {proto.IFileCreateTransactionBody}
     */
    _makeTransactionData() {
        return {
            keys:
                this._keys != null
                    ? {
                          keys: this._keys.map((key) => keyToProtobuf(key)),
                      }
                    : null,
            expirationTime: this._expirationTime._toProtobuf(),
            contents: this._contents,
        };
    }
}

// eslint-disable-next-line @typescript-eslint/unbound-method
TRANSACTION_REGISTRY.set("fileCreate", FileCreateTransaction._fromProtobuf);
