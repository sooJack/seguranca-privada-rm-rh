import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import spec from '../swagger/openapi.json'

const swaggerBackendUrl = import.meta.env.VITE_API_URL?.trim()
const swaggerProps = swaggerBackendUrl
  ? { url: `${swaggerBackendUrl.replace(/\/$/, '')}/api/openapi.json` }
  : { spec }

export function SwaggerDocs() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      <SwaggerUI {...swaggerProps} />
    </div>
  )
}
