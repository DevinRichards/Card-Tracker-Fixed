import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const LandingPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        // Fetch the initial data for the chart
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            const response = await axios.get('/api/card-values');
            setChartData({
                labels: response.data.labels,
                datasets: [
                    {
                        label: 'Card Value Over Time',
                        data: response.data.values,
                        fill: false,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching chart data', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`/api/search?query=${searchTerm}`);
            setSearchResults(response.data.results);
        } catch (error) {
            console.error('Error fetching search results', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setShowSearch(true);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Your Card Portfolio</h1>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search for cards..."
                    className="px-4 py-2 border rounded-md"
                />
            </div>

            {!showSearch ? (
                <div>
                    <Line data={chartData} />
                </div>
            ) : (
                <div>
                    <form onSubmit={handleSearch}>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                            Search
                        </button>
                    </form>
                    <div className="mt-4">
                        {searchResults.map((result) => (
                            <div key={result.id} className="mb-2 p-2 border rounded-md">
                                <img src={result.image_url} alt={result.name} className="w-16 h-16" />
                                <p>{result.name}</p>
                                <p>${result.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
