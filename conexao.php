<?php
// Configurações de conexão com o banco de dados
$servername = "192.168.7.208"; 
$username = "cracha"; 
$password = "Encel1963!@#"; 
$database = "aumoxarifadosgop";

// Criar conexão
$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Configurar caracteres UTF-8
$conn->set_charset("utf8mb4");

// Função para executar consultas no banco de dados
function executeQuery($sql, $params = []) {
    global $conn;
    
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        return [
            'success' => false,
            'error' => 'Erro na preparação da consulta: ' . $conn->error
        ];
    }
    
    if (!empty($params)) {
        $types = '';
        $values = [];
        
        foreach ($params as $param) {
            if (is_int($param)) {
                $types .= 'i';
            } elseif (is_float($param)) {
                $types .= 'd';
            } elseif (is_string($param)) {
                $types .= 's';
            } else {
                $types .= 'b';
            }
            $values[] = $param;
        }
        
        $stmt->bind_param($types, ...$values);
    }
    
    if (!$stmt->execute()) {
        return [
            'success' => false,
            'error' => 'Erro na execução da consulta: ' . $stmt->error
        ];
    }
    
    $result = $stmt->get_result();
    
    if ($result === false && $stmt->errno === 0) {
        // Provavelmente uma operação INSERT, UPDATE ou DELETE bem-sucedida
        return [
            'success' => true,
            'affected_rows' => $stmt->affected_rows,
            'insert_id' => $stmt->insert_id
        ];
    }
    
    if ($result === false) {
        return [
            'success' => false,
            'error' => 'Erro ao obter resultado: ' . $stmt->error
        ];
    }
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    
    $stmt->close();
    
    return [
        'success' => true,
        'data' => $data,
        'num_rows' => count($data)
    ];
}

// Função para validar e sanitizar input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}