<?php
header('Content-Type: application/json');
require_once '../conexao.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Registrar transferência de material entre NS
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['ns_origem']) || !isset($data['ns_destino']) || 
            !isset($data['item_codigo']) || !isset($data['item_descricao']) ||
            !isset($data['unidade']) || !isset($data['quantidade']) ||
            !isset($data['responsavel'])) {
             echo json_encode([
            'success' => false,
            'error' => 'Campos obrigatórios não fornecidos'
            ]);
            exit;
        }


            $params = [
                sanitizeInput($data['ns_origem']),
                sanitizeInput($data['ns_destino']),
                sanitizeInput($data['item_codigo']),
                sanitizeInput($data['item_descricao']),
                sanitizeInput($data['unidade']),
                floatval($data['quantidade']),
                sanitizeInput($data['responsavel']),
                isset($data['observacao']) ? sanitizeInput($data['observacao']) : null
            ];


        try {
            $sql = "CALL sp_transferir_material(?, ?, ?, ?, ?, ?, ?, ?)";
            $result = executeQuery($sql, $params);
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'error' => 'Método não permitido'
        ]);
        break;
}
?>
