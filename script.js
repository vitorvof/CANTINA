import {

collection,
addDoc,
getDocs,
query,
where,
doc,
updateDoc,
deleteDoc

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const db = window.db;



// =========================
// PEDIDOS
// =========================

function adicionarPedido(nome, preco){

    let pedidos = JSON.parse(
        localStorage.getItem("pedidos")
    ) || [];


    let itemExistente = pedidos.find(
        item => item.nome === nome
    );


    if(itemExistente){

        itemExistente.quantidade++;

    }else{

        pedidos.push({

            nome: nome,
            preco: preco,
            quantidade: 1

        });

    }


    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );

    atualizarCarrinhoFlutuante();

}



// =========================
// CARRINHO
// =========================

function atualizarCarrinhoFlutuante(){

    let pedidos = JSON.parse(
        localStorage.getItem("pedidos")
    ) || [];


    let quantidade = 0;

    let total = 0;


    pedidos.forEach((pedido) => {

        quantidade += pedido.quantidade;

        total +=
        pedido.preco * pedido.quantidade;

    });


    let carrinho =
    document.getElementById(
        "carrinho-info"
    );


    if(carrinho){

        carrinho.innerHTML =
        `🛒 ${quantidade} itens • R$ ${total}`;

    }

}



// =========================
// PEDIDOS PAGINA
// =========================

function carregarPedidos(){

    let pedidos = JSON.parse(
        localStorage.getItem("pedidos")
    ) || [];


    let lista =
    document.getElementById(
        "lista-pedidos"
    );


    let total = 0;


    if(!lista){
        return;
    }


    lista.innerHTML = "";


    pedidos.forEach((pedido, index) => {

        total +=
        pedido.preco * pedido.quantidade;


        lista.innerHTML += `

        <div class="card">

            <h3>${pedido.nome}</h3>

            <p>R$ ${pedido.preco}</p>

            <p>

                Quantidade:
                ${pedido.quantidade}

            </p>

            <p>

                Subtotal:
                R$ ${pedido.preco * pedido.quantidade}

            </p>

            <button
            onclick="removerPedido(${index})">

                Remover

            </button>

        </div>

        `;

    });


    let totalElemento =
    document.getElementById(
        "total"
    );


    if(totalElemento){

        totalElemento.innerText =
        `Total: R$ ${total}`;

    }

}



function removerPedido(index){

    let pedidos = JSON.parse(
        localStorage.getItem("pedidos")
    ) || [];


    pedidos.splice(index, 1);


    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );


    carregarPedidos();

    atualizarCarrinhoFlutuante();

}



// =========================
// FINALIZAR PEDIDO
// =========================


async function finalizarPedido(){

    let pedidos = JSON.parse(
        localStorage.getItem("pedidos")
    ) || [];

    if(pedidos.length === 0){

        alert("Carrinho vazio!");

        return;
    }

    let usuario = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if(!usuario){

        alert("Faça login primeiro!");

        return;
    }

    let total = 0;

    pedidos.forEach((item) => {

        total += item.preco * item.quantidade;

    });

    let numeroPedido = Math.floor(
        Math.random() * 90000
    ) + 10000;

    let formaPagamentoSelecionada =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );

    let pagamento = "PIX";

    if(formaPagamentoSelecionada){

        pagamento =
            formaPagamentoSelecionada.value;

    }

    let novoPedido = {

        numero: numeroPedido,

        usuario: usuario.nome,

        itens: pedidos,

        total: total.toFixed(2),

        pagamento: pagamento,

        status: "🟡 Em preparo"

    };

    try{

        await addDoc(
            collection(db, "pedidos"),
            novoPedido
        );

        localStorage.removeItem("pedidos");

        carregarPedidos();

        atualizarCarrinhoFlutuante();

        alert(
            `Pedido #${numeroPedido} realizado com sucesso!`
        );

    }catch(erro){

        console.log(erro);

        alert("Erro ao finalizar pedido");

    }

}


// =========================
// LOGIN
// =========================

