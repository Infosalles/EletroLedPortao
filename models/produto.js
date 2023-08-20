class Produto {
    /**
     * @constructor
     * @param {string} id - Id do produto.
     * @param {string} unidade - Unidade do produto.
     * @param {string} tipo - Tipo do produto.
     * @param {string} descricao - Descrição do produto.
     * @param {number} precoUnitario - Preço unitário do produto.
     * @param {number|undefined} metragemMinima - Metragem mínima para produto (usar quando produto for do tipo Motor).
     * @param {number|undefined} metragemMaxima - Metragem máxima para produto (usar quando produto for do tipo Motor).
     */
    constructor(id, unidade, tipo, descricao, precoUnitario, metragemMinima, metragemMaxima) {
        this.id = id;
        this.unidade = unidade;
        this.tipo = tipo;
        this.descricao = descricao;
        this.precoUnitario = precoUnitario;
        this.metragemMinima = metragemMinima ?? 0;
        this.metragemMaxima = metragemMaxima ?? 0;
    }

    /**
     * @returns {string[]}
     */
    validate() {
        let errMsg = [];

        if (!this.id) errMsg.push("[id] é obrigatório");
        if (!this.unidade) errMsg.push("[unidade] é obrigatório");
        if (!this.tipo) errMsg.push("[tipo] é obrigatório");
        if (!this.descricao) errMsg.push("[descricao] é obrigatório");
        if (typeof (this.precoUnitario) != "number") errMsg.push("[precoUnitario] é obrigatório e deve ser number");

        return errMsg;
    }

    update(produto) {
        for (let col in this) {
            this[col] = produto[col];
        }
    }

    clear() {
        for (let col in this) {
            this[col] = undefined;
        }
    }

    /**
     * @returns {string}
     */
    toJson() {
        return JSON.stringify(this);
    }
}