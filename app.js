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
