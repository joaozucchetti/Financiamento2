import { formatarMoeda } from './utils.js';

function calcularPRICE(valorFinanciado, taxaJuros, numeroParcelas) {
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

function calcularSAC(valorFinanciado, taxaJuros, numeroParcelas) {
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

export { calcularPRICE, calcularSAC };