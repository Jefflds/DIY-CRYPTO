import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-primary-light dark:bg-primary-dark text-black dark:text-white flex flex-col items-center justify-center p-4">
      <img
        src="/assets/images/logo.png"
        alt="Logo da Empresa"
        className="mb-4 w-24 h-24"
      />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">
        It seems like you’ve tried to access a page that doesn’t exist.
      </p>
      <button
        onClick={handleHomeRedirect}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Back to DIY LAB
      </button>
    </div>
  );
}
