

// import { Link } from "react-router-dom";

// function Home() {
//   return (
//     <div className="relative h-[75vh] w-full overflow-hidden">
//       {/* Background image */}
//       <div
//         className="absolute inset-0 bg-[url('/achome.jpg')] bg-cover bg-center opacity-50"
//       ></div>

//       {/* Overlay for readability */}
//       <div className="absolute inset-0 bg-blue-200/40"></div>

//       {/* Hero content */}
//       <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
//         <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-900 mb-4 leading-tight">
//           <span className="text-blue-700">Stay Cool</span> with <br />
//           <span className="text-blue-900">AC Solutions</span>
//         </h2>

//       <p className="text-base sm:text-lg md:text-xl text-blue-900/90 mb-6 max-w-3xl text-center sm:text-left leading-relaxed font-medium">
//         Explore our latest AC products and get comfort delivered straight to your home.
//       </p>
//         <Link
//           to="/products"
//           className="bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold py-3 px-8 sm:py-4 sm:px-10 rounded-xl shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           Shop Now
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Home;
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="relative h-[75vh] w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-[url('/achome.jpg')] bg-cover bg-center opacity-50"
      ></div>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-blue-200/40"></div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-900 mb-4 leading-tight">
          <span className="text-blue-700">Stay Cool</span> with <br />
          <span className="text-blue-900">AC Solutions</span>
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-blue-900/90 mb-6 max-w-3xl leading-relaxed font-medium">
          Explore our latest AC products and get comfort delivered straight to your home.
        </p>

        <Link
          to="/products"
          className="bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold py-3 px-8 sm:py-4 sm:px-10 rounded-xl shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Shop Now
        </Link>
      </div>

      {/* Offer banner  */}
      <div className="absolute top-6 left-6 z-20">
      <img
          src="/disc1.png"
          alt="10% Off Offer"
          className="w-[180px] sm:w-[220px] md:w-[260px] animate-bounce"
        />
      </div>

    </div>
  );
}

export default Home;
