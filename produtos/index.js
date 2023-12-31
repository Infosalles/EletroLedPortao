import { alert } from "../lib/utils/utils.js";

import { Produto } from "../models/produto.js";

import * as authRepository from "../repositories/authRepository.js";
import * as produtoRepository from "../repositories/produtoRepository.js";

/** @type {HTMLInputElement} */
const _btnLogout = document.getElementById('btnLogout');

const _formProduto = new Produto();

/** @type {HTMLFormElement} */
const _form = document.getElementById('produto-form');
/** @type {HTMLInputElement} */
const _btnSubmit = document.getElementById('btnSubmit');
/** @type {HTMLInputElement} */
const _btnDelete = document.getElementById('btnDelete');

/** @type {HTMLTableElement} */
const _table = document.getElementById("produto-table");

function init() {
    resetForm();
    produtoRepository.getProdutos(updateTable);
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

    // Adiciona as linhas da tabela
    produtoRepository.produtos.forEach(produto => {
        const row = document.createElement('tr');
        for (let col in _formProduto) {
            let cellData = produto[col];
            const td = document.createElement('td');
            td.dataset.col = col;
            td.textContent = cellData;
            row.appendChild(td);
        }
        row.addEventListener("click", function (e) {
            updateForm(produto, false);
        });
        tbody.appendChild(row);
    });
}

function resetForm() {
    _formProduto.clear();

    updateForm(_formProduto, true);
}

function updateForm(produto, iesInsert) {
    if (!iesInsert) _formProduto.update(produto);

    for (let col in _formProduto) {
        /** @type {HTMLInputElement} */
        let field = document.getElementById(col);

        if (!field) continue;

        field.value = _formProduto[col] ?? null;
    }

    _btnDelete.classList[iesInsert ? 'add' : 'remove']('d-none');
    _btnSubmit.value = (iesInsert ? "Adicionar" : "Atualizar") + " produto";

    if (iesInsert) {
        _btnDelete.classList.add('d-none');
    }
}

function updateProduto() {
    for (let col in _formProduto) {
        /** @type {HTMLInputElement} */
        let field = document.getElementById(col);

        if (!field) continue;

        if (field.type == "number")
            _formProduto[col] = Number.isNaN(field.valueAsNumber) ? null : field.valueAsNumber;
        else
            _formProduto[col] = field.value;
    }

    let validation = _formProduto.validate();
    if (validation.length > 0) {
        console.error(validation);
        alert('<ul class="m-0">' + validation.map(s => '<li>' + s + '</li>').join() + '</ul>', 'danger');
        return;
    }

    produtoRepository.addProduto(_formProduto);
    resetForm();
}

document.body.onload = function (e) {
    init();
};

_btnLogout.addEventListener('click', function (e) {
    authRepository.logout();
});

_form.addEventListener('submit', function (e) {
    e.preventDefault();

    updateProduto();
});
_form.addEventListener('reset', function (e) {
    e.preventDefault();

    resetForm();
});
_btnDelete.addEventListener('click', function (e) {
    produtoRepository.removeProduto(_formProduto.id);

    resetForm();
});