# 🌤️ Weather API - Integração com WeatherAPI

Uma API REST desenvolvida em **FastAPI** para consulta de informações meteorológicas, demonstrando integração com APIs externas e boas práticas de desenvolvimento.

## 📋 Sobre o Projeto

Este projeto foi criado como exemplo prático de como integrar APIs externas usando Python, mostrando:

- Integração com a [WeatherAPI](https://weatherapi.com)
- Criação de API REST com FastAPI
- Tratamento de erros e validação de dados
- Configuração de CORS para frontend
- Estruturação de dados de resposta

## ⚡ Funcionalidades

- 🌡️ **Temperatura atual** e sensação térmica
- 🔮 **Previsão do tempo** para o dia
- 📊 **Dados detalhados**: umidade, vento, pressão, UV
- ⏰ **Previsão por hora** (24h)
- 🚨 **Alertas meteorológicos**
- 🌍 **Busca por cidade, código postal ou coordenadas**

## 🛠️ Tecnologias Utilizadas

- **Python 3.11+**
- **FastAPI** - Framework web moderno e rápido
- **Pydantic** - Validação de dados com BaseModel
- **Requests** - Requisições HTTP para APIs externas
- **Uvicorn** - Servidor ASGI para produção

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seuusuario/weather-api.git
cd weather-api
```

### 2. Crie um ambiente virtual
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Instale as dependências
```bash
pip install -r requirements.txt
```

### 4. Configure sua API Key

1. Registre-se gratuitamente em [WeatherAPI.com](https://weatherapi.com)
2. Obtenha sua API Key gratuita
3. Substitua `"minha-api-key"` no código pela sua chave:

```python
# No arquivo main.py, linha 19
WEATHER_API_KEY = "SUA_API_KEY_AQUI"
```

⚠️ **Importante**: Nunca compartilhe sua API Key publicamente!

## 🚀 Como Executar

```bash
# Inicie o servidor
uvicorn main:app --reload

# Ou execute diretamente
python main.py

# Para iniciar o frontend abra o index.html diretamente no navegador
```

A API estará disponível em: `http://localhost:8000`

## 📚 Documentação da API

### Endpoints Disponíveis

#### `GET /`
Verifica se a API está funcionando
```json
{
  "message": "Weather API está funcionando!"
}
```

#### `POST /weather`
Busca informações meteorológicas

**Corpo da requisição:**
```json
{
  "location": "São Paulo"
}
```

**Exemplos de localização válidos:**
- `"São Paulo"` - Por cidade
- `"São Paulo, Brazil"` - Cidade com país
- `"01310-100"` - CEP
- `"-23.550520,-46.633309"` - Coordenadas (lat,lon)

**Resposta de sucesso (200):**
```json
{
  "location": {
    "name": "São Paulo",
    "region": "Sao Paulo",
    "country": "Brazil",
    "lat": -23.55,
    "lon": -46.63,
    "localtime": "2024-01-15 14:30"
  },
  "current": {
    "temperature_c": 28.5,
    "temperature_f": 83.3,
    "condition": "Partly cloudy",
    "condition_icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
    "humidity": 65,
    "wind_kph": 15.5,
    "wind_dir": "SW",
    "pressure_mb": 1013.2,
    "feels_like_c": 31.2,
    "uv": 8
  },
  "forecast": {
    "date": "2024-01-15",
    "max_temp_c": 32.1,
    "min_temp_c": 19.8,
    "condition": "Sunny",
    "condition_icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
    "chance_of_rain": 10,
    "max_wind_kph": 18.4,
    "avg_humidity": 58,
    "hourly": [
      {
        "time": "2024-01-15 00:00",
        "temp_c": 22.1,
        "condition": "Clear",
        "condition_icon": "//cdn.weatherapi.com/weather/64x64/night/113.png",
        "chance_of_rain": 0,
        "wind_kph": 8.6
      }
      // ... mais 23 horas
    ]
  },
  "alerts": []
}
```

#### `GET /health`
Health check da aplicação
```json
{
  "status": "healthy",
  "service": "Weather API"
}
```

### Códigos de Erro

- `400` - Localização não encontrada
- `500` - Erro interno do servidor
- `422` - Dados de entrada inválidos

## 🌐 Testando a API

### Usando cURL
```bash
curl -X POST "http://localhost:8000/weather" \
     -H "Content-Type: application/json" \
     -d '{"location": "Rio de Janeiro"}'
```

### Usando Python
```python
import requests

response = requests.post(
    "http://localhost:8000/weather",
    json={"location": "Salvador"}
)
print(response.json())
```

### 🔧 Debug e Desenvolvimento

Para facilitar o desenvolvimento, o projeto inclui logs detalhados:

```javascript
// Os logs ajudam a entender o fluxo da aplicação
console.log('🌤️ Weather App carregado!');
console.log('📍 Buscando:', location);
console.log('📡 Status da resposta:', response.status);
console.log('✅ Dados recebidos:', data);
```

**Testando a integração:**
1. Abra o Console do navegador (F12)
2. Digite: `testarAPI('São Paulo')`
3. Acompanhe os logs para entender o processo

## 🎨 Integrando com Frontend

### Exemplo Completo em JavaScript
Baseado no código real do projeto, aqui está como integrar com frontend:

```javascript
const API_BASE_URL = 'http://localhost:8000';

// Função principal de busca (baseada no código real)
async function handleSearch(e) {
    e.preventDefault();
    
    const locationInput = document.getElementById('locationInput');
    const searchBtn = document.getElementById('searchBtn');
    const weatherContent = document.getElementById('weatherContent');
    
    const location = locationInput.value.trim();
    if (!location) {
        alert('Por favor, digite uma cidade!');
        return;
    }
    
    // Estado de carregamento
    searchBtn.disabled = true;
    searchBtn.textContent = 'Buscando...';
    weatherContent.innerHTML = '<div>🔍 Buscando...</div>';
    
    try {
        // Requisição para a API
        const response = await fetch(API_BASE_URL + '/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: location })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro na API');
        }
        
        const data = await response.json();
        displayWeather(data);
        
    } catch (error) {
        weatherContent.innerHTML = `<div style="color: red;">❌ ${error.message}</div>`;
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Buscar';
    }
}

// Função para exibir os dados
function displayWeather(data) {
    const weatherContent = document.getElementById('weatherContent');
    const { location, current, forecast } = data;
    
    const html = `
        <div class="weather-card">
            <div class="weather-main">
                <img src="https:${current.condition_icon}" alt="${current.condition}">
                <div>
                    <h2>${location.name}, ${location.region}</h2>
                    <p>${current.condition}</p>
                </div>
                <div class="temperature">
                    ${Math.round(current.temperature_c)}°C
                    <small>Sensação: ${Math.round(current.feels_like_c)}°C</small>
                </div>
            </div>
            
            <div class="weather-details">
                <div>Umidade: ${current.humidity}%</div>
                <div>Vento: ${Math.round(current.wind_kph)} km/h</div>
                <div>Pressão: ${current.pressure_mb} mb</div>
                <div>Chuva: ${forecast.chance_of_rain || 0}%</div>
            </div>
        </div>
    `;
    
    weatherContent.innerHTML = html;
}

// Event listener
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
});
```

### 📖 Documentação Interativa

O FastAPI gera automaticamente uma documentação interativa da API:

- **Swagger UI**: Acesse `http://localhost:8000/docs`
- **ReDoc**: Acesse `http://localhost:8000/redoc`

Na documentação você pode:
- Ver todos os endpoints disponíveis
- Testar a API diretamente no navegador
- Visualizar os esquemas de dados (request/response)
- Executar requisições de exemplo

**Exemplo de teste via Swagger:**
1. Acesse `http://localhost:8000/docs`
2. Clique no endpoint `POST /weather`
3. Clique em "Try it out"
4. Insira: `{"location": "São Paulo"}`
5. Execute a requisição

### Função de Teste (Console)
```javascript
// Para testar rapidamente no console do navegador
window.testarAPI = async function(cidade = 'São Paulo') {
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
        locationInput.value = cidade;
        const form = document.getElementById('searchForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
};

// Uso: testarAPI('Rio de Janeiro');
```

## 📁 Estrutura do Projeto

```
weather-api/
├── frontend/
│   ├── index.html          # Interface do usuário
│   ├── script.js          # Lógica do frontend
│   └── styles.css         # Estilos da aplicação
├── venv/                  # Ambiente virtual Python (não commitado)
├── main.py               # Código principal da API
├── LICENSE
├── README.md            # Documentação do projeto
└── requirements.txt     # Dependências do projeto
```

## 🔧 Principais Conceitos Demonstrados

### 1. **Integração com API Externa**
```python
response = requests.get(url, params=params, timeout=10)
```

### 2. **Validação de Dados com Pydantic**
```python
class WeatherRequest(BaseModel):
    location: str

class WeatherResponse(BaseModel):
    location: dict
    current: dict
    forecast: dict
    alerts: Optional[list] = None
```

### 3. **Tratamento de Erros**
```python
try:
    # código da requisição
except requests.RequestException as e:
    raise HTTPException(status_code=500, detail=f"Erro na requisição: {str(e)}")
```

### 4. **Configuração de CORS**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 5. **Estruturação de Resposta**
Transformação dos dados da API externa em um formato consistente e limpo.

## 🚀 Deploy em Produção

Para deploy em produção, considere:

1. **Usar variáveis de ambiente** para a API key
2. **Configurar CORS** especificamente para seus domínios
3. **Adicionar rate limiting** para evitar abuso
4. **Implementar logs** para monitoramento

Exemplo de configuração para produção:
```python
import os

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://seusite.com"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

⭐ **Se este projeto te ajudou, deixe uma estrela!**
