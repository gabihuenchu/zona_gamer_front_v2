import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserService } from '../../services/userService';
import { AuthService } from '../../services/authService';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ total: 0, admins: 0, active: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: 'onChange' });

    

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const remoteUsers = await UserService.getAllUsers();
            const normalized = Array.isArray(remoteUsers) ? remoteUsers.map((u) => ({
                id: u.id ?? u.userId ?? u._id ?? String(Math.random()),
                name: (u.name != null && u.name !== '') ? u.name : (u.nombre != null && u.apellido != null) ? `${u.nombre} ${u.apellido}` : 'Usuario',
                email: u.email ?? u.correo ?? 'sin@email',
                role: u.role ?? (u.admin || u.isAdmin ? 'admin' : 'user'),
                status: (u.active === true || u.status === 'active') ? 'active' : 'inactive',
                active: u.active ?? false
            })) : [];
            setUsers(normalized);
            try {
                const statsRes = await UserService.getUserStats();
                const total = statsRes.totalUsuarios ?? normalized.length;
                const active = statsRes.usuariosActivos ?? normalized.filter((x) => x.status === 'active').length;
                const admins = normalized.filter((x) => x.role === 'admin').length;
                setStats({ total, admins, active });
            } catch {
                setStats({
                    total: normalized.length,
                    admins: normalized.filter((x) => x.role === 'admin').length,
                    active: normalized.filter((x) => x.status === 'active').length,
                });
            }
        } catch {
            setError('Error al cargar usuarios');
        } finally {
            setIsLoading(false);
        }
    };

    const onAddSubmit = async (data) => {
        try {
            await AuthService.register({
                email: data.email,
                password: data.password,
                nombre: data.nombre,
                apellido: data.apellido,
                numeroDeTelefono: data.numeroDeTelefono,
            });
            alert('Usuario creado');
            setShowAddModal(false);
            reset();
            await loadData();
        } catch (e) {
            alert('Error al crear usuario');
        }
    };

    const toggleRole = async (user) => {
        try {
            const isAdmin = user.role === 'admin' || user.admin === true || user.isAdmin === true;
            if (isAdmin) {
                await UserService.revokeAdmin(user.id);
            } else {
                await UserService.promoteToAdmin(user.id);
            }
            await loadData();
        } catch {
            alert('Error al actualizar rol');
        }
    };
    const toggleStatus = async (user) => {
        try {
            const isActive = user.active === true || user.status === 'active';
            if (isActive) {
                await UserService.deactivateUser(user.id);
            } else {
                await UserService.activateUser(user.id);
            }
            await loadData();
        } catch {
            alert('Error al actualizar estado');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-3 !px-6 !py-3 bg-blue-600 text-white !rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        <span>Crear Usuario</span>
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold !text-gray-800">Gestión de Usuarios</h2>
                        <p className="text-gray-500 mt-1">Administra permisos, roles y estado</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 !gap-6">
                <div className="bg-white !rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-0"><div className="w-16 bg-blue-50 flex items-center justify-center self-stretch"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292" /></svg></div><div className="flex-1 !px-4 !py-6"><p className="text-sm text-gray-500">Total Usuarios</p><p className="text-2xl font-bold text-gray-800">{isLoading ? '...' : stats.total}</p></div></div>
                </div>
                <div className="bg-white !rounded-xl shadow-sm border border-gray-100 overflow-hidden"><div className="flex items-center gap-0"><div className="w-16 bg-purple-50 flex items-center justify-center self-stretch"><svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg></div><div className="flex-1 !px-4 !py-6"><p className="text-sm text-gray-500">Administradores</p><p className="text-2xl font-bold text-gray-800">{isLoading ? '...' : stats.admins}</p></div></div></div>
                <div className="bg-white !rounded-xl shadow-sm border border-gray-100 overflow-hidden"><div className="flex items-center gap-0"><div className="w-16 bg-green-50 flex items-center justify-center self-stretch"><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg></div><div className="flex-1 !px-4 !py-6"><p className="text-sm text-gray-500">Activos</p><p className="text-2xl font-bold text-gray-800">{isLoading ? '...' : stats.active}</p></div></div></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden !mt-8">
                {error && (<div className="p-4 bg-red-50 border-b border-red-200 text-red-700">{error}</div>)}
                {isLoading ? (
                    <div className="!p-12 text-center text-gray-500"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>Cargando usuarios...</div>
                ) : users.length === 0 ? (
                    <div className="!p-12 text-center text-gray-500"><svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0" /></svg><p className="text-lg font-medium mb-2">No hay usuarios</p><p className="text-sm">Comienza agregando tu primer usuario</p></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="!px-8 !py-4 text-left text-xs font-semibold text-gray-600 uppercase">Usuario</th><th className="!px-8 !py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th><th className="!px-8 !py-4 text-left text-xs font-semibold text-gray-600 uppercase">Rol</th><th className="!px-8 !py-4 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th><th className="!px-8 !py-4 text-left text-xs font-semibold text-gray-600 uppercase">Acciones</th></tr></thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="!px-8 !py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">{user.name?.charAt(0) || '?'}</div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                            </div>
                                        </td>
                                        <td className="!px-8 !py-4 whitespace-nowrap text-gray-700">{user.email}</td>
                                        <td className="!px-8 !py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
                                        </td>
                                        <td className="!px-8 !py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${(user.active === true || user.status === 'active') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{(user.active === true || user.status === 'active') ? 'Activo' : 'Inactivo'}</span>
                                        </td>
                                        <td className="!px-8 !py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                
                                                <button onClick={() => toggleRole(user)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Alternar rol">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5l7 7" /></svg>
                                                </button>
                                                <button onClick={() => toggleStatus(user)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Activar/Desactivar">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 !px-6 !py-4 flex justify-between items-center">
                            <h3 className="text-2xl font-bold !text-gray-800">Crear Usuario</h3>
                            <button onClick={() => { setShowAddModal(false); reset(); }} className="!text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onAddSubmit)} className="!p-6 !space-y-4">
                            <div>
                                <label className="block text-sm font-medium !text-gray-900 mb-2">Email *</label>
                                <input type="email" className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    {...register('email', {
                                        required: { value: true, message: 'El email es obligatorio' },
                                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalido' },
                                    })}
                                />
                                {errors.email && (<p className="text-red-500 text-sm mt-2">{errors.email.message}</p>)}
                            </div>
                            <div>
                                <label className="block text-sm font-medium !text-gray-900 mb-2">Contraseña *</label>
                                <input type="password" className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    {...register('password', {
                                        required: { value: true, message: 'Contraseña debe ser obligatoria' },
                                        minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
                                    })}
                                />
                                {errors.password && (<p className="text-red-500 text-sm mt-2">{errors.password.message}</p>)}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium !text-gray-900 mb-2">Nombre *</label>
                                    <input type="text" className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        {...register('nombre', {
                                            required: { value: true, message: 'El nombre es obligatorio' },
                                            minLength: { value: 2, message: 'El nombre debe tener entre 2 a 50 caracteres' },
                                            maxLength: { value: 50, message: 'El nombre debe tener entre 2 a 50 caracteres' },
                                        })}
                                    />
                                    {errors.nombre && (<p className="text-red-500 text-sm mt-2">{errors.nombre.message}</p>)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium !text-gray-900 mb-2">Apellido *</label>
                                    <input type="text" className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        {...register('apellido', {
                                            required: { value: true, message: 'El apellido es obligatorio' },
                                            minLength: { value: 2, message: 'El apellido debe tener entre 2 a 50 caracteres' },
                                            maxLength: { value: 50, message: 'El apellido debe tener entre 2 a 50 caracteres' },
                                        })}
                                    />
                                    {errors.apellido && (<p className="text-red-500 text-sm mt-2">{errors.apellido.message}</p>)}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium !text-gray-900 mb-2">Número de Teléfono</label>
                                <input type="tel" className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+56912345678"
                                    {...register('numeroDeTelefono', {
                                        pattern: { value: /^\+?56?[0-9]{9}$/, message: 'Numero de telefono chileno invalido (ej: +56912345678 o 912345678)' },
                                    })}
                                />
                                {errors.numeroDeTelefono && (<p className="text-red-500 text-sm mt-2">{errors.numeroDeTelefono.message}</p>)}
                            </div>
                            <button type="submit" className="!mt-2 inline-flex items-center gap-2 !px-4 !py-2 bg-blue-600 text-white !rounded-xl hover:bg-blue-700 transition-all shadow-md">Guardar</button>
                        </form>
                    </div>
                </div>
            )}

            
        </div>
    );
};

export default UsersManagement;
