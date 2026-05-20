USE seguranca_privada;

/*
====================================================
TRIGGER
====================================================
*/

DROP TRIGGER IF EXISTS trg_validar_risco;

DELIMITER //

CREATE TRIGGER trg_validar_risco

BEFORE INSERT ON escalas

FOR EACH ROW

BEGIN

    DECLARE risco VARCHAR(20);

    DECLARE treinamento VARCHAR(50);

    SELECT nivel_risco
    INTO risco
    FROM postos
    WHERE id_posto = NEW.id_posto;

    SELECT nivel_treinamento
    INTO treinamento
    FROM vigilantes
    WHERE id_vigilante = NEW.id_vigilante;

    IF risco = 'CRITICO'
       AND treinamento <> 'AVANCADO' THEN

        SIGNAL SQLSTATE '45000'

        SET MESSAGE_TEXT =
        'Vigilante sem treinamento para posto crítico';

    END IF;

END //

DELIMITER ;