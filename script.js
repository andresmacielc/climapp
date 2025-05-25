window.addEventListener("DOMContentLoaded", () => {
    const appId = '747d760b808878b9d06f511c7e00da79';
    const units = "metric";
    let defaultCity = "Asunción";
    let defaultLang = "es";
    

    // 1. Función para cargar datos iniciales
    function loadDefaultCity() {
        getWeatherData(defaultCity);
        getForecastData(defaultCity);
    }

    // 2. Evento Enter (modificado)
    document.getElementById("searchInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch(document.getElementById("searchInput").value.trim());
        }
    });

    document.getElementById("searchButton").addEventListener("click", () => {
        const searchTerm = document.getElementById("searchInput").value.trim();
        handleSearch(searchTerm);
    });

    // 3. Llamar a la función inicial
    loadDefaultCity(); // <-- Esto recupera la ciudad por defecto

    // Resto del código sin cambios...
    function handleSearch(searchTerm) {
        if (searchTerm) {
            defaultCity = searchTerm;
            getWeatherData(searchTerm);
            getForecastData(searchTerm);
        } else {
            alert("Ingresa un término de búsqueda.");
        }
    }


    // script.js
function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appId}&units=${units}&lang=${defaultLang}`;
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(res.statusText); // Lanza error si la respuesta no es OK
            return res.json();
        })
        .then(data => {
            if (String(data.cod) === "200") {
                init(data);
            } else {
                alert("Ciudad no encontrada. Intenta con otra.");
            }
        })
        .catch(err => {
            alert(`Error: ${err.message}`); // Mensaje más descriptivo
        });
}

    /* FUNCION: Obtener pronóstico de 5 días/3 horas */
    function getForecastData(city) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${appId}&units=${units}&lang=${defaultLang}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.cod === "200") {
                    updateForecast(data);
                } else {
                    console.warn("No se pudo obtener pronóstico de horas.");
                }
            })
            .catch(err => {
                console.error("Error forecast:", err);
            });
    }

    /* INICIALIZAR: Actualiza fondo, info de clima, y muestra el contenedor */
    function init(data) {
        setWeatherBackground(data.weather[0].main);
        updateWeatherInfo(data);
        setWeatherAnimation(data.weather[0].main);
        const weatherEl = document.getElementById("weatherContainer");
        if (weatherEl) {
            weatherEl.style.visibility = "visible";
        }
    }

    /* Actualiza tarjeta con la info de clima actual */
    function updateWeatherInfo(data) {
        const { name, sys, main, weather, wind, visibility } = data;
        document.getElementById("cityHeader").innerText = `${name} - ${sys.country}`;
        document.getElementById("documentIconImg").src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        document.getElementById("weatherDescriptionHeader").innerText = capitalize(weather[0].description);
        document.getElementById("temperature").innerHTML = `${Math.round(main.temp)}°C`;
        document.getElementById("wind").innerText = `${Math.round(wind.speed)} km/h`;
        document.getElementById("humidity").innerText = `${main.humidity}%`;
        document.getElementById("pressure").innerText = `${main.pressure} hPa`;
        document.getElementById("visibility").innerText = `${(visibility/1000).toFixed(1)} km`;
        document.getElementById("sunrise").innerText = convertUnixTime(sys.sunrise);
        document.getElementById("sunset").innerText = convertUnixTime(sys.sunset);

        // BONUS: Mensaje informativo según clima
        showWeatherBonus(weather[0].main);
    }

    /* Muestra un mensaje según el estado del clima */
    function showWeatherBonus(condition) {
        const bonusEl = document.getElementById("weatherBonus");
        let message = "";
        switch (condition) {
            case "Clear":
                message = "☀️ ¡Día perfecto para disfrutar al aire libre!";
                break;
            case "Rain":
            case "Drizzle":
            case "Mist":
                message = "☔ Lleva tu paraguas si vas a salir.";
                break;
            case "Thunderstorm":
                message = "⚡ Procura quedarte en casa si es posible.";
                break;
            case "Snow":
                message = "❄️ Abrígate muy bien, está nevando.";
                break;
            case "Clouds":
                message = "⛅ Día nublado, ideal para actividades tranquilas.";
                break;
            default:
                message = "Consulta el clima antes de salir.";
        }
        bonusEl.innerText = message;
        bonusEl.style.display = "block";
    }

    /* Opcional: Cambia el fondo (si lo deseas) según el estado del clima */
    function setWeatherBackground(mainWeather) {
        const bgMap = {
            "Clear": "clear.jpg",
            "Clouds": "cloudy.jpg",
            "Rain": "rain.jpg",
            "Drizzle": "rain.jpg",
            "Mist": "rain.jpg",
            "Thunderstorm": "thunderstorm.jpg",
            "Snow": "snow.jpg"
        };
        const background = bgMap[mainWeather] || "default.jpg";
        document.body.style.backgroundImage = `url('img/${background}')`;
    }

    /* Aplica una animación sencilla al contenedor según el clima */
    function setWeatherAnimation(mainWeather) {
        const container = document.getElementById("weatherContainer");
        container.classList.remove("sunny", "rainy", "cloudy");
        if (mainWeather === "Clear") container.classList.add("sunny");
        else if (mainWeather === "Rain" || mainWeather === "Drizzle" || mainWeather === "Mist")
            container.classList.add("rainy");
        else if (mainWeather === "Clouds")
            container.classList.add("cloudy");
    }

    /* Muestra las próximas horas de pronóstico */
    function updateForecast(data) {
        const forecastEl = document.getElementById("forecastHours");
        forecastEl.innerHTML = ""; // Limpiar antes de mostrar

        // Tomar los próximos 4 intervalos (≈ 12 horas)
        const nextHours = data.list.slice(0, 4);
        nextHours.forEach(item => {
            const [dateStr, hourStr] = item.dt_txt.split(" ");
            const temp = Math.round(item.main.temp);
            const desc = capitalize(item.weather[0].description);
            const icon = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
            const hourBlock = document.createElement("div");
            hourBlock.classList.add("hour-forecast");
            hourBlock.innerHTML = `
                <div class="time">${hourStr.substring(0,5)}</div>
                <img src="${icon}" alt="Icono forecast">
                <div class="desc">${desc}</div>
                <div class="temp">${temp}°C</div>
            `;
            forecastEl.appendChild(hourBlock);
        });
    }

    /* Helpers */
    function convertUnixTime(timestamp) {
        return new Date(timestamp * 1000).toLocaleTimeString();
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});


/*function getSearchMethod(searchTerm) {
    return (searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm) ? "zip" : "q";
}

function searchWeather(searchTerm) {
    const searchMethod = getSearchMethod(searchTerm);
    const url = `https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.cod === 200) {
                init(data);
            } else {
                alert("Ciudad no encontrada. Intenta con otra.");
            }
        })
        .catch(err => {
            console.error("Error obteniendo datos del clima:", err);
            alert("Hubo un problema al obtener los datos.");
        });
}

