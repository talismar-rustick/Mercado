// --- 1. CONFIGURAÇÃO DO SUPABASE ---
// Você vai substituir essas strings pelas chaves do seu projeto no Supabase
const supabaseUrl = 'https://ssrrbjmrwujvpllcxnjx.supabase.co';
const supabaseKey = 'sb_publishable_wikZhbQKoPXtFH7bmZIi4g_Oc_zMdQo';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- 2. NAVEGAÇÃO MOBILE ---
function mudarAba(idAba, titulo) {
    // Esconde todas as telas
    document.querySelectorAll('.screen').forEach(tela => tela.classList.remove('active'));
    // Desmarca todos os botões do menu
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Mostra a tela selecionada
    document.getElementById(idAba).classList.add('active');
    document.getElementById('page-title').innerText = titulo;
    
    // Marca o botão clicado como ativo
    event.currentTarget.classList.add('active');
}

// --- 3. LÓGICA DE BANCO DE DADOS (Exemplos) ---
async function salvarProduto() {
    const nome = document.getElementById('nome-produto').value;
    if(!nome) return alert('Digite o nome do produto');

    const { data, error } = await supabase.from('produtos').insert([{ nome: nome }]);
    
    if (error) alert('Erro ao salvar!');
    else {
        alert('Produto salvo!');
        document.getElementById('nome-produto').value = '';
    }
}

async function salvarMercado() {
    const nome = document.getElementById('nome-mercado').value;
    if(!nome) return alert('Digite o nome do mercado');

    const { data, error } = await supabase.from('mercados').insert([{ nome: nome }]);
    
    if (error) alert('Erro ao salvar!');
    else {
        alert('Mercado salvo!');
        document.getElementById('nome-mercado').value = '';
    }
}

// O restante das funções de carregar selects, salvar compra e promoções 
// entraremos no detalhe assim que a conexão principal estiver rodando!
