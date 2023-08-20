// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBtNgQHS2gz3HnYEyRkkkXKcdy5yEnbVBg",
    authDomain: "eletroled-8f021.firebaseapp.com",
    databaseURL: "https://eletroled-8f021-default-rtdb.firebaseio.com/",
    projectId: "eletroled-8f021",
    storageBucket: "eletroled-8f021.appspot.com",
    messagingSenderId: "339244361573",
    appId: "1:339244361573:web:fae6d83b75a5198ab4638c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const produtos = [];

function addProduto(produto) {
    const itemRef = database.ref(`produtos/${produto.id}`);
    itemRef.set(produto);
}

function getProdutos(callbackFn) {
    const itemRef = database.ref("produtos");
    itemRef.on("value", function (snapshot) {
        produtos.length = 0;
        snapshot.forEach(function (childSnapshot) {
            produtos.push(childSnapshot.val());
        });
        if (callbackFn) callbackFn();
    });
}

function removeProduto(id) {
    const itemRef = database.ref("produtos");
    itemRef.child(id).remove();
}