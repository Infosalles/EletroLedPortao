import * as authRepository from "../repositories/authRepository.js";
import * as recebimentoRepository from "../repositories/recebimentoRepository.js";

/** @type {HTMLInputElement} */
const _btnLogout = document.getElementById('btnLogout');

/** @type {HTMLTableElement} */
const _table = document.getElementById("recebimento-table");

function init() {
    recebimentoRepository.getRecebimentos(updateTable);
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
    recebimentoRepository.recebimentos.forEach(recebimento => {
        const row = document.createElement('tr');
        if (recebimento.quitado) row.classList.add("table-success");
        
        /** @type {HTMLTableCellElement} */
        let td;

        const fnVisualizar = (e) => {
            location.href = "./open?id=" + recebimento.id;
        };

        const fnDeletar = (e) => {
            const msg = ["Você quer mesmo apagar o recebimento?"];
            columns.forEach(col => {
                let val = recebimento[col];
    
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
                recebimentoRepository.removeRecebimento(recebimento.id);
            }
        };

        /* botão visualizar recebimento */
        td = document.createElement('td');
        let btn_sm = document.createElement('button');
        btn_sm.classList.add("btn", "btn-sm", "btn-primary", "d-none", "d-md-block");
        btn_sm.innerHTML = "<i class='bi bi-list'></i>";
        btn_sm.addEventListener('click', fnVisualizar);
        td.appendChild(btn_sm);
        let btn = document.createElement('button');
        btn.classList.add("btn", "btn-primary", "d-md-none");
        btn.innerHTML = "<i class='bi bi-list'></i>";
        btn.addEventListener('click', fnVisualizar);
        td.appendChild(btn);
        row.appendChild(td);

        columns.forEach(col => {
            let val = recebimento[col];

            td = document.createElement('td');
            td.dataset.col = col;
            if (col == "quitado") {
                td.textContent = val ? "SIM" : "NÃO";
                td.classList.add("text-center");
            }
            else if (val && typeof (val) == "number") {
                td.textContent = formatFloat(val, 2);
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

_btnLogout.addEventListener('click', function (e) {
    authRepository.logout();
});