import Query, { QUERY_REGISTRY } from "../query/Query.js";
import ContractId from "./ContractId.js";

/**
 * @namespace proto
 * @typedef {import("@hashgraph/proto").IQuery} proto.IQuery
 * @typedef {import("@hashgraph/proto").IQueryHeader} proto.IQueryHeader
 * @typedef {import("@hashgraph/proto").IResponse} proto.IResponse
 * @typedef {import("@hashgraph/proto").IResponseHeader} proto.IResponseHeader
 * @typedef {import("@hashgraph/proto").IContractGetBytecodeQuery} proto.IContractGetBytecodeQuery
 * @typedef {import("@hashgraph/proto").IContractGetBytecodeResponse} proto.IContractGetBytecodeResponse
 */

/**
 * @typedef {import("../channel/Channel.js").default} Channel
 */

/**
 * @augments {Query<Uint8Array>}
 */
export default class ContractByteCodeQuery extends Query {
    /**
     * @param {object} properties
     * @param {ContractId | string} [properties.contractId]
     */
    constructor(properties = {}) {
        super();

        /**
         * @type {?ContractId}
         * @private
         */
        this._contractId = null;
        if (properties.contractId != null) {
            this.setContractId(properties.contractId);
        }
    }

    /**
     * @internal
     * @param {proto.IQuery} query
     * @returns {ContractByteCodeQuery}
     */
    static _fromProtobuf(query) {
        const bytecode = /** @type {proto.IContractGetBytecodeQuery} */ (query.contractGetBytecode);

        return new ContractByteCodeQuery({
            contractId:
                bytecode.contractID != null
                    ? ContractId._fromProtobuf(bytecode.contractID)
                    : undefined,
        });
    }

    /**
     * @returns {?ContractId}
     */
    get contractId() {
        return this._contractId;
    }

    /**
     * Set the contract ID for which the info is being requested.
     *
     * @param {ContractId | string} contractId
     * @returns {ContractByteCodeQuery}
     */
    setContractId(contractId) {
        this._contractId =
            contractId instanceof ContractId
                ? contractId
                : ContractId.fromString(contractId);

        return this;
    }

    /**
     * @override
     * @internal
     * @param {Channel} channel
     * @param {proto.IQuery} request
     * @returns {Promise<proto.IResponse>}
     */
    _execute(channel, request) {
        return channel.smartContract.contractGetBytecode(request);
    }

    /**
     * @override
     * @internal
     * @param {proto.IResponse} response
     * @returns {proto.IResponseHeader}
     */
    _mapResponseHeader(response) {
        const contractGetBytecodeResponse = /** @type {proto.IContractGetBytecodeResponse} */ (response.contractGetBytecodeResponse);
        return /** @type {proto.IResponseHeader} */ (contractGetBytecodeResponse.header);
    }

    /**
     * @protected
     * @override
     * @param {proto.IResponse} response
     * @returns {Promise<Uint8Array>}
     */
    _mapResponse(response) {
        const contractGetBytecodeResponse = /** @type {proto.IContractGetBytecodeResponse} */ (response.contractGetBytecodeResponse);

        return Promise.resolve(
            contractGetBytecodeResponse.bytecode != null
                ? contractGetBytecodeResponse.bytecode
                : new Uint8Array()
        );
    }

    /**
     * @override
     * @internal
     * @param {proto.IQueryHeader} header
     * @returns {proto.IQuery}
     */
    _onMakeRequest(header) {
        return {
            contractGetBytecode: {
                header,
                contractID:
                    this._contractId != null
                        ? this._contractId._toProtobuf()
                        : null,
            },
        };
    }
}

// eslint-disable-next-line @typescript-eslint/unbound-method
QUERY_REGISTRY.set("contractGetBytecode", ContractByteCodeQuery._fromProtobuf);
