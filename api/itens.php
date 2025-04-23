<?php
// API para operações com Itens
// api/itens.php

header('Content-Type: application/json');
require_once '../conexao.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Listar Itens ou obter um Item específico
        if (isset($_GET['item_codigo'])) {
            // Obter Item específico
            $item_codigo = sanitizeInput($_GET['item_codigo']);
            $sql = "SELECT * FROM itens WHERE item_codigo = ?";
            $result = executeQuery($sql, [$item_codigo]);
            
            // Se encontrou o item, retornar o primeiro resultado
            if ($result['success'] && $result['num_rows'] > 0) {
                echo json_encode([
                    'success' => true,
                    'data' => $result['data'][0]
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'error' => 'Item não encontrado'
                ]);
            }
        } else {
            // Listar todos os Itens
            $sql = "SELECT * FROM itens ORDER BY descricao";
            $result = executeQuery($sql);
            echo json_encode($result);
        }
        break;
        
    case 'POST':
        // Adicionar novo Item
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['item_codigo']) || !isset($data['descricao']) || 
            !isset($data['unidade'])) {
            echo json_encode([
                'success' => false,
                'error' => 'Campos obrigatórios não fornecidos'
            ]);
            exit;
        }
        
        $sql = "INSERT INTO itens (item_codigo, descricao, unidade) 
                VALUES (?, ?, ?)";
        
        $params = [
            sanitizeInput($data['item_codigo']),
            sanitizeInput($data['descricao']),
            sanitizeInput($data['unidade'])
        ];
        
        $result = executeQuery($sql, $params);
        echo json_encode($result);
        break;
        
    case 'PUT':
        // Atualizar Item existente
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['item_codigo'])) {
            echo json_encode([
                'success' => false,
                'error' => 'Código do item não fornecido'
            ]);
            exit;
        }
        
        $fields = [];
        $params = [];
        
        if (isset($data['descricao'])) {
            $fields[] = "descricao = ?";
            $params[] = sanitizeInput($data['descricao']);
        }
        
        if (isset($data['unidade'])) {
            $fields[] = "unidade = ?";
            $params[] = sanitizeInput($data['unidade']);
        }
        
        if (empty($fields)) {
            echo json_encode([
                'success' => false,
                'error' => 'Nenhum campo para atualizar'
            ]);
            exit;
        }
        
        $sql = "UPDATE itens SET " . implode(', ', $fields) . " WHERE item_codigo = ?";
        $params[] = sanitizeInput($data['item_codigo']);
        
        $result = executeQuery($sql, $params);
        echo json_encode($result);
        break;
        
    case 'DELETE':
        // Excluir Item
        if (!isset($_GET['item_codigo'])) {
            echo json_encode([
                'success' => false,
                'error' => 'Código do item não fornecido'
            ]);
            exit;
        }
        
        $item_codigo = sanitizeInput($_GET['item_codigo']);
        $sql = "DELETE FROM itens WHERE item_codigo = ?";
        $result = executeQuery($sql, [$item_codigo]);
        
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