import { addLoading, removeLoading, alert, getBaseURL } from "../lib/utils/utils.js";

import { app } from "./baseRepository.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js';

const auth = getAuth(app);

export const authUser = {
    isLoggedIn: false,
    displayName: null,
    photoURL: null,
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        authUser.isLoggedIn = true;
        authUser.displayName = user.displayName;
        authUser.photoURL = user.photoURL;
        let baseUrl = getBaseURL();
        if (location.href == baseUrl) location.href = baseUrl + "orcamento/";
    } else {
        authUser.isLoggedIn = false;
        authUser.displayName = null;
        authUser.photoURL = null;
        //redirect para o início
        let baseUrl = getBaseURL();
        if (location.href != baseUrl) location.href = baseUrl;
    }
});

export function login(email, password) {
    addLoading("login");
    signInWithEmailAndPassword(auth, email, password)
        .then((_) => {
            removeLoading("login");
        })
        .catch((error) => {
            removeLoading("login");
            alert("Não foi possível fazer login", "danger");
            console.error(error);
        });
}

export function logout() {
    addLoading("logout");
    signOut(auth).then(() => {
        removeLoading("logout");
    }).catch((error) => {
        removeLoading("logout");
        alert("Não foi possível fazer logout", "danger");
        console.error(error);
    });
}