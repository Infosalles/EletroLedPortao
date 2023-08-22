import { Orcamento } from "../models/orcamento.js";
import { app } from "./baseRepository.js";
import { getDatabase, ref, onValue, child, get, push, update, query, orderByChild, equalTo } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js';

const database = getDatabase(app);

/** @type {Orcamento[]} */
export const orcamentos = [];

/**
 * @param {Orcamento} orcamento 
 * @returns {string}
 */
export function addOrcamento(orcamento) {
    let postId = push(child(ref(database), "orcamentos")).key;
    orcamento.id = postId;

    update(ref(database, "orcamentos/" + postId), orcamento);

    return orcamento.id;
}

/**
 * Se conecta com o firebase para acessar a lista de orçamentos em tempo real
 * @param {function():void|undefined} callbackFn callback para atualizar a tela com a lista de orçamentos recarregada
 */
export function getOrcamentos(callbackFn) {
    onValue(ref(database, 'orcamentos'), (snapshot) => {
        orcamentos.length = 0;
        snapshot.forEach((childSnapshot) => {
            let _p = new Orcamento();
            _p.update(childSnapshot.val());
            orcamentos.push(_p);
        });
        if (callbackFn) callbackFn();
    });
}

/**
 * @param {string} id 
 * @param {function(Orcamento):void} callbackFn 
 */
export function getOrcamento(id, callbackFn) {
    get(query(ref(database, `orcamentos`), ...[orderByChild("id"), equalTo(id)]))
        .then((snapshot) => {
            let orcamento = new Orcamento();
            snapshot.forEach((childSnapshot) => {
                orcamento.update(childSnapshot.val());
            });
            if (callbackFn) callbackFn(orcamento);
        });
}