async function cadastrarUsuario(){

    let nome =
    document.getElementById("nome").value;

    let email =
    document.getElementById("email").value;

    let senha =
    document.getElementById("senha").value;


    try{

        await addDoc(

            collection(db, "usuarios"),

            {

                nome: nome,
                email: email,
                senha: senha,
                tipo: "cliente"

            }

        );

        window.location.href =
        "login.html";

    }catch(erro){

        console.log(erro);

    }

}



async function loginUsuario(){

    let email =
    document.getElementById(
        "login-email"
    ).value;


    let senha =
    document.getElementById(
        "login-senha"
    ).value;


    const q = query(

        collection(db, "usuarios"),

        where("email", "==", email),

        where("senha", "==", senha)

    );


    const querySnapshot =
    await getDocs(q);


    if(!querySnapshot.empty){

        let usuarioEncontrado;


        querySnapshot.forEach((doc) => {

            usuarioEncontrado = doc.data();

        });


        localStorage.setItem(

            "usuarioLogado",

            JSON.stringify(usuarioEncontrado)

        );


        if(usuarioEncontrado.tipo === "admin"){

            window.location.href =
            "admin.html";

        }else{

            window.location.href =
            "index.html";

        }

    }else{

        alert("Login inválido");

    }

}



// =========================
// USUARIO LOGADO
// =========================

function mostrarUsuarioLogado(){

    let usuario = JSON.parse(
        localStorage.getItem(
            "usuarioLogado"
        )
    );


    let span =
    document.getElementById(
        "usuario-logado"
    );


    if(usuario && span){

        span.innerText =
        ` | Olá, ${usuario.nome}`;

    }

}
// =========================
// ADMIN PEDIDOS
// =========================

async function carregarPedidosAdmin(){

    let listaAtivos =
    document.getElementById(
        "lista-admin"
    );

    let listaFinalizados =
    document.getElementById(
        "lista-finalizados"
    );

    if(!listaAtivos){
        return;
    }

    listaAtivos.innerHTML = "";
    
    let emPreparo = 0;
    let prontos = 0;
    let finalizados = 0;

    if(listaFinalizados){

        listaFinalizados.innerHTML = "";

    }

    const querySnapshot =
    await getDocs(
        collection(db, "pedidos")
    );

    querySnapshot.forEach((docFirebase) => {

        let pedido =
        docFirebase.data();

        let id =
        docFirebase.id;

        let itensHTML = "";

        pedido.itens.forEach((item) => {

            itensHTML += `

            <p>

                ${item.quantidade}x
                ${item.nome}

            </p>

            `;

        });

        let card = `

        <div class="card-pedido">

            <h3>

                Pedido #${pedido.numero}

            </h3>

            <p>

                Cliente:
                ${pedido.usuario}

            </p>

            ${itensHTML}

            <p>

                Total:
                R$ ${pedido.total}

            </p>

            <select
class="status-select"
onchange="alterarStatus(
'${id}',
this.value
)">
                <option
                value="🟡 Em preparo"

                ${pedido.status ===
                "🟡 Em preparo"
                ? "selected" : ""}>

                    🟡 Em preparo

                </option>

                <option
                value="🟠 Pronto para Retirada"

                ${pedido.status ===
                "🟠 Pronto para Retirada"
                ? "selected" : ""}>

                    🟠 Pronto para Retirada

                </option>

                <option
                value="🟢 Entregue"

                ${pedido.status ===
                "🟢 Entregue"
                ? "selected" : ""}>

                    🟢 Entregue

                </option>

            </select>

        </div>

        `;

        if(pedido.status === "🟡 Em preparo"){
         emPreparo++;
         }

        if(pedido.status === "🟠 Pronto para Retirada"){
        prontos++;
        }

        if(pedido.status === "🟢 Entregue"){
        finalizados++;
        }
        if(
            pedido.status !==
            "🟢 Entregue"
        ){

            listaAtivos.innerHTML += card;

        }else{

            listaFinalizados.innerHTML += card;

document.getElementById("contador-preparo").innerText =
emPreparo;

document.getElementById("contador-prontos").innerText =
prontos;

document.getElementById("contador-finalizados").innerText =
finalizados;
        }

    });

}



