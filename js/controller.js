// controller.js - manipula eventos, validações e orquestra model + view
import {
    mascaraMoeda,
    mascaraTaxa,
    mascaraInteiro,
    converterParaNumero,
    calcularPRICE,
    calcularSAC
} from './model.js';

import {
    criarCardsComparacao,
    criarRecomendacao,
    criarTabela
} from './view.js';

let dadosCalculoGlobal = null;

function aplicarMascaras() {
    const inputValor = document.getElementById('valorFinanciado');
    const inputTaxa = document.getElementById('taxaJuros');
    const inputParcelas = document.getElementById('numeroParcelas');
    const inputRenda = document.getElementById('rendaMensal');

    inputValor.addEventListener('input', function(e) {
        e.target.value = mascaraMoeda(e.target.value);
    });

    inputTaxa.addEventListener('input', function(e) {
        e.target.value = mascaraTaxa(e.target.value);
    });

    inputParcelas.addEventListener('input', function(e) {
        e.target.value = mascaraInteiro(e.target.value);
    });

    if (inputRenda) {
        inputRenda.addEventListener('input', function(e) {
            e.target.value = mascaraMoeda(e.target.value);
        });
    }
}

function limparFormulario() {
    document.getElementById('financingForm').reset();
    document.getElementById('resultsSection').classList.remove('active');
    dadosCalculoGlobal = null;
    const btnPrint = document.getElementById('btnPrint');
    if (btnPrint) btnPrint.style.display = 'none';
}

function inicializar() {
    document.addEventListener('DOMContentLoaded', () => {
        aplicarMascaras();

        document.getElementById('financingForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const valorFinanciadoStr = document.getElementById('valorFinanciado').value;
            const taxaJurosStr = document.getElementById('taxaJuros').value;
            const numeroParcelas = parseInt(document.getElementById('numeroParcelas').value.replace(/\D/g, ''));
            const rendaMensalStr = document.getElementById('rendaMensal') ? document.getElementById('rendaMensal').value : null;

            if (!valorFinanciadoStr || !taxaJurosStr || !numeroParcelas || !rendaMensalStr) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const valorFinanciado = converterParaNumero(valorFinanciadoStr);
            const taxaJuros = converterParaNumero(taxaJurosStr);
            const rendaMensal = converterParaNumero(rendaMensalStr);

            if (isNaN(valorFinanciado) || isNaN(taxaJuros) || isNaN(numeroParcelas) || isNaN(rendaMensal) || valorFinanciado <= 0 || taxaJuros <= 0 || numeroParcelas <= 0 || rendaMensal <= 0) {
                alert('Por favor, preencha todos os campos com valores positivos válidos.');
                return;
            }

            // Mostrar loading
            document.getElementById('loading').classList.add('active');
            document.getElementById('resultsSection').classList.remove('active');

            setTimeout(() => {
                const dadosPRICE = calcularPRICE(valorFinanciado, taxaJuros, numeroParcelas);
                const dadosSAC = calcularSAC(valorFinanciado, taxaJuros, numeroParcelas);

                dadosCalculoGlobal = { valorFinanciado, taxaJuros, numeroParcelas, dadosPRICE, dadosSAC };

                document.getElementById('comparisonCards').innerHTML = criarCardsComparacao(dadosPRICE, dadosSAC, valorFinanciado);
                document.getElementById('recommendationSection').innerHTML = criarRecomendacao(dadosPRICE, dadosSAC, valorFinanciado, numeroParcelas, rendaMensal);
                document.getElementById('tablesContainer').innerHTML = criarTabela('Tabela PRICE', dadosPRICE.parcelas) + criarTabela('Tabela SAC', dadosSAC.parcelas);

                document.getElementById('loading').classList.remove('active');
                document.getElementById('resultsSection').classList.add('active');

                // Mostrar o botão de imprimir após cálculo
                const btnPrintAfter = document.getElementById('btnPrint');
                if (btnPrintAfter) btnPrintAfter.style.display = 'inline-block';

                document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
            }, 400);
        });

        document.querySelectorAll('.btn-clear').forEach(btn => btn.addEventListener('click', limparFormulario));

        const btnPrint = document.getElementById('btnPrint');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => {
                // Se não houver resultados calculados, avise
                if (!dadosCalculoGlobal) {
                    alert('Realize um cálculo antes de imprimir.');
                    return;
                }

                // Simples: usar window.print() com regras @media print definidas no CSS
                window.print();
            });
        }
    });
}

// Inicializa automaticamente
inicializar();

export { inicializar };
