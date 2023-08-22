import * as orcamentoRepository from "../repositories/orcamentoRepository.js";

/** @type {HTMLTableElement} */
const _table = document.getElementById("orcamento-table");

function init() {
    orcamentoRepository.getOrcamentos(updateTable);
}

function updateTable() {
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
    orcamentoRepository.orcamentos.forEach(orcamento => {
        const row = document.createElement('tr');
        /** @type {HTMLTableCellElement} */
        let td;

        td = document.createElement('td');
        let btn_sm = document.createElement('button');
        btn_sm.classList.add("btn", "btn-sm", "btn-primary", "d-none", "d-md-block");
        btn_sm.innerHTML = "<i class='bi bi-list'></i>";
        btn_sm.addEventListener('click', (e) => {
            location.href = "./open?id=" + orcamento.id;
        });
        td.appendChild(btn_sm);
        let btn = document.createElement('button');
        btn.classList.add("btn", "btn-primary", "d-md-none");
        btn.innerHTML = "<i class='bi bi-list'></i>";
        btn.addEventListener('click', (e) => {
            location.href = "./open?id=" + orcamento.id;
        });
        td.appendChild(btn);
        row.appendChild(td);

        columns.forEach(col => {
            let val = orcamento[col];

            td = document.createElement('td');
            td.dataset.col = col;
            if (val && typeof (val) == "number") {
                td.textContent = formatFloat(val, 2);
                td.classList.add("text-end");
            }
            else td.textContent = val;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });
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

document.body.onload = function (e) {
    init();
};