async function alterarStatus(id, novoStatus){

    try{

        const pedidoRef =
        doc(db, "pedidos", id);

        await updateDoc(

            pedidoRef,

            {
                status: novoStatus
            }

        );

        carregarPedidosAdmin();

    }catch(erro){

        console.log(erro);

    }

}



// =========================
// HISTORICO
// =========================


async function carregarHistorico(){

    let usuario = JSON.parse(
        localStorage.getItem(
            "usuarioLogado"
        )
    );

    let lista =
    document.getElementById(
        "lista-historico"
    );

    if(!lista){
        return;
    }

    lista.innerHTML = "";

    const querySnapshot =
    await getDocs(
        collection(db, "pedidos")
    );

    querySnapshot.forEach((docFirebase) => {

        let pedido =
        docFirebase.data();

        if(
            usuario &&
            pedido.usuario === usuario.nome
        ){

            let itensHTML = "";

            pedido.itens.forEach((item) => {

                itensHTML += `

                <p>

                    ${item.quantidade}x
                    ${item.nome}

                </p>

                `;

            });

            lista.innerHTML += `

            <div class="card-pedido">

                <h3>

                    Pedido #${pedido.numero}

                </h3>

                ${itensHTML}

                <p>

                    💳 ${pedido.pagamento}

                </p>

                <p>

                    💰 Total:
                    R$ ${pedido.total}

                </p>

                <div class="status">

                    ${pedido.status}

                </div>

            </div>

            `;

        }

    });

}



// =========================
// PRODUTOS
// =========================

async function carregarProdutos(){

    const lista = document.getElementById(
        "lista-produtos"
    );

    if(!lista){
        return;
    }

    lista.innerHTML = "";

    try{

        const querySnapshot = await getDocs(
            collection(db, "produtos")
        );

        let contador = 0;

        querySnapshot.forEach((docFirebase) => {

            

            const produto = docFirebase.data();

            const id = docFirebase.id;

            lista.innerHTML += `

            <div class="card">

                <img src="${produto.imagem}">

                <h3>${produto.nome}</h3>

                <p>${produto.descricao}</p>

                <p class="preco-cardapio">

                    R$ ${produto.preco}

                </p>

               <div class="controle-cardapio">

    <button
    class="btn-menos"
    onclick='removerUm("${produto.nome}")'>

        -

    </button>

    <button
    onclick='adicionarPedido(
    "${produto.nome}",
    ${produto.preco}
    )'>

        Adicionar

    </button>

    <button
    class="btn-mais"
    onclick='adicionarPedido(
    "${produto.nome}",
    ${produto.preco}
    )'>

        +

    </button>

</div>
                ${JSON.parse(localStorage.getItem("usuarioLogado"))?.tipo === "admin"
                ? `
                <button
                class="btn-excluir"
                onclick="excluirProduto('${id}')">

                    Excluir

                </button>
                `
                : ""}

            </div>

            `;

        });

    }catch(erro){

        console.log(erro);

    }

}



// =========================
// CADASTRAR PRODUTO
// =========================

async function cadastrarProduto(){

    const nome =
    document.getElementById(
    "produto-nome").value;

    const preco =
    Number(
    document.getElementById(
    "produto-preco").value);

    const imagem =
    document.getElementById(
    "produto-imagem").value;

    const descricao =
    document.getElementById(
    "produto-descricao").value;


    await addDoc(
    collection(db, "produtos"), {

        nome: nome,
        preco: preco,
        imagem: imagem,
        descricao: descricao

    });

    alert("Produto cadastrado!");

    carregarProdutos();

}



// =========================
// EXCLUIR PRODUTO
// =========================

