import { useFavourites } from '../context/FavouritesContext';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function FavouritesPage() {
  const { favourites, removeFromFavourites } = useFavourites();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Please log in to view your favourites.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <FaHeart className="text-pink-500 dark:text-pink-400 w-8 h-8" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Favourites</h1>
        </div>
        {favourites.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">You have no favourite items yet.</p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favourites.map((favorite) => (
              <div key={favorite.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={favorite.product.image}
                    alt={favorite.product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      ${favorite.product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col h-48">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {favorite.product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">
                    {favorite.product.description}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => navigate(`/product/${favorite.product.id}`)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => removeFromFavourites(favorite.product.id)}
                      className="flex items-center justify-center bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-3 py-3 rounded-xl hover:bg-pink-200 dark:hover:bg-pink-900/40 transition-all duration-300"
                      title="Remove from favourites"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 