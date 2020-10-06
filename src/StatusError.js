/**
 * @typedef {import("./Status").default} Status
 * @typedef {import("./transaction/TransactionId").default} TransactionId
 */

export default class StatusError extends Error {
    /**
     * @param {object} props
     * @param {Status} props.status
     * @param {TransactionId} props.transactionId
     * @param {string} message
     */
    constructor(props, message) {
        super(message);

        this.name = "StatusError";

        if (typeof Error.captureStackTrace !== "undefined") {
            Error.captureStackTrace(this, StatusError);
        }
    }
}
