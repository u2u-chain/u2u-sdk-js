import * as proto from "@hashgraph/proto";
import Channel from "../channel/Channel";
import Transaction, { TRANSACTION_REGISTRY } from "../transaction/Transaction";
import FileId from "../file/FileId";
import ContractId from "../contract/ContractId";
import Timestamp from "../Timestamp";

export default class SystemDeleteTransaction extends Transaction {
    /**
     * @param {object} props
     * @param {FileId | string} [props.fileId]
     * @param {ContractId | string} [props.contractId]
     * @param {Timestamp} [props.expirationTime]
     */
    constructor(props = {}) {
        super();

        /**
         * @private
         * @type {?FileId}
         */
        this._fileId = null;

        /**
         * @private
         * @type {?ContractId}
         */
        this._contractId = null;

        /**
         * @private
         * @type {?Timestamp}
         */
        this._expirationTime = null;

        if (props.fileId != null) {
            this.setFileId(props.fileId);
        }

        if (props.contractId != null) {
            this.setContractId(props.contractId);
        }

        if (props.expirationTime != null) {
            this.setExpirationTime(props.expirationTime);
        }
    }

    /**
     * @internal
     * @param {proto.TransactionBody} body
     * @returns {SystemDeleteTransaction}
     */
    static _fromProtobuf(body) {
        const systemDelete = /** @type {proto.ISystemDeleteTransactionBody} */ (body.systemDelete);

        return new SystemDeleteTransaction({
            fileId:
                systemDelete.fileID != null
                    ? FileId._fromProtobuf(
                          /** @type {proto.IFileID} */ (systemDelete.fileID)
                      )
                    : undefined,
            contractId:
                systemDelete.contractID != null
                    ? ContractId._fromProtobuf(
                          /** @type {proto.IContractID} */ (systemDelete.contractID)
                      )
                    : undefined,
            expirationTime:
                systemDelete.expirationTime != null
                    ? Timestamp._fromProtobuf(systemDelete.expirationTime)
                    : undefined,
        });
    }

    /**
     * @returns {?FileId}
     */
    get fileId() {
        return this._fileId;
    }

    /**
     * @param {FileId | string} fileId
     * @returns {this}
     */
    setFileId(fileId) {
        this._requireNotFrozen();
        this._fileId =
            fileId instanceof FileId ? fileId : FileId.fromString(fileId);

        return this;
    }

    /**
     * @returns {?ContractId}
     */
    get contractId() {
        return this._contractId;
    }

    /**
     * @param {ContractId | string} contractId
     * @returns {this}
     */
    setContractId(contractId) {
        this._requireNotFrozen();
        this._contractId =
            contractId instanceof ContractId
                ? contractId
                : ContractId.fromString(contractId);

        return this;
    }

    /**
     * @returns {?Timestamp}
     */
    get expirationTime() {
        return this._expirationTime;
    }

    /**
     * @param {Timestamp} expirationTime
     * @returns {SystemDeleteTransaction}
     */
    setExpirationTime(expirationTime) {
        this._requireNotFrozen();
        this._expirationTime = expirationTime;
        return this;
    }

    /**
     * @override
     * @protected
     * @param {Channel} channel
     * @returns {(transaction: proto.ITransaction) => Promise<proto.ITransactionResponse>}
     */
    _getMethod(channel) {
        if (this._fileId != null) {
            return (transaction) => channel.file.systemDelete(transaction);
        } else {
            return (transaction) =>
                channel.smartContract.systemDelete(transaction);
        }
    }

    /**
     * @override
     * @protected
     * @returns {NonNullable<proto.TransactionBody["data"]>}
     */
    _getTransactionDataCase() {
        return "systemDelete";
    }

    /**
     * @override
     * @protected
     * @returns {proto.ISystemDeleteTransactionBody}
     */
    _makeTransactionData() {
        return {
            fileID: this._fileId != null ? this._fileId._toProtobuf() : null,
            contractID:
                this._contractId != null
                    ? this._contractId._toProtobuf()
                    : null,
            expirationTime:
                this._expirationTime != null
                    ? this._expirationTime._toProtobuf()
                    : null,
        };
    }
}

// eslint-disable-next-line @typescript-eslint/unbound-method
TRANSACTION_REGISTRY.set("systemDelete", SystemDeleteTransaction._fromProtobuf);
