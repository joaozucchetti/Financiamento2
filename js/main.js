import { mascaraMoeda, mascaraTaxa, mascaraInteiro } from './js/masks.js';
import { converterParaNumero, formatarMoeda } from './js/utils.js';
import { calcularPRICE, calcularSAC } from './js/calculations.js';
import { criarCardsComparacao } from './js/ui.js';

document.addEventListener('DOMContentLoaded', function() {
    const inputValor = document.getElementById('valorFinanciado');
    const inputTaxa = document.getElementById('taxaJuros');
    const inputParcelas = document.getElementById('numeroParcelas');

    inputValor.addEventListener('input', function(e) {
        let valor = e.target.value;
        e.target.value = mascaraMoeda(valor);
    });

    inputTaxa.addEventListener('input', function(e) {
        let valor = e.target.value;
        e.target.value = mascaraTaxa(valor);
    });

    inputParcelas.addEventListener('input', function(e) {
        let valor = e.target.value;
        e.target.value = mascaraInteiro(valor);
    });

    document.getElementById('financingForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const valorFinanciadoStr = document.getElementById('valorFinanciado').value;
        const taxaJurosStr = document.getElementById('taxaJuros').value;
        const numeroParcelas = parseInt(document.getElementById('numeroParcelas').value.replace(/\D/g, ''));

        if (!valorFinanciadoStr || !taxaJurosStr || !numeroParcelas) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const valorFinanciado = converterParaNumero(valorFinanciadoStr);
        const taxaJuros = converterParaNumero(taxaJurosStr);

        if (isNaN(valorFinanciado) || isNaN(taxaJuros) || isNaN(numeroParcelas) || 
            valorFinanciado <= 0 || taxaJuros <= 0 || numeroParcelas <= 0) {
            alert('Por favor, preencha todos os campos com valores positivos válidos.');
            return;
        }

        const dadosPRICE = calcularPRICE(valorFinanciado, taxaJuros, numeroParcelas);
        const dadosSAC = calcularSAC(valorFinanciado, taxaJuros, numeroParcelas);

        document.getElementById('comparisonCards').innerHTML = 
            criarCardsComparacao(dadosPRICE, dadosSAC, valorFinanciado);
    });
});