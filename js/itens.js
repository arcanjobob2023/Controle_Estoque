// Função para buscar item pelo código
import { obterItem } from './api.js';

async function buscarItemPorCodigo(codigo) {
    try {
        const item = await obterItem(codigo);
        return item;
    } catch (error) {
        console.error('Erro ao buscar item:', error);
        return null;
    }
}

export { buscarItemPorCodigo };