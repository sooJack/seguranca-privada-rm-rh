import { useState, useEffect } from 'react'
import { apiService } from '@/services/apiService'

export function ExemploVigilantes() {
  const [vigilantes, setVigilantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [serverStatus, setServerStatus] = useState('offline')

  useEffect(() => {
    // Verificar saúde do servidor
    apiService.checkHealth().then(health => {
      setServerStatus(health.status)
    })

    // Buscar vigilantes
    apiService.getVigilantes().then(data => {
      setVigilantes(data)
      setLoading(false)
    }).catch(err => {
      setError(err.message)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      <h2>Vigilantes</h2>
      <p>Status do servidor: <strong>{serverStatus}</strong></p>

      {vigilantes.length === 0 ? (
        <p>Nenhum vigilante cadastrado</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Nível</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vigilantes.map(v => (
              <tr key={v.id_vigilante}>
                <td>{v.id_vigilante}</td>
                <td>{v.nome}</td>
                <td>{v.cpf}</td>
                <td>{v.nivel_treinamento}</td>
                <td>{v.status_vigilante}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
