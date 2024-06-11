import { addLoading, removeLoading, alert } from "../lib/utils/utils.js";

import { Recebimento } from "../models/recebimento.js";

import { app } from "./baseRepository.js";
import { getDatabase, ref, onValue, child, get, push, update, remove, query, orderByChild, equalTo } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js';

const database = getDatabase(app);

/** @type {Recebimento[]} */
export const recebimentos = [];

/**
 * @param {Recebimento} recebimento 
 * @returns {string}
 */
export async function addRecebimento(recebimento) {
    try {
        addLoading("addRecebimento");

        let postId = push(child(ref(database), "recebimentos")).key;
        recebimento.id = postId;

        await update(ref(database, "recebimentos/" + postId), recebimento);

        return recebimento.id;
    } catch (e) {
        alert("Não foi possível gravar o recebimento");
        console.error(e);
    } finally {
        removeLoading("addRecebimento");
    }
}

/**
 * Atualiza um Recebimento no firebase
 * @param {Recebimento} recebimento 
 */
export async function updateRecebimento(recebimento) {
    try {
        addLoading("updateRecebimento");
        
        await update(ref(database, "recebimentos/" + recebimento.id), recebimento);
    } catch (e) {
        alert("Não foi possível gravar o recebimento");
        console.error(e);
    } finally {
        removeLoading("updateRecebimento");
    }
}

/**
 * Se conecta com o firebase para acessar a lista de recebimentos em tempo real
 * @param {function():void|undefined} callbackFn callback para atualizar a tela com a lista de recebimentos recarregada
 */
export function getRecebimentos(callbackFn) {
    try {
        addLoading("getRecebimentos");

        onValue(ref(database, 'recebimentos'), (snapshot) => {
            recebimentos.length = 0;
            snapshot.forEach((childSnapshot) => {
                let _p = new Recebimento();
                _p.update(childSnapshot.val());
                recebimentos.push(_p);
            });
            if (callbackFn) callbackFn();
            removeLoading("getRecebimentos");
        });
    } catch (e) {
        removeLoading("getRecebimentos");
        alert("Não foi possível carregar os recebimentos");
        console.error(e);
    }
}

/**
 * @param {string} id 
 * @param {function(Recebimento):void} callbackFn 
 */
export function getRecebimento(id, callbackFn) {
    try {
        addLoading("getRecebimento");

        get(query(ref(database, `recebimentos`), ...[orderByChild("id"), equalTo(id)]))
            .then((snapshot) => {
                let recebimento = new Recebimento();
                snapshot.forEach((childSnapshot) => {
                    recebimento.update(childSnapshot.val());
                });
                if (callbackFn) callbackFn(recebimento);
                removeLoading("getRecebimento");
            });
    } catch (e) {
        removeLoading("getRecebimento");
        alert("Não foi possível carregar o recebimento");
        console.error(e);
    }
}

/**
 * Remove um recebimento no firebase
 * @param {string} id 
 */
export async function removeRecebimento(id) {
    try {
        addLoading("removeRecebimento");

        await remove(ref(database, "recebimentos/" + id));
        
        removeLoading("removeRecebimento");
    } catch (e) {
        removeLoading("removeRecebimento");
        alert("Não foi possível remover o recebimento");
        console.error(e);
    }
}