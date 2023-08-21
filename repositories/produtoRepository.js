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
    set(ref(database, "produtos/" + produto.id), produto);
}

/**
 * Se conecta com o firebase para acessar a lista de produtos em tempo real
 * @param {function():void|undefined} callbackFn callback para atualizar a tela com a lista de produtos recarregada
 */
export function getProdutos(callbackFn) {
    onValue(ref(database, 'produtos'), (snapshot) => {
        produtos.length = 0;
        snapshot.forEach((childSnapshot) => {
            let _p = new Produto();
            _p.update(childSnapshot.val());
            produtos.push(_p);
        });
        if (callbackFn) callbackFn();
    });
}

/**
 * Remove um produto no firebase
 * @param {string} id 
 */
export function removeProduto(id) {
    remove(ref(database, "produtos/" + id));
}