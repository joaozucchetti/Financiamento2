// view.js - funções de renderização e manipulação leve do DOM
import { formatarMoeda } from './model.js';

export function criarCardsComparacao(dadosPRICE, dadosSAC, valorFinanciado) {
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

export function criarRecomendacao(dadosPRICE, dadosSAC, valorFinanciado, numeroParcelas, rendaMensal) {
    const economiaJuros = dadosPRICE.totalJuros - dadosSAC.totalJuros;
    const economiaTotal = dadosPRICE.totalPago - dadosSAC.totalPago;
    const percentualEconomia = (economiaTotal / dadosPRICE.totalPago * 100).toFixed(2);

    const primeiraParcelaPRICE = dadosPRICE.parcelas[0].prestacao;
    const primeiraParcelaSAC = dadosSAC.parcelas[0].prestacao;
    const ultimaParcelaSAC = dadosSAC.parcelas[dadosSAC.parcelas.length - 1].prestacao;

    const diferencaPrimeiraParcela = primeiraParcelaSAC - primeiraParcelaPRICE;

    let sistemaRecomendado = '';
    let topicos = [];

    // Regras com base na renda
    const limiteParcelaPorRenda = rendaMensal ? (rendaMensal * 0.35) : Infinity; // 35% da renda
    const economiaSignificativa = economiaTotal > (valorFinanciado * 0.01); // >1%
    const economiaMuitoAlta = economiaTotal > (valorFinanciado * 0.02); // >2%

    if (economiaSignificativa) {
        // SAC traz economia total; verificar impacto na renda do solicitante
        if (primeiraParcelaSAC > limiteParcelaPorRenda && !economiaMuitoAlta) {
            // Economia existe, mas primeira parcela SAC é alta e economia não é muito grande -> PRICE
            sistemaRecomendado = 'PRICE';
            topicos.push(`A primeira prestação do SAC seria <strong>${formatarMoeda(primeiraParcelaSAC)}</strong>, que excede 35% da sua renda mensal (${formatarMoeda(limiteParcelaPorRenda)}). Por isso recomendamos <strong>PRICE</strong> pela previsibilidade das parcelas.`);
            topicos.push(`O SAC apresenta economia total de <strong>${formatarMoeda(economiaTotal)}</strong>, mas ela não é grande o suficiente para justificar o aumento inicial das prestações.`);
        } else {
            // Recomendar SAC (com ou sem aviso)
            sistemaRecomendado = 'SAC';
            topicos.push(`Economia total de <span style="color: #2c2c2c; font-weight: 700;">${formatarMoeda(economiaTotal)}</span> (<span style="color: #2c2c2c; font-weight: 700;">${percentualEconomia}%</span> a menos) em relação ao sistema PRICE`);
            topicos.push(`Total de juros <span style="color: #2c2c2c; font-weight: 700;">${formatarMoeda(economiaJuros)}</span> menor, representando economia ao longo dos <span style="color: #2c2c2c; font-weight: 700;">${numeroParcelas} meses</span>`);
            if (primeiraParcelaSAC > limiteParcelaPorRenda) {
                topicos.push(`<strong style="color: #d97706;">⚠️ Atenção:</strong> A primeira parcela do SAC (<strong>${formatarMoeda(primeiraParcelaSAC)}</strong>) excede 35% da sua renda mensal (${formatarMoeda(limiteParcelaPorRenda)}). Avalie se consegue arcar com a parcela inicial.`);
            }
            topicos.push(`Prestações diminuem progressivamente: de <strong>${formatarMoeda(primeiraParcelaSAC)}</strong> para <strong>${formatarMoeda(ultimaParcelaSAC)}</strong>, aliviando o orçamento com o tempo.`);
            if (diferencaPrimeiraParcela > 0) {
                topicos.push(`<strong style="color: #d97706;">⚠️ Atenção:</strong> A primeira parcela do SAC é ${formatarMoeda(diferencaPrimeiraParcela)} maior que no PRICE.`);
            }
            topicos.push(`Ideal para quem pode pagar parcelas maiores no início e busca reduzir o custo total do financiamento.`);
        }
    } else {
        // Economia do SAC não é significativa -> PRICE é preferível
        sistemaRecomendado = 'PRICE';
        topicos.push(`Todas as <strong>${numeroParcelas}</strong> parcelas fixas em <strong>${formatarMoeda(primeiraParcelaPRICE)}</strong>.`);
        topicos.push(`Facilita o planejamento financeiro mensal com parcelas constantes.`);
        topicos.push(`A diferença total entre os sistemas é de apenas <strong>${formatarMoeda(Math.abs(economiaTotal))}</strong>, portanto previsibilidade pode compensar.`);
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

export function criarTabela(titulo, parcelas) {
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
