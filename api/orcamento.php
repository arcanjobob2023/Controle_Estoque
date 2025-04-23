<?php
// API para operações com Orçamento
// api/orcamento.php

header('Content-Type: application/json');
require_once '../conexao.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Listar Orçamento por NS
        if (isset($_GET['ns_codigo'])) {
            $ns_codigo = sanitizeInput($_GET['ns_codigo']);
            $sql = "SELECT o.*, i.descricao, i.unidade 
                   FROM orcamento_ns o
                   JOIN itens i ON o.item_codigo = i.item_codigo
                   WHERE o.ns_codigo = ?";
            $result = executeQuery($sql, [$ns_codigo]);
            echo json_encode($result);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'NS não fornecida'
            ]);
        }
        break;
        
    case 'POST':
        // Adicionar item ao orçamento
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['ns_codigo']) || !isset($data['item_codigo']) || 
            !isset($data['quantidade'])) {
            echo json_encode([
                'success' => false,
                'error' => 'Campos obrigatórios não fornecidos'
            ]);
            exit;
        }
        
        // Verificar se já existe o item para esta NS
        $check_sql = "SELECT id FROM orcamento_ns WHERE ns_codigo = ? AND item_codigo = ?";
        $check_result = executeQuery($check_sql, [
            sanitizeInput($data['ns_codigo']),
            sanitizeInput($data['item_codigo'])
        ]);
        
        if ($check_result['success'] && $check_result['num_rows'] > 0) {
            // Atualizar quantidade
            $sql = "UPDATE orcamento_ns SET quantidade = ? WHERE ns_codigo = ? AND item_codigo = ?";
            $params = [
                floatval($data['quantidade']),
                sanitizeInput($data['ns_codigo']),
                sanitizeInput($data['item_codigo'])
            ];
        } else {
            // Inserir novo item
            $sql = "INSERT INTO orcamento_ns (ns_codigo, item_codigo, quantidade) 
                    VALUES (?, ?, ?)";
            $params = [
                sanitizeInput($data['ns_codigo']),
                sanitizeInput($data['item_codigo']),
                floatval($data['quantidade'])
            ];
        }
        
        $result = executeQuery($sql, $params);
        echo json_encode($result);
        break;
        
    case 'PUT':
        // Atualizar quantidade de item no orçamento
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id']) || !isset($data['quantidade'])) {
            echo json_encode([
                'success' => false,
                'error' => 'ID ou quantidade não fornecidos'
            ]);
            exit;
        }
        
        $sql = "UPDATE orcamento_ns SET quantidade = ? WHERE id = ?";
        $result = executeQuery($sql, [
            floatval($data['quantidade']),
            intval($data['id'])
        ]);
        
        echo json_encode($result);
        break;
        
    case 'DELETE':
        // Remover item do orçamento
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = "DELETE FROM orcamento_ns WHERE id = ?";
            $result = executeQuery($sql, [$id]);
        } elseif (isset($_GET['ns_codigo']) && isset($_GET['item_codigo'])) {
            $ns_codigo = sanitizeInput($_GET['ns_codigo']);
            $item_codigo = sanitizeInput($_GET['item_codigo']);
            $sql = "DELETE FROM orcamento_ns WHERE ns_codigo = ? AND item_codigo = ?";
            $result = executeQuery($sql, [$ns_codigo, $item_codigo]);
        } else {
            $result = [
                'success' => false,
                'error' => 'ID ou NS+Item não fornecidos'
            ];
        }
        
        echo json_encode($result);
        break;
        
    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'error' => 'Método não permitido'
        ]);
}
?>