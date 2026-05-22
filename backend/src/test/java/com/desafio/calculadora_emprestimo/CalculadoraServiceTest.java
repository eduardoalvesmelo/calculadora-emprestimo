package com.desafio.calculadora_emprestimo;

import com.desafio.calculadora_emprestimo.dto.EmprestimoRequestDTO;
import com.desafio.calculadora_emprestimo.dto.ParcelaResponseDTO;
import com.desafio.calculadora_emprestimo.service.CalculadoraService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CalculadoraServiceTest {

    private CalculadoraService calculadoraService;

    @BeforeEach
    void setUp() {
        calculadoraService = new CalculadoraService();
    }

    @Test
    @DisplayName("Deve gerar o cronograma de parcelas e saldos corretamente para um cenário padrão")
    void deveCalcularEmprestimoComSucesso() {
        EmprestimoRequestDTO request = new EmprestimoRequestDTO();
        request.setDataInicial(LocalDate.of(2024, 1, 2));
        request.setDataFinal(LocalDate.of(2024, 3, 31));
        request.setPrimeiroPagamento(LocalDate.of(2024, 2, 15));
        request.setValorEmprestimo(10000.00);
        request.setTaxaJuros(1.5);

        List<ParcelaResponseDTO> resultado = calculadoraService.calcular(request);

        assertNotNull(resultado);
        assertFalse(resultado.isEmpty());

        ParcelaResponseDTO linhaAbertura = resultado.get(0);
        assertEquals(LocalDate.of(2024, 1, 2), linhaAbertura.getDataCompetencia());
        assertEquals(10000.00, linhaAbertura.getSaldoDevedor());

        ParcelaResponseDTO fimDeMesJan = resultado.stream()
                .filter(p -> p.getDataCompetencia().equals(LocalDate.of(2024, 1, 31)))
                .findFirst()
                .orElseThrow();
        assertEquals(10000.00, fimDeMesJan.getSaldoDevedor());
    }

    @Test
    @DisplayName("Deve tratar a pegadinha do dia 31 movendo o vencimento para o último dia do mês menor")
    void deveTratarPegadinhaDoDia31() {
        EmprestimoRequestDTO request = new EmprestimoRequestDTO();
        request.setDataInicial(LocalDate.of(2024, 1, 1));
        request.setDataFinal(LocalDate.of(2024, 4, 30));
        request.setPrimeiroPagamento(LocalDate.of(2024, 1, 31));
        request.setValorEmprestimo(15000.00);
        request.setTaxaJuros(2.0);

        List<ParcelaResponseDTO> resultado = calculadoraService.calcular(request);

        boolean existeParcelaFevereiroBissexto = resultado.stream()
                .anyMatch(p -> p.getDataCompetencia().equals(LocalDate.of(2024, 2, 29)));

        assertTrue(existeParcelaFevereiroBissexto);
    }
}