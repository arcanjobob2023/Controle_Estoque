<?php
// API para operações com NS (Notas de Serviço)
// api/ns.php

header('Content-Type: application/json');
require_once '../conexao.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Listar NS ou obter uma NS específica
        if (isset($_GET['ns_codigo'])) {
            // Obter NS específica
            $ns_codigo = sanitizeInput($_GET['ns_codigo']);
            $sql = "SELECT * FROM ns WHERE ns_codigo = ?";
            $result = executeQuery($sql, [$ns_codigo]);
        } elseif (isset($_GET['id_codigo'])) {
            // Listar NS por ID
            $id_codigo = sanitizeInput($_GET['id_codigo']);
            $sql = "SELECT * FROM ns WHERE id_codigo = ? ORDER BY data_criacao DESC";
            $result = executeQuery($sql, [$id_codigo]);
        } else {
            // Listar todas as NS
            $sql = "SELECT ns.*, ids.nome_projeto 
                   FROM ns 
                   JOIN ids ON ns.id_codigo = ids.id_codigo 
                   ORDER BY data_cadastro DESC";
            $result = executeQuery($sql);
        }
        
        echo json_encode($result);
        break;
        
    case 'POST':
        // Adicionar nova NS
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['ns_codigo']) || !isset($data['id_codigo']) || 
            !isset($data['descricao']) || !isset($data['data_criacao'])) {
            echo json_encode([
                'success' => false,
                'error' => 'Campos obrigatórios não fornecidos'
            ]);
            exit;
        }
        
        $sql = "INSERT INTO ns (ns_codigo, id_codigo, descricao, data_criacao, status, observacoes) 
                VALUES (?, ?, ?, ?, ?, ?)";
        
        $params = [
            sanitizeInput($data['ns_codigo']),
            sanitizeInput($data['id_codigo']),
            sanitizeInput($data['descricao']),
            sanitizeInput($data['data_criacao']),
            isset($data['status']) ? sanitizeInput($data['status']) : 'Aberta',
            isset($data['observacoes']) ? sanitizeInput($data['observacoes']) : null
        ];
        
        $result = executeQuery($sql, $params);
        echo json_encode($result);
        break;
        
    case 'PUT':
        // Atualizar NS existente
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['ns_codigo'])) {
            echo json_encode([
                'success' => false,
                'error' => 'NS não fornecida'
            ]);
            exit;
        }
        
        $fields = [];
        $params = [];
        
        if (isset($data['descricao'])) {
            $fields[] = "descricao = ?";
            $params[] = sanitizeInput($data['descricao']);
        }
        
        if (isset($data['data_criacao'])) {
            $fields[] = "data_criacao = ?";
            $params[] = sanitizeInput($data['data_criacao']);
        }
        
        if (isset($data['status'])) {
            $fields[] = "status = ?";
            $params[] = sanitizeInput($data['status']);
        }
        
        if (isset($data['observacoes'])) {
            $fields[] = "observacoes = ?";
            $params[] = sanitizeInput($data['observacoes']);
        }
        
        if (empty($fields)) {
            echo json_encode([
                'success' => false,
                'error' => 'Nenhum campo para atualizar'
            ]);
            exit;
        }
        
        $sql = "UPDATE ns SET " . implode(', ', $fields) . " WHERE ns_codigo = ?";
        $params[] = sanitizeInput($data['ns_codigo']);
        
        $result = executeQuery($sql, $params);
        echo json_encode($result);
        break;
        
    case 'DELETE':
        // Excluir NS
        if (!isset($_GET['ns_codigo'])) {
            echo json_encode([
                'success' => false,
                'error' => 'NS não fornecida'
            ]);
            exit;
        }
        
        $ns_codigo = sanitizeInput($_GET['ns_codigo']);
        $sql = "DELETE FROM ns WHERE ns_codigo = ?";
        $result = executeQuery($sql, [$ns_codigo]);
        
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