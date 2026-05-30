// --- 1. CONFIGURAÇÃO DO SUPABASE ---
const supabaseUrl = 'https://ssrrbjmrwujvpllcxnjx.supabase.co';
const supabaseKey = 'sb_publishable_wikZhbQKoPXtFH7bmZIi4g_Oc_zMdQo';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- 2. NAVEGAÇÃO MOBILE CORRIGIDA ---
function mudarAba(idAba, titulo, btnElement) {
    // Esconde todas as telas
    document.querySelectorAll('.screen').forEach(tela => tela.classList.remove('active'));
    // Remove a cor de todos os botões do menu
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Mostra a tela selecionada e altera o título
    document.getElementById(idAba).classList.add('active');
    document.getElementById('page-title').innerText = titulo;
    
    // Pinta de azul apenas o botão clicado
    if(btnElement) btnElement.classList.add('active');
}

// --- 3. LÓGICA COM ANIMAÇÃO ---
async function salvarProduto(btnElement) {
    const nomeInput = document.getElementById('nome-produto');
    const nome = nomeInput.value.trim();
    
    if(!nome) return alert('Digite o nome do produto');

    // Inicia a animação de carregamento
    const textoOriginal = btnElement.innerText;
    btnElement.innerText = '⏳ Salvando...';
    btnElement.disabled = true;

    const { error } = await supabase.from('produtos').insert([{ nome: nome }]);
    
    if (error) {
        console.error("Erro Supabase:", error);
        alert('Erro ao salvar produto: ' + error.message);
        // Volta ao normal em caso de erro
        btnElement.innerText = textoOriginal;
        btnElement.disabled = false;
    } else {
        // Feedback de sucesso (Verde)
        btnElement.innerText = '✅ Salvo!';
        btnElement.classList.add('sucesso');
        nomeInput.value = ''; 
        
        // Retorna o botão ao estado original após 2 segundos
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

    const { error } = await supabase.from('mercados').insert([{ nome: nome }]);
    
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
