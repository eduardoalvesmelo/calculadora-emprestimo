package com.desafio.calculadora_emprestimo.dto;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmprestimoRequestDTO {
    private LocalDate dataInicial;
    private LocalDate dataFinal;
    private LocalDate primeiroPagamento;
    private Double valorEmprestimo;
    private Double taxaJuros;
}