<?php
// API para operações com IDs
// api/ids.php

header('Content-Type: application/json');
require_once '../conexao.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Listar IDs ou obter um ID específico
        if (isset($_GET['id_codigo'])) {
            // Obter ID específico
            $id_codigo = sanitizeInput($_GET['id_codigo']);
            $sql = "SELECT * FROM ids WHERE id_codigo = ?";
            $result = executeQuery($sql, [$id_codigo]);
        } else {
            // Listar todos os IDs
            $sql = "SELECT i.*, 
                    (SELECT COUNT(*) FROM ns WHERE id_codigo = i.id_codigo) as ns_associadas 
                   FROM ids i ORDER BY data_cadastro DESC";
            $result = executeQuery($sql);
        }
        
        echo json_encode($result);
        break;
        
    case 'POST':
        // Adicionar novo ID
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id_codigo']) || !isset($data['nome_projeto']) || 
            !isset($data['cliente']) || !isset($data['responsavel']) || 
            !isset($data['data_inicio'])) {
            echo json_encode([
                'success' => false,
                'error' => 'Campos obrigatórios não fornecidos'
            ]);
            exit;
        }
        
        $sql = "INSERT INTO ids (id_codigo, nome_projeto, cliente, responsavel, data_inicio, data_fim, observacoes) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $params = [
            sanitizeInput($data['id_codigo']),
            sanitizeInput($data['nome_projeto']),
            sanitizeInput($data['cliente']),
            sanitizeInput($data['responsavel']),
            sanitizeInput($data['data_inicio']),
            isset($data['data_fim']) ? sanitizeInput($data['data_fim']) : null,
            isset($data['observacoes']) ? sanitizeInput($data['observacoes']) : null
        ];
        
        $result = executeQuery($sql, $params);
        echo json_encode($result);
        break;
        
    case 'PUT':
        // Atualizar ID existente
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id_codigo'])) {
            echo json_encode([
                'success' => false,
                'error' => 'ID não fornecido'
            ]);
            exit;
        }
        
        $fields = [];
        $params = [];
        
        if (isset($data['nome_projeto'])) {
            $fields[] = "nome_projeto = ?";
            $params[] = sanitizeInput($data['nome_projeto']);
        }
        
        if (isset($data['cliente'])) {
            $fields[] = "cliente = ?";
            $params[] = sanitizeInput($data['cliente']);
        }
        
        if (isset($data['responsavel'])) {
            $fields[] = "responsavel = ?";
            $params[] = sanitizeInput($data['responsavel']);
        }
        
        if (isset($data['data_inicio'])) {
            $fields[] = "data_inicio = ?";
            $params[] = sanitizeInput($data['data_inicio']);
        }
        
        if (isset($data['data_fim'])) {
            $fields[] = "data_fim = ?";
            $params[] = sanitizeInput($data['data_fim']);
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
        
        $sql = "UPDATE ids SET " . implode(', ', $fields) . " WHERE id_codigo = ?";
        $params[] = sanitizeInput($data['id_codigo']);
        
        $result = executeQuery($sql, $params);
        echo json_encode($result);
        break;
        
    case 'DELETE':
        // Excluir ID
        if (!isset($_GET['id_codigo'])) {
            echo json_encode([
                'success' => false,
                'error' => 'ID não fornecido'
            ]);
            exit;
        }
        
        $id_codigo = sanitizeInput($_GET['id_codigo']);
        $sql = "DELETE FROM ids WHERE id_codigo = ?";
        $result = executeQuery($sql, [$id_codigo]);
        
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







