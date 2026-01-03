const StopCard = ({ stop, onEdit, onDelete, onAddActivity, onDeleteActivity }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Calculate total cost for this stop
    const totalCost = stop.activities?.reduce((sum, act) => sum + parseFloat(act.cost || 0), 0) || 0;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                        📍 {stop.city_name}, {stop.country}
                    </h4>
                    <p className="text-sm text-gray-600">
                        {formatDate(stop.arrival_date)} → {formatDate(stop.departure_date)}
                    </p>
                    {totalCost > 0 && (
                        <p className="text-sm font-medium text-blue-600 mt-1">
                            Total: ${totalCost.toFixed(2)}
                        </p>
                    )}
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onDelete(stop.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {stop.notes && (
                <p className="text-sm text-gray-700 mb-3">{stop.notes}</p>
            )}

            {/* Activities */}
            <div className="mt-3 border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-medium text-gray-500">Activities</p>
                    <button
                        onClick={() => onAddActivity(stop)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                    >
                        + Add Activity
                    </button>
                </div>

                {stop.activities && stop.activities.length > 0 ? (
                    <div className="space-y-1">
                        {stop.activities.map((activity) => (
                            <div key={activity.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                <div className="flex-1">
                                    <span className="text-gray-700">
                                        {activity.custom_name || activity.activity_name}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2 capitalize">
                                        ({activity.category})
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {activity.cost > 0 && (
                                        <span className="text-gray-600 font-medium">
                                            ${parseFloat(activity.cost).toFixed(2)}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => onDeleteActivity(activity.id)}
                                        className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 italic">No activities yet</p>
                )}
            </div>
        </div>
    );
};

export default StopCard;
