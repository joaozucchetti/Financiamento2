// model.js - cálculos e utilitários (sem manipulação de DOM)

// Máscaras e conversões
export function mascaraMoeda(valor) {
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/(\d)(\d{2})$/, '$1,$2');
    valor = valor.replace(/(?=(\d{3})+(\D))\B/g, '.');
    return valor;
}

export function mascaraTaxa(valor) {
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/(\d)(\d{2})$/, '$1,$2');
    return valor;
}

export function mascaraInteiro(valor) {
    return valor.replace(/\D/g, '');
}

export function converterParaNumero(valor) {
    return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
}

export function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Cálculos
export function calcularPRICE(valorFinanciado, taxaJuros, numeroParcelas) {
    const taxa = taxaJuros / 100;
    const parcelas = [];
    const prestacao = valorFinanciado * (taxa * Math.pow(1 + taxa, numeroParcelas)) / (Math.pow(1 + taxa, numeroParcelas) - 1);

    let saldoDevedor = valorFinanciado;
    let totalJuros = 0;
    let totalAmortizacao = 0;

    for (let i = 1; i <= numeroParcelas; i++) {
        const juros = saldoDevedor * taxa;
        const amortizacao = prestacao - juros;
        saldoDevedor -= amortizacao;

        if (i === numeroParcelas) saldoDevedor = 0;

        totalJuros += juros;
        totalAmortizacao += amortizacao;

        parcelas.push({
            numero: i,
            prestacao: prestacao,
            juros: juros,
            amortizacao: amortizacao,
            saldoDevedor: Math.max(0, saldoDevedor)
        });
    }

    return {
        parcelas: parcelas,
        totalPago: valorFinanciado + totalJuros,
        totalJuros: totalJuros,
        prestacaoMedia: prestacao
    };
}

export function calcularSAC(valorFinanciado, taxaJuros, numeroParcelas) {
    const taxa = taxaJuros / 100;
    const parcelas = [];
    const amortizacao = valorFinanciado / numeroParcelas;

    let saldoDevedor = valorFinanciado;
    let totalJuros = 0;
    let totalPrestacao = 0;

    for (let i = 1; i <= numeroParcelas; i++) {
        const juros = saldoDevedor * taxa;
        const prestacao = amortizacao + juros;
        saldoDevedor -= amortizacao;

        if (i === numeroParcelas) saldoDevedor = 0;

        totalJuros += juros;
        totalPrestacao += prestacao;

        parcelas.push({
            numero: i,
            prestacao: prestacao,
            juros: juros,
            amortizacao: amortizacao,
            saldoDevedor: Math.max(0, saldoDevedor)
        });
    }

    return {
        parcelas: parcelas,
        totalPago: valorFinanciado + totalJuros,
        totalJuros: totalJuros,
        prestacaoMedia: totalPrestacao / numeroParcelas
    };
}
