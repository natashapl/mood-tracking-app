import { AuthProvider, useAuth } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f5ff] from-73% to-[#e0e0ff] flex items-center justify-center">
        <div className="text-[20px]/[1.4] text-mood-neutral-600">Loading...</div>
      </div>
    );
  }

  return user ? <HomePage /> : <AuthPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
