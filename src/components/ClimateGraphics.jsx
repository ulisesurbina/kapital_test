import axios from 'axios';
import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';

function ClimateGraphics({ keyword }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [tempData, setTempData] = useState({});
    const [loading, setLoading] = useState(false);
    const [chartType, setChartType] = useState("temperatura");

    useEffect(() => {
        if (!keyword || keyword.trim() === "") return;

        setLoading(true);

        const KEY = 'da38ec99d438610f058d6f2a8b895e17';
        const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${keyword}&appid=${KEY}&lang=es&units=metric`;
        axios.get(URL)
            .then(response => {
                const groupedData = {};

                response.data.list.forEach(item => {
                    const date = item.dt_txt.split(' ')[0];
                    const tempMax = item.main.temp_max;
                    const tempMin = item.main.temp_min;
                    const humidity = item.main.humidity;
                    const speedwind = item.wind.speed;

                    if (!groupedData[date]) {
                        groupedData[date] = {
                            tempsMax: [],
                            tempsMin: [],
                            humidity: [],
                            speedwind: []
                        };
                    }

                    groupedData[date].tempsMax.push(tempMax);
                    groupedData[date].tempsMin.push(tempMin);
                    groupedData[date].humidity.push(humidity);
                    groupedData[date].speedwind.push(speedwind);
                });

                const processedData = Object.entries(groupedData).slice(0, 5).map(([date, temps]) => ({
                    date,
                    tempMax: Math.max(...temps.tempsMax),
                    tempMin: Math.min(...temps.tempsMin),
                    humidity: Math.min(...temps.humidity),
                    speedwind: Math.min(...temps.speedwind),
                }));
                setTempData(processedData);
            })
            .catch(error => {
                console.error('Error al acceder a los datos:', error);
                setTempData([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [keyword])

    // console.log(tempData);

    useEffect(() => {
        if (!Array.isArray(tempData) || tempData.length === 0) return;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        let datasets = [];

         if (chartType === "temperatura") {
            datasets = [
                {
                    label: 'Temperatura Máxima (°C)',
                    data: tempData.map(entry => entry.tempMax),
                    borderColor: '#ff6384',
                    backgroundColor: '#ff638433',
                    tension: 0.2,
                },
                {
                    label: 'Temperatura Mínima (°C)',
                    data: tempData.map(entry => entry.tempMin),
                    borderColor: '#36a2eb',
                    backgroundColor: '#36a2eb33',
                    tension: 0.2,
                }
            ];
        } else if (chartType === "humedad") {
            datasets = [
                {
                    label: 'Humedad (%)',
                    data: tempData.map(entry => entry.humidity),
                    borderColor: '#9966ff',
                    backgroundColor: '#9966ff33',
                    tension: 0.2,
                }
            ];
        } else if (chartType === "viento") {
            datasets = [
                {
                    label: 'Velocidad del Viento (m/s)',
                    data: tempData.map(entry => entry.speedwind),
                    borderColor: '#ffce56',
                    backgroundColor: '#ffce5633'    ,
                    tension: 0.2,
                }
            ];
        }

        chartInstanceRef.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: tempData.map(entry => entry.date
                ),
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [tempData, chartType]);

  return (
    <div className='w-full flex'>
        <div className='w-full flex flex-col items-center'>
            {loading ? (
                <p className="my-4 text-gray-600 animate-pulse">Cargando datos del clima...</p>
            ) : (
                tempData.length > 0 && (
                    <div>
                        <h2 className='text-xl font-semibold my-4'>
                            Datos climáticos de {keyword}
                        </h2>

                        <div className="flex gap-4 mb-4">
                            <button
                                className={`px-4 py-2 rounded ${chartType === 'temperatura' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                onClick={() => setChartType('temperatura')}
                            >
                                Temperatura
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${chartType === 'humedad' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                onClick={() => setChartType('humedad')}
                            >
                                Humedad
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${chartType === 'viento' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                onClick={() => setChartType('viento')}
                            >
                                Viento
                            </button>
                        </div>

                        <canvas id="acquisitions" ref={chartRef} width="600" height="400"></canvas>
                    </div>
                )
            )}
        </div>
    </div>
  )
}

export default ClimateGraphics