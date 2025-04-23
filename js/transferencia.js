// Carregar informações do item para transferência
function carregarInfoItem(codigoItem, nsOrigem) {
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
    api.get(`/itens/${codigoItem}`, function(err, item) {
        if (err) {
            console.error('Erro ao carregar informações do item:', err);
            alert('Erro ao buscar item: ' + err.message);
            return;
        }
        
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
       
       // Usar o endpoint correto para verificar o estoque
       api.get(`/estoque`, function(err, todosEstoques) {
           if (err) {
               console.error('Erro ao carregar estoque:', err);
               alert('Erro ao verificar estoque: ' + err.message);
               return;
           }
           
           // Filtrar para encontrar o item na NS específica
           const estoqueItem = todosEstoques.find(e => 
               e.ns === nsOrigem && e.codigoItem === codigoItem
           );
           
           console.log('Estoque encontrado:', estoqueItem);
           
           const quantidade = estoqueItem ? estoqueItem.quantidade : 0;
           document.getElementById('quantidade-disponivel').value = quantidade;
           
           // Se a quantidade for 0, alertar o usuário
           if (quantidade <= 0) {
               alert('Não há quantidade disponível deste item na NS de origem!');
           }
       });
   });
}