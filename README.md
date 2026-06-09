# 🍔 Sistema Web de Gerenciamento de Pedidos - Cantina FATEC

Sistema desenvolvido como Projeto de Extensão Curricularizado da FATEC com o objetivo de modernizar o processo de pedidos em cantinas escolares através de uma plataforma web integrada ao Firebase.

---

## 📋 Sobre o Projeto

O projeto surgiu da necessidade de reduzir filas e melhorar o atendimento na cantina da instituição.

A solução desenvolvida permite que os alunos realizem seus pedidos online, acompanhem o status em tempo real e consultem o histórico de compras, enquanto os administradores possuem um painel para gerenciamento dos pedidos e produtos.

---

## 🎯 Objetivos

- Reduzir filas nos horários de intervalo;
- Melhorar a experiência dos alunos;
- Automatizar o gerenciamento de pedidos;
- Centralizar informações em um banco de dados na nuvem;
- Facilitar o controle administrativo da cantina.

---

## 🚀 Funcionalidades

### 👨‍🎓 Área do Cliente

- Cadastro de usuários;
- Login e autenticação;
- Visualização do cardápio digital;
- Adição de produtos ao carrinho;
- Finalização de pedidos;
- Consulta ao histórico de pedidos;
- Acompanhamento do status do pedido.

### 👨‍💼 Área Administrativa

- Gerenciamento de pedidos;
- Atualização de status dos pedidos;
- Cadastro e manutenção de produtos;
- Controle de usuários;
- Visualização dos pedidos finalizados.

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Função |
|------------|---------|
| HTML5 | Estrutura da aplicação |
| CSS3 | Estilização e responsividade |
| JavaScript | Regras de negócio |
| Firebase Authentication | Autenticação de usuários |
| Cloud Firestore | Banco de dados NoSQL |
| Firebase Hosting | Hospedagem da aplicação |

---

## 🏗 Arquitetura do Sistema

```text
Usuário
   ↓
Interface Web
(HTML + CSS + JavaScript)
   ↓
Firebase Authentication
   ↓
Cloud Firestore
   ↓
Painel Administrativo
```

---

## 🗄 Estrutura do Banco de Dados

### Coleção: Usuarios

```json
{
  "nome": "Vitor Franco",
  "email": "usuario@email.com",
  "role": "cliente"
}
```

### Coleção: Produtos

```json
{
  "nome": "Coxinha",
  "preco": 8.50,
  "descricao": "Coxinha de frango",
  "imagem": "url_da_imagem"
}
```

### Coleção: Pedidos

```json
{
  "cliente": "Vitor Franco",
  "total": 18.00,
  "status": "Em preparo",
  "data": "2025-05-30"
}
```

---

## 🔥 Integração com Firebase

### Inicialização do Firebase

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "cantina-fatec.firebaseapp.com",
  projectId: "cantina-fatec",
  storageBucket: "cantina-fatec.firebasestorage.app",
  messagingSenderId: "667107364749",
  appId: "1:667107364749:web:29ef8d1693acae744977c4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

### Cadastro de Pedido

```javascript
await addDoc(collection(db, "pedidos"), {
  cliente: nomeCliente,
  itens: carrinho,
  total: valorTotal,
  status: "Em preparo",
  data: new Date()
});
```

### Atualização de Status

```javascript
await updateDoc(doc(db, "pedidos", pedidoId), {
  status: "Pronto"
});
```

---

## 📸 Telas do Sistema

### 🏠 Home

- Página inicial da aplicação;
- Navegação principal do sistema;
- Acesso ao cardápio e autenticação.

### 🍔 Cardápio

- Produtos cadastrados dinamicamente;
- Integração com Firebase;
- Carrinho de compras.

### 🛒 Pedidos

- Controle dos itens selecionados;
- Cálculo automático do valor total;
- Finalização do pedido.

### 📜 Histórico

- Consulta de pedidos anteriores;
- Acompanhamento de status.

### ⚙️ Painel Administrativo

- Controle de pedidos;
- Alteração de status;
- Cadastro de novos produtos;
- Gestão da operação.

---

## ✅ Testes Realizados

| Funcionalidade | Status |
|---------------|---------|
| Cadastro de Usuários | ✅ |
| Login | ✅ |
| Cardápio Dinâmico | ✅ |
| Carrinho de Compras | ✅ |
| Finalização de Pedidos | ✅ |
| Histórico de Pedidos | ✅ |
| Painel Administrativo | ✅ |
| Alteração de Status | ✅ |

---

## 📈 Resultados Obtidos

- Redução das filas na cantina;
- Melhor organização dos pedidos;
- Centralização das informações;
- Facilidade de gerenciamento;
- Melhor experiência para os usuários.

---

## 🔮 Melhorias Futuras

- Integração com PIX;
- Notificações em tempo real;
- Aplicativo mobile;
- Relatórios gerenciais;
- Controle de estoque;
- Dashboard analítico.

---

## 👥 Equipe

| Integrante | Responsabilidade |
|------------|-----------------|
| Vitor Franco | Desenvolvimento Front-end, Firebase e Integrações |
| Julio | Testes e Validação |
| Thiago | Banco de Dados |
| Rayssa | Documentação |
| Stella | Levantamento de Requisitos |
| Marlon | Revisão e Apoio Geral |

---

## 🎓 Instituição

**Faculdade de Tecnologia do Estado de São Paulo (FATEC)**

Curso de **INFORMATICA PARA NEGOCIOS**

Projeto de Extensão Curricularizado – 2025

---

## ⭐ Contribuição

Caso queira contribuir com melhorias:

```bash
git clone https://github.com/seu-usuario/cantina-fatec.git
```

```bash
cd cantina-fatec
```

Abra o projeto em seu editor favorito e execute localmente.

---

## 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos.

---

⭐ Se este projeto foi útil para você, deixe uma estrela no repositório!
