import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyTrips } from '../services/tripService';
import Navbar from '../components/Navbar';
import TripCard from '../components/TripCard';

const Dashboard = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            setLoading(true);
            const data = await getMyTrips();
            setTrips(data.trips || []);
            setError('');
        } catch (err) {
            console.error('Error fetching trips:', err);
            setError('Failed to load trips');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Trips
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Plan and manage your travel adventures
                        </p>
                    </div>

                    <Link
                        to="/trips/new"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        + Plan New Trip
                    </Link>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading your trips...</p>
                    </div>
                ) : trips.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <div className="text-6xl mb-4">✈️</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No trips yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start planning your next adventure!
                        </p>
                        <Link
                            to="/trips/new"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Plan Your First Trip
                        </Link>
                    </div>
                ) : (
                    /* Trips Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map((trip) => (
                            <TripCard key={trip.id} trip={trip} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
