const _formOrcamento = new Orcamento();

/** @type {HTMLFormElement} */
const _form = document.getElementById('orcamento-form');

function init() {
    resetForm();
    getProdutos(updateData);
}

function updateData() {
    /** @type {HTMLSelectElement} */
    let cor = document.getElementById("cor");
    cor.options.length = 0;

    produtos
        .filter(produto => produto.tipo == "PINTURA")
        .forEach(produto => {
            const option = document.createElement("option");
            option.value = produto.id;
            option.text = produto.descricao;
            cor.options.add(option);
        });
}

function resetForm() {
    _formOrcamento.clear();

    updateForm();
}

function updateForm() {
    for (let col in _formOrcamento) {
        /** @type {HTMLInputElement|HTMLSelectElement} */
        let field = document.getElementById(col);

        if (!field) continue;

        if (field instanceof HTMLSelectElement) field.value = _formOrcamento[col] ?? field.options.item(0)?.value;
        else field.value = _formOrcamento[col] ?? null;
    }
}

function updateOrcamento() {
    _formOrcamento.itens.length = 0;

    for (let col in _formOrcamento) {
        /** @type {HTMLInputElement|HTMLSelectElement} */
        let field = document.getElementById(col);

        if (!field) continue;

        if (field instanceof HTMLInputElement && field.type == "number")
            _formOrcamento[col] = Number.isNaN(field.valueAsNumber) ? null : field.valueAsNumber;
        else
            _formOrcamento[col] = field.value;
    }

    let validation = _formOrcamento.validate();
    if (validation.length > 0) {
        console.error(validation);
        return;
    }

    let fixos = [
        "L001", //lamina
        "S001", //soleira
        "E001", //eixo
        "G001", //guia
        "B001", //borracha lateral
        "B002", //borracha soleira
    ];

    let produtosFixos = produtos
        .filter(produto => fixos.indexOf(produto.id) >= 0)
        .map(produto => {
            if (produto.id == "E001")
                return new OrcamentoItem(produto, produtos.find(produto => produto.id == "M001")?.precoUnitario);
            else return new OrcamentoItem(produto);
        });
    _formOrcamento.itens.push(...produtosFixos);

    let area = _formOrcamento.getArea();

    let motor = produtos.find(produto => produto.tipo == "MOTOR" && area >= produto.metragemMinima && area <= produto.metragemMaxima);
    _formOrcamento.itens.push(new OrcamentoItem(motor));

    let cor = produtos.find(produto => produto.id == _formOrcamento.cor);
    _formOrcamento.itens.push(new OrcamentoItem(cor));

    if (_formOrcamento.alcapao == "S") {
        let alcapao = produtos.find(produto => produto.id == "A001");
        _formOrcamento.itens.push(new OrcamentoItem(alcapao));
    }

    _formOrcamento.calculaOrcamento();

    addOrcamento(_formOrcamento);
    resetForm();
}

_form.addEventListener('submit', function (e) {
    e.preventDefault();

    updateOrcamento();
});
_form.addEventListener('reset', function (e) {
    e.preventDefault();

    resetForm();
});