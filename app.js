// --- 1. CONFIGURAÇÃO DO SUPABASE ---
const supabaseUrl = 'https://ssrrbjmrwujvpllcxnjx.supabase.co';
const supabaseKey = 'sb_publishable_wikZhbQKoPXtFH7bmZIi4g_Oc_zMdQo';

// MUDANÇA CRÍTICA: Nome alterado para clienteSupabase para evitar conflito com a CDN
const clienteSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- 2. NAVEGAÇÃO MOBILE CORRIGIDA ---
function mudarAba(idAba, titulo, btnElement) {
    document.querySelectorAll('.screen').forEach(tela => tela.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(idAba).classList.add('active');
    document.getElementById('page-title').innerText = titulo;
    
    if(btnElement) btnElement.classList.add('active');
}

// --- 3. LÓGICA COM ANIMAÇÃO ---
async function salvarProduto(btnElement) {
    const nomeInput = document.getElementById('nome-produto');
    const nome = nomeInput.value.trim();
    
    if(!nome) return alert('Digite o nome do produto');

    const textoOriginal = btnElement.innerText;
    btnElement.innerText = '⏳ Salvando...';
    btnElement.disabled = true;

    // Usando a nova variável clienteSupabase
    const { error } = await clienteSupabase.from('produtos').insert([{ nome: nome }]);
    
    if (error) {
        console.error("Erro Supabase:", error);
        alert('Erro ao salvar produto: ' + error.message);
        btnElement.innerText = textoOriginal;
        btnElement.disabled = false;
    } else {
        btnElement.innerText = '✅ Salvo!';
        btnElement.classList.add('sucesso');
        nomeInput.value = ''; 
        
        setTimeout(() => {
            btnElement.innerText = textoOriginal;
            btnElement.disabled = false;
            btnElement.classList.remove('sucesso');
        }, 2000);
    }
}

async function salvarMercado(btnElement) {
    const nomeInput = document.getElementById('nome-mercado');
    const nome = nomeInput.value.trim();
    
    if(!nome) return alert('Digite o nome do mercado');

    const textoOriginal = btnElement.innerText;
    btnElement.innerText = '⏳ Salvando...';
    btnElement.disabled = true;

    // Usando a nova variável clienteSupabase
    const { error } = await clienteSupabase.from('mercados').insert([{ nome: nome }]);
    
    if (error) {
        console.error("Erro Supabase:", error);
        alert('Erro ao salvar mercado: ' + error.message);
        btnElement.innerText = textoOriginal;
        btnElement.disabled = false;
    } else {
        btnElement.innerText = '✅ Salvo!';
        btnElement.classList.add('sucesso');
        nomeInput.value = ''; 
        
        setTimeout(() => {
            btnElement.innerText = textoOriginal;
            btnElement.disabled = false;
            btnElement.classList.remove('sucesso');
        }, 2000);
    }
}

// Obs: As funções salvarPromocao(), adicionarItemCesta() e finalizarCompra()
// serão adicionadas no próximo passo, assim que essa conexão inicial brilhar verde!

// ==========================================
// --- 4. CARREGAMENTO DE LISTAS (DROPDOWNS) ---
// ==========================================
async function carregarListas() {
    // Busca Produtos
    const { data: produtos } = await clienteSupabase.from('produtos').select('*').order('nome');
    const promoProd = document.getElementById('promo-produto');
    const compraProd = document.getElementById('compra-produto');
    
    let htmlProd = '<option value="">Selecione o Produto...</option>';
    if (produtos) {
        produtos.forEach(p => htmlProd += `<option value="${p.id}">${p.nome}</option>`);
    }
    promoProd.innerHTML = htmlProd;
    compraProd.innerHTML = htmlProd;

    // Busca Mercados
    const { data: mercados } = await clienteSupabase.from('mercados').select('*').order('nome');
    const promoMerc = document.getElementById('promo-mercado');
    const compraMerc = document.getElementById('compra-mercado');
    
    let htmlMerc = '<option value="">Selecione o Mercado...</option>';
    if (mercados) {
        mercados.forEach(m => htmlMerc += `<option value="${m.id}">${m.nome}</option>`);
    }
    promoMerc.innerHTML = htmlMerc;
    compraMerc.innerHTML = htmlMerc;
}

// Carrega as listas automaticamente quando o app abre
window.onload = carregarListas;

// ==========================================
// --- 5. MÓDULO PROMOÇÃO ---
// ==========================================
async function salvarPromocao(btnElement) {
    const mercadoId = document.getElementById('promo-mercado').value;
    const produtoId = document.getElementById('promo-produto').value;
    const valor = document.getElementById('promo-valor').value;

    if (!mercadoId || !produtoId || !valor) {
        return alert('Preencha mercado, produto e valor da promoção!');
    }

    const textoOriginal = btnElement.innerText;
    btnElement.innerText = '⏳ Salvando...';
    btnElement.disabled = true;

    const { error } = await clienteSupabase.from('promocoes').insert([{ 
        mercado_id: mercadoId, 
        produto_id: produtoId, 
        // Troca a vírgula por ponto (caso o teclado do celular mande vírgula) e converte para decimal
        valor: parseFloat(valor.replace(',', '.')) 
    }]);

    if (error) {
        console.error("Erro Supabase:", error);
        alert('Erro ao salvar promoção: ' + error.message);
        btnElement.innerText = textoOriginal;
        btnElement.disabled = false;
    } else {
        btnElement.innerText = '✅ Salvo!';
        btnElement.classList.add('sucesso');
        document.getElementById('promo-valor').value = ''; // Limpa só o valor
        
        setTimeout(() => {
            btnElement.innerText = textoOriginal;
            btnElement.disabled = false;
            btnElement.classList.remove('sucesso');
        }, 2000);
    }
}

// ==========================================
// --- 6. MÓDULO CARRINHO (GESTÃO DE COMPRA) ---
// ==========================================
let cestaDeCompras = [];
let totalDaCompra = 0;

// OUVINTE DE EVENTO: Dispara sempre que você seleciona um produto no carrinho
document.getElementById('compra-produto').addEventListener('change', async function() {
    const produtoId = this.value;
    const alerta = document.getElementById('alerta-promo');
    alerta.style.display = 'none'; // Esconde o alerta por padrão

    if (!produtoId) return;

    // Vai no banco e busca se existe alguma promoção para esse produto, ordenando pela mais barata
    const { data, error } = await clienteSupabase
        .from('promocoes')
        .select('valor, mercados(nome)')
        .eq('produto_id', produtoId)
        .order('valor', { ascending: true })
        .limit(1);

    // Se encontrou promoção, exibe o alerta na tela
    if (data && data.length > 0) {
        const promo = data[0];
        alerta.innerText = `🔥 Em promo no ${promo.mercados.nome} por R$ ${promo.valor.toFixed(2)}`;
        alerta.style.display = 'block';
    }
});

function adicionarItemCesta() {
    const selectProd = document.getElementById('compra-produto');
    const produtoId = selectProd.value;
    const nomeProduto = selectProd.options[selectProd.selectedIndex].text;
    let valorInput = document.getElementById('compra-valor').value;
    
    // Tratamento para aceitar vírgula ou ponto
    const valor = parseFloat(valorInput.replace(',', '.'));

    if (!produtoId || isNaN(valor)) {
        return alert('Selecione o produto e digite o valor pago.');
    }

    // Adiciona na memória
    cestaDeCompras.push({ produto_id: produtoId, nome: nomeProduto, valor: valor });
    
    // Limpa os campos para o próximo produto
    selectProd.value = '';
    document.getElementById('compra-valor').value = '';
    document.getElementById('alerta-promo').style.display = 'none';
    
    atualizarUILista();
}

function atualizarUILista() {
    const lista = document.getElementById('lista-cesta');
    lista.innerHTML = ''; // Limpa a lista visual
    totalDaCompra = 0;

    // Recria a lista e soma os valores
    cestaDeCompras.forEach((item) => {
        totalDaCompra += item.valor;
        lista.innerHTML += `
            <li>
                <span>${item.nome}</span> 
                <strong>R$ ${item.valor.toFixed(2)}</strong>
            </li>`;
    });

    document.getElementById('total-compra').innerText = totalDaCompra.toFixed(2);
}

async function finalizarCompra(btnElement) {
    const mercadoId = document.getElementById('compra-mercado').value;

    if (!mercadoId) return alert('Selecione o mercado onde está fazendo a compra (no topo da tela).');
    if (cestaDeCompras.length === 0) return alert('Sua cesta está vazia. Adicione itens primeiro.');

    const textoOriginal = btnElement.innerText;
    btnElement.innerText = '⏳ Finalizando...';
    btnElement.disabled = true;

    // 1. Salva a "Capa" da compra na tabela compras
    const { data: compraSalva, error: erroCompra } = await clienteSupabase
        .from('compras')
        .insert([{ mercado_id: mercadoId, total_pago: totalDaCompra }])
        .select();

    if (erroCompra || !compraSalva) {
        console.error("Erro na compra:", erroCompra);
        alert('Erro ao registrar a compra principal.');
        btnElement.innerText = textoOriginal;
        btnElement.disabled = false;
        return;
    }

    const idDaCompraGerada = compraSalva[0].id;

    // 2. Monta o pacote de itens da cesta com o ID da compra gerada
    const itensParaSalvar = cestaDeCompras.map(item => ({
        compra_id: idDaCompraGerada,
        produto_id: item.produto_id,
        valor_unitario: item.valor
    }));

    // 3. Salva todos os itens de uma vez na tabela itens_compra
    const { error: erroItens } = await clienteSupabase.from('itens_compra').insert(itensParaSalvar);

    if (erroItens) {
        console.error("Erro nos itens:", erroItens);
        alert('A compra foi criada, mas ocorreu um erro ao salvar a lista de itens.');
    } else {
        btnElement.innerText = '✅ Compra Finalizada!';
        btnElement.classList.add('sucesso');
        
        // Zera o carrinho e a interface
        cestaDeCompras = [];
        document.getElementById('compra-mercado').value = '';
        atualizarUILista(); // Atualiza pra zerar a tela

        setTimeout(() => {
            btnElement.innerText = textoOriginal;
            btnElement.disabled = false;
            btnElement.classList.remove('sucesso');
        }, 3000);
    }
}
