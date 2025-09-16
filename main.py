from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
from typing import Optional

app = FastAPI(title="Weather API", description="API para consulta de clima")

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Substitua pela sua API key do WeatherAPI
WEATHER_API_KEY = "Sua API key"
WEATHER_BASE_URL = "http://api.weatherapi.com/v1"

class WeatherRequest(BaseModel):
    location: str

class WeatherResponse(BaseModel):
    location: dict
    current: dict
    forecast: dict
    alerts: Optional[list] = None

@app.get("/")
async def root():
    return {"message": "Weather API está funcionando!"}

@app.post("/weather")
async def get_weather(request: WeatherRequest):
    """
    Busca informações meteorológicas para uma localização
    """
    try:
        # Endpoint para dados atuais e previsão
        url = f"{WEATHER_BASE_URL}/forecast.json"
        
        params = {
            "key": WEATHER_API_KEY,
            "q": request.location,
            "days": 1,  # Previsão para hoje
            "aqi": "yes",  # Incluir índice de qualidade do ar
            "alerts": "yes"  # Incluir alertas meteorológicos
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # Estruturar a resposta
            weather_data = {
                "location": {
                    "name": data["location"]["name"],
                    "region": data["location"]["region"],
                    "country": data["location"]["country"],
                    "lat": data["location"]["lat"],
                    "lon": data["location"]["lon"],
                    "localtime": data["location"]["localtime"]
                },
                "current": {
                    "temperature_c": data["current"]["temp_c"],
                    "temperature_f": data["current"]["temp_f"],
                    "condition": data["current"]["condition"]["text"],
                    "condition_icon": data["current"]["condition"]["icon"],
                    "humidity": data["current"]["humidity"],
                    "wind_kph": data["current"]["wind_kph"],
                    "wind_dir": data["current"]["wind_dir"],
                    "pressure_mb": data["current"]["pressure_mb"],
                    "feels_like_c": data["current"]["feelslike_c"],
                    "uv": data["current"]["uv"]
                },
                "forecast": {
                    "date": data["forecast"]["forecastday"][0]["date"],
                    "max_temp_c": data["forecast"]["forecastday"][0]["day"]["maxtemp_c"],
                    "min_temp_c": data["forecast"]["forecastday"][0]["day"]["mintemp_c"],
                    "condition": data["forecast"]["forecastday"][0]["day"]["condition"]["text"],
                    "condition_icon": data["forecast"]["forecastday"][0]["day"]["condition"]["icon"],
                    "chance_of_rain": data["forecast"]["forecastday"][0]["day"]["daily_chance_of_rain"],
                    "max_wind_kph": data["forecast"]["forecastday"][0]["day"]["maxwind_kph"],
                    "avg_humidity": data["forecast"]["forecastday"][0]["day"]["avghumidity"],
                    "hourly": [
                        {
                            "time": hour["time"],
                            "temp_c": hour["temp_c"],
                            "condition": hour["condition"]["text"],
                            "condition_icon": hour["condition"]["icon"],
                            "chance_of_rain": hour["chance_of_rain"],
                            "wind_kph": hour["wind_kph"]
                        }
                        for hour in data["forecast"]["forecastday"][0]["hour"]
                    ]
                },
                "alerts": data.get("alerts", {}).get("alert", [])
            }
            
            return weather_data
            
        elif response.status_code == 400:
            raise HTTPException(status_code=400, detail="Localização não encontrada")
        else:
            raise HTTPException(status_code=500, detail="Erro interno do servidor meteorológico")
            
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Erro na requisição: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro inesperado: {str(e)}")

@app.get("/health")
async def health_check():
    """
    Endpoint para verificar se a API está funcionando
    """
    return {"status": "healthy", "service": "Weather API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)