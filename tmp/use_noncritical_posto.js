const U = 'http://localhost:3001/api';
(async ()=>{
  try{
    const vigRes = await (await fetch(U + '/vigilantes')).json();
    const novo = vigRes.find(v => v.nome && v.nome.includes('Arlan Teste'));
    console.log('Found created vigilante:', novo ? novo.id_vigilante : 'none');
    const postos = await (await fetch(U + '/postos')).json();
    const good = postos.find(p => !(p.nivel_risco && p.nivel_risco.toUpperCase() === 'CRITICO'));
    console.log('Selected posto:', good || 'none');
    if (novo && good) {
      const esc = await (await fetch(U + '/escalas', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id_vigilante: novo.id_vigilante, id_posto: good.id_posto, data_servico: new Date().toISOString().split('T')[0], turno: 'DIURNO' }) })).json();
      console.log('Escala create result:', esc);
    }
  }catch(e){
    console.error('ERROR', e.message || e);
  }
})();
