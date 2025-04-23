// Funções para comunicação com a API
const API_BASE_URL = './api';

// Função genérica para realizar requisições AJAX
async function fetchAPI(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // Adicionar corpo da requisição se necessário
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        let url = `${API_BASE_URL}/${endpoint}`;
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!result.success && result.error) {
            throw new Error(result.error);
        }
        
        return result;
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert(`Erro: ${error.message}`);
        throw error;
    }
}

// ==== Funções para manipulação de IDs ====

// Listar todos os IDs
async function listarIDs() {
    try {
        const result = await fetchAPI('ids.php');
        return result.data || [];
    } catch (error) {
        return [];
    }
}

// Obter um ID específico
async function obterID(idCodigo) {
    try {
        const result = await fetchAPI(`ids.php?id_codigo=${idCodigo}`);
        return result.data && result.data.length > 0 ? result.data[0] : null;
    } catch (error) {
        return null;
    }
}

// Adicionar um novo ID
async function cadastrarID(dadosID) {
    return await fetchAPI('ids.php', 'POST', dadosID);
}

// Atualizar um ID existente
async function atualizarID(dadosID) {
    return await fetchAPI('ids.php', 'PUT', dadosID);
}

// Excluir um ID
async function excluirID(idCodigo) {
    return await fetchAPI(`ids.php?id_codigo=${idCodigo}`, 'DELETE');
}

// ==== Funções para manipulação de NSs ====

// Listar todas as NSs
async function listarNSs() {
    try {
        const result = await fetchAPI('ns.php');
        return result.data || [];
    } catch (error) {
        return [];
    }
}

// Listar NSs por ID
async function listarNSsPorID(idCodigo) {
    try {
        const result = await fetchAPI(`ns.php?id_codigo=${idCodigo}`);
        return result.data || [];
    } catch (error) {
        return [];
    }
}

// Obter uma NS específica
async function obterNS(nsCodigo) {
    try {
        const result = await fetchAPI(`ns.php?ns_codigo=${nsCodigo}`);
        return result.data && result.data.length > 0 ? result.data[0] : null;
    } catch (error) {
        return null;
    }
}

// Adicionar uma nova NS
async function cadastrarNS(dadosNS) {
    return await fetchAPI('ns.php', 'POST', dadosNS);
}

// Atualizar uma NS existente
async function atualizarNS(dadosNS) {
    return await fetchAPI('ns.php', 'PUT', dadosNS);
}

// Excluir uma NS
async function excluirNS(nsCodigo) {
    return await fetchAPI(`ns.php?ns_codigo=${nsCodigo}`, 'DELETE');
}

// ==== Funções para manipulação de Itens ====

// Listar todos os itens
async function listarItens() {
    try {
        const result = await fetchAPI('itens.php');
        return result.data || [];
    } catch (error) {
        return [];
    }
}

// Obter um item específico
async function obterItem(itemCodigo) {
    try {
        const result = await fetchAPI(`itens.php?item_codigo=${itemCodigo}`);
        return result.data && result.data.length > 0 ? result.data[0] : null;
    } catch (error) {
        return null;
    }
}

// Adicionar um novo item
async function cadastrarItem(dadosItem) {
    return await fetchAPI('itens.php', 'POST', dadosItem);
}

// Atualizar um item existente
async function atualizarItem(dadosItem) {
    return await fetchAPI('itens.php', 'PUT', dadosItem);
}

// Excluir um item
async function excluirItem(itemCodigo) {
    return await fetchAPI(`itens.php?item_codigo=${itemCodigo}`, 'DELETE');
}

// ==== Funções para manipulação de Orçamento ====

// Listar orçamento por NS
async function listarOrcamentoPorNS(nsCodigo) {
    try {
        const result = await fetchAPI(`orcamento.php?ns_codigo=${nsCodigo}`);
        return result.data || [];
    } catch (error) {
        return [];
    }
}

// Adicionar item ao orçamento
async function adicionarItemOrcamento(dadosOrcamento) {
    return await fetchAPI('orcamento.php', 'POST', dadosOrcamento);
}

// Atualizar quantidade de item no orçamento
async function atualizarItemOrcamento(id, quantidade) {
    return await fetchAPI('orcamento.php', 'PUT', { id, quantidade });
}

