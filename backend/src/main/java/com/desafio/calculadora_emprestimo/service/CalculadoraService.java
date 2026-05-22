package com.desafio.calculadora_emprestimo.service;

import com.desafio.calculadora_emprestimo.dto.EmprestimoRequestDTO;
import com.desafio.calculadora_emprestimo.dto.ParcelaResponseDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class CalculadoraService {

    public List<ParcelaResponseDTO> calcular(EmprestimoRequestDTO request) {
        List<ParcelaResponseDTO> grid = gerarCronogramaDatas(request);
        
        double valorInicial = request.getValorEmprestimo();
        double taxaJurosExibida = request.getTaxaJuros() / 100.0; 
        
        long totalParcelas = contarParcelasNoPeriodo(grid, request.getPrimeiroPagamento(), request.getDataFinal());
        double valorAmortizacaoFixa = valorInicial / (totalParcelas > 0 ? totalParcelas : 1);
        
        
        ParcelaResponseDTO inicial = grid.get(0);
        inicial.setValorEmprestimo(valorInicial);
        inicial.setSaldoDevedor(valorInicial);
        inicial.setPrincipalSaldo(valorInicial);
        inicial.setTotalParcela(0.0);
        inicial.setAmortizacao(0.0);
        inicial.setProvisaoJuros(0.0);
        inicial.setJurosAcumulados(0.0);
        inicial.setJurosPagos(0.0);
        inicial.setConsolidada("");

        double saldoDevedorAtual = valorInicial;
        double jurosAcumuladosControle = 0.0;
        int numeroParcela = 0;

        
        for (int i = 1; i < grid.size(); i++) {
            ParcelaResponseDTO anterior = grid.get(i - 1);
            ParcelaResponseDTO atual = grid.get(i);
            
            
            long diasCorridos = ChronoUnit.DAYS.between(anterior.getDataCompetencia(), atual.getDataCompetencia());
            
            double baseCalculoJuros = saldoDevedorAtual + jurosAcumuladosControle;
            double provisaoLinha = baseCalculoJuros * (Math.pow(taxaJurosExibida + 1.0, (double) diasCorridos / 360.0) - 1.0);
            provisaoLinha = arredondar(provisaoLinha);
            
            jurosAcumuladosControle += provisaoLinha;
            
            atual.setValorEmprestimo(0.0);
            atual.setProvisaoJuros(provisaoLinha);
            
            if (eDataDeParcela(atual.getDataCompetencia(), request.getPrimeiroPagamento(), request.getDataFinal())) {
                numeroParcela++;
                atual.setConsolidada(numeroParcela + "/" + totalParcelas);
                
                double amortizacao = arredondar(valorAmortizacaoFixa);
                if (numeroParcela == totalParcelas || amortizacao > saldoDevedorAtual) {
                    amortizacao = saldoDevedorAtual;
                }
                
                double jurosPagos = arredondar(jurosAcumuladosControle);
                double totalParcela = arredondar(amortizacao + jurosPagos);
                
                saldoDevedorAtual = arredondar(saldoDevedorAtual - amortizacao);
                
                atual.setAmortizacao(amortizacao);
                atual.setJurosPagos(jurosPagos);
                
                jurosAcumuladosControle = 0.0; 
                atual.setJurosAcumulados(0.0);
                
                atual.setTotalParcela(totalParcela);
                atual.setSaldoDevedor(saldoDevedorAtual);
                atual.setPrincipalSaldo(saldoDevedorAtual);
            } else {
                atual.setConsolidada("");
                atual.setAmortizacao(0.0);
                atual.setJurosPagos(0.0);
                atual.setJurosAcumulados(arredondar(jurosAcumuladosControle));
                atual.setTotalParcela(0.0);
                
                atual.setSaldoDevedor(arredondar(saldoDevedorAtual)); 
                atual.setPrincipalSaldo(arredondar(saldoDevedorAtual));
            }
        }
        return grid;
    }

    private List<ParcelaResponseDTO> gerarCronogramaDatas(EmprestimoRequestDTO request) {
        List<ParcelaResponseDTO> cronograma = new ArrayList<>();
        
        ParcelaResponseDTO pInicial = new ParcelaResponseDTO();
        pInicial.setDataCompetencia(request.getDataInicial());
        cronograma.add(pInicial);
        
        LocalDate dataGrid = request.getDataInicial();
        LocalDate primeiroPgto = request.getPrimeiroPagamento();
        LocalDate dataFinal = request.getDataFinal();
        
        while (dataGrid.isBefore(dataFinal)) {
            LocalDate fimMes = dataGrid.withDayOfMonth(dataGrid.lengthOfMonth());
            if (fimMes.isAfter(dataFinal)) break;
            
            if (fimMes.isAfter(dataGrid) && !fimMes.equals(dataFinal)) {
                final LocalDate fMes = fimMes;
                if (cronograma.stream().noneMatch(p -> p.getDataCompetencia().equals(fMes))) {
                    ParcelaResponseDTO pFim = new ParcelaResponseDTO();
                    pFim.setDataCompetencia(fimMes);
                    cronograma.add(pFim);
                }
            }
            dataGrid = fimMes.plusDays(1);
        }
        
        LocalDate dataPgto = primeiroPgto;
        while (!dataPgto.isAfter(dataFinal)) {
            final LocalDate dataVerificar = dataPgto;
            boolean jaExiste = cronograma.stream().anyMatch(p -> p.getDataCompetencia().equals(dataVerificar));
            if (!jaExiste) {
                ParcelaResponseDTO pPgto = new ParcelaResponseDTO();
                pPgto.setDataCompetencia(dataPgto);
                cronograma.add(pPgto);
            }
            dataPgto = dataPgto.plusMonths(1);
        }
        
        final LocalDate dFinal = dataFinal;
        if (cronograma.stream().noneMatch(p -> p.getDataCompetencia().equals(dFinal))) {
            ParcelaResponseDTO pFinal = new ParcelaResponseDTO();
            pFinal.setDataCompetencia(dataFinal);
            cronograma.add(pFinal);
        }
        
        cronograma.sort((p1, p2) -> p1.getDataCompetencia().compareTo(p2.getDataCompetencia()));
        return cronograma;
    }

    private long contarParcelasNoPeriodo(List<ParcelaResponseDTO> grid, LocalDate primeiroPgto, LocalDate dataFinal) {
        return grid.stream().filter(p -> eDataDeParcela(p.getDataCompetencia(), primeiroPgto, dataFinal)).count();
    }

    private boolean eDataDeParcela(LocalDate data, LocalDate primeiroPgto, LocalDate dataFinal) {
        if (data.equals(dataFinal)) return true;
        if (data.isBefore(primeiroPgto)) return false;
        return data.getDayOfMonth() == primeiroPgto.getDayOfMonth();
    }

    private double arredondar(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}