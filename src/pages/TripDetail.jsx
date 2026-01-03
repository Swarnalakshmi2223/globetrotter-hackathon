import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById } from '../services/tripService';
import { getAllCities, addStopToTrip, deleteStop } from '../services/cityService';
import { getBudgetBreakdown, addActivity, deleteActivity as deleteActivityAPI } from '../services/activityService';
import Navbar from '../components/Navbar';
import StopCard from '../components/StopCard';

const TripDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [cities, setCities] = useState([]);
    const [budgetBreakdown, setBudgetBreakdown] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Add stop modal
    const [showAddStop, setShowAddStop] = useState(false);
    const [newStop, setNewStop] = useState({
        city_id: '',
        arrival_date: '',
        departure_date: '',
        notes: ''
    });

    // Add activity modal
    const [showAddActivity, setShowAddActivity] = useState(false);
    const [selectedStop, setSelectedStop] = useState(null);
    const [newActivity, setNewActivity] = useState({
        custom_name: '',
        description: '',
        cost: '',
        category: 'food',
        date: '',
        time: ''
    });

    useEffect(() => {
        fetchTripData();
        fetchCities();
        fetchBudget();
    }, [id]);

    const fetchTripData = async () => {
        try {
            setLoading(true);
            const data = await getTripById(id);
            setTrip(data.trip);
            setError('');
        } catch (err) {
            console.error('Error fetching trip:', err);
            setError('Failed to load trip');
        } finally {
            setLoading(false);
        }
    };

    const fetchCities = async () => {
        try {
            const data = await getAllCities();
            setCities(data.cities || []);
        } catch (err) {
            console.error('Error fetching cities:', err);
        }
    };

    const fetchBudget = async () => {
        try {
            const data = await getBudgetBreakdown(id);
            setBudgetBreakdown(data.breakdown || []);
        } catch (err) {
            console.error('Error fetching budget:', err);
        }
    };

    const handleAddStop = async (e) => {
        e.preventDefault();
        try {
            const stopOrder = (trip.stops?.length || 0) + 1;
            await addStopToTrip({
                trip_id: parseInt(id),
                city_id: parseInt(newStop.city_id),
                stop_order: stopOrder,
                arrival_date: newStop.arrival_date,
                departure_date: newStop.departure_date,
                notes: newStop.notes
            });

            setNewStop({ city_id: '', arrival_date: '', departure_date: '', notes: '' });
            setShowAddStop(false);
            fetchTripData();
            fetchBudget();
        } catch (err) {
            console.error('Error adding stop:', err);
            alert('Failed to add stop');
        }
    };

    const handleDeleteStop = async (stopId) => {
        if (!window.confirm('Delete this stop and all its activities?')) return;

        try {
            await deleteStop(stopId);
            fetchTripData();
            fetchBudget();
        } catch (err) {
            console.error('Error deleting stop:', err);
            alert('Failed to delete stop');
        }
    };

    const handleAddActivityClick = (stop) => {
        setSelectedStop(stop);
        setNewActivity({
            custom_name: '',
            description: '',
            cost: '',
            category: 'food',
            date: stop.arrival_date || '',
            time: ''
        });
        setShowAddActivity(true);
    };

    const handleAddActivity = async (e) => {
        e.preventDefault();
        try {
            await addActivity({
                trip_stop_id: selectedStop.id,
                custom_name: newActivity.custom_name,
                description: newActivity.description,
                cost: parseFloat(newActivity.cost) || 0,
                category: newActivity.category,
                date: newActivity.date,
                time: newActivity.time
            });

            setShowAddActivity(false);
            setSelectedStop(null);
            fetchTripData();
            fetchBudget();
        } catch (err) {
            console.error('Error adding activity:', err);
            alert('Failed to add activity');
        }
    };

    const handleDeleteActivity = async (activityId) => {
        if (!window.confirm('Delete this activity?')) return;

        try {
            await deleteActivityAPI(activityId);
            fetchTripData();
            fetchBudget();
        } catch (err) {
            console.error('Error deleting activity:', err);
            alert('Failed to delete activity');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto py-8 px-4">
                    <p className="text-gray-600">Loading trip...</p>
                </div>
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto py-8 px-4">
                    <p className="text-red-600">{error || 'Trip not found'}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 hover:text-blue-800 mb-4"
                    >
                        ← Back to Dashboard
                    </button>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {trip.name}
                            </h1>
                            <p className="text-gray-600">
                                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                            </p>
                            {trip.description && (
                                <p className="text-gray-700 mt-2">{trip.description}</p>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate(`/trips/${id}/timeline`)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
                            >
                                📅 Timeline
                            </button>
                            <button
                                onClick={() => navigate(`/trips/${id}/budget`)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                            >
                                💰 Budget
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - Itinerary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Itinerary</h2>
                                <button
                                    onClick={() => setShowAddStop(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                    + Add Stop
                                </button>
                            </div>

                            {trip.stops && trip.stops.length > 0 ? (
                                trip.stops.map((stop) => (
                                    <StopCard
                                        key={stop.id}
                                        stop={stop}
                                        onEdit={() => { }}
                                        onDelete={handleDeleteStop}
                                        onAddActivity={handleAddActivityClick}
                                        onDeleteActivity={handleDeleteActivity}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="text-4xl mb-2">🗺️</p>
                                    <p>No stops added yet. Start building your itinerary!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Budget */}
                    <div>
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
                            <div className="text-3xl font-bold text-blue-600 mb-4">
                                ${parseFloat(trip.total_budget || 0).toFixed(2)}
                            </div>

                            {budgetBreakdown.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm font-medium text-gray-700">By Category:</p>
                                    {budgetBreakdown.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-600 capitalize">{item.category}</span>
                                            <span className="font-medium">${parseFloat(item.total).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => navigate(`/trips/${id}/budget`)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                            >
                                View Full Budget
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Stop Modal */}
            {showAddStop && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">Add Stop</h3>

                        <form onSubmit={handleAddStop} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City *
                                </label>
                                <select
                                    value={newStop.city_id}
                                    onChange={(e) => setNewStop({ ...newStop, city_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select a city</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}, {city.country}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Arrival Date *
                                </label>
                                <input
                                    type="date"
                                    value={newStop.arrival_date}
                                    onChange={(e) => setNewStop({ ...newStop, arrival_date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Departure Date *
                                </label>
                                <input
                                    type="date"
                                    value={newStop.departure_date}
                                    onChange={(e) => setNewStop({ ...newStop, departure_date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    value={newStop.notes}
                                    onChange={(e) => setNewStop({ ...newStop, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="2"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddStop(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Add Stop
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Activity Modal */}
            {showAddActivity && selectedStop && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">
                            Add Activity - {selectedStop.city_name}
                        </h3>

                        <form onSubmit={handleAddActivity} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Activity Name *
                                </label>
                                <input
                                    type="text"
                                    value={newActivity.custom_name}
                                    onChange={(e) => setNewActivity({ ...newActivity, custom_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="e.g., Eiffel Tower Visit"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    value={newActivity.category}
                                    onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="food">Food</option>
                                    <option value="lodging">Lodging</option>
                                    <option value="transport">Transport</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="shopping">Shopping</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cost *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newActivity.cost}
                                    onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={newActivity.date}
                                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={newActivity.description}
                                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="2"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddActivity(false);
                                        setSelectedStop(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Add Activity
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripDetail;
