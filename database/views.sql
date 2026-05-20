USE seguranca_privada;

/*
====================================================
VIEW
====================================================
*/

CREATE OR REPLACE VIEW vw_operacao_completa AS

SELECT

    v.nome AS vigilante,
    p.nome_posto,
    c.empresa,
    e.data_servico,
    e.turno,
    p.nivel_risco

FROM escalas e

JOIN vigilantes v
ON e.id_vigilante = v.id_vigilante

JOIN postos p
ON e.id_posto = p.id_posto

JOIN clientes c
ON p.id_cliente = c.id_cliente;