import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import spec from '../swagger/openapi.json'

export function SwaggerDocs() {
  return (
    <div style={{ padding: '20px' }}>
      <SwaggerUI spec={spec} />
    </div>
  )
}
