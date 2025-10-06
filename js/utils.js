function converterParaNumero(valor) {
    return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export { converterParaNumero, formatarMoeda };