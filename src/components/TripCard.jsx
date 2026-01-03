import { Link } from 'react-router-dom';

const TripCard = ({ trip }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Link
            to={`/trips/${trip.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
        >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {trip.name}
            </h3>

            {trip.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">
                    {trip.description}
                </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                    <span>📅 {formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
                </div>

                <div className="text-blue-600 font-semibold">
                    ${parseFloat(trip.total_budget || 0).toFixed(2)}
                </div>
            </div>
        </Link>
    );
};

export default TripCard;
