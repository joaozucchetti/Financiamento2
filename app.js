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

function converterParaNumero(valor) {
    return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
}

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
});

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

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

function criarCardsComparacao(dadosPRICE, dadosSAC, valorFinanciado) {
    const primeiraParcelaPRICE = dadosPRICE.parcelas[0];
    const ultimaParcelaPRICE = dadosPRICE.parcelas[dadosPRICE.parcelas.length - 1];
    const primeiraParcelaSAC = dadosSAC.parcelas[0];
    const ultimaParcelaSAC = dadosSAC.parcelas[dadosSAC.parcelas.length - 1];

    return `
        <div class="card price">
            <h2>Sistema PRICE</h2>
            <div class="card-info">
                <div class="card-info-item">
                    <span>Valor Financiado:</span>
                    <span>${formatarMoeda(valorFinanciado)}</span>
                </div>
                <div class="card-info-item">
                    <span>Prestação (constante):</span>
                    <span>${formatarMoeda(primeiraParcelaPRICE.prestacao)}</span>
                </div>
                <div class="card-info-item">
                    <span>1º Juro:</span>
                    <span>${formatarMoeda(primeiraParcelaPRICE.juros)}</span>
                </div>
                <div class="card-info-item">
                    <span>1º Amortização:</span>
                    <span>${formatarMoeda(primeiraParcelaPRICE.amortizacao)}</span>
                </div>
                <div class="card-info-item">
                    <span>Total de Juros:</span>
                    <span>${formatarMoeda(dadosPRICE.totalJuros)}</span>
                </div>
                <div class="card-info-item" style="background: rgba(255, 255, 255, 0.4); font-weight: bold;">
                    <span>Total Pago:</span>
                    <span>${formatarMoeda(dadosPRICE.totalPago)}</span>
                </div>
            </div>
        </div>

        <div class="card sac">
            <h2>Sistema SAC</h2>
            <div class="card-info">
                <div class="card-info-item">
                    <span>Valor Financiado:</span>
                    <span>${formatarMoeda(valorFinanciado)}</span>
                </div>
                <div class="card-info-item">
                    <span>1ª Prestação:</span>
                    <span>${formatarMoeda(primeiraParcelaSAC.prestacao)}</span>
                </div>
                <div class="card-info-item">
                    <span>Última Prestação:</span>
                    <span>${formatarMoeda(ultimaParcelaSAC.prestacao)}</span>
                </div>
                <div class="card-info-item">
                    <span>Amortização (constante):</span>
                    <span>${formatarMoeda(primeiraParcelaSAC.amortizacao)}</span>
                </div>
                <div class="card-info-item">
                    <span>Total de Juros:</span>
                    <span>${formatarMoeda(dadosSAC.totalJuros)}</span>
                </div>
                <div class="card-info-item" style="background: rgba(255, 255, 255, 0.4); font-weight: bold;">
                    <span>Total Pago:</span>
                    <span>${formatarMoeda(dadosSAC.totalPago)}</span>
                </div>
            </div>
        </div>
    `;
}

