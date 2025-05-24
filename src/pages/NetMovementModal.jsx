export default function NetMovementModal({ purchases, transfersIn, transfersOut, netMovement, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Net Movement Breakdown</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
  
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Purchases:</span>
              <span className="font-medium">+{purchases}</span>
            </div>
            <div className="flex justify-between">
              <span>Transfers In:</span>
              <span className="font-medium">+{transfersIn}</span>
            </div>
            <div className="flex justify-between">
              <span>Transfers Out:</span>
              <span className="font-medium">-{transfersOut}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-200">
              <div className="flex justify-between font-semibold">
                <span>Total Net Movement:</span>
                <span className={netMovement >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {netMovement}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }