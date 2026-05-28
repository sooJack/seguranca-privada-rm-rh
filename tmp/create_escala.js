const U = 'http://localhost:3001/api';
(async ()=>{
  try{
    const nome = 'Arlan Teste ' + Date.now();
    const cpf = String(Date.now()).slice(-11).padStart(11,'0');
    const postRes = await fetch(U + '/vigilantes', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nome, cpf, telefone: '(99)99999-9999', nivel_treinamento: 'BASICO', status_vigilante: 'ATIVO' })
    });
    const postJson = await postRes.json();
    console.log('Created vigilante:', postJson);

    let postos = await (await fetch(U + '/postos')).json();
    // prefer a non-critical posto
    let good = (postos || []).find(p => !(p.nivel_risco && p.nivel_risco.toUpperCase() === 'CRITICO'));
    if (!good && (!postos || postos.length === 0)) {
      console.log('No postos found. Creating cliente and posto...');
      const cliente = await (await fetch(U + '/clientes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ empresa: 'ClienteTeste', segmento: 'Teste', endereco: 'Rua X' }) })).json();
      const posto = await (await fetch(U + '/postos', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ nome_posto: 'PostoTeste', localizacao: 'Local', nivel_risco: 'BAIXO', id_cliente: cliente.id_cliente }) })).json();
      postos = [{ id_posto: posto.id_posto, nome_posto: posto.nome_posto, nivel_risco: posto.nivel_risco }];
      console.log('Created posto:', posto);
      good = postos[0];
    }

    const postoId = (good || (postos && postos[0])).id_posto;
    const escala = await (await fetch(U + '/escalas', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id_vigilante: postJson.id_vigilante, id_posto: postoId, data_servico: new Date().toISOString().split('T')[0], turno: 'DIURNO', horas_trabalhadas: 8 }) })).json();
    console.log('Created escala or error:', escala);

    const escalas = await (await fetch(U + '/escalas')).json();
    console.log('\nFirst escala:', escalas[0]);
  }catch(err){
    console.error('ERROR',err.message || err);
  }
})();
