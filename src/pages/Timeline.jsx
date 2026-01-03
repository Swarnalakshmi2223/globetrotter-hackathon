import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById } from '../services/tripService';
import Navbar from '../components/Navbar';

const Timeline = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrip();
    }, [id]);

    const fetchTrip = async () => {
        try {
            setLoading(true);
            const data = await getTripById(id);
            setTrip(data.trip);
        } catch (err) {
            console.error('Error fetching trip:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto py-8 px-4">
                    <p className="text-gray-600">Loading timeline...</p>
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

    // Calculate trip duration
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateShort = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

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
                        Trip Timeline
                    </h1>
                    <p className="text-gray-600">{trip.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)} ({durationDays} days)
                    </p>
                </div>

                {/* Timeline Visualization */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {trip.stops && trip.stops.length > 0 ? (
                        <div className="space-y-8">
                            {/* Trip Start */}
                            <div className="flex items-start">
                                <div className="flex flex-col items-center mr-4">
                                    <div className="w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow"></div>
                                    <div className="w-1 h-16 bg-gray-300"></div>
                                </div>
                                <div className="flex-1 pb-8">
                                    <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
                                        <p className="text-sm font-medium text-green-800">Trip Starts</p>
                                        <p className="text-xs text-green-600 mt-1">{formatDate(trip.start_date)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* City Stops */}
                            {trip.stops.map((stop, index) => {
                                const arrivalDate = new Date(stop.arrival_date);
                                const departureDate = new Date(stop.departure_date);
                                const stayDays = Math.ceil((departureDate - arrivalDate) / (1000 * 60 * 60 * 24)) + 1;

                                return (
                                    <div key={stop.id} className="flex items-start">
                                        <div className="flex flex-col items-center mr-4">
                                            <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow"></div>
                                            {index < trip.stops.length - 1 && (
                                                <div className="w-1 flex-1 bg-gray-300" style={{ minHeight: '120px' }}></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-blue-900">
                                                            📍 {stop.city_name}, {stop.country}
                                                        </h3>
                                                        <p className="text-sm text-blue-700 mt-1">
                                                            {formatDateShort(stop.arrival_date)} → {formatDateShort(stop.departure_date)}
                                                        </p>
                                                        <p className="text-xs text-blue-600 mt-1">
                                                            {stayDays} {stayDays === 1 ? 'day' : 'days'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {stop.notes && (
                                                    <p className="text-sm text-gray-700 mt-2 italic">"{stop.notes}"</p>
                                                )}

                                                {stop.activities && stop.activities.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-blue-200">
                                                        <p className="text-xs font-medium text-blue-800 mb-2">
                                                            {stop.activities.length} {stop.activities.length === 1 ? 'Activity' : 'Activities'} Planned
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {stop.activities.slice(0, 5).map((activity, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                                                                >
                                                                    {activity.custom_name || activity.activity_name}
                                                                </span>
                                                            ))}
                                                            {stop.activities.length > 5 && (
                                                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                                                    +{stop.activities.length - 5} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Trip End */}
                            <div className="flex items-start">
                                <div className="flex flex-col items-center mr-4">
                                    <div className="w-4 h-4 rounded-full bg-red-500 border-4 border-white shadow"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4">
                                        <p className="text-sm font-medium text-red-800">Trip Ends</p>
                                        <p className="text-xs text-red-600 mt-1">{formatDate(trip.end_date)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-4xl mb-2">📅</p>
                            <p>No stops added yet. Add stops to see the timeline!</p>
                        </div>
                    )}
                </div>

                {/* Summary Card */}
                <div className="mt-6 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">{durationDays}</p>
                            <p className="text-sm text-gray-600">Total Days</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">{trip.stops?.length || 0}</p>
                            <p className="text-sm text-gray-600">Cities</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">
                                {trip.stops?.reduce((sum, stop) => sum + (stop.activities?.length || 0), 0) || 0}
                            </p>
                            <p className="text-sm text-gray-600">Activities</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
