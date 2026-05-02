import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";
import notFoundAnimation from "../assets/lottie/not_found.json";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-gray-50 to-blue-50 flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="relative inset-0 justify-center items-center">
          <Player
            autoplay
            loop
            src={notFoundAnimation}
            style={{ width: 400, height: 400 }}
          />
        </div>
        <p className="text-xs sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 px-4 leading-relaxed">
          Sorry, we couldn't find the page you were looking for.
          <br />
          The page may have been deleted, moved, or may no longer exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-[#869cf3] text-[#4a63c7] rounded-lg font-semibold text-sm sm:text-base hover:text-[#17368b] hover:border-[#3e5acc] hover:shadow-md transition-all duration-200 transform hover:scale-105 cursor-pointer"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            Go back
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#112e82] text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-[#1e4acf] hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
          >
            <Home size={18} className="sm:w-5 sm:h-5" />
            Back to Home Page
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto opacity-50">
          <div className="h-1.5 sm:h-2 bg-[#2647a3] rounded-full animate-pulse"></div>
          <div className="h-1.5 sm:h-2 bg-[#1a3275] rounded-full animate-pulse delay-100"></div>
          <div className="h-1.5 sm:h-2 bg-[#2647a3] rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
}
