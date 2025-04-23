-- Criação do banco de dados (caso não exista)
-- CREATE DATABASE IF NOT EXISTS aumoxarifadosgop;
-- USE aumoxarifadosgop;

-- Tabela de IDs (Projetos)
CREATE TABLE IF NOT EXISTS ids (
    id_codigo VARCHAR(20) PRIMARY KEY,
    nome_projeto VARCHAR(100) NOT NULL,
    cliente VARCHAR(100) NOT NULL,
    responsavel VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de NSs (Notas de Serviço)
CREATE TABLE IF NOT EXISTS ns (
    ns_codigo VARCHAR(20) PRIMARY KEY,
    id_codigo VARCHAR(20) NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    data_criacao DATE NOT NULL,
    status ENUM('Aberta', 'Em Andamento', 'Concluída', 'Cancelada') DEFAULT 'Aberta',
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_codigo) REFERENCES ids(id_codigo) ON DELETE CASCADE
);

-- Tabela de Itens (Materiais)
CREATE TABLE IF NOT EXISTS itens (
    item_codigo VARCHAR(50) PRIMARY KEY,
    descricao VARCHAR(200) NOT NULL,
    unidade ENUM('un', 'pç', 'kg', 'm') NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Orçamento de Itens por NS
CREATE TABLE IF NOT EXISTS orcamento_ns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ns_codigo VARCHAR(20) NOT NULL,
    item_codigo VARCHAR(50) NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ns_codigo) REFERENCES ns(ns_codigo) ON DELETE CASCADE,
    FOREIGN KEY (item_codigo) REFERENCES itens(item_codigo) ON DELETE CASCADE,
    UNIQUE KEY (ns_codigo, item_codigo)
);

-- Tabela de Estoque (Controle de entrada/saída de materiais)
CREATE TABLE IF NOT EXISTS estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ns_codigo VARCHAR(20) NOT NULL,
    item_codigo VARCHAR(50) NOT NULL,
    quantidade_entrada DECIMAL(10,2) DEFAULT 0,
    quantidade_saida DECIMAL(10,2) DEFAULT 0,
    data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responsavel VARCHAR(100) NOT NULL,
    observacao TEXT,
    FOREIGN KEY (ns_codigo) REFERENCES ns(ns_codigo) ON DELETE CASCADE,
    FOREIGN KEY (item_codigo) REFERENCES itens(item_codigo) ON DELETE CASCADE
);

-- View para facilitar a consulta do estoque atual por item e NS
CREATE OR REPLACE VIEW vw_estoque_atual AS
SELECT 
    e.ns_codigo,
    n.id_codigo,
    e.item_codigo,
    i.descricao AS item_descricao,
    i.unidade,
    SUM(e.quantidade_entrada - e.quantidade_saida) AS quantidade_atual
FROM 
    estoque e
    JOIN ns n ON e.ns_codigo = n.ns_codigo
    JOIN itens i ON e.item_codigo = i.item_codigo
GROUP BY 
    e.ns_codigo, e.item_codigo
HAVING 
    quantidade_atual > 0;

-- View para mostrar o estoque agrupado por ID (soma de todas as NS)
CREATE OR REPLACE VIEW vw_estoque_por_id AS
SELECT 
    n.id_codigo,
    e.item_codigo,
    i.descricao AS item_descricao,
    i.unidade,
    SUM(e.quantidade_entrada - e.quantidade_saida) AS quantidade_total,
    GROUP_CONCAT(DISTINCT e.ns_codigo) AS ns_associadas
FROM 
    estoque e
    JOIN ns n ON e.ns_codigo = n.ns_codigo
    JOIN itens i ON e.item_codigo = i.item_codigo
GROUP BY 
    n.id_codigo, e.item_codigo
HAVING 
    quantidade_total > 0;

-- Stored Procedure para adicionar item ao estoque
DELIMITER //
CREATE PROCEDURE sp_adicionar_estoque(
    IN p_ns_codigo VARCHAR(20),
    IN p_item_codigo VARCHAR(50),
    IN p_quantidade DECIMAL(10,2),
    IN p_responsavel VARCHAR(100),
    IN p_observacao TEXT
)
BEGIN
    INSERT INTO estoque (
        ns_codigo, 
        item_codigo, 
        quantidade_entrada, 
        responsavel, 
        observacao
    ) VALUES (
        p_ns_codigo, 
        p_item_codigo, 
        p_quantidade, 
        p_responsavel, 
        p_observacao
    );
END //
DELIMITER ;

-- Stored Procedure para retirar item do estoque
DELIMITER //
CREATE PROCEDURE sp_retirar_estoque(
    IN p_ns_codigo VARCHAR(20),
    IN p_item_codigo VARCHAR(50),
    IN p_quantidade DECIMAL(10,2),
    IN p_responsavel VARCHAR(100),
    IN p_observacao TEXT
)
BEGIN
    DECLARE estoque_disponivel DECIMAL(10,2);
    
    -- Verificar se há estoque suficiente
    SELECT SUM(quantidade_entrada - quantidade_saida) INTO estoque_disponivel
    FROM estoque 
    WHERE ns_codigo = p_ns_codigo AND item_codigo = p_item_codigo;
    
    IF estoque_disponivel >= p_quantidade THEN
        INSERT INTO estoque (
            ns_codigo, 
            item_codigo, 
            quantidade_saida, 
            responsavel, 
            observacao
        ) VALUES (
            p_ns_codigo, 
            p_item_codigo, 
            p_quantidade, 
            p_responsavel, 
            p_observacao
        );
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Quantidade insuficiente em estoque';
    END IF;
END //
DELIMITER ;