import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/authService';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar
 * @param {boolean} props.requireAdmin - Si requiere rol de administrador
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    // Verificar si está autenticado
    const isAuth = AuthService.isAuthenticated();
    if (!isAuth) {
        console.warn("ProtectedRoute: Usuario no autenticado, redirigiendo a login.");
        return <Navigate to="/login" replace />;
    }

    // Si requiere admin, verificar rol
    if (requireAdmin) {
        const isAdmin = AuthService.isAdmin();
        if (!isAdmin) {
             console.warn("ProtectedRoute: Usuario autenticado pero no admin, redirigiendo a home.");
             return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;