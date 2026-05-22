export interface EmprestimoRequest {
  dataInicial: string;
  dataFinal: string;
  primeiroPagamento: string;
  valorEmprestimo: number;
  taxaJuros: number;
}

export interface ParcelaResponse {
  dataCompetencia: string;
  valorEmprestimo: number;
  saldoDevedor: number;
  consolidada: string;
  totalParcela: number;
  amortizacao: number;
  principalSaldo: number;
  provisaoJuros: number;
  jurosAcumulados: number;
  jurosPagos: number;
}