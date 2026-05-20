USE seguranca_privada;

/*
====================================================
PROCEDURE: registrar_ocorrencia
====================================================
*/

DROP PROCEDURE IF EXISTS registrar_ocorrencia;

DELIMITER //

CREATE PROCEDURE registrar_ocorrencia (

    IN p_id_escala INT,
    IN p_descricao TEXT,
    IN p_criticidade VARCHAR(20)

)

BEGIN

    INSERT INTO ocorrencias (

        id_escala,
        descricao,
        nivel_criticidade,
        data_ocorrencia

    )

    VALUES (

        p_id_escala,
        p_descricao,
        p_criticidade,
        NOW()

    );

END //

DELIMITER ;

/*
====================================================
PROCEDURE: registrar_risco
====================================================
*/

DROP PROCEDURE IF EXISTS registrar_risco;

DELIMITER //

CREATE PROCEDURE registrar_risco (

    IN p_id_posto INT,
    IN p_tipo_risco VARCHAR(100),
    IN p_probabilidade VARCHAR(20),
    IN p_impacto VARCHAR(20),
    IN p_plano TEXT

)

BEGIN

    INSERT INTO gestao_risco_rm (

        id_posto,
        tipo_risco,
        probabilidade,
        impacto,
        plano_acao,
        status_risco

    )

    VALUES (

        p_id_posto,
        p_tipo_risco,
        p_probabilidade,
        p_impacto,
        p_plano,
        'ABERTO'

    );

END //

DELIMITER ;