function init(data) {
    setWeatherBackground(data.weather[0].main);
    updateWeatherInfo(data);
    document.getElementById("weatherContainer").style.visibility = "visible";
}

function setWeatherBackground(mainWeather) {
    const bgMap = {
        "Clear": "clear.jpg",
        "Clouds": "cloudy.jpg",
        "Rain": "rain.jpg",
        "Drizzle": "rain.jpg",
        "Mist": "rain.jpg",
        "Thunderstorm": "thunderstorm.jpg",
        "Snow": "snow.jpg"
    };

    const background = bgMap[mainWeather] || "default.jpg";
    document.body.style.backgroundImage = `url('img/${background}')`;
}

function updateWeatherInfo(data) {
    const {
        name,
        sys,
        main,
        weather,
        wind,
        visibility
    } = data;

    const icon = weather[0].icon;
    const desc = weather[0].description;

    document.getElementById("documentIconImg").src = `http://openweathermap.org/img/w/${icon}.png`;
    document.getElementById("weatherDescriptionHeader").innerText = capitalize(desc);
    document.getElementById("temperature").innerHTML = `${Math.round(main.temp)}&deg;C`;
    document.getElementById("humidity").innerText = `${main.humidity}%`;
    document.getElementById("pressure").innerText = `${main.pressure} hPa`;
    document.getElementById("wind").innerText = `${Math.round(wind.speed)} km/h`;
    document.getElementById("visibility").innerText = `${(visibility / 1000).toFixed(1)} km`;
    document.getElementById("cityHeader").innerText = `${name}, ${sys.country}`;
    document.getElementById("sunrise").innerText = convertUnixTime(sys.sunrise);
    document.getElementById("sunset").innerText = convertUnixTime(sys.sunset);

    // BONUS agregado: consejo según el clima
    showWeatherBonus(weather[0].main);
}

function showWeatherBonus(condition) {
    const bonusEl = document.getElementById("weatherBonus");
    let message = "";

    switch (condition) {
        case "Clear":
            message = "☀️ ¡Día perfecto para salir a caminar!";
            break;
        case "Rain":
        case "Drizzle":
        case "Mist":
            message = "☔ Lleva paraguas si vas a salir.";
            break;
        case "Thunderstorm":
            message = "⚡ Quédate en casa si es posible.";
            break;
        case "Snow":
            message = "❄️ Abrígate bien y ten precaución al manejar.";
            break;
        case "Clouds":
            message = "⛅ Día nublado, ideal para actividades tranquilas.";
            break;
        default:
            message = "Consulta el clima antes de salir.";
    }

    bonusEl.innerText = message;
    bonusEl.style.display = "block";
}

function convertUnixTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

document.getElementById("searchButton").addEventListener("click", () => {
    const searchTerm = document.getElementById("searchInput").value.trim();
    if (searchTerm) {
        searchWeather(searchTerm);
    } else {
        alert("Por favor, ingresa un término de búsqueda.");
    }
}); */
