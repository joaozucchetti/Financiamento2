function mascaraMoeda(valor) {
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/(\d)(\d{2})$/, '$1,$2');
    valor = valor.replace(/(?=(\d{3})+(\D))\B/g, '.');
    return valor;
}

function mascaraTaxa(valor) {
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/(\d)(\d{2})$/, '$1,$2');
    return valor;
}

function mascaraInteiro(valor) {
    return valor.replace(/\D/g, '');
}

export { mascaraMoeda, mascaraTaxa, mascaraInteiro };