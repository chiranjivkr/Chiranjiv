const API_KEY = '68c3b8a164bc12d0fc01df484ded8aa3';
        const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

        function showLoading() {
            document.getElementById('loading').classList.add('active');
            document.getElementById('weatherInfo').classList.remove('active');
            document.getElementById('error').classList.remove('active');
        }

        function hideLoading() {
            document.getElementById('loading').classList.remove('active');
        }

        function showError(message) {
            const errorEl = document.getElementById('error');
            errorEl.textContent = message;
            errorEl.classList.add('active');
            hideLoading();
        }

        function displayWeather(data) {
            hideLoading();
            document.getElementById('error').classList.remove('active');
            
            document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById('description').textContent = data.weather[0].description;
            document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
            document.getElementById('humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
            document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
            
            const iconCode = data.weather[0].icon;
            document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
            
            document.getElementById('weatherInfo').classList.add('active');
        }

        async function fetchWeather(url) {
            try {
                showLoading();
                const response = await fetch(url);
                
                if (!response.ok) {
                    const data = await response.json();
                    showError(data.message || 'City not found. Please check the spelling.');
                    return;
                }
                
                const data = await response.json();
                displayWeather(data);
            } catch (error) {
                console.error('Error:', error);
                showError('Unable to fetch weather data. If viewing locally, try opening in Claude artifacts or hosting on a server.');
            }
        }

        function searchWeather() {
            const city = document.getElementById('cityInput').value.trim();
            if (!city) {
                showError('Please enter a city name');
                return;
            }
            
            const url = `${API_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
            fetchWeather(url);
        }

        function getLocationWeather() {
            if (!navigator.geolocation) {
                showError('Geolocation is not supported by your browser');
                return;
            }

            showLoading();
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const url = `${API_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
                    fetchWeather(url);
                },
                (error) => {
                    hideLoading();
                    showError('Unable to get your location. Please enter a city manually.');
                }
            );
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                searchWeather();
            }
        }