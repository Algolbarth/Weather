import React, { useState, useEffect } from "react";

interface WeatherData {
  city: string;
  temperature: number;
  weather_description: string;
}

const get_outfit = (condition: string, temperature: number) => {
  if (condition.includes("rain")) {
    return "Prenez un parapluie et un imperméable !";
  }
  else if (temperature >= 10 && temperature < 20) {
    return "Un pull léger et un jean feront l'affaire.";
  }
  else if (temperature < 10) {
    return "Portez un manteau chaud et une écharpe.";
  }
  else {
    return "Un t-shirt et un short sont parfaits pour aujourd'hui.";
  }
};

const App: React.FC = () => {
  const [city, set_city] = useState("");
  const [weather, set_weather] = useState<WeatherData | null>(null);
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState("");
  const [darkMode, set_darkMode] = useState(false);

  useEffect(() => {
    const hours = new Date().getHours();
    set_darkMode(hours < 6 || hours > 20 || window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const get_weather = async (city_name: string) => {
    set_loading(true);
    set_error("");

    try {
      const response = await fetch(`api/v1/weathers?search=${city_name}`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const data = await response.json();
      set_weather(data[0]);

    } catch (err) {
      set_error("Impossible de récupérer la météo. Veuillez réessayer.");
    }

    set_loading(false);
  };

  const get_location = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(`/geo/reverse?format=json&lat=${latitude}&lon=${longitude}`,);
          if (!res.ok) {
            throw new Error("Erreur lors de la récupération de la localisation");
          }

          const data = await res.json();
          set_city(data.address.town);
          get_weather(data.address.town);

        } catch {
          set_error("Impossible de récupérer votre localisation.");
        }
      });

    } else {
      set_error("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>Météo en temps réel</h1>
      <input
        type="text"
        placeholder="Entrez une ville"
        value={city}
        onChange={(e) => set_city(e.target.value)}
        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", marginRight: "10px" }}
      />
      <button onClick={() => get_weather(city)} style={{ padding: "8px 12px", cursor: "pointer" }}>Rechercher</button>
      <button onClick={get_location} style={{ padding: "8px 12px", cursor: "pointer", marginLeft: "10px" }}>Utiliser ma localisation</button>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>{weather.city}</h2>
          <p>{weather.temperature}°C - {weather.weather_description}</p>
          <p>Conseil : {get_outfit(weather.weather_description, weather.temperature)}</p>
        </div>
      )}
    </div>
  );
};

export default App;
