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

---

## 📖 Sobre o Projeto
O sistema substitui planilhas complexas de controle financeiro por uma interface web amigável e segura. Ele valida instantaneamente os dados de entrada (prazos, carências e taxas) e consulta um motor de cálculo back-end robusto para gerar o fluxo financeiro exato até a quitação do contrato.

<img width="832" height="322" alt="video1" src="https://github.com/user-attachments/assets/1f3d804d-4780-4e18-a4ca-f93d76feaeaa" />

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
A API ficará disponível em http://localhost:8080.
````
### 2. Rodando a Interface (Front-end)
Abra um novo terminal e execute:

Bash
# Entre na pasta do front-end
cd calculadora-emprestimo-ui

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
A aplicação ficará disponível no navegador (geralmente em http://localhost:5173).

## 🧪 Testes Automatizados
O front-end possui uma suíte de testes de comportamento (E2E e Unitários) configurada com Vitest para garantir a integridade da UI sem depender do back-end ligado.

Os testes validam:

Renderização correta dos inputs padrão.

Bloqueio dinâmico ao inserir datas inválidas no contrato.

Bloqueio dinâmico para períodos de carência inconsistentes.

Chamada correta da API e renderização estruturada da tabela de resultados.

Para rodar os testes:

Bash
````
cd calculadora-emprestimo-ui
npm run test
````
# Algumas imagens
<img width="1165" height="920" alt="tela funcionando" src="https://github.com/user-attachments/assets/60ee69f6-e2a6-4b50-8473-2ec5e4fc29e2" />
<img width="863" height="349" alt="testes unitarios frontend" src="https://github.com/user-attachments/assets/857f221a-4b6d-4522-abe8-b5960cfca723" />
<img width="1747" height="337" alt="testes unitarios backend" src="https://github.com/user-attachments/assets/2bd3d036-c683-4ca7-91d1-2069f461afdd" />