async function excluirProduto(id){

    let usuario = JSON.parse(
        localStorage.getItem(
            "usuarioLogado"
        )
    );

    if(!usuario || usuario.tipo !== "admin"){

        alert("Apenas admins podem excluir");

        return;

    }

    let confirmar = confirm(
        "Deseja excluir este produto?"
    );

    if(!confirmar){
        return;
    }

    try{

        await deleteDoc(
            doc(db, "produtos", id)
        );

        carregarProdutos();

    }catch(erro){

        console.log(erro);

    }

}



// =========================
// USUARIOS ADMIN
// =========================

async function carregarUsuarios(){

    let lista =
    document.getElementById(
        "lista-usuarios"
    );

    if(!lista){
        return;
    }

    lista.innerHTML = "";

    const querySnapshot =
    await getDocs(
        collection(db, "usuarios")
    );

    querySnapshot.forEach((docFirebase) => {

        let usuario =
        docFirebase.data();

        let id =
        docFirebase.id;

        lista.innerHTML += `

        <div class="card-pedido">

            <h3>${usuario.nome}</h3>

            <p>${usuario.email}</p>

            <p>

                Tipo:
                ${usuario.tipo}

            </p>

            <button
            onclick="alterarTipoUsuario(
            '${id}',
            '${usuario.tipo}'
            )">

                ${usuario.tipo === "admin"
                ? "Tornar Cliente"
                : "Tornar Admin"}

            </button>

        </div>

        `;

    });

}



async function alterarTipoUsuario(id, tipoAtual){

    let novoTipo =
    tipoAtual === "admin"
    ? "cliente"
    : "admin";

    try{

        await updateDoc(

            doc(db, "usuarios", id),

            {
                tipo: novoTipo
            }

        );

        carregarUsuarios();

    }catch(erro){

        console.log(erro);

    }

}



// =========================
// NAVBAR
// =========================

function verificarAdmin(){

    let usuario = JSON.parse(
        localStorage.getItem(
            "usuarioLogado"
        )
    );


    let linkAdmin =
    document.getElementById(
        "link-admin"
    );


    if(linkAdmin){

        if(usuario && usuario.tipo === "admin"){

            linkAdmin.style.display =
            "block";

        }else{

            linkAdmin.style.display =
            "none";

        }

    }

}



function verificarLoginNavbar(){

    let usuario = JSON.parse(
        localStorage.getItem(
            "usuarioLogado"
        )
    );

    let botaoLogout =
    document.querySelector(
        ".logout-btn"
    );

    if(botaoLogout){

        if(usuario){

            botaoLogout.style.display =
            "inline-block";

        }else{

            botaoLogout.style.display =
            "none";

        }

    }

}
function logout(){

    localStorage.removeItem(
        "usuarioLogado"
    );

    window.location.href =
    "login.html";

}
function aumentarQuantidade(index){

    let pedidos = JSON.parse(
        localStorage.getItem("pedidos")
    ) || [];

    pedidos[index].quantidade++;

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );

    carregarPedidos();

    atualizarCarrinhoFlutuante();

}
function diminuirQuantidade(index){

    let pedidos = JSON.parse(
        localStorage.getItem("pedidos")
    ) || [];

    if(pedidos[index].quantidade > 1){

        pedidos[index].quantidade--;

    }

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );

    carregarPedidos();

    atualizarCarrinhoFlutuante();

}


// =========================
// EXECUTAR
// =========================

carregarPedidos();

atualizarCarrinhoFlutuante();

mostrarUsuarioLogado();

carregarProdutos();

verificarAdmin();

verificarLoginNavbar();

carregarUsuarios();

carregarHistorico();

carregarPedidosAdmin();


// =========================
// WINDOW
// =========================
window.adicionarPedido = adicionarPedido;
window.finalizarPedido = finalizarPedido;
window.removerPedido = removerPedido;
window.aumentarQuantidade = aumentarQuantidade;
window.diminuirQuantidade = diminuirQuantidade;
window.cadastrarUsuario = cadastrarUsuario;
window.loginUsuario = loginUsuario;
window.logout = logout;
window.alterarStatus = alterarStatus;
window.cadastrarProduto = cadastrarProduto;
window.excluirProduto = excluirProduto;
window.alterarTipoUsuario = alterarTipoUsuario;