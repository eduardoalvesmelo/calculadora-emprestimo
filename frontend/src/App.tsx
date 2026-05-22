import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EmprestimoRequest, ParcelaResponse } from './types/Calculadora';

export default function App() {
  const [formData, setFormData] = useState<EmprestimoRequest>({
    dataInicial: '2024-01-01',
    dataFinal: '2034-01-01',
    primeiroPagamento: '2024-02-15',
    valorEmprestimo: 140000,
    taxaJuros: 7.0,
  });

  const [resultado, setResultado] = useState<ParcelaResponse[]>([]);
  const [erro, setErro] = useState<string>('');
  const [botaoHabilitado, setBotaoHabilitado] = useState<boolean>(false);

  useEffect(() => {
    const { dataInicial, dataFinal, primeiroPagamento, valorEmprestimo, taxaJuros } = formData;

    if (!dataInicial || !dataFinal || !primeiroPagamento || !valorEmprestimo || !taxaJuros) {
      setBotaoHabilitado(false);
      return;
    }

    const dInicial = new Date(dataInicial);
    const dFinal = new Date(dataFinal);
    const dPagamento = new Date(primeiroPagamento);

    const validaDataFinal = dFinal > dInicial;
    const validaPagamento = dPagamento > dInicial && dPagamento <= dFinal;

    if (validaDataFinal && validaPagamento) {
      setBotaoHabilitado(true);
      setErro('');
    } else {
      setBotaoHabilitado(false);
      if (dataFinal && !validaDataFinal) {
        setErro('A data final deve ser maior que a data inicial.');
      } else if (primeiroPagamento && !validaPagamento) {
        setErro('O primeiro pagamento deve estar entre a data inicial e a data final.');
      }
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valorEmprestimo' || name === 'taxaJuros' ? Number(value) : value,
    }));
  };

  const handleCalcular = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<ParcelaResponse[]>('http://localhost:8080/api/calculadora/calcular', formData);
      setResultado(response.data);
      setErro('');
    } catch (err: any) {
      setErro(err.response?.data || 'Erro de conexão com o servidor Back-end.');
    }
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: '#334155', 
    border: '1px solid #475569',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#ffffff', 
    outline: 'none',
    boxSizing: 'border-box',
    height: '38px',
    fontWeight: '500'
  };

  return (
    <div style={{ padding: '20px', fontFamily: '"Segoe UI", -apple-system, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
      
      <div style={{ marginBottom: '20px', width: '100%' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#0f172a', margin: '0' }}>Calculadora de Empréstimos</h1>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Simulação avançada com cronograma de competências e provisões</p>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px 20px', border: '1px solid #e2e8f0', marginBottom: '20px', width: '100%', boxSizing: 'border-box' }}>
        <form onSubmit={handleCalcular} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', alignItems: 'flex-end' }}>
          
          <div>
            <label htmlFor="dataInicial" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Data Inicial</label>
            <input id="dataInicial" type="date" name="dataInicial" value={formData.dataInicial} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label htmlFor="dataFinal" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Data Final</label>
            <input id="dataFinal" type="date" name="dataFinal" value={formData.dataFinal} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label htmlFor="primeiroPagamento" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Primeiro Pagamento</label>
            <input id="primeiroPagamento" type="date" name="primeiroPagamento" value={formData.primeiroPagamento} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label htmlFor="valorEmprestimo" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Valor do Empréstimo</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '12px', color: '#94a3b8', fontSize: '13px', fontWeight: '500', zIndex: 2 }}>R$</span>
              <input id="valorEmprestimo" type="number" name="valorEmprestimo" value={formData.valorEmprestimo} onChange={handleChange} style={{ ...inputStyle, paddingLeft: '34px' }} />
            </div>
          </div>

          <div>
            <label htmlFor="taxaJuros" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Taxa de Juros</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input id="taxaJuros" type="number" step="0.01" name="taxaJuros" value={formData.taxaJuros} onChange={handleChange} style={{ ...inputStyle, paddingRight: '28px' }} />
              <span style={{ position: 'absolute', right: '12px', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>%</span>
            </div>
          </div>

          <div>
            <button type="submit" disabled={!botaoHabilitado} style={{ width: '100%', padding: '0', backgroundColor: botaoHabilitado ? '#1e40af' : '#cbd5e1', color: botaoHabilitado ? '#ffffff' : '#94a3b8', border: 'none', borderRadius: '6px', cursor: botaoHabilitado ? 'pointer' : 'not-allowed', height: '38px', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' }}>
              Calcular Simulação
            </button>
          </div>
        </form>
        {erro && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '10px', fontWeight: '500' }}>{erro}</div>}
      </div>

      {resultado.length > 0 && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: '#334155', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ backgroundColor: '#2f5597', color: '#ffffff', height: '32px' }}>
                <th colSpan={3} style={{ border: '1px solid #2563eb', padding: '4px', fontWeight: '600', textAlign: 'center', fontSize: '12px' }}>Empréstimo</th>
                <th colSpan={2} style={{ border: '1px solid #2563eb', padding: '4px', fontWeight: '600', textAlign: 'center', fontSize: '12px' }}>Parcela</th>
                <th colSpan={2} style={{ border: '1px solid #2563eb', padding: '4px', fontWeight: '600', textAlign: 'center', fontSize: '12px' }}>Principal</th>
                <th colSpan={3} style={{ border: '1px solid #2563eb', padding: '4px', fontWeight: '600', textAlign: 'center', fontSize: '12px' }}>Juros</th>
              </tr>
              <tr style={{ backgroundColor: '#4582b5', color: '#ffffff', height: '30px' }}>
                <th style={{ border: '1px solid #60a5fa', padding: '4px', fontWeight: '600', textAlign: 'center', width: '11%' }}>Data Competência</th>
                <th style={{ border: '1px solid #60a5fa', padding: '4px', fontWeight: '500', textAlign: 'center', width: '11%' }}>Valor de empréstimo</th>
                <th style={{ border: '1px solid #60a5fa', padding: '4px', fontWeight: '500', textAlign: 'center', width: '11%' }}>Saldo Devedor</th>
                <th style={{ border: '1px solid #60a5fa', padding: '4px', fontWeight: '500', textAlign: 'center', width: '8%' }}>Consolidada</th>
                <th style={{ border: '1px solid #60a5fa', padding: '4px', fontWeight: '500', textAlign: 'center', width: '9%' }}>Total</th>
                <th style={{ border: '1px solid #60a5fa', padding: '4px', fontWeight: '500', textAlign: 'center', width: '9%' }}>Amortização</th>
                <th style={{ border: '1px solid #60a5fa', padding: '4px', fontWeight: '500', textAlign: 'center', width: '11%' }}>Saldo</th>
                <th style={{ border: '1px solid #60a5fa', padding: '4px', fontWeight: '500', textAlign: 'center', width: '10%' }}>Provisão</th>
                <th style={{ border: '1px solid #60a5fa', padding: '4px', fontWeight: '500', textAlign: 'center', width: '10%' }}>Acumulado</th>
                <th style={{ border: '1px solid #60a5fa', padding: '4px', fontWeight: '500', textAlign: 'center', width: '10%' }}>Pago</th>
              </tr>
            </thead>
            <tbody>
              {resultado.map((linha, index) => {
                const possuiPagamento = linha.totalParcela > 0;
                return (
                  <tr key={index} style={{ height: '28px', backgroundColor: possuiPagamento ? '#f0fdf4' : index % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ border: '1px solid #e2e8f0', textAlign: 'center', padding: '4px 6px', fontWeight: '600', color: '#0f172a' }}>
                      {new Date(linha.dataCompetencia).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </td>
                    <td style={{ border: '1px solid #e2e8f0', textAlign: 'right', padding: '4px 6px', color: linha.valorEmprestimo > 0 ? '#0f172a' : '#94a3b8' }}>
                      {linha.valorEmprestimo > 0 ? formatarMoeda(linha.valorEmprestimo) : '0,00'}
                    </td>
                    <td style={{ border: '1px solid #e2e8f0', textAlign: 'right', padding: '4px 6px', fontWeight: '500' }}>
                      {formatarMoeda(linha.saldoDevedor)}
                    </td>
                    <td style={{ border: '1px solid #e2e8f0', textAlign: 'center', padding: '4px 4px', fontWeight: '600', color: '#1e3a8a' }}>
                      {linha.consolidada || '-'}
                    </td>
                    <td style={{ border: '1px solid #e2e8f0', textAlign: 'right', padding: '4px 6px', fontWeight: possuiPagamento ? '700' : '400', color: possuiPagamento ? '#166534' : '#0f172a' }}>
                      {formatarMoeda(linha.totalParcela)}
                    </td>
                    <td style={{ border: '1px solid #e2e8f0', textAlign: 'right', padding: '4px 6px' }}>
                      {formatarMoeda(linha.amortizacao)}
                    </td>
                    <td style={{ border: '1px solid #e2e8f0', textAlign: 'right', padding: '4px 6px' }}>
                      {formatarMoeda(linha.principalSaldo)}
                    </td>
                    <td style={{ border: '1px solid #e2e8f0', textAlign: 'right', padding: '4px 6px', color: '#475569' }}>
                      {formatarMoeda(linha.provisaoJuros)}
                    </td>
                    <td style={{ border: '1px solid #e2e8f0', textAlign: 'right', padding: '4px 6px', color: linha.jurosAcumulados > 0 ? '#dc2626' : '#475569' }}>
                      {formatarMoeda(linha.jurosAcumulados)}
                    </td>
                    <td style={{ border: '1px solid #e2e8f0', textAlign: 'right', padding: '4px 6px', fontWeight: linha.jurosPagos > 0 ? '600' : '400', color: linha.jurosPagos > 0 ? '#15803d' : '#475569' }}>
                      {formatarMoeda(linha.jurosPagos)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}