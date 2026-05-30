// --- 1. CONFIGURAÇÃO DO SUPABASE ---
const supabaseUrl = 'https://ssrrbjmrwujvpllcxnjx.supabase.co';
const supabaseKey = 'sb_publishable_wikZhbQKoPXtFH7bmZIi4g_Oc_zMdQo';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- 2. NAVEGAÇÃO MOBILE ---
function mudarAba(idAba, titulo) {
    // Esconde todas as telas
    document.querySelectorAll('.screen').forEach(tela => tela.classList.remove('active'));
    
    // Remove a classe 'active' de todos os botões com segurança
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Mostra a tela selecionada e altera o título
    document.getElementById(idAba).classList.add('active');
    document.getElementById('page-title').innerText = titulo;
    
    // Destaca o botão clicado
    if (window.event) {
        const btn = window.event.currentTarget || window.event.target.closest('.nav-btn');
        if (btn) btn.classList.add('active');
    }
}

// --- 3. LÓGICA DE BANCO DE DADOS ---
async function salvarProduto() {
    const nomeInput = document.getElementById('nome-produto');
    const nome = nomeInput.value.trim();
    
    if(!nome) {
        alert('Digite o nome do produto');
        return;
    }

    const { error } = await supabase.from('produtos').insert([{ nome: nome }]);
    
    if (error) {
        console.error("Erro Supabase:", error);
        alert('Erro ao salvar produto: ' + error.message);
    } else {
        alert('Produto salvo com sucesso!');
        nomeInput.value = ''; // Limpa o campo após salvar
    }
}

async function salvarMercado() {
    const nomeInput = document.getElementById('nome-mercado');
    const nome = nomeInput.value.trim();
    
    if(!nome) {
        alert('Digite o nome do mercado');
        return;
    }

    const { error } = await supabase.from('mercados').insert([{ nome: nome }]);
    
    if (error) {
        console.error("Erro Supabase:", error);
        alert('Erro ao salvar mercado: ' + error.message);
    } else {
        alert('Mercado salvo com sucesso!');
        nomeInput.value = ''; // Limpa o campo após salvar
    }
}
