import { addLoading, removeLoading, alert } from "../lib/utils/utils.js";

import { Produto } from "../models/produto.js";

import { app } from "./baseRepository.js";
import { getDatabase, ref, onValue, child, set, remove, query, orderByChild, limitToLast } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js';

const database = getDatabase(app);

/** @type {Produto[]} */
export const produtos = [];

/**
 * Adiciona um produto no firebase
 * @param {Produto} produto 
 */
export function addProduto(produto) {
    try {
        addLoading("addProduto");

        set(ref(database, "produtos/" + produto.id), produto);
    } catch (e) {
        alert("Não foi possível gravar o produto");
        console.error(e);
    } finally {
        removeLoading("addProduto");
    }
}

/**
 * Se conecta com o firebase para acessar a lista de produtos em tempo real
 * @param {function():void|undefined} callbackFn callback para atualizar a tela com a lista de produtos recarregada
 */
export function getProdutos(callbackFn) {
    try {
        addLoading("getProdutos");

        onValue(ref(database, 'produtos'), (snapshot) => {
            produtos.length = 0;
            snapshot.forEach((childSnapshot) => {
                let _p = new Produto();
                _p.update(childSnapshot.val());
                produtos.push(_p);
            });
            if (callbackFn) callbackFn();
            removeLoading("getProdutos");
        });
    } catch (e) {
        removeLoading("getProdutos");
        alert("Não foi possível carregar os produtos");
        console.error(e);
    }
}

/**
 * Remove um produto no firebase
 * @param {string} id 
 */
export function removeProduto(id) {
    try {
        addLoading("removeProduto");

        remove(ref(database, "produtos/" + id));
        
        removeLoading("removeProduto");
    } catch (e) {
        removeLoading("removeProduto");
        alert("Não foi possível remover o produto");
        console.error(e);
    }
}