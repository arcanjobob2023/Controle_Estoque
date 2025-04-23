<?php
// Modificação do endpoint estoque.php para incluir histórico de entradas e saídas
// api/estoque.php

header('Content-Type: application/json');
require_once '../conexao.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Obter estoque
        if (isset($_GET['historico']) && $_GET['historico'] == 'entrada' && isset($_GET['ns_codigo'])) {
            // Histórico de entradas para uma NS específica
            $ns_codigo = sanitizeInput($_GET['ns_codigo']);
            $sql = "SELECT e.*, i.descricao, i.unidade 
                   FROM estoque e
                   JOIN itens i ON e.item_codigo = i.item_codigo
                   WHERE e.ns_codigo = ? AND e.quantidade_entrada > 0
                   ORDER BY e.data_movimento DESC";
            $result = executeQuery($sql, [$ns_codigo]);
            echo json_encode($result);
            
        } elseif (isset($_GET['historico']) && $_GET['historico'] == 'saida' && isset($_GET['ns_codigo'])) {
            // Histórico de saídas para uma NS específica
            $ns_codigo = sanitizeInput($_GET['ns_codigo']);
            $sql = "SELECT e.*, i.descricao, i.unidade 
                   FROM estoque e
                   JOIN itens i ON e.item_codigo = i.item_codigo
                   WHERE e.ns_codigo = ? AND e.quantidade_saida > 0
                   ORDER BY e.data_movimento DESC";
            $result = executeQuery($sql, [$ns_codigo]);
            echo json_encode($result);
            
        } elseif (isset($_GET['tipo']) && $_GET['tipo'] == 'geral') {
            // Estoque geral
            $sql = "SELECT * FROM vw_estoque_atual ORDER BY id_codigo, ns_codigo, item_codigo";
            $result = executeQuery($sql);
            echo json_encode($result);
            
        } elseif (isset($_GET['id_codigo'])) {
            // Estoque por ID
            $id_codigo = sanitizeInput($_GET['id_codigo']);
            $sql = "SELECT * FROM vw_estoque_por_id WHERE id_codigo = ?";
            $result = executeQuery($sql, [$id_codigo]);
            echo json_encode($result);
            
        } elseif (isset($_GET['ns_codigo'])) {
            // Estoque por NS
            $ns_codigo = sanitizeInput($_GET['ns_codigo']);
            $sql = "SELECT * FROM vw_estoque_atual WHERE ns_codigo = ?";
            $result = executeQuery($sql, [$ns_codigo]);
            echo json_encode($result);
            
        } else {
            $result = [
                'success' => false,
                'error' => 'Parâmetro de consulta não fornecido'
            ];
            echo json_encode($result);
        }
        break;
        
    case 'POST':
        // Adicionar ao estoque
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['ns_codigo']) || !isset($data['item_codigo']) || 
            !isset($data['quantidade']) || !isset($data['responsavel'])) {
            echo json_encode([
                'success' => false,
                'error' => 'Campos obrigatórios não fornecidos'
            ]);
            exit;
        }
        
        // Chamar a stored procedure
        $sql = "CALL sp_adicionar_estoque(?, ?, ?, ?, ?)";
        $params = [
            sanitizeInput($data['ns_codigo']),
            sanitizeInput($data['item_codigo']),
            floatval($data['quantidade']),
            sanitizeInput($data['responsavel']),
            isset($data['observacao']) ? sanitizeInput($data['observacao']) : null
        ];
        
        $result = executeQuery($sql, $params);
        echo json_encode($result);
        break;
    
    case 'PUT':
        // Retirar do estoque
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['ns_codigo']) || !isset($data['item_codigo']) || 
            !isset($data['quantidade']) || !isset($data['responsavel'])) {
            echo json_encode([
                'success' => false,
                'error' => 'Campos obrigatórios não fornecidos'
            ]);
            exit;
        }
        
        // Chamar a stored procedure
        $sql = "CALL sp_retirar_estoque(?, ?, ?, ?, ?)";
        $params = [
            sanitizeInput($data['ns_codigo']),
            sanitizeInput($data['item_codigo']),
            floatval($data['quantidade']),
            sanitizeInput($data['responsavel']),
            isset($data['observacao']) ? sanitizeInput($data['observacao']) : null
        ];
        
        $result = executeQuery($sql, $params);
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