const orcamentos = [];

/**
 * @param {Orcamento} orcamento 
 * @returns {string}
 */
function addOrcamento(orcamento) {
    const itemRef = database.ref("orcamentos");
    let data = JSON.parse(JSON.stringify(orcamento));
    let postRef = itemRef.push(data);
    orcamento.id = postRef.key;
    postRef.update({
        id: orcamento.id
    });
    return orcamento.id;
}

function getOrcamentos(callbackFn) {
    const itemRef = database.ref("orcamentos");
    itemRef
        .on("value", function (snapshot) {
            orcamentos.length = 0;
            snapshot.forEach(function (childSnapshot) {
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
function getOrcamento(id, callbackFn) {
    const itemRef = database.ref("orcamentos");
    itemRef
        .orderByChild(id)
        .limitToLast(1)
        .once('value')
        .then((snapshot) => {
            let orcamento = new Orcamento();
            snapshot.forEach(function (childSnapshot) {
                orcamento.update(childSnapshot.val());
            });
            if (callbackFn) callbackFn(orcamento);
        });
}