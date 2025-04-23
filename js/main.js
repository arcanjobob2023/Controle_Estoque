// Funções de UI para o Sistema de Controle de Estoque

// Função para mostrar a página correta
function showPage(pageId, element) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active-page');
    });
    document.getElementById(pageId).classList.add('active-page');

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');
}

// Funções para abrir e fechar modais
function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
// Registrar transferência de material (atualizado para usar transferencias.php)
async function registrarTransferencia() {
    try {
        const nsOrigem = document.getElementById('ns-origem').value;
        const nsDestino = document.getElementById('ns-destino').value;
        const itemCodigo = document.getElementById('codigo-item-transferencia').value;
        const quantidadeTransferir = parseFloat(document.getElementById('quantidade-transferencia').value);
        const responsavel = document.getElementById('responsavel-transferencia').value;
        const observacao = document.getElementById('observacao-transferencia').value;

        if (!nsOrigem || !nsDestino || !itemCodigo || !quantidadeTransferir || !responsavel) {
            alert('Preencha todos os campos obrigatórios da transferência!');
            return;
        }

        if (nsOrigem === nsDestino) {
            alert('A NS de origem e destino não podem ser iguais.');
            return;
        }

        const transferencia = {
            ns_origem: nsOrigem,
            ns_destino: nsDestino,
            item_codigo: itemCodigo,
            quantidade: quantidadeTransferir,
            responsavel: responsavel,
            observacao: observacao
        };

        const result = await fetchAPI('transferencias.php', 'POST', transferencia);

        if (result.success) {
            alert('Transferência registrada com sucesso!');
            document.getElementById('form-transferencia-material').reset();
            carregarHistoricoTransferencias();
            carregarEstoqueGeral();
        } else {
            throw new Error(result.error || 'Erro ao registrar transferência');
        }


    } catch (error) {
        console.error('Erro ao processar transferência:', error);
        alert('Erro ao processar transferência: ' + error.message);
    }
}
async function carregarTotaisResumo() {
    try {
        const [itens, ids, nss] = await Promise.all([
            listarItens(),
            listarIDs(),
            listarNSs()
        ]);

        document.getElementById('total-itens').textContent = itens.length;
        document.getElementById('total-ids').textContent = ids.length;
        document.getElementById('total-ns').textContent = nss.length;
    } catch (error) {
        console.error('Erro ao carregar totais do resumo:', error);
    }
}


// Registrar devolução de material
async function registrarDevolucao() {
    try {
        const transferenciaId = parseInt(document.getElementById('transferencia-id').value);
        const quantidade = parseFloat(document.getElementById('quantidade-devolucao').value);
        const responsavel = document.getElementById('responsavel-devolucao').value.trim();
        const observacao = document.getElementById('observacao-devolucao').value.trim();

        if (!quantidade || quantidade <= 0) {
            alert('A quantidade a devolver deve ser maior que zero.');
            return;
        }

        if (!responsavel) {
            alert('Informe o responsável pela devolução.');
            return;
        }

        const dados = {
            transferencia_id: transferenciaId,
            quantidade_devolucao: quantidade,
            responsavel_devolucao: responsavel,
            observacao_devolucao: observacao
        };

        const resultado = await fetchAPI('devolucao.php', 'PUT', dados);

        if (resultado.success) {
            alert('Devolução registrada com sucesso!');

            // Fechar o modal
            fecharModal('modal-devolucao');

            // Atualizar histórico
            await carregarHistoricoTransferencias();

            // Atualizar estoque geral
            await carregarEstoqueGeral();
        } else {
            throw new Error(resultado.error || 'Erro ao registrar devolução');
        }

    } catch (error) {
        console.error('Erro ao registrar devolução:', error);
        alert('Erro ao registrar devolução: ' + error.message);
    }
}


// Modal para adicionar item ao estoque
function abrirModalAdicionarEstoque(nsCodigo, itemCodigo, itemDescricao) {
    document.getElementById('ns-adicionar').value = nsCodigo;
    document.getElementById('item-adicionar').value = itemCodigo;
    document.getElementById('ns-adicionar-texto').textContent = nsCodigo;
    document.getElementById('item-adicionar-texto').textContent = `${itemCodigo} - ${itemDescricao}`;
    
    abrirModal('modal-adicionar-estoque');
}

