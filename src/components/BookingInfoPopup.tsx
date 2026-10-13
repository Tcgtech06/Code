interface BookingInfoPopupProps {
  userName: string;
  teamName: string;
  status: string;
  remarks?: string; // Add remarks as an optional prop
  position: { x: number; y: number };
  onClose: () => void;
}

export function BookingInfoPopup({ userName, teamName, status, remarks, position, onClose }: BookingInfoPopupProps) {
  return (
    <div
      className="fixed z-50 bg-white p-3 sm:p-4 rounded-lg shadow-lg border border-gray-200 w-48 sm:w-56"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
        &times;
      </button>
      <div className="mt-2">
        <p className="font-semibold text-gray-800 text-xs sm:text-sm break-words">Booked by: {userName}</p>
        <p className="text-gray-600 text-xs sm:text-sm break-words">Team: {teamName}</p>
        <p className="text-xs sm:text-xs text-gray-500 break-words">Status: {status}</p>
        {remarks && <p className="text-xs sm:text-xs text-gray-500 break-words mt-1">Purpose: {remarks}</p>} {/* Display remarks */}
      </div>
    </div>
  );
}
