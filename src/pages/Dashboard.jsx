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
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 tracking-tight pb-1">
                            My Trips
                        </h1>
                        <p className="text-slate-500 font-medium mt-1 text-lg">
                            Plan and manage your travel adventures
                        </p>
                    </div>

                    <Link
                        to="/trips/new"
                        className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 font-bold transform hover:-translate-y-0.5"
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
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div className="text-7xl mb-6 transform hover:scale-110 transition-transform cursor-default">✈️</div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">
                            No trips yet
                        </h3>
                        <p className="text-slate-500 mb-8 text-lg">
                            Start planning your next adventure!
                        </p>
                        <Link
                            to="/trips/new"
                            className="inline-block px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all font-bold shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5"
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
