import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Welcome, {user?.name || 'User'}!
                </h1>

                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">
                        Dashboard - Your trips will appear here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
