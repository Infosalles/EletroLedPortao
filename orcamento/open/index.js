import { Orcamento } from "../../models/orcamento.js";

import * as authRepository from "../../repositories/authRepository.js";
import * as orcamentoRepository from "../../repositories/orcamentoRepository.js";

const _orcamento = new Orcamento();

/** @type {HTMLInputElement} */
const _realizado = document.getElementById('realizado');

/** @type {HTMLInputElement} */
const _btnLogout = document.getElementById('btnLogout');

/** @type {HTMLTableElement} */
const _table = document.getElementById("itens-table");

/** @type {HTMLInputElement} */
const _btnPrintCliente = document.getElementById('btnPrintCliente');
/** @type {HTMLInputElement} */
const _btnPrintFornecedor = document.getElementById('btnPrintFornecedor');

function init() {
    let params = new URLSearchParams(location.search);
    let id = params.get("id");
    orcamentoRepository.getOrcamento(id, updateTable);
}

/**
 * @param {Orcamento} orcamento 
 */
function updateTable(orcamento) {
    _orcamento.update(orcamento);
    
    /** @type {HTMLTableSectionElement} */
    let tbody;

    if (_table.tBodies.length > 0) {
        tbody = _table.tBodies.item(0);
    }
    else {
        tbody = document.createElement("tbody");
        _table.appendChild(tbody);
    }

    // Limpa o conteúdo da tabela
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Adiciona as linhas da tabela
    orcamento.itens.forEach(item => {
        const row = document.createElement('tr');

        let td;

        td = document.createElement('td');
        td.dataset.col = "qtd";
        td.textContent = item.produto.unidade == "PC" ? formatInt(item.qtd) : formatFloat(item.qtd, 2);
        td.classList.add("text-end");
        row.appendChild(td);

        td = document.createElement('td');
        td.dataset.col = "unidade";
        td.textContent = item.produto.unidade;
        row.appendChild(td);

        td = document.createElement('td');
        td.dataset.col = "descricao";
        td.textContent = item.produto.descricao;
        row.appendChild(td);

        td = document.createElement('td');
        td.dataset.col = "valor";
        td.textContent = formatFloat(item.valor, 2);
        td.classList.add("hidden-cliente", "text-end");
        row.appendChild(td);

        tbody.appendChild(row);
    });

    updateForm(orcamento);
}

/**
 * @param {Orcamento} orcamento 
 */
function updateForm(orcamento) {
    for (let col in orcamento) {
        /** @type {HTMLInputElement|HTMLSelectElement} */
        let field = document.getElementById(col);

        if (!field) continue;

        let val = orcamento[col];
        if (val && field instanceof HTMLInputElement && field.type == "checkbox") field.checked = val == "S" || val == true;
        else if (val && typeof (val) == "number") field.value = formatFloat(val, 2);
        else field.value = val ?? null;
    }
}

function formatInt(n) {
    return n.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

function formatFloat(n, totalDigits) {
    return n.toLocaleString(undefined, {
        minimumFractionDigits: totalDigits,
        maximumFractionDigits: totalDigits,
    });
}

/**
 * 
 * @param {('cliente'|'fornecedor')} tipo 
 */
function printOrcamento(tipo) {
    const body = document.body;

    body.classList.remove("print-cliente", "print-fornecedor");
    body.classList.add("print-" + tipo);

    print();
}

document.body.onload = function (e) {
    init();
};

_realizado.addEventListener('change', function (e) {
    _orcamento.realizado = _realizado.checked ? "S" : "N";
    orcamentoRepository.updateOrcamento(_orcamento);
});

_btnLogout.addEventListener('click', function (e) {
    authRepository.logout();
});

_btnPrintCliente.addEventListener('click', function (e) {
    printOrcamento('cliente');
});
_btnPrintFornecedor.addEventListener('click', function (e) {
    printOrcamento('fornecedor');
});