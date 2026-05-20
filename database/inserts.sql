USE seguranca_privada;

/*
====================================================
INSERTS - VIGILANTES
====================================================
*/

INSERT IGNORE INTO vigilantes
(nome, cpf, telefone, nivel_treinamento, status_vigilante)

VALUES
('Carlos Silva', '111.111.111-11', '83999999999', 'AVANCADO', 'ATIVO'),

('João Souza', '222.222.222-22', '83988888888', 'BASICO', 'ATIVO');

/*
====================================================
INSERTS - CLIENTES
====================================================
*/

INSERT IGNORE INTO clientes
(id_cliente, empresa, segmento, endereco)

VALUES
(1, 'Banco XPTO', 'Bancário', 'Centro'),

(2, 'Hospital Vida', 'Hospitalar', 'Zona Sul');

/*
====================================================
INSERTS - POSTOS
====================================================
*/

INSERT IGNORE INTO postos
(id_posto, nome_posto, localizacao, nivel_risco, id_cliente)

VALUES
(1, 'Agência Central', 'Centro', 'CRITICO', 1),

(2, 'Hospital Principal', 'Zona Sul', 'MEDIO', 2);

/*
====================================================
INSERTS - ESCALAS
====================================================
*/

INSERT IGNORE INTO escalas
(id_escala, id_vigilante, id_posto, data_servico, turno, horas_trabalhadas)

VALUES
(1, 1, 1, '2026-05-19', 'NOTURNO', 12),

(2, 2, 2, '2026-05-19', 'DIURNO', 8);

/*
====================================================
INSERTS - FÉRIAS
====================================================
*/

INSERT IGNORE INTO ferias
(id_ferias, id_vigilante, data_inicio, data_fim)

VALUES
(1, 2, '2026-06-01', '2026-06-30');

/*
====================================================
INSERTS - HORAS EXTRAS
====================================================
*/

INSERT IGNORE INTO horas_extras
(id_extra, id_vigilante, quantidade_horas, motivo, data_extra)

VALUES
(1, 1, 4, 'Cobertura emergencial', '2026-05-19');

/*
====================================================
REGISTRO DE OCORRÊNCIAS
====================================================
*/

CALL registrar_ocorrencia(
    1,
    'Tentativa de invasão identificada.',
    'ALTA'
);

/*
====================================================
REGISTRO DE RISCOS
====================================================
*/

CALL registrar_risco(
    1,
    'Assalto armado',
    'ALTA',
    'CRITICO',
    'Reforçar vigilância armada e câmeras.'
);