USE seguranca_privada;

/*
====================================================
TOTAL DE HORAS POR VIGILANTE
====================================================
*/

SELECT

    v.nome,

    SUM(e.horas_trabalhadas) AS total_horas

FROM vigilantes v

JOIN escalas e
ON v.id_vigilante = e.id_vigilante

GROUP BY v.nome

ORDER BY total_horas DESC;

/*
====================================================
TOTAL DE OCORRÊNCIAS POR POSTO
====================================================
*/

SELECT

    p.nome_posto,

    COUNT(o.id_ocorrencia) AS total_ocorrencias

FROM postos p

JOIN escalas e
ON p.id_posto = e.id_posto

JOIN ocorrencias o
ON e.id_escala = o.id_escala

GROUP BY p.nome_posto

ORDER BY total_ocorrencias DESC;

/*
====================================================
RISCOS ABERTOS
====================================================
*/

SELECT

    p.nome_posto,

    g.tipo_risco,

    g.probabilidade,

    g.impacto,

    g.status_risco

FROM gestao_risco_rm g

JOIN postos p
ON g.id_posto = p.id_posto

WHERE g.status_risco = 'ABERTO';

/*
====================================================
VIGILANTES EM POSTOS CRÍTICOS
====================================================
*/

SELECT DISTINCT

    v.nome,

    p.nome_posto,

    p.nivel_risco

FROM vigilantes v

JOIN escalas e
ON v.id_vigilante = e.id_vigilante

JOIN postos p
ON e.id_posto = p.id_posto

WHERE p.nivel_risco = 'CRITICO';

/*
====================================================
VISUALIZAÇÃO COMPLETA DA OPERAÇÃO
====================================================
*/

SELECT *
FROM vw_operacao_completa;

/*
====================================================
TOTAL DE HORAS EXTRAS POR VIGILANTE
====================================================
*/

SELECT

    v.nome,

    SUM(h.quantidade_horas) AS total_horas_extras

FROM vigilantes v

JOIN horas_extras h
ON v.id_vigilante = h.id_vigilante

GROUP BY v.nome;

/*
====================================================
VIGILANTES EM FÉRIAS
====================================================
*/

SELECT

    v.nome,

    f.data_inicio,

    f.data_fim

FROM ferias f

JOIN vigilantes v
ON f.id_vigilante = v.id_vigilante;

/*
====================================================
POSTOS E SEUS CLIENTES
====================================================
*/

SELECT

    p.nome_posto,

    c.empresa,

    p.nivel_risco

FROM postos p

JOIN clientes c
ON p.id_cliente = c.id_cliente;

/*
====================================================
OCORRÊNCIAS CRÍTICAS
====================================================
*/

SELECT

    o.id_ocorrencia,

    p.nome_posto,

    o.descricao,

    o.data_ocorrencia

FROM ocorrencias o

JOIN escalas e
ON o.id_escala = e.id_escala

JOIN postos p
ON e.id_posto = p.id_posto

WHERE o.nivel_criticidade = 'CRITICA';

/*
====================================================
QUANTIDADE DE VIGILANTES POR NÍVEL
====================================================
*/

SELECT

    nivel_treinamento,

    COUNT(*) AS quantidade

FROM vigilantes

GROUP BY nivel_treinamento;