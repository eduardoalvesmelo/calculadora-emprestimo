# 🧮 Calculadora de Empréstimos Avançada

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-729B1B?style=for-the-badge&logo=vitest&logoColor=white)

Uma aplicação Full-Stack desenvolvida para a simulação de empréstimos sob o **regime de competência**. O sistema projeta detalhadamente o cronograma de parcelas, amortizações, e o provisionamento exato de juros (pró-rata) sobre o saldo devedor.

---

## 📑 Sumário
1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Arquitetura e Tecnologias](#-arquitetura-e-tecnologias)
3. [Regras de Negócio](#-regras-de-negócio)
4. [Como Executar](#-como-executar)
5. [Testes Automatizados](#-testes-automatizados)
6. [Documentação da API](#-documentação-da-api)

---

## 📖 Sobre o Projeto
O sistema substitui planilhas complexas de controle financeiro por uma interface web amigável e segura. Ele valida instantaneamente os dados de entrada (prazos, carências e taxas) e consulta um motor de cálculo back-end robusto para gerar o fluxo financeiro exato até a quitação do contrato.

`![Demonstração do Sistema](./docs/video1.gif)`

---

## 🛠️ Arquitetura e Tecnologias

A aplicação utiliza uma arquitetura **Client-Server** fortemente tipada e desacoplada.

### 🖥️ Front-end (`calculadora-emprestimo-ui`)
Focado na reatividade, UX/UI e validação instantânea:
* **Core:** React 18 + TypeScript + Vite.
* **Requisições:** Axios.
* **Estilização:** Tailwind CSS / CSS Inline com paleta Slate/Blue.
* **Testes:** Vitest + React Testing Library.

### ⚙️ Back-end (`calculadora-emprestimo-api`)
Motor de cálculo de alta precisão e exposição de endpoints:
* **Core:** Java 17 + Spring Boot 3.
* **Boilerplate:** Lombok.
* **Testes:** JUnit 5 + Mockito.
* **Documentação:** Springdoc OpenAPI (Swagger).

---

## 🧠 Regras de Negócio

* **Consistência de Datas:** A Data Final deve ser sempre maior que a Data Inicial. O Primeiro Pagamento não pode ocorrer fora deste intervalo.
* **Cálculo por Competência:** O sistema acumula frações de juros a cada virada de mês (juros acruados).
* **Amortização e Quitação:** No dia do pagamento, o sistema calcula os juros totais devidos até a data, abate o valor pago e aplica a amortização fixa sobre o **Saldo Principal**.

---

## 🚀 Como Executar

### Pré-requisitos
* **Java 17+**
* **Node.js 18+**

### 1. Rodando a API (Back-end)
```bash
# Entre na pasta da API
cd calculadora-emprestimo-api

# Execute o projeto com o Maven Wrapper
./mvnw spring-boot:run