function criarRecomendacao(dadosPRICE, dadosSAC, valorFinanciado, numeroParcelas) {
    const economiaJuros = dadosPRICE.totalJuros - dadosSAC.totalJuros;
    const economiaTotal = dadosPRICE.totalPago - dadosSAC.totalPago;
    const percentualEconomia = (economiaTotal / dadosPRICE.totalPago * 100).toFixed(2);
    
    const primeiraParcelaPRICE = dadosPRICE.parcelas[0].prestacao;
    const primeiraParcelaSAC = dadosSAC.parcelas[0].prestacao;
    const ultimaParcelaSAC = dadosSAC.parcelas[dadosSAC.parcelas.length - 1].prestacao;
    
    const diferencaPrimeiraParcela = primeiraParcelaSAC - primeiraParcelaPRICE;
    
    let sistemaRecomendado = '';
    let textoCompleto = '';
    
    let topicos = [];
    
    if (economiaTotal > 0 && economiaTotal > (valorFinanciado * 0.01)) {
        sistemaRecomendado = 'SAC';
        
        topicos.push(`Economia total de <span style="color: #2c2c2c; font-weight: 700;">${formatarMoeda(economiaTotal)}</span> (<span style="color: #2c2c2c; font-weight: 700;">${percentualEconomia}%</span> a menos) em relação ao sistema PRICE`);
        
        topicos.push(`Total de juros <span style="color: #2c2c2c; font-weight: 700;">${formatarMoeda(economiaJuros)}</span> menor, representando economia significativa ao longo dos <span style="color: #2c2c2c; font-weight: 700;">${numeroParcelas} meses</span>`);
        
        topicos.push(`Prestações diminuem progressivamente: de <span style="color: #2c2c2c; font-weight: 700;">${formatarMoeda(primeiraParcelaSAC)}</span> para <span style="color: #2c2c2c; font-weight: 700;">${formatarMoeda(ultimaParcelaSAC)}</span>, aliviando o orçamento ao longo do tempo`);
        
        if (diferencaPrimeiraParcela > 0) {
            topicos.push(`<strong style="color: #d97706;">⚠️ Atenção:</strong> Primeira parcela <span style="color: #d97706; font-weight: 700;">${formatarMoeda(diferencaPrimeiraParcela)}</span> maior que no PRICE - certifique-se de que cabe no orçamento inicial`);
        }
        
        topicos.push(`Ideal para quem tem capacidade de pagar parcelas maiores no início e deseja economizar no custo total`);
        
    } else {
        sistemaRecomendado = 'PRICE';
        
        topicos.push(`Todas as <span style="color: #2c2c2c; font-weight: 700;">${numeroParcelas} parcelas</span> fixas em <span style="color: #2c2c2c; font-weight: 700;">${formatarMoeda(primeiraParcelaPRICE)}</span>`);
        
        topicos.push(`Facilita o planejamento financeiro mensal com parcelas constantes`);
        
        topicos.push(`Prestação <span style="color: #2c2c2c; font-weight: 700;">${formatarMoeda(Math.abs(diferencaPrimeiraParcela))}</span> menor que a primeira parcela do SAC`);
        
        if (Math.abs(economiaTotal) < (valorFinanciado * 0.01)) {
            topicos.push(`Diferença total entre sistemas de apenas <span style="color: #2c2c2c; font-weight: 700;">${formatarMoeda(Math.abs(economiaTotal))}</span> - previsibilidade compensa`);
        }
        
        topicos.push(`Ideal para quem prefere estabilidade e previsibilidade nas prestações`);
    }
    
    let html = `
        <div class="recommendation-header">
            <h3 class="recommendation-title">Nossa Recomendação</h3>
        </div>
        
        <div class="recommendation-winner">
            Sistema ${sistemaRecomendado}
        </div>
        
        <div class="recommendation-text">
            <ul class="recommendation-list">
                ${topicos.map(topico => `<li>${topico}</li>`).join('')}
            </ul>
        </div>
    `;
    
    return html;
}

function criarTabela(titulo, parcelas, valorTotal) {
    let html = `
        <div class="table-wrapper">
            <h3>${titulo}</h3>
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Nº</th>
                            <th>Prestação</th>
                            <th>Juros</th>
                            <th>Amortização</th>
                            <th>Saldo Devedor</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    parcelas.forEach(parcela => {
        html += `
            <tr>
                <td>${parcela.numero}</td>
                <td>${formatarMoeda(parcela.prestacao)}</td>
                <td>${formatarMoeda(parcela.juros)}</td>
                <td>${formatarMoeda(parcela.amortizacao)}</td>
                <td>${formatarMoeda(parcela.saldoDevedor)}</td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return html;
}

let dadosCalculoGlobal = null;

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

    document.getElementById('loading').classList.add('active');
    document.getElementById('resultsSection').classList.remove('active');

    setTimeout(() => {
        const dadosPRICE = calcularPRICE(valorFinanciado, taxaJuros, numeroParcelas);
        const dadosSAC = calcularSAC(valorFinanciado, taxaJuros, numeroParcelas);

        dadosCalculoGlobal = {
            valorFinanciado,
            taxaJuros,
            numeroParcelas,
            dadosPRICE,
            dadosSAC
        };

        document.getElementById('comparisonCards').innerHTML = 
            criarCardsComparacao(dadosPRICE, dadosSAC, valorFinanciado);

        document.getElementById('recommendationSection').innerHTML = 
            criarRecomendacao(dadosPRICE, dadosSAC, valorFinanciado, numeroParcelas);

        document.getElementById('tablesContainer').innerHTML = 
            criarTabela('Tabela PRICE', dadosPRICE.parcelas, dadosPRICE.totalPago) +
            criarTabela('Tabela SAC', dadosSAC.parcelas, dadosSAC.totalPago);

        document.getElementById('loading').classList.remove('active');
        document.getElementById('resultsSection').classList.add('active');
        document.getElementById('btnExport').style.display = 'inline-block';

        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }, 500);
});

