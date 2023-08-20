class Orcamento {
    /**
     * @constructor
     * @param {string} id 
     * @param {string} cliente 
     * @param {number} altura 
     * @param {number} largura 
     * @param {string} cor
     * @param {bool} alcapao
     * @param {string} pagamento
     * @param {number} taxa
     * @param {number} margem
     */
    constructor(id, cliente, altura, largura, cor, alcapao, pagamento, taxa, margem) {
        /** @type {string} */
        this.id = id;
        /** @type {string} */
        this.cliente = cliente;
        /** @type {number} */
        this.altura = altura;
        /** @type {number} */
        this.largura = largura;
        /** @type {string} */
        this.cor = cor;
        /** @type {string} */
        this.alcapao = alcapao;
        /** @type {string} */
        this.pagamento = pagamento;
        /** @type {number} */
        this.taxa = taxa;
        /** @type {number} */
        this.margem = margem;

        /** @type {OrcamentoItem[]} */
        this.itens = [];
        /** @type {number} */
        this.totalValor = 0;
        /** @type {number} */
        this.totalValorPix = 0;
        /** @type {number} */
        this.totalValorCartao = 0;
    }

    /**
     * @returns {string[]}
     */
    validate() {
        let errMsg = [];

        // if (!this.id) errMsg.push("[id] é obrigatório");
        if (!this.cliente) errMsg.push("[cliente] é obrigatório");
        if (typeof (this.altura) != "number") errMsg.push("[altura] é obrigatório e deve ser number");
        if (typeof (this.largura) != "number") errMsg.push("[largura] é obrigatório e deve ser number");
        if (!this.cor) errMsg.push("[cor] é obrigatório");
        if (!this.pagamento) errMsg.push("[pagamento] é obrigatório");
        if (typeof (this.taxa) != "number") errMsg.push("[taxa] é obrigatório e deve ser number");
        if (typeof (this.margem) != "number") errMsg.push("[largura] é obrigatório e deve ser number");

        return errMsg;
    }

    update(orcamento) {
        for (let col in this) {
            this[col] = orcamento[col];
        }
    }

    clear() {
        for (let col in this) {
            if (Array.isArray(this[col])) this[col] = [];
            else this[col] = undefined;
        }
    }

    getAltura() {
        return this.altura + 0.6;
    }

    getLargura() {
        return this.largura + 0.08;
    }

    getArea() {
        return this.getAltura() * this.getLargura();
    }

    /**
     * @param {number} n número para arredondar
     * @param {number} totalDigits total de dígitos
     * @returns {number}
     */
    round(n, totalDigits) {
        return parseFloat(n.toFixed(totalDigits));
    }

    calculaOrcamento() {
        let orcamento = this;
        orcamento.totalValor = 0;

        for (let orcamentoItem of orcamento.itens) {
            let item = orcamentoItem.produto;

            let qtd = 0;
            let valor = 0;
            if (item.formulaQtd && item.formulaValor) {
                qtd = eval(item.formulaQtd);
                valor = eval(item.formulaValor);
            }
            else {
                qtd = 1;
                valor = item.precoUnitario;
            }
            if (orcamentoItem.valorMO) {
                valor += orcamentoItem.valorMO;
            }
            orcamentoItem.qtd = this.round(qtd, 2);
            orcamentoItem.valor = this.round(valor, 2);

            orcamento.totalValor += orcamentoItem.valor;
        }
        orcamento.totalValor = this.round(orcamento.totalValor, 2);
        orcamento.totalValorPix = this.round(orcamento.totalValor * (1 + (orcamento.margem / 100)), 2);
        orcamento.totalValorCartao = this.round(orcamento.totalValorPix * (1 + (orcamento.taxa / 100)), 2);
    }
}

class OrcamentoItem {
    constructor(produto, valorMO) {
        /** @type {Produto} */
        this.produto = produto;
        /** @type {number|undefined} */
        this.valorMO = valorMO

        /** @type {number} */
        this.qtd = 0;
        /** @type {number} */
        this.valor = 0;
    }

    update(orcamento) {
        for (let col in this) {
            this[col] = orcamento[col];
        }
    }
}