// Remover item do orçamento
async function removerItemOrcamento(id) {
    return await fetchAPI(`orcamento.php?id=${id}`, 'DELETE');
}

// ==== Funções para manipulação de Estoque ====

// Obter estoque geral
async function obterEstoqueGeral() {
    try {
        const result = await fetchAPI('estoque.php?tipo=geral');
        return result.data || [];
    } catch (error) {
        return [];
    }
}

// Obter estoque por ID
async function obterEstoquePorID(idCodigo) {
    try {
        const result = await fetchAPI(`estoque.php?id_codigo=${idCodigo}`);
        return result.data || [];
    } catch (error) {
        return [];
    }
}

// Obter estoque por NS
async function obterEstoquePorNS(nsCodigo) {
    try {
        const result = await fetchAPI(`estoque.php?ns_codigo=${nsCodigo}`);
        return result.data || [];
    } catch (error) {
        return [];
    }
}

// Adicionar ao estoque
async function adicionarEstoque(dadosEstoque) {
    return await fetchAPI('estoque.php', 'POST', dadosEstoque);
}

// Retirar do estoque
async function retirarEstoque(dadosEstoque) {
    return await fetchAPI('estoque.php', 'PUT', dadosEstoque);
}

// Obter estoque de um item específico em uma NS
async function obterEstoqueItemNS(nsCodigo, itemCodigo) {
    try {
        const result = await fetchAPI(`estoque.php?ns_codigo=${nsCodigo}&item_codigo=${itemCodigo}`);
        return result.data && result.data.length > 0 ? result.data[0] : null;
    } catch (error) {
        console.error('Erro ao obter estoque do item na NS:', error);
        return null;
    }
}

// ==== Funções para manipulação de Transferências ====

// Listar todas as transferências
async function listarTransferencias(filtroNS = null) {
    try {
        let endpoint = 'transferencias.php';
        if (filtroNS) {
            endpoint += `?ns_codigo=${filtroNS}`;
        }
        
        const result = await fetchAPI(endpoint);
        return result.data || [];
    } catch (error) {
        console.error('Erro ao listar transferências:', error);
        return [];
    }
}

// Obter uma transferência específica
async function obterTransferencia(transferenciaID) {
    try {
        const result = await fetchAPI(`transferencias.php?id=${transferenciaID}`);
        return result.data && result.data.length > 0 ? result.data[0] : null;
    } catch (error) {
        console.error('Erro ao obter transferência:', error);
        return null;
    }
}

// Registrar uma nova transferência
async function registrarTransferencia(dadosTransferencia) {
    try {
        return await fetchAPI('transferencias.php', 'POST', dadosTransferencia);
    } catch (error) {
        console.error('Erro ao registrar transferência:', error);
        throw error;
    }
}

// Atualizar uma transferência existente (para devolução)
async function atualizarTransferencia(dadosTransferencia) {
    try {
        return await fetchAPI('transferencias.php', 'PUT', dadosTransferencia);
    } catch (error) {
        console.error('Erro ao atualizar transferência:', error);
        throw error;
    }
}

// ==== Funções para carregar dados nas páginas ====

// Carregar dados da página de Estoque Geral
async function carregarEstoqueGeral() {
    const tbody = document.querySelector('#estoque-geral table tbody');
    const estoque = await obterEstoqueGeral();

    if (tbody) {
        tbody.innerHTML = '';

        if (estoque.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum item encontrado</td></tr>';
        } else {
            estoque.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.id_codigo}</td>
                    <td>${item.ns_codigo}</td>
                    <td>${item.item_codigo}</td>
                    <td>${item.item_descricao}</td>
                    <td>${item.unidade}</td>
                    <td>${item.quantidade_atual}</td>
                    <td>
                        <button onclick="abrirModalRetirarEstoque('${item.ns_codigo}', '${item.item_codigo}', '${item.item_descricao}')">Retirar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Atualizar os contadores do topo da página
        document.getElementById('total-itens').textContent = estoque.length;
        document.getElementById('total-ids').textContent = new Set(estoque.map(e => e.id_codigo)).size;
        document.getElementById('total-ns').textContent = new Set(estoque.map(e => e.ns_codigo)).size;
    }
}


