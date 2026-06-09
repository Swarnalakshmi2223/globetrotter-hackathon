import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="text-2xl font-extrabold text-white tracking-wide flex items-center gap-2 drop-shadow-sm">
                            <span className="text-3xl">🌍</span> GlobeTrotter
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <span className="text-blue-50 font-medium tracking-wide">Welcome, {user?.name}!</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-white border border-white/30 rounded-full hover:bg-white/10 hover:border-white transition-all shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
