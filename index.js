import { alert } from './lib/utils/utils.js';

import { Auth } from "./models/auth.js";
import * as authRepository from "./repositories/authRepository.js";

const _formAuth = new Auth();

/** @type {HTMLFormElement} */
const _form = document.getElementById('login-form');

function init() {
    resetForm();
}

function resetForm() {
    _formAuth.clear();

    updateForm();
}

function updateForm() {
    for (let col in _formAuth) {
        /** @type {HTMLInputElement} */
        let field = document.getElementById(col);

        if (!field) continue;

        let val = _formAuth[col];
        field.value = val ?? null;
    }
}

function updateAuth() {
    for (let col in _formAuth) {
        /** @type {HTMLInputElement} */
        let field = document.getElementById(col);

        if (!field) continue;

        _formAuth[col] = field.value;
    }

    let validation = _formAuth.validate();
    if (validation.length > 0) {
        console.error(validation);
        alert('<ul class="m-0">' + validation.map(s => '<li>' + s + '</li>').join("") + '</ul>', 'danger');
        return;
    }

    authRepository.login(_formAuth.email, _formAuth.password);
    resetForm();
}

document.body.onload = function (e) {
    init(); 
};

_form.addEventListener('submit', function (e) {
    e.preventDefault();

    updateAuth();
});
_form.addEventListener('reset', function (e) {
    e.preventDefault();

    resetForm();
});