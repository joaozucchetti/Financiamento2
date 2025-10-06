import { formatarMoeda } from './utils.js';

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

export { criarCardsComparacao };