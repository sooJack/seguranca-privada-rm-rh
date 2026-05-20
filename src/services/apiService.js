const API_URL = 'http://localhost:3001/api';

export const apiService = {
  // Vigilantes
  async getVigilantes() {
    try {
      const response = await fetch(`${API_URL}/vigilantes`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar vigilantes:', error);
      return [];
    }
  },

  async getVigilante(id) {
    try {
      const response = await fetch(`${API_URL}/vigilantes/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar vigilante:', error);
      return null;
    }
  },

  async createVigilante(data) {
    try {
      const response = await fetch(`${API_URL}/vigilantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar vigilante:', error);
      return null;
    }
  },

  // Clientes
  async getClientes() {
    try {
      const response = await fetch(`${API_URL}/clientes`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
  },

  // Postos
  async getPostos() {
    try {
      const response = await fetch(`${API_URL}/postos`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar postos:', error);
      return [];
    }
  },

  // Escalas
  async getEscalas() {
    try {
      const response = await fetch(`${API_URL}/escalas`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar escalas:', error);
      return [];
    }
  },

  // Ocorrências
  async getOcorrencias() {
    try {
      const response = await fetch(`${API_URL}/ocorrencias`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar ocorrências:', error);
      return [];
    }
  },

  // Health Check
  async checkHealth() {
    try {
      const response = await fetch(`${API_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Servidor não está respondendo');
      return { status: 'offline' };
    }
  }
};
