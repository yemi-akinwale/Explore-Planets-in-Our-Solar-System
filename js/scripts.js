document.addEventListener('DOMContentLoaded', function () {
    const nasaApiKey = 'Bikz7YLkeP9PfyNbrxN1wFcLs8pA53Ov6fbiI3ap'; // NASA API Key
    const openWeatherApiKey = '92e17158ba5b1604c2870ec70e579100'; // OpenWeatherMap API Key
    const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`;
    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${openWeatherApiKey}&units=metric`;

    // Simulated weather data for Mars and Jupiter
    const planetWeather = {
        Mars: { temperature: '-60°C', condition: 'Dust Storm', wind: '40 km/h' },
        Jupiter: { temperature: '-145°C', condition: 'High Winds', wind: '100 km/h' },
    };

    // Fetch APOD data
    function fetchAPOD(url, planet = '') {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch APOD data. Please try again later.');
                }
                return response.json();
            })
            .then(data => updateAPOD(data, planet))
            .catch(error => {
                console.error('Error fetching APOD data:', error);
                document.getElementById('apod-container').innerHTML = '<p class="text-danger">Failed to load Astronomy Picture of the Day. Please try again later.</p>';
            });
    }

    // Update APOD section
    function updateAPOD(data, planet) {
        const apodLink = document.getElementById('apod-link');
        const apodImage = document.getElementById('apod-image');
        const apodVideo = document.getElementById('apod-video');
        const apodTitle = document.getElementById('apod-title');
        const apodDescription = document.getElementById('apod-description');

        apodLink.href = data.url;

        if (data.media_type === 'image') {
            apodImage.src = data.url;
            apodImage.alt = data.title || 'Astronomy Picture of the Day';
            apodImage.style.display = 'block';
            apodVideo.style.display = 'none';
        } else if (data.media_type === 'video') {
            apodVideo.src = data.url;
            apodVideo.title = data.title || 'Astronomy Picture of the Day';
            apodVideo.style.display = 'block';
            apodImage.style.display = 'none';
        }

        apodTitle.textContent = planet ? `${data.title} - Related to ${planet}` : data.title;
        apodDescription.textContent = data.explanation;
    }

    // Fetch weather data for Earth
    function fetchEarthWeather() {
        fetch(openWeatherUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data for Earth.');
                }
                return response.json();
            })
            .then(data => updateWeather('Earth', {
                temperature: `${data.main.temp}°C`,
                condition: data.weather[0].description,
                wind: `${data.wind.speed} km/h`,
            }))
            .catch(error => {
                console.error('Error fetching weather data for Earth:', error);
                updateWeather('Earth', { temperature: 'N/A', condition: 'N/A', wind: 'N/A' });
            });
    }

    // Update weather information
    function updateWeather(planet, weather) {
        const weatherContainer = document.getElementById('weather-container');
        if (weather) {
            const { temperature, condition, wind } = weather;
            weatherContainer.innerHTML = `
                <h3>Weather on ${planet}</h3>
                <p>Temperature: ${temperature}</p>
                <p>Condition: ${condition}</p>
                <p>Wind Speed: ${wind}</p>
            `;
        } else {
            weatherContainer.innerHTML = '<p class="text-muted">Weather data not available for this planet.</p>';
        }
    }

    // Initial APOD fetch
    fetchAPOD(apodUrl);

    // Fetch APOD and weather on planet selection
    document.getElementById('Planet').addEventListener('change', function () {
        const planet = this.value;
        fetchAPOD(apodUrl, planet);

        if (planet === 'Earth') {
            fetchEarthWeather();
        } else {
            updateWeather(planet, planetWeather[planet]);
        }

        updatePlanetSummary(planet);
    });

    // Update planet summary
    function updatePlanetSummary(planet) {
        const summaryContainer = document.getElementById('planet-summary');
        const summaries = {
            Earth: 'Earth is the third planet from the Sun and the only known celestial body to support life.',
            Mars: 'Mars is the fourth planet from the Sun, known as the "Red Planet" due to its reddish appearance.',
            Jupiter: 'Jupiter is the fifth and largest planet in our Solar System, famous for its Great Red Spot.',
        };
        summaryContainer.textContent = summaries[planet] || '';
    }

    // Highlight selected planet
    function highlightPlanet(button) {
        document.querySelectorAll('.planet-title').forEach(btn => {
            btn.classList.remove('btn-primary', 'text-white');
            btn.classList.add('btn-outline-primary');
            btn.style.transform = 'scale(1)';
        });
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-primary', 'text-white');
        button.style.transform = 'scale(1.1)';
    }

    // Attach highlightPlanet to buttons
    document.querySelectorAll('.planet-title').forEach(button => {
        button.addEventListener('click', function () {
            highlightPlanet(this);
        });
    });

    // Form validation
    document.getElementById('trip-form').addEventListener('submit', function (e) {
        const requiredFields = ['Name', 'Email', 'Phone'];
        let isValid = true;

        requiredFields.forEach(field => {
            const value = document.getElementById(field).value.trim();
            if (!value) {
                alert(`Please fill out the ${field} field.`);
                isValid = false;
            }
        });

        const travelPurpose = document.querySelector('input[name="TravelPurpose"]:checked');
        if (!travelPurpose) {
            alert('Please select a purpose for your travel.');
            isValid = false;
        }

        if (!isValid) e.preventDefault();
    });

    // Calculate total cost
    document.getElementById('Travelers').addEventListener('input', calculateTotalCost);

    function calculateTotalCost() {
        const travelerCount = document.getElementById('Travelers').value;
        const selectedOption = document.getElementById('Planet').options[document.getElementById('Planet').selectedIndex];
        const costPerTraveler = selectedOption.getAttribute('data-cost') || 0;
        const totalCost = costPerTraveler * travelerCount;
        document.getElementById('total-cost').textContent = totalCost;
    }
});