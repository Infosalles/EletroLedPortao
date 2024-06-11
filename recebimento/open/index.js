import { alert } from "../../lib/utils/utils.js";

import { Recebimento, Lancamento } from "../../models/recebimento.js";

import * as authRepository from "../../repositories/authRepository.js";
import * as recebimentoRepository from "../../repositories/recebimentoRepository.js";

const _recebimento = new Recebimento();

/** @type {HTMLInputElement} */
const _quitado = document.getElementById('quitado');

/** @type {HTMLButtonElement} */
const _btnLogout = document.getElementById('btnLogout');

/** @type {HTMLTableElement} */
const _table = document.getElementById("itens-table");

/** @type {HTMLButtonElement} */
const _btnAdd = document.getElementById('btnAdd');

function init() {
    let params = new URLSearchParams(location.search);
    let id = params.get("id");
    recebimentoRepository.getRecebimento(id, updateTable);
}

/**
 * @param {Recebimento} recebimento 
 */
function updateTable(recebimento) {
    _recebimento.update(recebimento);
    
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

    let columns = [];
    document
        .querySelectorAll(`#${_table.id} thead [data-col]`)
        .forEach(el => {
            /** @type {HTMLTableCellElement} */
            let td = el;
            columns.push(td.dataset.col);
        });

    // Adiciona as linhas da tabela
    recebimento.lancamentos.forEach((item, index) => {
        const row = document.createElement('tr');

        /** @type {HTMLTableCellElement} */
        let td;

        const fnDeletar = (e) => {
            const msg = ["Você quer mesmo apagar o lançamento?"];
            columns.forEach(col => {
                let val = item[col];
    
                if (val && typeof (val) == "number") {
                    msg.push(`${col}: ${formatFloat(val, 2)}`);
                }
                else if (val && val instanceof Date) {
                    msg.push(`${col}: ${val.toLocaleDateString()}`);
                }
                else msg.push(`${col}: ${val}`);
            });

            if (confirm(msg.join('\n')))
            {
                recebimento.removeLancamento(index);
                updateRecebimento(recebimento);
            }
        };

        columns.forEach(col => {
            let val = item[col];

            td = document.createElement('td');
            td.dataset.col = col;
            if (val && typeof (val) == "number") {
                td.textContent = col == "seq" ? formatInt(val) : formatFloat(val, 2);
                td.classList.add("text-end");
            }
            else if (val && val instanceof Date) {
                td.textContent = val.toLocaleDateString();
                td.classList.add("text-center");
            }
            else td.textContent = val;
            row.appendChild(td);
        });
        
        /* botão deletar recebimento */
        td = document.createElement('td');
        let btn_del_sm = document.createElement('button');
        btn_del_sm.classList.add("btn", "btn-sm", "btn-danger", "d-none", "d-md-block");
        btn_del_sm.innerHTML = "<i class='bi bi-trash'></i>";
        btn_del_sm.addEventListener('click', fnDeletar);
        td.appendChild(btn_del_sm);
        let btn_del = document.createElement('button');
        btn_del.classList.add("btn", "btn-danger", "d-md-none");
        btn_del.innerHTML = "<i class='bi bi-trash'></i>";
        btn_del.addEventListener('click', fnDeletar);
        td.appendChild(btn_del);
        row.appendChild(td);

        tbody.appendChild(row);
    });

    updateForm(recebimento);
}

/**
 * @param {Recebimento} recebimento 
 */
function updateForm(recebimento) {
    for (let col in recebimento) {
        /** @type {HTMLInputElement|HTMLSelectElement} */
        let field = document.getElementById(col);

        if (!field) continue;

        let val = recebimento[col];
        if (val && field instanceof HTMLInputElement && field.type == "checkbox") field.checked = val == "S" || val == true;
        else if (val && typeof (val) == "number") field.valueAsNumber = val;
        else if (val && val instanceof Date) field.valueAsDate = val;
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

/** @type {Recebimento} */
function updateRecebimento(recebimento) {
    recebimentoRepository.updateRecebimento(recebimento);
    init();
}

document.body.onload = function (e) {
    init();
};

_quitado.addEventListener('change', function (e) {
    _recebimento.quitado = _quitado.checked;
    updateRecebimento(_recebimento);
});

_btnLogout.addEventListener('click', function (e) {
    authRepository.logout();
});

_btnAdd.addEventListener('click', function (e) {
    /** @type {HTMLInputElement} */
    const _descricao = document.getElementById('descricao');
    /** @type {HTMLInputElement} */
    const _valor_recebido = document.getElementById('valor_recebido');
    /** @type {HTMLInputElement} */
    const _data_lancamento = document.getElementById('data_lancamento');

    let descricao = _descricao.value;
    let valor_recebido = _valor_recebido.valueAsNumber;
    let data_lancamento = _data_lancamento.valueAsDate;
    if (data_lancamento) {
        data_lancamento.setHours(data_lancamento.getHours() + 3);
    }
    
    let newLancamento = new Lancamento();
    newLancamento.descricao = descricao;
    newLancamento.valor_recebido = valor_recebido;
    newLancamento.data_lancamento = data_lancamento;

    let validation = newLancamento.validate();
    if (validation.length > 0) {
        console.error(validation);
        alert('<ul class="m-0">' + validation.map(s => '<li>' + s + '</li>').join("") + '</ul>', 'danger');
        return;
    }

    _recebimento.addLancamento(newLancamento);
    updateRecebimento(_recebimento);
});