function limparFormulario() {
    document.getElementById('financingForm').reset();
    document.getElementById('resultsSection').classList.remove('active');
    document.getElementById('btnExport').style.display = 'none';
    dadosCalculoGlobal = null;
}

function exportarPDF() {
    if (!dadosCalculoGlobal) {
        alert('Realize um cálculo antes de exportar.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    const { valorFinanciado, taxaJuros, numeroParcelas, dadosPRICE, dadosSAC } = dadosCalculoGlobal;

    const cinzaEscuro = [26, 26, 26];
    const cinzaMedio = [102, 102, 102];
    const cinzaClaro = [153, 153, 153];
    const branco = [255, 255, 255];

    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, 0, 30, 'F');
    
            doc.setFont('times', 'bold');
            doc.setFontSize(22);
            doc.setTextColor(...cinzaEscuro);
            doc.text('Relatório de Financiamento', 20, 18);
    
            doc.setFont('times', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(...cinzaMedio);
            doc.text('Comparação: Sistema PRICE vs Sistema SAC', 20, 26);

    doc.setDrawColor(229, 229, 229);
    doc.setLineWidth(0.5);
    doc.line(20, 28, 190, 28);

    let y = 40;
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...cinzaMedio);
    doc.text('DADOS DO FINANCIAMENTO', 20, y);
    
    y += 6;
    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...cinzaEscuro);
    doc.text(`Valor Financiado:`, 20, y);
    doc.setFont('times', 'bold');
    doc.text(`${formatarMoeda(valorFinanciado)}`, 70, y);
    
    doc.setFont('times', 'normal');
    doc.text(`Taxa de Juros:`, 20, y + 5);
    doc.setFont('times', 'bold');
    doc.text(`${taxaJuros}% ao mês`, 70, y + 5);
    
    doc.setFont('times', 'normal');
    doc.text(`Parcelas:`, 20, y + 10);
    doc.setFont('times', 'bold');
    doc.text(`${numeroParcelas} meses`, 70, y + 10);

    y = 65;
    
    const primeiraParcelaPRICE_card = dadosPRICE.parcelas[0];
    const ultimaParcelaSAC_card = dadosSAC.parcelas[dadosSAC.parcelas.length - 1];
    
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, y, 85, 45, 3, 3, 'F');
    doc.setDrawColor(229, 229, 229);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, y, 85, 45, 3, 3, 'S');
    
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...cinzaEscuro);
    doc.text('Sistema PRICE', 25, y + 6);
    
    doc.setFont('times', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...cinzaMedio);
    doc.text('Valor Financiado:', 25, y + 12);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(valorFinanciado), 65, y + 12);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('Prestação (constante):', 25, y + 16);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(primeiraParcelaPRICE_card.prestacao), 65, y + 16);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('1º Juro:', 25, y + 20);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(primeiraParcelaPRICE_card.juros), 65, y + 20);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('1º Amortização:', 25, y + 24);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(primeiraParcelaPRICE_card.amortizacao), 65, y + 24);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('Total de Juros:', 25, y + 28);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(dadosPRICE.totalJuros), 65, y + 28);
    
    doc.setFillColor(240, 240, 240);
    doc.rect(25, y + 32, 70, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text('Total Pago:', 25, y + 36);
    doc.text(formatarMoeda(dadosPRICE.totalPago), 65, y + 36);
    
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(110, y, 85, 45, 3, 3, 'F');
    doc.setDrawColor(229, 229, 229);
    doc.setLineWidth(0.5);
    doc.roundedRect(110, y, 85, 45, 3, 3, 'S');
    
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...cinzaEscuro);
    doc.text('Sistema SAC', 115, y + 6);
    
    doc.setFont('times', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...cinzaMedio);
    doc.text('Valor Financiado:', 115, y + 12);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(valorFinanciado), 155, y + 12);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('1ª Prestação:', 115, y + 16);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(dadosSAC.parcelas[0].prestacao), 155, y + 16);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('Última Prestação:', 115, y + 20);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(ultimaParcelaSAC_card.prestacao), 155, y + 20);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('Amortização (constante):', 115, y + 24);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(dadosSAC.parcelas[0].amortizacao), 155, y + 24);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('Total de Juros:', 115, y + 28);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(dadosSAC.totalJuros), 155, y + 28);
    
    doc.setFillColor(240, 240, 240);
    doc.rect(115, y + 32, 70, 6, 'F');
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text('Total Pago:', 115, y + 36);
    doc.text(formatarMoeda(dadosSAC.totalPago), 155, y + 36);

    y = 115;
    
    const economiaJuros = dadosPRICE.totalJuros - dadosSAC.totalJuros;
    const economiaTotal = dadosPRICE.totalPago - dadosSAC.totalPago;
    const percentualEconomia = (economiaTotal / dadosPRICE.totalPago * 100).toFixed(2);
    const primeiraParcelaPRICE = dadosPRICE.parcelas[0].prestacao;
    const primeiraParcelaSAC = dadosSAC.parcelas[0].prestacao;
    const ultimaParcelaSAC = dadosSAC.parcelas[dadosSAC.parcelas.length - 1].prestacao;
    const diferencaPrimeiraParcela = primeiraParcelaSAC - primeiraParcelaPRICE;
    
    let sistemaRecomendado = '';
    let topicosPDF = [];
    
    if (economiaTotal > 0 && economiaTotal > (valorFinanciado * 0.01)) {
        sistemaRecomendado = 'SAC';
        topicosPDF.push(`Economia total de ${formatarMoeda(economiaTotal)} (${percentualEconomia}% a menos) em relacao ao sistema PRICE`);
        topicosPDF.push(`Total de juros ${formatarMoeda(economiaJuros)} menor, economia significativa ao longo dos ${numeroParcelas} meses`);
        topicosPDF.push(`Prestacoes diminuem progressivamente: de ${formatarMoeda(primeiraParcelaSAC)} para ${formatarMoeda(ultimaParcelaSAC)}`);
        if (diferencaPrimeiraParcela > 0) {
            topicosPDF.push(`ATENCAO: Primeira parcela ${formatarMoeda(diferencaPrimeiraParcela)} maior que no PRICE`);
        }
        topicosPDF.push(`Ideal para quem pode pagar parcelas maiores no inicio e quer economizar no total`);
    } else {
        sistemaRecomendado = 'PRICE';
        topicosPDF.push(`Todas as ${numeroParcelas} parcelas fixas em ${formatarMoeda(primeiraParcelaPRICE)}`);
        topicosPDF.push(`Facilita o planejamento financeiro mensal com parcelas constantes`);
        topicosPDF.push(`Prestacao ${formatarMoeda(Math.abs(diferencaPrimeiraParcela))} menor que a primeira parcela do SAC`);
        if (Math.abs(economiaTotal) < (valorFinanciado * 0.01)) {
            topicosPDF.push(`Diferenca total entre sistemas de apenas ${formatarMoeda(Math.abs(economiaTotal))}`);
        }
        topicosPDF.push(`Ideal para quem prefere estabilidade e previsibilidade nas prestacoes`);
    }
    
    doc.setFontSize(12);
    doc.setTextColor(...cinzaEscuro);
    doc.setFont('times', 'bold');
    doc.text('RECOMENDAÇÃO', 25, y + 2);
    
    y += 10;
    
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, y, 170, 14, 2, 2, 'F');
    
    doc.setFontSize(16);
    doc.setTextColor(...cinzaEscuro);
    doc.setFont('times', 'bold');
    doc.text(`Sistema ${sistemaRecomendado}`, 25, y + 8);
    
    y += 18;
    
    doc.setFontSize(8);
    doc.setFont('times', 'normal');
    doc.setTextColor(51, 51, 51);
    
    topicosPDF.forEach((topico, index) => {
        doc.setFillColor(26, 26, 26);
        doc.circle(23, y + 1.5, 1.5, 'F');
        
        const linhasTopico = doc.splitTextToSize(topico, 160);
        doc.text(linhasTopico, 28, y + 3);
        y += (linhasTopico.length * 4) + 2;
    });
    
    y += 6;
    
    doc.setDrawColor(229, 229, 229);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    
    y += 6;
    doc.setFillColor(250, 250, 250);
    doc.rect(20, y - 3, 170, 6, 'F');
    
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...cinzaEscuro);
    doc.text('Sistema PRICE', 23, y);
    
    y += 6;
    doc.setFontSize(8);
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    
    doc.text('Prestação (constante)', 23, y);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(dadosPRICE.parcelas[0].prestacao), 80, y);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('Total de Juros', 23, y + 4);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(dadosPRICE.totalJuros), 80, y + 4);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('Total Pago', 23, y + 8);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(dadosPRICE.totalPago), 80, y + 8);

    y += 14;
    doc.autoTable({
        startY: y,
        head: [['Nº', 'Prestação', 'Juros', 'Amortização', 'Saldo Devedor']],
        body: dadosPRICE.parcelas.map(p => [
            p.numero,
            formatarMoeda(p.prestacao),
            formatarMoeda(p.juros),
            formatarMoeda(p.amortizacao),
            formatarMoeda(p.saldoDevedor)
        ]),
        theme: 'plain',
        headStyles: { 
            fillColor: [250, 250, 250],
            textColor: [26, 26, 26],
            fontStyle: 'bold',
            fontSize: 8,
            halign: 'center',
            lineWidth: 0.1,
            lineColor: [229, 229, 229]
        },
        styles: { 
            fontSize: 7,
            cellPadding: 3,
            textColor: [51, 51, 51],
            lineWidth: 0.1,
            lineColor: [240, 240, 240]
        },
        columnStyles: {
            0: { cellWidth: 15, halign: 'center' },
            1: { cellWidth: 35, halign: 'right' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' },
            4: { cellWidth: 35, halign: 'right' }
        },
        margin: { left: 20, right: 20 }
    });

    doc.addPage();
    
    y = 18;
    doc.setFillColor(250, 250, 250);
    doc.rect(20, y - 3, 170, 6, 'F');
    
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...cinzaEscuro);
    doc.text('Sistema SAC', 23, y);
    
    y += 6;
    doc.setFontSize(8);
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    
    doc.text('Primeira Prestação', 23, y);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(dadosSAC.parcelas[0].prestacao), 80, y);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('Última Prestação', 23, y + 4);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(dadosSAC.parcelas[dadosSAC.parcelas.length-1].prestacao), 80, y + 4);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('Total de Juros', 23, y + 8);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(dadosSAC.totalJuros), 80, y + 8);
    
    doc.setFont('times', 'normal');
    doc.setTextColor(...cinzaMedio);
    doc.text('Total Pago', 23, y + 12);
    doc.setFont('times', 'bold');
    doc.setTextColor(...cinzaEscuro);
    doc.text(formatarMoeda(dadosSAC.totalPago), 80, y + 12);

    y += 18;
    doc.autoTable({
        startY: y,
        head: [['Nº', 'Prestação', 'Juros', 'Amortização', 'Saldo Devedor']],
        body: dadosSAC.parcelas.map(p => [
            p.numero,
            formatarMoeda(p.prestacao),
            formatarMoeda(p.juros),
            formatarMoeda(p.amortizacao),
            formatarMoeda(p.saldoDevedor)
        ]),
        theme: 'plain',
        headStyles: { 
            fillColor: [250, 250, 250],
            textColor: [26, 26, 26],
            fontStyle: 'bold',
            fontSize: 8,
            halign: 'center',
            lineWidth: 0.1,
            lineColor: [229, 229, 229]
        },
        styles: { 
            fontSize: 7,
            cellPadding: 3,
            textColor: [51, 51, 51],
            lineWidth: 0.1,
            lineColor: [240, 240, 240]
        },
        columnStyles: {
            0: { cellWidth: 15, halign: 'center' },
            1: { cellWidth: 35, halign: 'right' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' },
            4: { cellWidth: 35, halign: 'right' }
        },
        margin: { left: 20, right: 20 }
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        doc.setDrawColor(229, 229, 229);
        doc.setLineWidth(0.3);
        doc.line(20, 282, 190, 282);
        
        doc.setFontSize(6);
        doc.setTextColor(...cinzaClaro);
        doc.setFont('times', 'normal');
        doc.text(`Página ${i} de ${pageCount}`, 105, 287, { align: 'center' });
        doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 105, 291, { align: 'center' });
    }

    const pdfDataUri = doc.output('dataurlnewwindow');
    window.open(pdfDataUri, '_blank');
}
