const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-black">
            <div className="relative">
                {/* Background pulse effect */}
                <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse scale-150 blur-xl"></div>
                
                {/* Main loading circle */}
                <div className="relative w-16 h-16 rounded-full border-2 border-gray-800">
                    {/* Animated border */}
                    <div 
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-white border-r-gray-400"
                        style={{
                            animation: "spin 2s linear infinite",
                        }}
                    ></div>
                    
                    {/* Inner dot */}
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                </div>
                
                {/* Loading text */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                        <span>Loading</span>
                        <div className="flex gap-1">
                            <div 
                                className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                            ></div>
                            <div 
                                className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                            ></div>
                            <div 
                                className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Keyframes */}
            <style jsx>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default Loading;