import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold">
              Product Tracking
            </Link>
            
            {user && (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/products" 
                  className={`px-3 py-2 rounded hover:bg-blue-700 transition ${isActive('/products')}`}
                >
                  Products
                </Link>
                <Link 
                  to="/brands" 
                  className={`px-3 py-2 rounded hover:bg-blue-700 transition ${isActive('/brands')}`}
                >
                  Brands
                </Link>
                <Link 
                  to="/export" 
                  className={`px-3 py-2 rounded hover:bg-blue-700 transition ${isActive('/export')}`}
                >
                  Export
                </Link>
                <Link 
                  to="/profile" 
                  className={`px-3 py-2 rounded hover:bg-blue-700 transition ${isActive('/profile')}`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
