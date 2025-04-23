<?php
// api/devolucao.php

header('Content-Type: application/json');
require_once '../conexao.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'PUT') {
    http_response_code(405); // Método não permitido
    echo json_encode([
        'success' => false,
        'error' => 'Método não permitido. Use PUT.'
    ]);
    exit;
}

// Lê os dados enviados
$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['transferencia_id']) ||
    !isset($data['quantidade_devolucao']) ||
    !isset($data['responsavel_devolucao'])
) {
    echo json_encode([
        'success' => false,
        'error' => 'Campos obrigatórios não fornecidos'
    ]);
    exit;
}

$transferencia_id = intval($data['transferencia_id']);
$quantidade = floatval($data['quantidade_devolucao']);
$responsavel = sanitizeInput($data['responsavel_devolucao']);
$observacao = isset($data['observacao_devolucao']) ? sanitizeInput($data['observacao_devolucao']) : null;

// Chama a stored procedure
$sql = "CALL sp_devolver_material(?, ?, ?, ?)";
$params = [$transferencia_id, $quantidade, $responsavel, $observacao];

$result = executeQuery($sql, $params);

echo json_encode($result);
