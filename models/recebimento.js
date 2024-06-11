export class Recebimento {
    /**
     * @constructor
     * @param {string} id 
     * @param {string} cliente 
     * @param {Date} data_recebimento 
     * @param {number} valor 
     * @param {number} juros 
     * @param {boolean} quitado 
     */
    
    constructor(id, cliente, data_recebimento, valor, juros, quitado) {
        /** @type {string} */
        this.id = id ?? "";
        /** @type {string} */
        this.cliente = cliente ?? "";
        /** @type {Date} */
        this.data_recebimento = data_recebimento ?? today();
        /** @type {number} */
        this.valor = valor ?? 0;
        /** @type {number} */
        this.juros = juros ?? 0;
        /** @type {boolean} */
        this.quitado = quitado ?? false;

        /** @type {Lancamento[]} */
        this.lancamentos = [];
        /** @type {number} */
        this.saldo = 0;
        /** @type {number} */
        this.saldo_com_juros = 0;
    }

    /** @returns {string[]} */
    validate() {
        let errMsg = [];

        if (!this.cliente) errMsg.push("[cliente] é obrigatório");
        if (!this.data_recebimento) errMsg.push("[data] é obrigatória");
        if (typeof (this.valor) != "number") errMsg.push("[valor] é obrigatório e deve ser number");
        else if (this.valor <= 0) errMsg.push("[valor] deve ser maior que zero");
        if (typeof(this.juros) != "number") errMsg.push("[juros] é obrigatório e deve ser number");
        else if (this.juros < 0) errMsg.push("[juros] deve ser maior/igual que zero");

        return errMsg;
    }

    update(recebimento) {
        this.id = recebimento.id ?? "";
        this.cliente = recebimento.cliente ?? "";
        this.data_recebimento = today();
        if (recebimento.data_recebimento) this.data_recebimento = new Date(Date.parse(recebimento.data_recebimento));
        this.valor = recebimento.valor ?? 0;
        this.juros = recebimento.juros ?? 0;
        this.quitado = recebimento.quitado ?? false;
        this.lancamentos = recebimento.lancamentos?.map(item => {
            let lancamento = new Lancamento();
            lancamento.update(item);
            return lancamento;
        }) ?? [];
        this.saldo = recebimento.saldo ?? 0;
        this.saldo_com_juros = recebimento.saldo_com_juros ?? 0;
    }

    clear() {
        this.id = "";
        this.cliente = "";
        this.data_recebimento = today();
        this.valor = 0;
        this.juros = 0;
        this.quitado = false;
        this.lancamentos = [];
        this.saldo = 0;
        this.saldo_com_juros = 0;
    }

    jurosDiario() {
        return (this.juros / 30) / 100;
    }

    calculaSaldo() {
        //saldo puro
        let total_principal = this.lancamentos.length == 0 ? 0 : this.lancamentos.map(l => l.valor_principal).reduce((a, b) => a + b);
        this.saldo = this.valor - total_principal;

        //saldo com juros
        let hoje = today();
        let dataUltimoLancamento = this.lancamentos.length == 0 ? this.data_recebimento :  maxDate(this.lancamentos.map(l => l.data_lancamento));
        let dias = diasDiff(hoje, dataUltimoLancamento);
        let juros = this.jurosDiario() * dias;
        this.saldo_com_juros = this.saldo * (1 + juros);
    }

    fixSequencia() {
        this.lancamentos?.forEach((lancamento, index) => {
            lancamento.seq = index + 1;
        });
    }

    /** @param {Lancamento} lancamento */
    addLancamento(lancamento) {
        lancamento.calculaValores(this);
        this.lancamentos.push(lancamento);
        this.fixSequencia();
        this.calculaSaldo();
    }

    /** @param {number} index */
    removeLancamento(index) {
        this.lancamentos.splice(index, 1);
        this.fixSequencia();
        this.calculaSaldo();
    }
}

export class Lancamento {
    /**
     * @constructor
     * @param {number} seq 
     * @param {string} descricao 
     * @param {Date} data_lancamento 
     * @param {number} valor 
     */
    constructor(seq, descricao, data_lancamento, valor) {
        /** @type {number} */
        this.seq = seq ?? 0;
        /** @type {string} */
        this.descricao = descricao ?? "";
        /** @type {Date} */
        this.data_lancamento = data_lancamento ?? today();
        /** @type {number} */
        this.valor_recebido = valor ?? 0;

        /** @type {number} */
        this.valor_principal = 0;
        /** @type {number} */
        this.valor_juros = 0;
    }

    /** @returns {string[]} */
    validate() {
        let errMsg = [];

        if (!this.descricao) errMsg.push("[descricao] é obrigatório");
        if (!this.data_lancamento) errMsg.push("[data] é obrigatória");
        if (typeof (this.valor_recebido) != "number") errMsg.push("[valor] é obrigatório e deve ser number");
        else if (this.valor_recebido <= 0) errMsg.push("[valor] deve ser maior que zero");

        return errMsg;
    }

    update(lancamento) {
        this.seq = lancamento.seq ?? 0;
        this.descricao = lancamento.descricao ?? "";
        this.data_lancamento = today();
        if (lancamento.data_lancamento) this.data_lancamento = new Date(Date.parse(lancamento.data_lancamento));
        this.valor_recebido = lancamento.valor_recebido ?? 0;
        this.valor_principal = lancamento.valor_principal ?? 0;
        this.valor_juros = lancamento.valor_juros ?? 0;
    }

    clear() {
        this.seq = 0;
        this.descricao = "";
        this.data_lancamento = today();
        this.valor_recebido = 0;
        this.valor_principal = 0;
        this.valor_juros = 0;
    }

    /** @param {Recebimento} recebimento  */
    calculaValores(recebimento) {
        if (this.valor_recebido <= 0) {
            this.valor_principal = 0;
            this.valor_juros = 0;
            return;
        }

        let dataUltimoLancamento = recebimento.lancamentos.length == 0 ? recebimento.data_recebimento : maxDate(recebimento.lancamentos.map(l => l.data_lancamento));
        let dias = diasDiff(this.data_lancamento, dataUltimoLancamento);
        
        let pct_juros = dias * recebimento.jurosDiario();

        this.valor_juros = recebimento.saldo * pct_juros;
        this.valor_principal = this.valor_recebido - this.valor_juros;
    }
}

/**
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns @type {number}
 */
function diasDiff(date1, date2) {
    return Math.abs(Math.floor((date1 - date2) / (1000 * 60 * 60 * 24)));
}

/**
 * @param {Date[]} dates 
 * @returns  @type {Date}
 */
function maxDate(dates) {
    return new Date(Math.max.apply(null, dates));
}

/**
 * @returns  @type {Date}
 */
function today() {
    let now = new Date();
    return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}