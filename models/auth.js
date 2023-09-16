export class Auth {
    /**
     * @constructor
     * @param {string} email 
     * @param {string} password 
     */
    constructor(email, password) {
        /** @type {string} */
        this.email = email ?? "";
        /** @type {string} */
        this.password = password ?? "";
    }

    /**
     * @returns {string[]}
     */
    validate() {
        let errMsg = [];

        if (!this.email) errMsg.push("[email] é obrigatório");
        if (!this.password) errMsg.push("[password] é obrigatório");

        return errMsg;
    }

    update(auth) {
        this.email = produto.email ?? "";
        this.password = produto.password ?? "";
    }

    clear() {
        this.email = "";
        this.password = "";
    }

    /**
     * @returns {string}
     */
    toJson() {
        return JSON.stringify(this);
    }
}