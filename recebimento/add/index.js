import { alert } from "../../lib/utils/utils.js";

import { Recebimento, Lancamento } from "../../models/recebimento.js";

import * as authRepository from "../../repositories/authRepository.js";
import * as recebimentoRepository from "../../repositories/recebimentoRepository.js";

/** @type {HTMLInputElement} */
const _btnLogout = document.getElementById('btnLogout');

const _formRecebimento = new Recebimento();

/** @type {HTMLFormElement} */
const _form = document.getElementById('recebimento-form');

function init() {
    resetForm();
}

function resetForm() {
    _formRecebimento.clear();

    updateForm();
}

function updateForm() {
    for (let col in _formRecebimento) {
        /** @type {HTMLInputElement|HTMLSelectElement} */
        let field = document.getElementById(col);

        if (!field) continue;

        let val = _formRecebimento[col];
        if (field instanceof HTMLSelectElement) field.value = val ?? field.options.item(0)?.value;
        else field.value = val ?? null;
    }
}

function updateRecebimento() {
    for (let col in _formRecebimento) {
        /** @type {HTMLInputElement|HTMLSelectElement} */
        let field = document.getElementById(col);

        if (!field) continue;

        if (field instanceof HTMLInputElement && field.type == "number")
            _formRecebimento[col] = Number.isNaN(field.valueAsNumber) ? null : field.valueAsNumber;
        else if (field instanceof HTMLInputElement && field.type == "date")
        {
            let date = field.valueAsDate;
            if (date) {
                date.setHours(date.getHours() + 3);
            }
            _formRecebimento[col] = date;
        }
        else
            _formRecebimento[col] = field.value;
    }

    let validation = _formRecebimento.validate();
    if (validation.length > 0) {
        console.error(validation);
        alert('<ul class="m-0">' + validation.map(s => '<li>' + s + '</li>').join("") + '</ul>', 'danger');
        return;
    }

    _formRecebimento.calculaSaldo();
    
    recebimentoRepository
        .addRecebimento(_formRecebimento)
        .then(recebimentoId => {
            location.href = "../open?id=" + recebimentoId;
        });
}

document.body.onload = function (e) {
    init();
};

_btnLogout.addEventListener('click', function (e) {
    authRepository.logout();
});

_form.addEventListener('submit', function (e) {
    e.preventDefault();

    updateRecebimento();
});
_form.addEventListener('reset', function (e) {
    e.preventDefault();

    resetForm();
});