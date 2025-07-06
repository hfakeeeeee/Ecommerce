import { useFavourites } from '../context/FavouritesContext';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaTrash } from 'react-icons/fa';

export default function FavouritesPage() {
  const { favourites, removeFromFavourites } = useFavourites();
  const navigate = useNavigate();

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {favourites.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col h-[370px] group overflow-hidden">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 truncate" title={product.name}>
                    {product.name.length > 40 ? product.name.slice(0, 40) + '…' : product.name}
                  </h3>
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-xl mb-4 block">
                    ${product.price}
                  </span>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => removeFromFavourites(product.id)}
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