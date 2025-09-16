// ==========================================
// VERSÃO SIMPLIFICADA PARA DEBUG
// ==========================================

const API_BASE_URL = 'http://localhost:8000';

// Aguardar carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌤️ Weather App carregado!');
    
    // Configurar formulário
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
        console.log('✅ Event listener configurado');
    } else {
        console.error('❌ Formulário não encontrado!');
    }
});

// Função principal de busca
async function handleSearch(e) {
    e.preventDefault();
    console.log('🔍 Iniciando busca...');
    
    const locationInput = document.getElementById('locationInput');
    const searchBtn = document.getElementById('searchBtn');
    const weatherContent = document.getElementById('weatherContent');
    
    // Verificar elementos
    if (!locationInput || !searchBtn || !weatherContent) {
        console.error('❌ Elementos HTML não encontrados!');
        return;
    }
    
    const location = locationInput.value.trim();
    if (!location) {
        alert('Por favor, digite uma cidade!');
        return;
    }
    
    console.log('📍 Buscando:', location);
    
    // Estado de carregamento
    searchBtn.disabled = true;
    searchBtn.textContent = 'Buscando...';
    weatherContent.innerHTML = '<div style="padding: 20px; text-align: center;">🔍 Buscando...</div>';
    
    try {
        // Fazer requisição
        console.log('📡 Fazendo requisição para:', API_BASE_URL + '/weather');
        
        const response = await fetch(API_BASE_URL + '/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: location })
        });
        
        console.log('📡 Status da resposta:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro na API');
        }
        
        const data = await response.json();
        console.log('✅ Dados recebidos:', data);
        
        // Exibir dados (versão simplificada)
        displayWeatherSimple(data);
        
    } catch (error) {
        console.error('💥 Erro:', error);
        weatherContent.innerHTML = `<div style="background: #ff7675; color: white; padding: 15px; border-radius: 10px;">❌ ${error.message}</div>`;
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Buscar';
    }
}

// Função simplificada para exibir dados
function displayWeatherSimple(data) {
    console.log('🎨 Exibindo dados...');
    
    const weatherContent = document.getElementById('weatherContent');
    
    // Verificar se os dados existem
    if (!data || !data.location || !data.current) {
        console.error('❌ Dados inválidos:', data);
        weatherContent.innerHTML = '<div style="color: red;">Dados inválidos recebidos da API</div>';
        return;
    }
    
    // Extrair dados com verificação de segurança
    const location = data.location || {};
    const current = data.current || {};
    const forecast = data.forecast || {};
    
    console.log('📊 Processando dados:', { location, current, forecast });
    
    // HTML simplificado mas funcional
    const html = `
        <div style="background: white; border-radius: 15px; padding: 25px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <!-- Informações principais -->
            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 25px;">
                <img src="https:${current.condition_icon || ''}" alt="${current.condition || 'Clima'}" style="width: 80px; height: 80px;">
                <div style="flex: 1;">
                    <h2 style="margin: 0 0 10px 0; color: #2d3436;">${location.name || 'N/A'}, ${location.region || ''}</h2>
                    <p style="margin: 0; color: #636e72; font-size: 1.1em;">${current.condition || 'N/A'}</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 3em; font-weight: 300; margin: 0; color: #2d3436;">${Math.round(current.temperature_c || 0)}°C</div>
                    <div style="color: #636e72;">Sensação: ${Math.round(current.feels_like_c || 0)}°C</div>
                </div>
            </div>
            
            <!-- Detalhes -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                <div style="background: rgba(116, 185, 255, 0.1); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="color: #636e72; margin-bottom: 5px;">Umidade</div>
                    <div style="font-weight: 600; color: #2d3436; font-size: 1.2em;">${current.humidity || 0}%</div>
                </div>
                <div style="background: rgba(116, 185, 255, 0.1); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="color: #636e72; margin-bottom: 5px;">Vento</div>
                    <div style="font-weight: 600; color: #2d3436; font-size: 1.2em;">${Math.round(current.wind_kph || 0)} km/h</div>
                </div>
                <div style="background: rgba(116, 185, 255, 0.1); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="color: #636e72; margin-bottom: 5px;">Pressão</div>
                    <div style="font-weight: 600; color: #2d3436; font-size: 1.2em;">${current.pressure_mb || 0} mb</div>
                </div>
                <div style="background: rgba(116, 185, 255, 0.1); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="color: #636e72; margin-bottom: 5px;">Chuva</div>
                    <div style="font-weight: 600; color: #2d3436; font-size: 1.2em;">${forecast.chance_of_rain || 0}%</div>
                </div>
            </div>
        </div>
    `;
    
    console.log('🎨 Inserindo HTML...');
    weatherContent.innerHTML = html;
    console.log('✅ Dados exibidos com sucesso!');
}

// Função de teste manual (para usar no console)
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

console.log('📝 Script simplificado carregado!');
console.log('💡 Para testar, digite no console: testarAPI("São Paulo")');