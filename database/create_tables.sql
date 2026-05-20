/*
====================================================
BANCO DE DADOS - SEGURANÇA PRIVADA
====================================================
*/

CREATE DATABASE IF NOT EXISTS seguranca_privada;

USE seguranca_privada;

/*
====================================================
TABELA: vigilantes
====================================================
*/

CREATE TABLE IF NOT EXISTS vigilantes (

    id_vigilante INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    cpf VARCHAR(14) NOT NULL UNIQUE,

    telefone VARCHAR(20),

    nivel_treinamento ENUM('BASICO', 'INTERMEDIARIO', 'AVANCADO')
        DEFAULT 'BASICO',

    status_vigilante ENUM('ATIVO', 'INATIVO', 'AFASTADO')
        DEFAULT 'ATIVO',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
====================================================
TABELA: clientes
====================================================
*/

CREATE TABLE IF NOT EXISTS clientes (

    id_cliente INT AUTO_INCREMENT PRIMARY KEY,

    empresa VARCHAR(100) NOT NULL,

    segmento VARCHAR(50),

    endereco VARCHAR(200),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
====================================================
TABELA: postos
====================================================
*/

CREATE TABLE IF NOT EXISTS postos (

    id_posto INT AUTO_INCREMENT PRIMARY KEY,

    nome_posto VARCHAR(100) NOT NULL,

    localizacao VARCHAR(200),

    nivel_risco ENUM('BAIXO', 'MEDIO', 'ALTO', 'CRITICO')
        DEFAULT 'BAIXO',

    id_cliente INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_posto_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

/*
====================================================
TABELA: escalas
====================================================
*/

CREATE TABLE IF NOT EXISTS escalas (

    id_escala INT AUTO_INCREMENT PRIMARY KEY,

    id_vigilante INT NOT NULL,

    id_posto INT NOT NULL,

    data_servico DATE NOT NULL,

    turno ENUM('DIURNO', 'NOTURNO') NOT NULL,

    horas_trabalhadas DECIMAL(5,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_escala_vigilante
        FOREIGN KEY (id_vigilante)
        REFERENCES vigilantes(id_vigilante)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_escala_posto
        FOREIGN KEY (id_posto)
        REFERENCES postos(id_posto)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

/*
====================================================
TABELA: ocorrencias
====================================================
*/

CREATE TABLE IF NOT EXISTS ocorrencias (

    id_ocorrencia INT AUTO_INCREMENT PRIMARY KEY,

    id_escala INT NOT NULL,

    descricao TEXT NOT NULL,

    nivel_criticidade ENUM('BAIXA', 'MEDIA', 'ALTA', 'CRITICA')
        DEFAULT 'BAIXA',

    data_ocorrencia DATETIME DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ocorrencia_escala
        FOREIGN KEY (id_escala)
        REFERENCES escalas(id_escala)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

/*
====================================================
TABELA: gestao_risco_rm
====================================================
*/

CREATE TABLE IF NOT EXISTS gestao_risco_rm (

    id_risco INT AUTO_INCREMENT PRIMARY KEY,

    id_posto INT NOT NULL,

    tipo_risco VARCHAR(100) NOT NULL,

    probabilidade ENUM('BAIXA', 'MEDIA', 'ALTA')
        DEFAULT 'MEDIA',

    impacto ENUM('BAIXO', 'MEDIO', 'ALTO', 'CRITICO')
        DEFAULT 'MEDIO',

    plano_acao TEXT,

    status_risco ENUM(
        'ABERTO',
        'EM_ANALISE',
        'MITIGADO',
        'ENCERRADO'
    ) DEFAULT 'ABERTO',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_risco_posto
        FOREIGN KEY (id_posto)
        REFERENCES postos(id_posto)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

/*
====================================================
TABELA: ferias
====================================================
*/

CREATE TABLE IF NOT EXISTS ferias (

    id_ferias INT AUTO_INCREMENT PRIMARY KEY,

    id_vigilante INT NOT NULL,

    data_inicio DATE NOT NULL,

    data_fim DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ferias_vigilante
        FOREIGN KEY (id_vigilante)
        REFERENCES vigilantes(id_vigilante)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

/*
====================================================
TABELA: horas_extras
====================================================
*/

CREATE TABLE IF NOT EXISTS horas_extras (

    id_extra INT AUTO_INCREMENT PRIMARY KEY,

    id_vigilante INT NOT NULL,

    quantidade_horas DECIMAL(5,2) NOT NULL,

    motivo VARCHAR(200),

    data_extra DATE DEFAULT (CURRENT_DATE),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_extra_vigilante
        FOREIGN KEY (id_vigilante)
        REFERENCES vigilantes(id_vigilante)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

/*
====================================================
ÍNDICES
====================================================
*/

CREATE INDEX idx_vigilante_cpf
ON vigilantes(cpf);

CREATE INDEX idx_escala_data
ON escalas(data_servico);

CREATE INDEX idx_ocorrencia_data
ON ocorrencias(data_ocorrencia);

CREATE INDEX idx_risco_status
ON gestao_risco_rm(status_risco);