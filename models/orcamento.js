import { Produto } from "./produto.js";

export class Orcamento {
    /**
     * @constructor
     * @param {string} id 
     * @param {string} cliente 
     * @param {number} altura 
     * @param {number} largura 
     * @param {string} cor
     * @param {string} alcapao
     * @param {number} taxa
     * @param {number} margem
     * @param {string} realizado
     */
    constructor(id, cliente, altura, largura, cor, alcapao, taxa, margem, realizado) {
        /** @type {string} */
        this.id = id ?? "";
        /** @type {string} */
        this.cliente = cliente ?? "";
        /** @type {number} */
        this.altura = altura ?? 0;
        /** @type {number} */
        this.largura = largura ?? 0;
        /** @type {string} */
        this.cor = cor ?? "";
        /** @type {string} */
        this.alcapao = alcapao ?? "N";
        /** @type {number} */
        this.taxa = taxa ?? 0;
        /** @type {number} */
        this.margem = margem ?? 0;
        /** @type {string} */
        this.realizado = realizado ?? "N";

        /** @type {OrcamentoItem[]} */
        this.itens = [];
        /** @type {number} */
        this.totalValor = 0;
        /** @type {number} */
        this.totalValorPix = 0;;
        /** @type {number} */
        this.totalValorCartao = 0;

        /** @type {string} */
        this.data = (new Date()).toLocaleDateString();
    }

    /**
     * @returns {string[]}
     */
    validate() {
        let errMsg = [];

        if (!this.cliente) errMsg.push("[cliente] é obrigatório");
        if (typeof (this.altura) != "number") errMsg.push("[altura] é obrigatório e deve ser number");
        else if (this.altura <= 0) errMsg.push("[altura] deve ser maior que zero");
        if (typeof (this.largura) != "number") errMsg.push("[largura] é obrigatório e deve ser number");
        else if (this.largura <= 0) errMsg.push("[largura] deve ser maior que zero");
        if (!this.cor) errMsg.push("[cor] é obrigatório");
        if (typeof (this.taxa) != "number") errMsg.push("[taxa] é obrigatório e deve ser number");
        if (typeof (this.margem) != "number") errMsg.push("[margem] é obrigatório e deve ser number");

        return errMsg;
    }

    update(orcamento) {
        this.id = orcamento.id ?? "";
        this.cliente = orcamento.cliente ?? "";
        this.altura = orcamento.altura ?? 0;
        this.largura = orcamento.largura ?? 0;
        this.cor = orcamento.cor ?? "";
        this.alcapao = orcamento.alcapao ?? "N";
        this.taxa = orcamento.taxa ?? 0;
        this.margem = orcamento.margem ?? 0;
        this.realizado = orcamento.realizado ?? "N";

        this.itens = orcamento.itens?.map(item => {
            let orcamentoItem = new OrcamentoItem();
            orcamentoItem.update(item);
            return orcamentoItem;
        }) ?? [];
        this.totalValor = orcamento.totalValor ?? 0;
        this.totalValorPix = orcamento.totalValorPix ?? 0;
        this.totalValorCartao = orcamento.totalValorCartao ?? 0;

        this.data = orcamento.data ?? (new Date()).toLocaleDateString();
    }

    clear() {
        this.id = "";
        this.cliente = "";
        this.altura = 0;
        this.largura = 0;
        this.cor = "";
        this.alcapao = "N";
        this.taxa = 0;
        this.margem = 0;

        this.itens = [];
        this.totalValor = 0;
        this.totalValorPix = 0;
        this.totalValorCartao = 0;

        this.data = (new Date()).toLocaleDateString();
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

export class OrcamentoItem {
    constructor(produto, valorMO) {
        /** @type {Produto} */
        this.produto = produto ?? new Produto();
        /** @type {number} */
        this.valorMO = valorMO ?? 0;

        /** @type {number} */
        this.qtd = 0;
        /** @type {number} */
        this.valor = 0;
    }

    update(item) {
        this.produto = new Produto();
        this.produto.update(item.produto);
        this.valorMO = item.valorMO ?? 0;

        this.qtd = item.qtd ?? 0;
        this.valor = item.valor ?? 0;
    }
}