// Carregar dados da página de Estoque por ID
async function carregarEstoquePorID() {
    const selectID = document.getElementById('select-id');
    const tbody = document.querySelector('#estoque-id table tbody');
    
    // Limpar tabela
    if (tbody) {
        tbody.innerHTML = '';
    }
    
    // Se nenhum ID selecionado, sair
    if (!selectID || !selectID.value) {
        return;
    }
    
    const estoque = await obterEstoquePorID(selectID.value);
    
    if (tbody) {
        if (estoque.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum item encontrado</td></tr>';
            return;
        }
        
        estoque.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.item_codigo}</td>
                <td>${item.item_descricao}</td>
                <td>${item.unidade}</td>
                <td>${item.quantidade_total}</td>
                <td>${item.ns_associadas}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Carregar dados da página de Estoque por NS
async function carregarEstoquePorNS() {
    const selectNS = document.getElementById('select-ns');
    const tbody = document.querySelector('#estoque-ns table tbody');
    const nsInfo = document.getElementById('ns-info');
    
    // Limpar tabela
    if (tbody) {
        tbody.innerHTML = '';
    }
    
    // Limpar info
    if (nsInfo) {
        nsInfo.innerHTML = '';
    }
    
    // Se nenhuma NS selecionada, sair
    if (!selectNS || !selectNS.value) {
        return;
    }
    
    // Obter informações da NS
    const ns = await obterNS(selectNS.value);
    
    if (nsInfo && ns) {
        nsInfo.innerHTML = `<p><strong>ID Associado:</strong> ${ns.id_codigo}</p>`;
    }
    
    const estoque = await obterEstoquePorNS(selectNS.value);
    
    if (tbody) {
        if (estoque.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum item encontrado</td></tr>';
            return;
        }
        
        estoque.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.item_codigo}</td>
                <td>${item.item_descricao}</td>
                <td>${item.unidade}</td>
                <td>${item.quantidade_atual}</td>
                <td>
                    <button onclick="abrirModalRetirarEstoque('${item.ns_codigo}', '${item.item_codigo}', '${item.item_descricao}')">Retirar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Carregar lista de IDs nos selects
async function carregarSelecaoIDs() {
    const selects = document.querySelectorAll('select[data-tipo="ids"]');
    const ids = await listarIDs();
    
    selects.forEach(select => {
        const valorAtual = select.value;
        select.innerHTML = '<option value="">Selecione um ID</option>';
        
        ids.forEach(id => {
            const option = document.createElement('option');
            option.value = id.id_codigo;
            option.textContent = `${id.id_codigo} - ${id.nome_projeto}`;
            select.appendChild(option);
        });
        
        // Restaurar valor selecionado
        if (valorAtual) {
            select.value = valorAtual;
        }
    });
}

// Carregar lista de NSs nos selects
async function carregarSelecaoNSs() {
    const selects = document.querySelectorAll('select[data-tipo="ns"]');
    const nss = await listarNSs();
    
    selects.forEach(select => {
        const valorAtual = select.value;
        select.innerHTML = '<option value="">Selecione uma NS</option>';
        
        nss.forEach(ns => {
            const option = document.createElement('option');
            option.value = ns.ns_codigo;
            option.textContent = `${ns.ns_codigo} - ${ns.descricao}`;
            select.appendChild(option);
        });
        
        // Restaurar valor selecionado
        if (valorAtual) {
            select.value = valorAtual;
        }
    });
}

// Carregar lista de Itens nos selects
async function carregarSelecaoItens() {
    const selects = document.querySelectorAll('select[data-tipo="itens"]');
    const itens = await listarItens();
    
    selects.forEach(select => {
        const valorAtual = select.value;
        select.innerHTML = '<option value="">Selecione um Item</option>';
        
        itens.forEach(item => {
            const option = document.createElement('option');
            option.value = item.item_codigo;
            option.textContent = `${item.item_codigo} - ${item.descricao} (${item.unidade})`;
            select.appendChild(option);
        });
        
        // Restaurar valor selecionado
        if (valorAtual) {
            select.value = valorAtual;
        }
    });
}

// ==== Funções para Transferência de Material ====

// Carregar informações da NS de origem
async function carregarInfoNsOrigem(nsCodigo) {
    try {
        console.log('Carregando informações da NS de origem:', nsCodigo);
        
        // Obter dados da NS
        const ns = await obterNS(nsCodigo);
        
        if (!ns) {
            console.error('NS de origem não encontrada');
            return;
        }
        
        // Preencher o ID associado
        document.getElementById('id-origem').textContent = ns.id_codigo || '-';
        
        // Se tiver ID associado, buscar o nome do projeto
        if (ns.id_codigo) {
            const id = await obterID(ns.id_codigo);
            
            if (id) {
                document.getElementById('projeto-origem').textContent = id.nome_projeto || '-';
            } else {
                document.getElementById('projeto-origem').textContent = '-';
            }
        } else {
            document.getElementById('projeto-origem').textContent = '-';
        }
    } catch (error) {
        console.error('Erro ao carregar informações da NS de origem:', error);
    }
}

// Limpar informações da NS de origem
function limparInfoNsOrigem() {
    document.getElementById('id-origem').textContent = '-';
    document.getElementById('projeto-origem').textContent = '-';
}

// Carregar informações da NS de destino
async function carregarInfoNsDestino(nsCodigo) {
    try {
        console.log('Carregando informações da NS de destino:', nsCodigo);
        
        // Obter dados da NS
        const ns = await obterNS(nsCodigo);
        
        if (!ns) {
            console.error('NS de destino não encontrada');
            return;
        }
        
        // Preencher o ID associado
        document.getElementById('id-destino').textContent = ns.id_codigo || '-';
        
        // Se tiver ID associado, buscar o nome do projeto
        if (ns.id_codigo) {
            const id = await obterID(ns.id_codigo);
            
            if (id) {
                document.getElementById('projeto-destino').textContent = id.nome_projeto || '-';
            } else {
                document.getElementById('projeto-destino').textContent = '-';
            }
        } else {
            document.getElementById('projeto-destino').textContent = '-';
        }
    } catch (error) {
        console.error('Erro ao carregar informações da NS de destino:', error);
    }
}

// Limpar informações da NS de destino
function limparInfoNsDestino() {
    document.getElementById('id-destino').textContent = '-';
    document.getElementById('projeto-destino').textContent = '-';
}

// Carregar informações do item para transferência
async function carregarInfoItem(codigoItem, nsOrigem) {
    try {
        // Verificar se o código do item e a NS de origem estão preenchidos
        if (!codigoItem) {
            alert('Digite o código do item');
            return;
        }
        
        if (!nsOrigem) {
            alert('Selecione a NS de origem primeiro');
            return;
        }
        
        console.log('Buscando item:', codigoItem);
        
        // Primeiro, buscar o item no catálogo
        const item = await obterItem(codigoItem);
        
        if (!item) {
            alert('Item não encontrado no catálogo!');
            return;
        }
        
        console.log('Item encontrado:', item);
        
        // Preencher os campos de descrição e unidade
        document.getElementById('descricao-item-transferencia').value = item.descricao || '';
        document.getElementById('unidade-item-transferencia').value = item.unidade || '';
        
        // Agora, verificar a quantidade disponível na NS de origem
        console.log('Verificando estoque na NS:', nsOrigem);
        
        // Buscar estoque específico deste item na NS
        const estoqueItem = await obterEstoqueItemNS(nsOrigem, codigoItem);
        
        console.log('Estoque encontrado:', estoqueItem);
        
        const quantidade = estoqueItem ? estoqueItem.quantidade_atual : 0;
        document.getElementById('quantidade-disponivel').value = quantidade;
        
        // Se a quantidade for 0, alertar o usuário
        if (quantidade <= 0) {
            alert('Não há quantidade disponível deste item na NS de origem!');
        }
    } catch (error) {
        console.error('Erro ao carregar informações do item:', error);
        alert('Erro ao buscar informações do item: ' + error.message);
    }
}

// Registrar transferência de material
async function registrarTransferencia() {
    try {
        const nsOrigem = document.getElementById('ns-origem').value;
        const nsDestino = document.getElementById('ns-destino').value;
        const codigoItem = document.getElementById('codigo-item-transferencia').value;
        const descricaoItem = document.getElementById('descricao-item-transferencia').value;
        const unidadeItem = document.getElementById('unidade-item-transferencia').value;
        const quantidadeTransferir = parseFloat(document.getElementById('quantidade-transferencia').value);
        const quantidadeDisponivel = parseFloat(document.getElementById('quantidade-disponivel').value);
        const responsavel = document.getElementById('responsavel-transferencia').value;
        const observacao = document.getElementById('observacao-transferencia').value;
        
        console.log('Iniciando transferência de material');
        console.log('NS Origem:', nsOrigem);
        console.log('NS Destino:', nsDestino);
        console.log('Código Item:', codigoItem);
        console.log('Quantidade a transferir:', quantidadeTransferir);
        console.log('Quantidade disponível:', quantidadeDisponivel);
        
        // Validações
        if (!nsOrigem) {
            alert('Selecione a NS de origem!');
            return;
        }
        
        if (!nsDestino) {
            alert('Selecione a NS de destino!');
            return;
        }
        
        if (nsOrigem === nsDestino) {
            alert('A NS de origem e destino não podem ser iguais!');
            return;
        }
        
        if (!codigoItem) {
            alert('Selecione um item!');
            return;
        }
        
        if (!quantidadeTransferir || quantidadeTransferir <= 0) {
            alert('A quantidade a transferir deve ser maior que zero!');
            return;
        }
        
        if (quantidadeTransferir > quantidadeDisponivel) {
            alert('A quantidade a transferir não pode ser maior que a quantidade disponível!');
            return;
        }
        
        if (!responsavel) {
            alert('Informe o responsável pela transferência!');
            return;
        }
        
        // Criar o objeto de transferência com a descrição e unidade obtidas do formulário
        const transferencia = {
            ns_origem: nsOrigem,
            ns_destino: nsDestino,
            item_codigo: codigoItem,
            item_descricao: descricaoItem,
            unidade: unidadeItem,
            quantidade: quantidadeTransferir,
            responsavel: responsavel,
            observacao: observacao,
            data_transferencia: new Date().toISOString(),
            status: 'Transferido',
            quantidade_devolvida: 0
        };
        
        console.log('Objeto de transferência:', transferencia);
        
        // Registrar a transferência
        const resultado = await registrarTransferencia(transferencia);
        
        if (!resultado.success) {
            throw new Error(resultado.error || 'Erro ao registrar transferência');
        }
        
        console.log('Transferência registrada com sucesso:', resultado);
        alert('Transferência registrada com sucesso!');
        
        // Atualizar o estoque na NS de origem (retirar)
        const retiradaEstoque = {
            ns_codigo: nsOrigem,
            item_codigo: codigoItem,
            quantidade: quantidadeTransferir,
            tipo_movimento: 'retirada',
            responsavel: responsavel,
            observacao: `Transferência para NS ${nsDestino}`
        };
        
        await retirarEstoque(retiradaEstoque);
        
        console.log('Estoque na origem atualizado com sucesso');
        
        // Atualizar o estoque na NS de destino (adicionar)
        const adicaoEstoque = {
            ns_codigo: nsDestino,
            item_codigo: codigoItem,
            quantidade: quantidadeTransferir,
            responsavel: responsavel,
            observacao: `Transferência da NS ${nsOrigem}`
        };
        
        await adicionarEstoque(adicaoEstoque);
        
        console.log('Estoque no destino atualizado com sucesso');
        
        // Limpar o formulário
        document.getElementById('form-transferencia-material').reset();
        document.getElementById('descricao-item-transferencia').value = '';
        document.getElementById('unidade-item-transferencia').value = '';
        document.getElementById('quantidade-disponivel').value = '';
        limparInfoNsOrigem();
        limparInfoNsDestino();
        
        // Atualizar o histórico de transferências
        await carregarHistoricoTransferencias();
        
    } catch (error) {
        console.error('Erro ao processar transferência:', error);
        alert('Erro ao processar transferência: ' + error.message);
    }
}

// Carregar histórico de transferências
async function carregarHistoricoTransferencias(filtroNs = null) {
    try {
        console.log('Carregando histórico de transferências');
        
        const transferencias = await listarTransferencias(filtroNs);
        
        const tbody = document.getElementById('lista-transferencias');
        
        if (!tbody) {
            console.error('Elemento lista-transferencias não encontrado');
            return;
        }
        
        if (!transferencias || transferencias.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center">Nenhuma transferência encontrada</td></tr>';
            return;
        }
        
        // Ordenar por data, mais recente primeiro
        transferencias.sort((a, b) => new Date(b.data_transferencia) - new Date(a.data_transferencia));
        
        let html = '';
        
        transferencias.forEach(function(t) {
            const dataFormatada = new Date(t.data_transferencia).toLocaleDateString('pt-BR');
            const podeDevolver = t.status === 'Transferido' || (t.status === 'Devolvido Parcialmente' && t.quantidade > t.quantidade_devolvida);
            
            html += `
            <tr>
                <td>${dataFormatada}</td>
                <td>${t.ns_origem}</td>
                <td>${t.ns_destino}</td>
                <td>${t.item_codigo}</td>
                <td>${t.item_descricao || '-'}</td>
                <td>${t.quantidade} ${t.unidade || ''}</td>
                <td>${t.responsavel}</td>
                <td data-status="${t.status}">${t.status}</td>
                <td>
                    ${podeDevolver ? 
                      `<button class="btn-small" onclick="abrirModalDevolucao('${t.id}')">Devolver</button>` : 
                      '<span class="badge">Concluído</span>'}
                </td>
            </tr>`;
        });
        
        tbody.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar histórico de transferências:', error);
    }
}

// Abrir modal de devolução
async function abrirModalDevolucao(transferenciaid) {
    try {
        console.log('Abrindo modal de devolução para transferência:', transferenciaid);
        
        // Buscar os detalhes da transferência
        const transferencia = await obterTransferencia(transferenciaid);
        
        if (!transferencia) {
            alert('Transferência não encontrada!');
            return;
        }
        
        // Preencher os dados no modal
        document.getElementById('transferencia-id').value = transferencia.id;
        document.getElementById('devolucao-ns-origem').textContent = transferencia.ns_origem;
        document.getElementById('devolucao-ns-destino').textContent = transferencia.ns_destino;
        document.getElementById('devolucao-item-texto').textContent = `${transferencia.item_codigo} - ${transferencia.item_descricao || ''}`;
        document.getElementById('devolucao-quantidade-original').textContent = `${transferencia.quantidade} ${transferencia.unidade || ''}`;
        document.getElementById('devolucao-quantidade-devolvida').textContent = `${transferencia.quantidade_devolvida || 0} ${transferencia.unidade || ''}`;
        
        // Calcular quantidade máxima que pode ser devolvida
        const quantidadeRestante = transferencia.quantidade - (transferencia.quantidade_devolvida || 0);
        document.getElementById('quantidade-devolucao').max = quantidadeRestante;
        document.getElementById('quantidade-devolucao').value = quantidadeRestante; // Preencher com o valor máximo por padrão
        
        // Verificar se o item ainda está disponível na NS de destino
        const estoqueItem = await obterEstoqueItemNS(transferencia.ns_destino, transferencia.item_codigo);
        
        const quantidadeDisponivel = estoqueItem ? estoqueItem.quantidade_atual : 0;
        
        if (quantidadeDisponivel < quantidadeRestante) {
            alert(`Atenção: A NS de destino tem apenas ${quantidadeDisponivel} ${transferencia.unidade || ''} disponíveis para devolução do total de ${quantidadeRestante} ${transferencia.unidade || ''} que poderiam ser devolvidos.`);
            document.getElementById('quantidade-devolucao').max = quantidadeDisponivel;
            document.getElementById('quantidade-devolucao').value = quantidadeDisponivel;
        }
        
        // Abrir o modal
        document.getElementById('modal-devolucao').style.display = 'block';
    } catch (error) {
        console.error('Erro ao abrir modal de devolução:', error);
        alert('Erro ao abrir modal de devolução: ' + error.message);
    }
}

// Registrar devolução de material
async function registrarDevolucao() {
    try {
        const transferenciaid = document.getElementById('transferencia-id').value;
        const quantidadeDevolucao = parseFloat(document.getElementById('quantidade-devolucao').value);
        const responsavel = document.getElementById('responsavel-devolucao').value;
        const observacao = document.getElementById('observacao-devolucao').value;
        
        // Validações
        if (!quantidadeDevolucao || quantidadeDevolucao <= 0) {
            alert('A quantidade a devolver deve ser maior que zero!');
            return;
        }
        
        if (!responsavel) {
            alert('Informe o responsável pela devolução!');
            return;
        }
        
        // Buscar informações da transferência
        const transferencia = await obterTransferencia(transferenciaid);
        
        if (!transferencia) {
            alert('Transferência não encontrada!');
            return;
        }
        
        // Validar quantidade disponível na NS de destino
        const estoqueItem = await obterEstoqueItemNS(transferencia.ns_destino, transferencia.item_codigo);
        
        const quantidadeDisponivel = estoqueItem ? estoqueItem.quantidade_atual : 0;
        
        if (quantidadeDisponivel < quantidadeDevolucao) {
            alert(`Não há quantidade suficiente disponível na NS de destino. Disponível: ${quantidadeDisponivel}`);
            return;
        }
        
        // Calcular nova quantidade devolvida total
        const novaQuantidadeDevolvida = (transferencia.quantidade_devolvida || 0) + quantidadeDevolucao;
        
        // Determinar o novo status
        let novoStatus;
        if (novaQuantidadeDevolvida >= transferencia.quantidade) {
            novoStatus = 'Devolvido Totalmente';
        } else {
            novoStatus = 'Devolvido Parcialmente';
        }
        
        // Atualizar o registro da transferência
        const dadosAtualizacao = {
            id: transferenciaid,
            quantidade_devolvida: novaQuantidadeDevolvida,
            status: novoStatus,
            data_devolucao: new Date().toISOString(),
            responsavel_devolucao: responsavel,
            observacao_devolucao: observacao
        };
        
        // Atualizar a transferência
        const resultadoAtualizacao = await atualizarTransferencia(dadosAtualizacao);
        
        if (!resultadoAtualizacao.success) {
            throw new Error(resultadoAtualizacao.error || 'Erro ao atualizar transferência');
        }
        
        // Atualizar o estoque: retirar da NS de destino
        const retiradaEstoque = {
            ns_codigo: transferencia.ns_destino,
            item_codigo: transferencia.item_codigo,
            quantidade: quantidadeDevolucao,
            tipo_movimento: 'retirada',
            responsavel: responsavel,
            observacao: `Devolução para NS ${transferencia.ns_origem}`
        };
        
        await retirarEstoque(retiradaEstoque);
        
        // Atualizar o estoque: adicionar à NS de origem
        const adicaoEstoque = {
            ns_codigo: transferencia.ns_origem,
            item_codigo: transferencia.item_codigo,
            quantidade: quantidadeDevolucao,
            responsavel: responsavel,
            observacao: `Devolução da NS ${transferencia.ns_destino}`
        };
        
        await adicionarEstoque(adicaoEstoque);
        
        alert('Devolução registrada com sucesso!');
        
        // Fechar o modal
        document.getElementById('modal-devolucao').style.display = 'none';
        
        // Atualizar o histórico de transferências
        await carregarHistoricoTransferencias();
        
    } catch (error) {
        console.error('Erro ao processar devolução:', error);
        alert('Erro ao processar devolução: ' + error.message);
    }
}

// Função para abrir modal
function abrirModal(id) {
    document.getElementById(id).style.display = 'block';
}

// Função para fechar modal
function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados iniciais
    carregarSelecaoIDs();
    carregarSelecaoNSs();
    carregarSelecaoItens();
    carregarEstoqueGeral();
    
    // Configurar listeners para os selects
    const selectID = document.getElementById('select-id');
    if (selectID) {
        selectID.addEventListener('change', carregarEstoquePorID);
    }
    
    const selectNS = document.getElementById('select-ns');
    if (selectNS) {
        selectNS.addEventListener('change', carregarEstoquePorNS);
    }
    
    // Configurar eventos para a tela de transferência de material
    const nsOrigemSelect = document.getElementById('ns-origem');
    if (nsOrigemSelect) {
        nsOrigemSelect.addEventListener('change', function() {
            const nsOrigem = this.value;
            if (nsOrigem) {
                carregarInfoNsOrigem(nsOrigem);
                // Limpar o código do item e descrição quando mudar a NS
                document.getElementById('codigo-item-transferencia').value = '';
                document.getElementById('descricao-item-transferencia').value = '';
                document.getElementById('unidade-item-transferencia').value = '';
                document.getElementById('quantidade-disponivel').value = '';
            } else {
                limparInfoNsOrigem();
            }
        });
    }

    const nsDestinoSelect = document.getElementById('ns-destino');
    if (nsDestinoSelect) {
        nsDestinoSelect.addEventListener('change', function() {
            const nsDestino = this.value;
            if (nsDestino) {
                carregarInfoNsDestino(nsDestino);
            } else {
                limparInfoNsDestino();
            }
        });
    }

    const codigoItemTransferencia = document.getElementById('codigo-item-transferencia');
    if (codigoItemTransferencia) {
        // Evento quando o campo perde o foco
        codigoItemTransferencia.addEventListener('blur', function() {
            const codigoItem = this.value.trim();
            const nsOrigem = document.getElementById('ns-origem').value;
            
            if (codigoItem && nsOrigem) {
                carregarInfoItem(codigoItem, nsOrigem);
            }
        });
        
        // Evento para a tecla Tab
        codigoItemTransferencia.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const codigoItem = this.value.trim();
                const nsOrigem = document.getElementById('ns-origem').value;
                
                if (codigoItem && nsOrigem) {
                    // Evitar comportamento padrão do Tab
                    e.preventDefault();
                    
                    // Buscar informações do item
                    carregarInfoItem(codigoItem, nsOrigem);
                    
                    // Focar no próximo campo após buscar as informações
                    setTimeout(() => {
                        document.getElementById('quantidade-transferencia').focus();
                    }, 100);
                }
            }
        });
    }

    const filtroTransferencias = document.getElementById('filtro-transferencias');
    if (filtroTransferencias) {
        filtroTransferencias.addEventListener('change', function() {
            carregarHistoricoTransferencias(this.value);
        });
    }

    const formTransferencia = document.getElementById('form-transferencia-material');
    if (formTransferencia) {
        formTransferencia.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarTransferencia();
        });
    }

    const formDevolucao = document.getElementById('form-devolucao');
    if (formDevolucao) {
        formDevolucao.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarDevolucao();
        });
    }
    
    // Verificar se a página de transferência está ativa
    const paginaTransferencia = document.getElementById('transferencia-material');
    if (paginaTransferencia && paginaTransferencia.classList.contains('active-page')) {
        carregarHistoricoTransferencias();
    }
    
    // Configurar formulário de cadastro de ID
    const formCadastroID = document.getElementById('form-cadastro-id');
    if (formCadastroID) {
        formCadastroID.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const dadosID = {
                id_codigo: document.getElementById('codigo-id').value,
                nome_projeto: document.getElementById('nome-projeto').value,
                cliente: document.getElementById('cliente-id').value,
                responsavel: document.getElementById('responsavel-id').value,
                data_inicio: document.getElementById('data-inicio').value,
                data_fim: document.getElementById('data-fim').value,
                observacoes: document.getElementById('observacoes-id').value
            };
            
            try {
                const result = await cadastrarID(dadosID);
                if (result.success) {
                    alert('ID cadastrado com sucesso!');
                    formCadastroID.reset();
                    carregarSelecaoIDs();
                }
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
            
            const dadosItem = {
                item_codigo: document.getElementById('codigo-item').value,
                descricao: document.getElementById('descricao-item').value,
                unidade: document.getElementById('unidade-item').value
            };
            
            try {
                const result = await cadastrarItem(dadosItem);
                if (result.success) {
                    alert('Item cadastrado com sucesso!');
                    formCadastroItem.reset();
                    carregarSelecaoItens();
                }
            } catch (error) {
                // Erro já tratado na função fetchAPI
            }
        });
    }
});