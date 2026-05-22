import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';
import { describe, test, expect, beforeEach, vi } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as any;

describe('Calculadora de Empréstimos - Front-end', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Deve renderizar o formulário com os valores padrões inicializados', () => {
    render(<App />);
    
    expect(screen.getByText(/Calculadora de Empréstimos/i)).toBeInTheDocument();
    
    expect(screen.getByLabelText(/Data Inicial/i)).toHaveValue('2024-01-01');
    expect(screen.getByLabelText(/Data Final/i)).toHaveValue('2034-01-01');
    expect(screen.getByLabelText(/Primeiro Pagamento/i)).toHaveValue('2024-02-15');
    expect(screen.getByLabelText(/Valor do Empréstimo/i)).toHaveValue(140000);
    expect(screen.getByLabelText(/Taxa de Juros/i)).toHaveValue(7);
  });

  test('Deve exibir mensagem de erro se a Data Final for menor ou igual à Data Inicial', () => {
    render(<App />);
    
    const inputDataInicial = screen.getByLabelText(/Data Inicial/i);
    const inputDataFinal = screen.getByLabelText(/Data Final/i);

    fireEvent.change(inputDataInicial, { target: { value: '2024-05-10' } });
    fireEvent.change(inputDataFinal, { target: { value: '2024-01-01' } });

    expect(screen.getByText(/A data final deve ser maior que a data inicial/i)).toBeInTheDocument();
    
    const botao = screen.getByRole('button', { name: /Calcular Simulação/i });
    expect(botao).toBeDisabled();
  });

  test('Deve exibir mensagem de erro se o Primeiro Pagamento estiver fora do intervalo do contrato', () => {
    render(<App />);
    
    const inputPrimeiroPgto = screen.getByLabelText(/Primeiro Pagamento/i);
    fireEvent.change(inputPrimeiroPgto, { target: { value: '2023-12-25' } });

    expect(screen.getByText(/O primeiro pagamento deve estar entre a data inicial e a data final/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calcular Simulação/i })).toBeDisabled();
  });

  test('Deve disparar a requisição da API e renderizar a tabela de resultados após o clique com sucesso', async () => {
    const mockResultadoApi = [
      {
        dataCompetencia: '2024-01-01',
        valorEmprestimo: 140000.0,
        saldoDevedor: 140000.0,
        consolidada: '',
        totalParcela: 0.0,
        amortizacao: 0.0,
        principalSaldo: 140000.0,
        provisaoJuros: 0.0,
        jurosAcumulados: 0.0,
        jurosPagos: 0.0,
      }
    ];

    mockedAxios.post.mockResolvedValueOnce({ data: mockResultadoApi });

    render(<App />);
    
    const botaoCalcular = screen.getByRole('button', { name: /Calcular Simulação/i });
    fireEvent.click(botaoCalcular);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8080/api/calculadora/calcular',
      expect.any(Object)
    );

    // CORREÇÃO: Alvo explícito nas células da tabela (th) para ignorar os inputs e títulos do topo
    await waitFor(() => {
      const cabecalhoEmprestimo = screen.getByRole('columnheader', { name: /^Empréstimo$/ });
      const cabecalhoParcela = screen.getByRole('columnheader', { name: /^Parcela$/ });
      
      expect(cabecalhoEmprestimo).toBeInTheDocument();
      expect(cabecalhoParcela).toBeInTheDocument();
    });
  });
});