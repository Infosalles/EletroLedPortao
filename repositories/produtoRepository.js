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
            let _p = new Produto();
            _p.update(childSnapshot.val());
            produtos.push(_p);
        });
        if (callbackFn) callbackFn();
    });
}

function removeProduto(id) {
    const itemRef = database.ref("produtos");
    itemRef.child(id).remove();
}