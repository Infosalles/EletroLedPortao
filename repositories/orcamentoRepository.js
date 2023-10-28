import { addLoading, removeLoading, alert } from "../lib/utils/utils.js";

import { Orcamento } from "../models/orcamento.js";

import { app } from "./baseRepository.js";
import { getDatabase, ref, onValue, child, get, push, update, remove, query, orderByChild, equalTo } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js';

const database = getDatabase(app);

/** @type {Orcamento[]} */
export const orcamentos = [];

/**
 * @param {Orcamento} orcamento 
 * @returns {string}
 */
export function addOrcamento(orcamento) {
    try {
        addLoading("addOrcamento");

        let postId = push(child(ref(database), "orcamentos")).key;
        orcamento.id = postId;

        update(ref(database, "orcamentos/" + postId), orcamento);

        return orcamento.id;
    } catch (e) {
        alert("Não foi possível gravar o orçamento");
        console.error(e);
    } finally {
        removeLoading("addOrcamento");
    }
}

/**
 * Atualiza um Orçamento no firebase
 * @param {Orcamento} orcamento 
 */
export function updateOrcamento(orcamento) {
    try {
        addLoading("updateOrcamento");

        update(ref(database, "orcamentos/" + orcamento.id), orcamento);
    } catch (e) {
        alert("Não foi possível gravar o orçamento");
        console.error(e);
    } finally {
        removeLoading("updateOrcamento");
    }
}

/**
 * Se conecta com o firebase para acessar a lista de orçamentos em tempo real
 * @param {function():void|undefined} callbackFn callback para atualizar a tela com a lista de orçamentos recarregada
 */
export function getOrcamentos(callbackFn) {
    try {
        addLoading("getOrcamentos");

        onValue(ref(database, 'orcamentos'), (snapshot) => {
            orcamentos.length = 0;
            snapshot.forEach((childSnapshot) => {
                let _p = new Orcamento();
                _p.update(childSnapshot.val());
                orcamentos.push(_p);
            });
            if (callbackFn) callbackFn();
            removeLoading("getOrcamentos");
        });
    } catch (e) {
        removeLoading("getOrcamentos");
        alert("Não foi possível carregar os orçamentos");
        console.error(e);
    }
}

/**
 * @param {string} id 
 * @param {function(Orcamento):void} callbackFn 
 */
export function getOrcamento(id, callbackFn) {
    try {
        addLoading("getOrcamento");

        get(query(ref(database, `orcamentos`), ...[orderByChild("id"), equalTo(id)]))
            .then((snapshot) => {
                let orcamento = new Orcamento();
                snapshot.forEach((childSnapshot) => {
                    orcamento.update(childSnapshot.val());
                });
                if (callbackFn) callbackFn(orcamento);
                removeLoading("getOrcamento");
            });
    } catch (e) {
        removeLoading("getOrcamento");
        alert("Não foi possível carregar o orçamento");
        console.error(e);
    }
}

/**
 * Remove um orçamento no firebase
 * @param {string} id 
 */
export function removeOrcamento(id) {
    try {
        addLoading("removeOrcamento");

        remove(ref(database, "orcamentos/" + id));
        
        removeLoading("removeOrcamento");
    } catch (e) {
        removeLoading("removeOrcamento");
        alert("Não foi possível remover o orçamento");
        console.error(e);
    }
}