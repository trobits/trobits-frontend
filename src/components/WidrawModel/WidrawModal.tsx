import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// Withdraw Modal Component
function WithdrawModal({ isOpen, onClose, userRewards }: { isOpen: boolean, onClose: () => void, userRewards: number }) {
  const [selectedCoin, setSelectedCoin] = useState('shib');
  const [address, setAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState(10000);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock crypto prices (you should replace these with real-time data)
  const cryptoPrices = {
    shib: 0.00001307, // SHIB price in USD
    lunc: 0.00007854, // LUNC price in USD
    pepe: 0.00001234, // PEPE price in USD
    floki: 0.00012456, // FLOKI price in USD
    bonk: 0.00000987   // BONK price in USD
  };

  const coins = [
    { value: 'shib', label: 'SHIB', icon: '🔥' },
    { value: 'lunc', label: 'LUNC', icon: '🌙' },
    { value: 'pepe', label: 'PEPE', icon: '🐸' },
    { value: 'floki', label: 'FLOKI', icon: '🐕' },
    { value: 'bonk', label: 'BONK', icon: '🦴' }
  ];

  // Calculate crypto amount based on points (assuming 1 point = $0.01)
  const pointValueInUSD = 0.01;
  const usdAmount = withdrawAmount * pointValueInUSD;
  const cryptoAmount = usdAmount / cryptoPrices[selectedCoin as keyof typeof cryptoPrices];

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const submitToastLoading = toast.loading("Processing withdrawal...");

    try {
      // Handle withdrawal logic here
      console.log('Withdrawal:', {
        coin: selectedCoin,
        address,
        amount: withdrawAmount,
        cryptoAmount
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Withdrawal request submitted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to process withdrawal. Please try again.");
      console.error("Error processing withdrawal:", error);
    } finally {
      setIsSubmitting(false);
      toast.dismiss(submitToastLoading);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-[#1a1a1a] text-white rounded-lg p-8 w-[90%] max-w-md shadow-lg">
        {/* Close Button */}
        <button
          disabled={isSubmitting}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Withdraw Rewards
        </h2>

        <div className="space-y-4">
          {/* Withdraw Method Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cryptocurrency <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {coins.find(coin => coin.value === selectedCoin)?.icon}
                  </span>
                  <span>
                    {coins.find(coin => coin.value === selectedCoin)?.label}
                  </span>
                  <span className="bg-cyan-600 text-white text-xs px-2 py-0.5 rounded">BTC</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {isDropdownOpen && !isSubmitting && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                  {coins.map((coin) => (
                    <button
                      key={coin.value}
                      onClick={() => {
                        setSelectedCoin(coin.value);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 text-white transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <span className="text-sm">{coin.icon}</span>
                      <span>{coin.label}</span>
                      <span className="bg-cyan-600 text-white text-xs px-2 py-0.5 rounded">BTC</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Wallet Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your wallet address"
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Coins Available */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Amount to Withdraw <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="10000"
              max={userRewards}
              value={withdrawAmount}
              onChange={(e) =>
                setWithdrawAmount(Math.max(10000, parseInt(e.target.value) || 10000))
              }
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-400 mt-1">
              Available: <span className="text-cyan-400">{userRewards} coins</span> | 
              Minimum: <span className="text-cyan-400">10,000 coins</span>
            </p>
            {withdrawAmount < 10000 && (
              <p className="text-red-400 text-xs mt-1">Minimum withdrawal is 10,000 coins</p>
            )}
          </div>

          {/* Faucetpay Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              You Will Receive
            </label>
            <input
              type="text"
              value={`${cryptoAmount.toFixed(8)} ${selectedCoin.toUpperCase()}`}
              readOnly
              className="w-full px-4 py-2 bg-gray-800 text-gray-400 border border-gray-600 rounded-lg"
              disabled
            />
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300">Transaction Fee:</span>
              <span className="text-white">0</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-gray-300">USD Value:</span>
              <span className="text-cyan-400">${usdAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={withdrawAmount < 10000 || !address || withdrawAmount > userRewards || isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawModal;