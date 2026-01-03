import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById } from '../services/tripService';
import { getBudgetBreakdown } from '../services/activityService';
import Navbar from '../components/Navbar';

const Budget = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [budgetBreakdown, setBudgetBreakdown] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const tripData = await getTripById(id);
            const budgetData = await getBudgetBreakdown(id);
            setTrip(tripData.trip);
            setBudgetBreakdown(budgetData.breakdown || []);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto py-8 px-4">
                    <p className="text-gray-600">Loading budget...</p>
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto py-8 px-4">
                    <p className="text-red-600">Trip not found</p>
                </div>
            </div>
        );
    }

    // Calculate per-city costs
    const cityCosts = trip.stops?.map(stop => {
        const total = stop.activities?.reduce((sum, act) => sum + parseFloat(act.cost || 0), 0) || 0;
        return {
            cityName: `${stop.city_name}, ${stop.country}`,
            total,
            activities: stop.activities || []
        };
    }) || [];

    // Get category colors
    const categoryColors = {
        food: 'bg-green-100 text-green-800',
        lodging: 'bg-blue-100 text-blue-800',
        transport: 'bg-yellow-100 text-yellow-800',
        entertainment: 'bg-purple-100 text-purple-800',
        shopping: 'bg-pink-100 text-pink-800',
        other: 'bg-gray-100 text-gray-800'
    };

    const totalBudget = parseFloat(trip.total_budget || 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(`/trips/${id}`)}
                        className="text-blue-600 hover:text-blue-800 mb-4"
                    >
                        ← Back to Trip
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Budget Breakdown
                    </h1>
                    <p className="text-gray-600">{trip.name}</p>
                </div>

                {/* Total Budget Card */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 mb-8 text-white">
                    <h2 className="text-lg font-medium mb-2 opacity-90">Total Trip Cost</h2>
                    <p className="text-5xl font-bold">${totalBudget.toFixed(2)}</p>
                    {trip.stops && trip.stops.length > 0 && (
                        <p className="mt-4 opacity-90">
                            Across {trip.stops.length} {trip.stops.length === 1 ? 'city' : 'cities'}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Cost by Category */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            By Category
                        </h3>

                        {budgetBreakdown.length > 0 ? (
                            <div className="space-y-3">
                                {budgetBreakdown.map((item, idx) => {
                                    const percentage = totalBudget > 0 ? (parseFloat(item.total) / totalBudget * 100) : 0;
                                    return (
                                        <div key={idx}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {item.category}
                                                </span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    ${parseFloat(item.total).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {percentage.toFixed(1)}% of total
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No expenses yet</p>
                        )}
                    </div>

                    {/* Cost by City */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            By City
                        </h3>

                        {cityCosts.length > 0 ? (
                            <div className="space-y-4">
                                {cityCosts.map((city, idx) => (
                                    <div key={idx} className="border-b pb-3 last:border-b-0">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-900">
                                                📍 {city.cityName}
                                            </span>
                                            <span className="font-bold text-blue-600">
                                                ${city.total.toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {city.activities.length} {city.activities.length === 1 ? 'activity' : 'activities'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No cities added yet</p>
                        )}
                    </div>
                </div>

                {/* All Activities */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        All Activities
                    </h3>

                    {cityCosts.length > 0 ? (
                        <div className="space-y-6">
                            {cityCosts.map((city, cityIdx) => (
                                city.activities.length > 0 && (
                                    <div key={cityIdx}>
                                        <h4 className="font-semibold text-gray-800 mb-3">
                                            {city.cityName}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {city.activities.map((activity, actIdx) => (
                                                <div
                                                    key={actIdx}
                                                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-sm font-medium text-gray-900 flex-1">
                                                            {activity.custom_name || activity.activity_name}
                                                        </span>
                                                        <span className="text-sm font-bold text-blue-600 ml-2">
                                                            ${parseFloat(activity.cost).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${categoryColors[activity.category] || categoryColors.other
                                                            }`}
                                                    >
                                                        {activity.category}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-4xl mb-2">💰</p>
                            <p>No activities added yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Budget;
