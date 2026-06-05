// API BASE URL
const API_BASE = '/api';

// FUNCIONES UTILITÁRIAS
function mostrarMensagem(tipo, titulo, mensagem) {
    const modal = document.getElementById('modal');
    const modalMensagem = document.getElementById('modalMensagem');
    
    modalMensagem.innerHTML = `<strong>${titulo}</strong><br>${mensagem}`;
    modal.style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
    carregarEstoque();
}

const closeBtn = document.querySelector('.close');
if (closeBtn) {
    closeBtn.onclick = function() {
        document.getElementById('modal').style.display = 'none';
    };
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

function mostrarMensagemInline(elementId, tipo, mensagem) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;
    
    elemento.className = `mensagem ${tipo}`;
    elemento.textContent = mensagem;
    
    setTimeout(() => {
        elemento.className = 'mensagem';
    }, 5000);
}

// GERENCIAR ABAS
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active de todos os botões e conteúdos
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Adiciona active no clicado
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        // Recarrega dados quando necessário
        if (tabId === 'estoque') {
            carregarEstoque();
        }
    });
});

// CARREGAR ESTOQUE
async function carregarEstoque() {
    try {
        const response = await fetch(`${API_BASE}/estoque`);
        const estoque = await response.json();
        
        const tabelaEstoque = document.getElementById('tabelaEstoque');
        
        if (estoque.length === 0) {
            tabelaEstoque.innerHTML = '<p class="loading">O estoque está vazio</p>';
            return;
        }
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Preço Unitário</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        estoque.forEach(item => {
            const total = (item.quantidade * item.preco_unitario).toFixed(2);
            html += `
                <tr>
                    <td>${item.id}</td>
                    <td><strong>${item.produto.replace(/_/g, ' ')}</strong></td>
                    <td>${item.quantidade}</td>
                    <td>R$ ${parseFloat(item.preco_unitario).toFixed(2)}</td>
                    <td><strong>R$ ${total}</strong></td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        tabelaEstoque.innerHTML = html;
    } catch (error) {
        console.error('Erro ao carregar estoque:', error);
        document.getElementById('tabelaEstoque').innerHTML = '<p class="loading" style="color: red;">Erro ao carregar estoque</p>';
    }
}

// ADICIONAR PRODUTO
document.getElementById('formAdicionar').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const produto = document.getElementById('nomeProduto').value.trim();
    const quantidade = parseInt(document.getElementById('quantidadeProduto').value);
    const preco = parseFloat(document.getElementById('precoProduto').value);
    
    if (!produto || quantidade <= 0 || preco <= 0) {
        mostrarMensagemInline('mensagemAdicionar', 'erro', '❌ Preencha todos os campos corretamente!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/adicionar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                produto: produto,
                quantidade: quantidade,
                preco: preco
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarMensagem('sucesso', '✅ Sucesso!', data.mensagem);
            document.getElementById('formAdicionar').reset();
        } else {
            mostrarMensagemInline('mensagemAdicionar', 'erro', `❌ ${data.erro}`);
        }
    } catch (error) {
        mostrarMensagemInline('mensagemAdicionar', 'erro', '❌ Erro ao adicionar produto');
        console.error('Erro:', error);
    }
});

// PESQUISAR PRODUTO
async function pesquisarProduto() {
    const nome = document.getElementById('pesquisaNome').value.trim().replace(' ', '_').toLowerCase();
    
    if (!nome) {
        alert('Digite o nome do produto!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/produto/${nome}`);
        const resultadoPesquisa = document.getElementById('resultadoPesquisa');
        
        if (!response.ok) {
            resultadoPesquisa.innerHTML = '<p class="loading">Produto não encontrado</p>';
            return;
        }
        
        const produto = await response.json();
        const total = (produto.quantidade * produto.preco_unitario).toFixed(2);
        
        const html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Preço Unitário</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${produto.id}</td>
                        <td><strong>${produto.produto.replace(/_/g, ' ')}</strong></td>
                        <td>${produto.quantidade}</td>
                        <td>R$ ${parseFloat(produto.preco_unitario).toFixed(2)}</td>
                        <td><strong>R$ ${total}</strong></td>
                    </tr>
                </tbody>
            </table>
        `;
        
        resultadoPesquisa.innerHTML = html;
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('resultadoPesquisa').innerHTML = '<p class="loading" style="color: red;">Erro na pesquisa</p>';
    }
}

// PERMITIR ENTER NA PESQUISA
document.getElementById('pesquisaNome').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        pesquisarProduto();
    }
});

// TOGGLE QUANTIDADE REMOVER
document.querySelectorAll('input[name="tipoRemocao"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const container = document.getElementById('quantidadeRemoverContainer');
        if (radio.value === '2') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
});

// REMOVER PRODUTO
async function removerProduto() {
    const produto = document.getElementById('produtoRemover').value.trim().replace(' ', '_').toLowerCase();
    const modo = parseInt(document.querySelector('input[name="tipoRemocao"]:checked').value);
    const quantidade = parseInt(document.getElementById('quantidadeRemover').value) || 0;
    
    if (!produto) {
        alert('Digite o nome do produto!');
        return;
    }
    
    if (modo === 2 && quantidade <= 0) {
        alert('Digite a quantidade a remover!');
        return;
    }
    
    if (!confirm(`Tem certeza que deseja ${modo === 1 ? 'deletar todo' : 'remover'} o produto "${produto.replace(/_/g, ' ')}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/deletar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                produto: produto,
                modo: modo,
                quantidade: modo === 2 ? quantidade : 0
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarMensagem('sucesso', '✅ Sucesso!', data.mensagem);
            document.getElementById('produtoRemover').value = '';
            document.getElementById('quantidadeRemover').value = '';
        } else {
            mostrarMensagem('erro', '❌ Erro', data.erro);
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('erro', '❌ Erro', 'Erro ao remover produto');
    }
}

// ATUALIZAR PREÇO
async function atualizarPreco() {
    const produto = document.getElementById('produtoAtualizarPreco').value.trim().replace(' ', '_').toLowerCase();
    const novoPreco = parseFloat(document.getElementById('novoPreco').value);
    
    if (!produto || novoPreco <= 0) {
        alert('Preencha todos os campos corretamente!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/atualizar-preco`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                produto: produto,
                preco: novoPreco
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarMensagem('sucesso', '✅ Sucesso!', data.mensagem);
            document.getElementById('produtoAtualizarPreco').value = '';
            document.getElementById('novoPreco').value = '';
        } else {
            mostrarMensagem('erro', '❌ Erro', data.erro);
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('erro', '❌ Erro', 'Erro ao atualizar preço');
    }
}

// LIMPAR ESTOQUE
async function limparEstoque() {
    if (!confirm('⚠️ ATENÇÃO! Isso irá deletar TODOS os produtos do estoque. Tem certeza?')) {
        return;
    }
    
    if (!confirm('Esta ação não pode ser desfeita. Confirma mesmo assim?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/limpar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarMensagem('sucesso', '✅ Sucesso!', data.mensagem);
        } else {
            mostrarMensagem('erro', '❌ Erro', data.erro);
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('erro', '❌ Erro', 'Erro ao limpar estoque');
    }
}

// ORDENAR ESTOQUE
async function ordenarEstoque() {
    const campo = document.getElementById('ordenarPor').value;
    
    try {
        const response = await fetch(`${API_BASE}/ordenar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                campo: campo,
                ordem: 'asc'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            carregarEstoque();
            mostrarMensagem('sucesso', '✅ Sucesso!', data.mensagem);
        } else {
            mostrarMensagem('erro', '❌ Erro', data.erro);
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('erro', '❌ Erro', 'Erro ao ordenar estoque');
    }
}

// CARREGAR ESTOQUE AO INICIAR
document.addEventListener('DOMContentLoaded', carregarEstoque);