// Modal para retirar item do estoque
function abrirModalRetirarEstoque(nsCodigo, itemCodigo, itemDescricao) {
    document.getElementById('ns-retirar').value = nsCodigo;
    document.getElementById('item-retirar').value = itemCodigo;
    document.getElementById('ns-retirar-texto').textContent = nsCodigo;
    document.getElementById('item-retirar-texto').textContent = `${itemCodigo} - ${itemDescricao}`;
    
    abrirModal('modal-retirar-estoque');
}

// Função para formatar data
function formatarData(dataString) {
    if (!dataString) return '';
    
    const data = new Date(dataString);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
}

// Função para filtrar a tabela de IDs
function filtrarIDs() {
    const busca = document.getElementById('busca-ids').value.toLowerCase();
    const rows = document.querySelectorAll('#lista-ids tr');
    
    rows.forEach(row => {
        const texto = row.textContent.toLowerCase();
        if (texto.indexOf(busca) > -1) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Função para filtrar a tabela de NSs
function filtrarNSs() {
    const busca = document.getElementById('busca-ns').value.toLowerCase();
    const rows = document.querySelectorAll('#lista-ns tr');
    
    rows.forEach(row => {
        const texto = row.textContent.toLowerCase();
        if (texto.indexOf(busca) > -1) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Função para filtrar a tabela de Itens
function filtrarItens() {
    const busca = document.getElementById('busca-itens').value.toLowerCase();
    const rows = document.querySelectorAll('#lista-itens tr');
    
    rows.forEach(row => {
        const texto = row.textContent.toLowerCase();
        if (texto.indexOf(busca) > -1) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Função para filtrar o estoque geral
function filtrarEstoqueGeral() {
    const busca = document.getElementById('busca-estoque-geral').value.toLowerCase();
    const rows = document.querySelectorAll('#tbody-estoque-geral tr');
    
    rows.forEach(row => {
        const texto = row.textContent.toLowerCase();
        if (texto.indexOf(busca) > -1) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Função para buscar item pelo código
async function obterItem(itemCodigo) {
    try {
        console.log("Fazendo requisição para item_codigo:", itemCodigo);
        const result = await fetchAPI(`itens.php?item_codigo=${encodeURIComponent(itemCodigo)}`);
        console.log("Resposta da API:", result);
        return result.data || null;
    } catch (error) {
        console.error("Erro em obterItem:", error);
        return null;
    }
}

// Atualizar lista de IDs
async function atualizarListaIDs() {
    const tbody = document.getElementById('lista-ids');
    const ids = await listarIDs();
    
    if (tbody) {
        tbody.innerHTML = '';
        
        if (ids.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum ID encontrado</td></tr>';
            return;
        }
        
        ids.forEach(id => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${id.id_codigo}</td>
                <td>${id.nome_projeto}</td>
                <td>${id.cliente}</td>
                <td>${id.responsavel}</td>
                <td>${formatarData(id.data_inicio)}</td>
                <td>${formatarData(id.data_fim)}</td>
                <td>${id.ns_associadas || 0}</td>
                <td>
                    <button onclick="editarID('${id.id_codigo}')">Editar</button>
                    <button class="btn-danger" onclick="confirmarExclusaoID('${id.id_codigo}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Atualizar lista de NSs
async function atualizarListaNSs() {
    const tbody = document.getElementById('lista-ns');
    const nss = await listarNSs();
    
    if (tbody) {
        tbody.innerHTML = '';
        
        if (nss.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhuma NS encontrada</td></tr>';
            return;
        }
        
        nss.forEach(ns => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ns.ns_codigo}</td>
                <td>${ns.id_codigo}</td>
                <td>${ns.nome_projeto || '-'}</td>
                <td>${ns.descricao}</td>
                <td>${formatarData(ns.data_criacao)}</td>
                <td>${ns.status}</td>
                <td>
                    <button onclick="editarNS('${ns.ns_codigo}')">Editar</button>
                    <button class="btn-danger" onclick="confirmarExclusaoNS('${ns.ns_codigo}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Atualizar lista de Itens
async function atualizarListaItens() {
    const tbody = document.getElementById('lista-itens');
    const itens = await listarItens();
    
    if (tbody) {
        tbody.innerHTML = '';
        
        if (itens.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum item encontrado</td></tr>';
            return;
        }
        
        itens.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.item_codigo}</td>
                <td>${item.descricao}</td>
                <td>${item.unidade}</td>
                <td>
                    <button onclick="editarItem('${item.item_codigo}')">Editar</button>
                    <button class="btn-danger" onclick="confirmarExclusaoItem('${item.item_codigo}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Atualizar lista de orçamento por NS
async function atualizarListaOrcamento(nsCodigo) {
    const tbody = document.getElementById('lista-orcamento');
    
    if (!tbody) return;
    
    if (!nsCodigo) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Selecione uma NS</td></tr>';
        return;
    }
    
    const orcamento = await listarOrcamentoPorNS(nsCodigo);
    
    tbody.innerHTML = '';
    
    if (orcamento.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum item no orçamento</td></tr>';
        return;
    }
    
    orcamento.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.item_codigo}</td>
            <td>${item.descricao}</td>
            <td>${item.unidade}</td>
            <td>${item.quantidade}</td>
            <td>
                <button onclick="editarItemOrcamento(${item.id})">Editar</button>
                <button class="btn-danger" onclick="removerItemOrcamento(${item.id})">Remover</button>
                <button class="btn-warning" onclick="abrirModalAdicionarEstoque('${item.ns_codigo}', '${item.item_codigo}', '${item.descricao}')">Adicionar ao Estoque</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para editar ID
async function editarID(idCodigo) {
    const id = await obterID(idCodigo);
    
    if (id) {
        document.getElementById('codigo-id').value = id.id_codigo;
        document.getElementById('nome-projeto').value = id.nome_projeto;
        document.getElementById('cliente-id').value = id.cliente;
        document.getElementById('responsavel-id').value = id.responsavel;
        document.getElementById('data-inicio').value = id.data_inicio;
        document.getElementById('data-fim').value = id.data_fim || '';
        document.getElementById('observacoes-id').value = id.observacoes || '';
        
        // Desabilitar o campo de código (chave primária)
        document.getElementById('codigo-id').disabled = true;
        
        // Mudar texto do botão
        const botaoSubmit = document.querySelector('#form-cadastro-id button[type="submit"]');
        botaoSubmit.textContent = 'Atualizar ID';
        
        // Rolar para o formulário
        document.getElementById('cadastro-id').scrollIntoView();
    }
}

// Função para editar NS
async function editarNS(nsCodigo) {
    const ns = await obterNS(nsCodigo);
    
    if (ns) {
        document.getElementById('codigo-ns').value = ns.ns_codigo;
        document.getElementById('id-ns').value = ns.id_codigo;
        document.getElementById('descricao-ns').value = ns.descricao;
        document.getElementById('data-criacao-ns').value = ns.data_criacao;
        document.getElementById('status-ns').value = ns.status;
        document.getElementById('observacoes-ns').value = ns.observacoes || '';
        
        // Desabilitar o campo de código (chave primária)
        document.getElementById('codigo-ns').disabled = true;
        
        // Mudar texto do botão
        const botaoSubmit = document.querySelector('#form-cadastro-ns button[type="submit"]');
        botaoSubmit.textContent = 'Atualizar NS';
        
        // Rolar para o formulário
        document.getElementById('cadastro-ns').scrollIntoView();
    }
}

// Função para editar Item
async function editarItem(itemCodigo) {
    const item = await obterItem(itemCodigo);
    
    if (item) {
        document.getElementById('codigo-item').value = item.item_codigo;
        document.getElementById('descricao-item').value = item.descricao;
        document.getElementById('unidade-item').value = item.unidade;
        
        // Desabilitar o campo de código (chave primária)
        document.getElementById('codigo-item').disabled = true;
        
        // Mudar texto do botão
        const botaoSubmit = document.querySelector('#form-cadastro-item button[type="submit"]');
        botaoSubmit.textContent = 'Atualizar Item';
        
        // Rolar para o formulário
        document.getElementById('cadastro-item').scrollIntoView();
    }
}

// Funções de confirmação para exclusão
function confirmarExclusaoID(idCodigo) {
    if (confirm(`Tem certeza que deseja excluir o ID ${idCodigo}? Esta ação também excluirá todas as NS associadas.`)) {
        excluirID(idCodigo).then(() => {
            alert('ID excluído com sucesso!');
            carregarSelecaoIDs();
            atualizarListaIDs();
        }).catch(error => {
            console.error('Erro ao excluir ID:', error);
        });
    }
}

function confirmarExclusaoNS(nsCodigo) {
    if (confirm(`Tem certeza que deseja excluir a NS ${nsCodigo}?`)) {
        excluirNS(nsCodigo).then(() => {
            alert('NS excluída com sucesso!');
            carregarSelecaoNSs();
            atualizarListaNSs();
        }).catch(error => {
            console.error('Erro ao excluir NS:', error);
        });
    }
}

function confirmarExclusaoItem(itemCodigo) {
    if (confirm(`Tem certeza que deseja excluir o item ${itemCodigo}?`)) {
        excluirItem(itemCodigo).then(() => {
            alert('Item excluído com sucesso!');
            carregarSelecaoItens();
            atualizarListaItens();
        }).catch(error => {
            console.error('Erro ao excluir item:', error);
        });
    }
}

// Funções para gerenciar o cadastro de entrada no estoque

// Atualizar lista de entradas no estoque por NS
async function atualizarListaEntradasEstoque(nsCodigo) {
    const tbody = document.getElementById('lista-entradas-estoque');
    
    if (!tbody) return;
    
    if (!nsCodigo) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Selecione uma NS</td></tr>';
        return;
    }
    
    try {
        // Buscar histórico de entradas para esta NS
        const entradas = await listarEntradasEstoque(nsCodigo);
        
        tbody.innerHTML = '';
        
        if (entradas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma entrada de estoque encontrada</td></tr>';
            return;
        }
        
        entradas.forEach(entrada => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${entrada.item_codigo}</td>
                <td>${entrada.descricao}</td>
                <td>${entrada.unidade}</td>
                <td>${entrada.quantidade_entrada}</td>
                <td>${entrada.responsavel}</td>
                <td>${formatarData(entrada.data_movimento)}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao buscar entradas de estoque:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Erro ao carregar dados</td></tr>';
    }
}

// Função para adicionar automaticamente ao orçamento se não existir
async function adicionarAoOrcamentoSeNecessario(nsCodigo, itemCodigo) {
    // Verificar se o item já existe no orçamento desta NS
    const orcamento = await listarOrcamentoPorNS(nsCodigo);
    const itemExiste = orcamento.some(item => item.item_codigo === itemCodigo);
    
    if (!itemExiste) {
        // Item não está no orçamento, vamos adicioná-lo com quantidade 0
        const dadosOrcamento = {
            ns_codigo: nsCodigo,
            item_codigo: itemCodigo,
            quantidade: 0 // Quantidade orçada inicial 0
        };
        
        try {
            await adicionarItemOrcamento(dadosOrcamento);
            console.log(`Item ${itemCodigo} adicionado automaticamente ao orçamento da NS ${nsCodigo}`);
        } catch (error) {
            console.error('Erro ao adicionar item ao orçamento:', error);
        }
    }
}

// Função para buscar histórico de entradas de estoque por NS
async function listarEntradasEstoque(nsCodigo) {
    try {
        const result = await fetchAPI(`estoque.php?historico=entrada&ns_codigo=${encodeURIComponent(nsCodigo)}`);
        return result.data || [];
    } catch (error) {
        console.error('Erro ao listar entradas de estoque:', error);
        return [];
    }
}

// Adicionar ao document.ready para incluir os listeners da nova página
document.addEventListener('DOMContentLoaded', function() {
    // Outros códigos existentes...

    // Adicionar link à navegação
    const nav = document.querySelector('nav');
    if (nav) {
        // Verificar se o link já existe
        if (!document.querySelector('a[onclick="showPage(\'cadastro-entrada-estoque\', this)"]')) {
            const entradaEstoqueLink = document.createElement('a');
            entradaEstoqueLink.href = '#';
            entradaEstoqueLink.textContent = 'Entrada de Estoque';
            entradaEstoqueLink.onclick = function() { showPage('cadastro-entrada-estoque', this); };
            nav.appendChild(entradaEstoqueLink);
        }
    }

    // Configurar listeners para o select de NS na página de entrada de estoque
    const nsEntradaEstoque = document.getElementById('ns-entrada-estoque');
    if (nsEntradaEstoque) {
        nsEntradaEstoque.addEventListener('change', async function() {
            const nsCodigo = this.value;
            
            if (nsCodigo) {
                // Obter NS e ID associado
                const ns = await obterNS(nsCodigo);
                if (ns) {
                    document.getElementById('id-entrada-estoque').textContent = ns.id_codigo;
                    
                    // Obter nome do projeto
                    const id = await obterID(ns.id_codigo);
                    if (id) {
                        document.getElementById('projeto-entrada-estoque').textContent = id.nome_projeto;
                    }
                }
                
                // Atualizar lista de entradas no estoque
                atualizarListaEntradasEstoque(nsCodigo);
            } else {
                document.getElementById('id-entrada-estoque').textContent = '-';
                document.getElementById('projeto-entrada-estoque').textContent = '-';
                document.getElementById('lista-entradas-estoque').innerHTML = '<tr><td colspan="6" class="text-center">Selecione uma NS</td></tr>';
            }
        });
    }
    
    const formDevolucao = document.getElementById('form-devolucao');
if (formDevolucao) {
    formDevolucao.addEventListener('submit', function(e) {
        e.preventDefault();
        registrarDevolucao();
    });
}

    
    // Configurar comportamento do campo de código do item para entrada de estoque
    const codigoItemEntradaEstoque = document.getElementById('codigo-item-entrada-estoque');
    const descricaoItemEntradaEstoque = document.getElementById('descricao-item-entrada-estoque');
    const unidadeItemEntradaEstoque = document.getElementById('unidade-item-entrada-estoque');
    const quantidadeEntradaEstoque = document.getElementById('quantidade-entrada-estoque');
    
    if (codigoItemEntradaEstoque) {
        // Quando o usuário pressionar TAB ou ENTER após digitar o código
        codigoItemEntradaEstoque.addEventListener('keydown', async function(e) {
            if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault(); // Prevenir comportamento padrão do TAB/ENTER
                
                const codigo = this.value.trim();
                if (codigo) {
                    // Buscar item no banco de dados
                    const item = await obterItem(codigo);
                    
                    if (item) {
                        // Preencher campos com os dados do item
                        descricaoItemEntradaEstoque.value = item.descricao;
                        unidadeItemEntradaEstoque.value = item.unidade;
                        
                        // Verificar se precisa adicionar ao orçamento
                        const nsCodigo = document.getElementById('ns-entrada-estoque').value;
                        if (nsCodigo) {
                            await adicionarAoOrcamentoSeNecessario(nsCodigo, codigo);
                        }
                        
                        // Mover o foco para o campo de quantidade
                        quantidadeEntradaEstoque.focus();
                    } else {
                        alert('Item não encontrado. Verifique o código digitado.');
                        this.focus();
                    }
                }
            }
        });
        
        // Quando o usuário pressionar ENTER no campo de quantidade
        quantidadeEntradaEstoque.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevenir o envio do formulário
                
                // Verificar se tem valor
                if (this.value && parseFloat(this.value) > 0) {
                    // Mover para o campo de responsável
                    document.getElementById('responsavel-entrada-estoque').focus();
                }
            }
        });
    }
    
    // Configurar formulário de cadastro de entrada no estoque
    const formCadastroEntradaEstoque = document.getElementById('form-cadastro-entrada-estoque');
    if (formCadastroEntradaEstoque) {
        formCadastroEntradaEstoque.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nsCodigo = document.getElementById('ns-entrada-estoque').value;
            const itemCodigo = document.getElementById('codigo-item-entrada-estoque').value;
            const quantidade = document.getElementById('quantidade-entrada-estoque').value;
            const responsavel = document.getElementById('responsavel-entrada-estoque').value;
            const observacao = document.getElementById('observacao-entrada-estoque').value;
            
            if (!nsCodigo || !itemCodigo || !quantidade || !responsavel) {
                alert('Preencha todos os campos obrigatórios!');
                return;
            }
            
            const dadosEstoque = {
                ns_codigo: nsCodigo,
                item_codigo: itemCodigo,
                quantidade: parseFloat(quantidade),
                responsavel: responsavel,
                observacao: observacao
            };
            
            try {
                const result = await adicionarEstoque(dadosEstoque);
                
                if (result.success) {
                    alert('Item adicionado ao estoque com sucesso!');
                    
                    // Limpar campos do formulário exceto NS selecionada
                    document.getElementById('codigo-item-entrada-estoque').value = '';
                    document.getElementById('descricao-item-entrada-estoque').value = '';
                    document.getElementById('unidade-item-entrada-estoque').value = '';
                    document.getElementById('quantidade-entrada-estoque').value = '';
                    document.getElementById('observacao-entrada-estoque').value = '';
                    
                    // Manter o responsável para facilitar entradas múltiplas
                    
                    // Atualizar lista de entradas e estoque
                    atualizarListaEntradasEstoque(nsCodigo);
                    
                    // Recarregar estoque geral
                    carregarEstoqueGeral();
                    
                    // Focar novamente no campo de código para novo item
                    document.getElementById('codigo-item-entrada-estoque').focus();
                }
            } catch (error) {
                // Erro já tratado na função fetchAPI
            }
        });
    }
});

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados iniciais
    carregarSelecaoIDs();
    carregarSelecaoNSs();
    carregarSelecaoItens();
    carregarEstoqueGeral();
    carregarTotaisResumo();
    atualizarListaIDs();
    atualizarListaNSs();
    atualizarListaItens();
    
    
    // Configurar listeners para os selects
    const selectID = document.getElementById('select-id');
    if (selectID) {
        selectID.addEventListener('change', carregarEstoquePorID);
    }
    
    const selectNS = document.getElementById('select-ns');
    if (selectNS) {
        selectNS.addEventListener('change', carregarEstoquePorNS);
    }
    
    const nsOrcamento = document.getElementById('ns-orcamento');
    if (nsOrcamento) {
        nsOrcamento.addEventListener('change', async function() {
            const nsCodigo = this.value;
            
            if (nsCodigo) {
                // Obter NS e ID associado
                const ns = await obterNS(nsCodigo);
                if (ns) {
                    document.getElementById('id-orcamento').textContent = ns.id_codigo;
                    
                    // Obter nome do projeto
                    const id = await obterID(ns.id_codigo);
                    if (id) {
                        document.getElementById('projeto-orcamento').textContent = id.nome_projeto;
                    }
                }
                
                // Atualizar lista de orçamento
                atualizarListaOrcamento(nsCodigo);
            } else {
                document.getElementById('id-orcamento').textContent = '-';
                document.getElementById('projeto-orcamento').textContent = '-';
                document.getElementById('lista-orcamento').innerHTML = '<tr><td colspan="5" class="text-center">Selecione uma NS</td></tr>';
            }
        });
    }
    
    // Configurar comportamento do campo de código do item
    const codigoItemOrcamento = document.getElementById('codigo-item-orcamento');
    const descricaoItemOrcamento = document.getElementById('descricao-item-orcamento');
    const unidadeItemOrcamento = document.getElementById('unidade-item-orcamento');
    const quantidadeOrcamento = document.getElementById('quantidade-orcamento');
    
    if (codigoItemOrcamento) {
        // Quando o usuário pressionar TAB ou ENTER após digitar o código
        codigoItemOrcamento.addEventListener('keydown', async function(e) {
            if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault(); // Prevenir comportamento padrão do TAB/ENTER
                
                const codigo = this.value.trim();
                if (codigo) {
                    // Buscar item no banco de dados
                    const item = await obterItem(codigo);
                    
                    if (item) {
                        // Preencher campos com os dados do item
                        descricaoItemOrcamento.value = item.descricao;
                        unidadeItemOrcamento.value = item.unidade;
                        
                        // Mover o foco para o campo de quantidade
                        quantidadeOrcamento.focus();
                    } else {
                        alert('Item não encontrado. Verifique o código digitado.');
                        this.focus();
                    }
                }
            }
        });
        
        // Quando o usuário pressionar ENTER no campo de quantidade
        quantidadeOrcamento.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevenir o envio do formulário
                
                // Verificar se tem valor
                if (this.value && parseFloat(this.value) > 0) {
                    // Submeter o formulário programaticamente
                    document.getElementById('form-cadastro-orcamento').dispatchEvent(new Event('submit'));
                }
            }
        });
    }
    
    // Configurar formulário de cadastro de ID
    const formCadastroID = document.getElementById('form-cadastro-id');
    if (formCadastroID) {
        formCadastroID.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const codigoID = document.getElementById('codigo-id');
            const isEdicao = codigoID.disabled;
            
            const dadosID = {
                id_codigo: codigoID.value,
                nome_projeto: document.getElementById('nome-projeto').value,
                cliente: document.getElementById('cliente-id').value,
                responsavel: document.getElementById('responsavel-id').value,
                data_inicio: document.getElementById('data-inicio').value,
                data_fim: document.getElementById('data-fim').value,
                observacoes: document.getElementById('observacoes-id').value
            };
            
            try {
                let result;
                
                if (isEdicao) {
                    result = await atualizarID(dadosID);
                    if (result.success) {
                        alert('ID atualizado com sucesso!');
                    }
                } else {
                    result = await cadastrarID(dadosID);
                    if (result.success) {
                        alert('ID cadastrado com sucesso!');
                    }
                }
                
                // Limpar formulário e reset estado
                formCadastroID.reset();
                codigoID.disabled = false;
                document.querySelector('#form-cadastro-id button[type="submit"]').textContent = 'Cadastrar ID';
                
                // Atualizar listas
                carregarSelecaoIDs();
                atualizarListaIDs();
            } catch (error) {
                // Erro já tratado na função fetchAPI
            }
        });
    }
    
    // Configurar formulário de cadastro de NS
    const formCadastroNS = document.getElementById('form-cadastro-ns');
    if (formCadastroNS) {
        formCadastroNS.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const codigoNS = document.getElementById('codigo-ns');
            const isEdicao = codigoNS.disabled;
            
            const dadosNS = {
                ns_codigo: codigoNS.value,
                id_codigo: document.getElementById('id-ns').value,
                descricao: document.getElementById('descricao-ns').value,
                data_criacao: document.getElementById('data-criacao-ns').value,
                status: document.getElementById('status-ns').value,
                observacoes: document.getElementById('observacoes-ns').value
            };
            
            try {
                let result;
                
                if (isEdicao) {
                    result = await atualizarNS(dadosNS);
                    if (result.success) {
                        alert('NS atualizada com sucesso!');
                    }
                } else {
                    result = await cadastrarNS(dadosNS);
                    if (result.success) {
                        alert('NS cadastrada com sucesso!');
                    }
                }
                
                // Limpar formulário e reset estado
                formCadastroNS.reset();
                codigoNS.disabled = false;
                document.querySelector('#form-cadastro-ns button[type="submit"]').textContent = 'Cadastrar NS';
                
                // Atualizar listas
                carregarSelecaoNSs();
                atualizarListaNSs();
            } catch (error) {
                // Erro já tratado na função fetchAPI
            }
        });
    }
    
    // Configurar formulário de cadastro de Item
    const formCadastroItem = document.getElementById('form-cadastro-item');
    if (formCadastroItem) {
        formCadastroItem.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const codigoItem = document.getElementById('codigo-item');
            const isEdicao = codigoItem.disabled;
            
            const dadosItem = {
                item_codigo: codigoItem.value,
                descricao: document.getElementById('descricao-item').value,
                unidade: document.getElementById('unidade-item').value
            };
            
            try {
                let result;
                
                if (isEdicao) {
                    result = await atualizarItem(dadosItem);
                    if (result.success) {
                        alert('Item atualizado com sucesso!');
                    }
                } else {
                    result = await cadastrarItem(dadosItem);
                    if (result.success) {
                        alert('Item cadastrado com sucesso!');
                    }
                }
                
                // Limpar formulário e reset estado
                formCadastroItem.reset();
                codigoItem.disabled = false;
                document.querySelector('#form-cadastro-item button[type="submit"]').textContent = 'Cadastrar Item';
                
                // Atualizar listas
                carregarSelecaoItens();
                atualizarListaItens();
            } catch (error) {
                // Erro já tratado na função fetchAPI
            }
        });
    }
    
    // Configurar formulário de cadastro de Orçamento
    const formCadastroOrcamento = document.getElementById('form-cadastro-orcamento');
    if (formCadastroOrcamento) {
        formCadastroOrcamento.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nsCodigo = document.getElementById('ns-orcamento').value;
            const itemCodigo = document.getElementById('codigo-item-orcamento').value;
            const quantidade = document.getElementById('quantidade-orcamento').value;
            
            if (!nsCodigo || !itemCodigo || !quantidade) {
                alert('Preencha todos os campos!');
                return;
            }
            
            const dadosOrcamento = {
                ns_codigo: nsCodigo,
                item_codigo: itemCodigo,
                quantidade: parseFloat(quantidade)
            };
            
            try {
                const result = await adicionarItemOrcamento(dadosOrcamento);
                
                if (result.success) {
                    // Limpar campos do item e quantidade
                    document.getElementById('codigo-item-orcamento').value = '';
                    document.getElementById('descricao-item-orcamento').value = '';
                    document.getElementById('unidade-item-orcamento').value = '';
                    document.getElementById('quantidade-orcamento').value = '';
                    
                    // Atualizar lista de orçamento
                    atualizarListaOrcamento(nsCodigo);
                    
                    // Focar novamente no campo de código para novo item
                    document.getElementById('codigo-item-orcamento').focus();
                }
            } catch (error) {
                // Erro já tratado na função fetchAPI
            }
        });
    }
    
    // Configurar formulário de adição ao estoque
    const formAdicionarEstoque = document.getElementById('form-adicionar-estoque');
    if (formAdicionarEstoque) {
        formAdicionarEstoque.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const dadosEstoque = {
                ns_codigo: document.getElementById('ns-adicionar').value,
                item_codigo: document.getElementById('item-adicionar').value,
                quantidade: parseFloat(document.getElementById('quantidade-adicionar').value),
                responsavel: document.getElementById('responsavel-adicionar').value,
                observacao: document.getElementById('observacao-adicionar').value
            };
            
            try {
                const result = await adicionarEstoque(dadosEstoque);
                
                if (result.success) {
                    alert('Item adicionado ao estoque com sucesso!');
                    formAdicionarEstoque.reset();
                    fecharModal('modal-adicionar-estoque');
                    
                    // Recarregar dados
                    carregarEstoqueGeral();
                    const selectID = document.getElementById('select-id');
                    if (selectID && selectID.value) {
                        carregarEstoquePorID();
                    }
                    
                    const selectNS = document.getElementById('select-ns');
                    if (selectNS && selectNS.value) {
                        carregarEstoquePorNS();
                    }
                }
            } catch (error) {
                // Erro já tratado na função fetchAPI
            }
        });
    }
    
    // Configurar formulário de retirada do estoque
    const formRetirarEstoque = document.getElementById('form-retirar-estoque');
    if (formRetirarEstoque) {
        formRetirarEstoque.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const dadosEstoque = {
                ns_codigo: document.getElementById('ns-retirar').value,
                item_codigo: document.getElementById('item-retirar').value,
                quantidade: parseFloat(document.getElementById('quantidade-retirar').value),
                responsavel: document.getElementById('responsavel-retirar').value,
                observacao: document.getElementById('observacao-retirar').value
            };
            
            try {
                const result = await retirarEstoque(dadosEstoque);
                
                if (result.success) {
                    alert('Item retirado do estoque com sucesso!');
                    formRetirarEstoque.reset();
                    fecharModal('modal-retirar-estoque');
                    
                    // Recarregar dados
                    carregarEstoqueGeral();
                    const selectID = document.getElementById('select-id');
                    if (selectID && selectID.value) {
                        carregarEstoquePorID();
                    }
                    
                    const selectNS = document.getElementById('select-ns');
                    if (selectNS && selectNS.value) {
                        carregarEstoquePorNS();
                    }
                }
            } catch (error) {
                // Erro já tratado na função fetchAPI
            }
        });
    }
    
    // Fechar modal quando clicar fora
    window.onclick = function(event) {
        const modais = document.getElementsByClassName('modal');
        for (let i = 0; i < modais.length; i++) {
            if (event.target === modais[i]) {
                modais[i].style.display = 'none';
            }
        }
    };

});