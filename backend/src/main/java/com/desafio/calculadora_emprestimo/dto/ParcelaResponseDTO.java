package com.desafio.calculadora_emprestimo.dto;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ParcelaResponseDTO {
    private LocalDate dataCompetencia;
    private Double valorEmprestimo;
    private Double saldoDevedor;
    private String consolidada;
    private Double totalParcela;
    private Double amortizacao;
    private Double principalSaldo;
    private Double provisaoJuros;
    private Double jurosAcumulados;
    private Double jurosPagos;
}