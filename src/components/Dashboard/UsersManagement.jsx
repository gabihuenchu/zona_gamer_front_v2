import { useEffect, useState } from 'react';
import { usersCRUD } from '../../lib/api/usersCRUD';
import { UserService } from '../../services/userService';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ total: 0, admins: 0, active: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [formData, setFormData] = useState({ name: '', email: '', role: 'user', status: 'active' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const localUsers = await usersCRUD.getAll();
            const localStats = await usersCRUD.getStats();
            setUsers(localUsers);
            setStats(localStats);

            try {
                const remoteUsers = await UserService.getAllUsers();
                if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
                    const normalized = remoteUsers.map((u) => ({
                        id: u.id ?? u.userId ?? u._id ?? String(Math.random()),
                        name:
                            (u.name != null && u.name !== '')
                                ? u.name
                                : (u.nombre != null && u.apellido != null)
                                    ? `${u.nombre} ${u.apellido}`
                                    : 'Usuario',
                        email: u.email ?? u.correo ?? 'sin@email',
                        role: u.role ?? (u.admin ? 'admin' : 'user'),
                        status: u.status ?? (u.activo ? 'active' : 'inactive'),
                    }));
                    setUsers(normalized);
                    setStats({
                        total: normalized.length,
                        admins: normalized.filter((x) => x.role === 'admin').length,
                        active: normalized.filter((x) => x.status === 'active').length,
                    });
                }
            } catch (e) { void e }
        } catch {
            setError('Error al cargar usuarios');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => setFormData({ name: '', email: '', role: 'user', status: 'active' });

    const handleAddUser = async (e) => {
        e.preventDefault();
        try { await usersCRUD.create(formData); await loadData(); setShowAddModal(false); resetForm(); } catch { alert('Error al agregar usuario'); }
    };

    const handleEditClick = (user) => { setSelectedUser(user); setFormData({ name: user.name, email: user.email, role: user.role, status: user.status }); setShowEditModal(true); };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try { await usersCRUD.update(selectedUser.id, formData); await loadData(); setShowEditModal(false); setSelectedUser(null); resetForm(); } catch { alert('Error al actualizar usuario'); }
    };

    const handleDeleteClick = (user) => { setSelectedUser(user); setShowDeleteModal(true); };
    const handleDeleteUser = async () => { try { await usersCRUD.delete(selectedUser.id); await loadData(); setShowDeleteModal(false); setSelectedUser(null); } catch { alert('Error al eliminar usuario'); } };

    const toggleRole = async (user) => { const nextRole = user.role === 'admin' ? 'user' : 'admin'; await usersCRUD.update(user.id, { role: nextRole }); await loadData(); };
    const toggleStatus = async (user) => { const next = user.status === 'active' ? 'inactive' : 'active'; await usersCRUD.update(user.id, { status: next }); await loadData(); };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold !text-gray-800">Gestión de Usuarios</h2>
                    <p className="text-gray-500 mt-1">Administra permisos, roles y estado</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-3 !px-6 !py-3 bg-blue-600 text-white !rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    <span>Agregar Usuario</span>
                </button>
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
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                                        </td>
                                        <td className="!px-8 !py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditClick(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button onClick={() => handleDeleteClick(user)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
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
                            <h3 className="text-2xl font-bold !text-gray-800">Agregar Usuario</h3>
                            <button onClick={() => { setShowAddModal(false); resetForm(); }} className="!text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="!p-6 !space-y-4">
                            <div><label className="block text-sm font-medium !text-gray-900 mb-2">Nombre *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
                            <div><label className="block text-sm font-medium !text-gray-900 mb-2">Email *</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium !text-gray-700 mb-2">Rol *</label><select name="role" value={formData.role} onChange={handleInputChange} className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg"><option value="user">Usuario</option><option value="admin">Administrador</option></select></div>
                                <div><label className="block text-sm font-medium !text-gray-700 mb-2">Estado *</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg"><option value="active">Activo</option><option value="inactive">Inactivo</option></select></div>
                            </div>
                            <button type="submit" className="!mt-2 inline-flex items-center gap-2 !px-4 !py-2 bg-blue-600 text-white !rounded-xl hover:bg-blue-700 transition-all shadow-md">Guardar</button>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 !px-6 !py-4 flex justify-between items-center">
                            <h3 className="text-2xl font-bold !text-gray-800">Editar Usuario</h3>
                            <button onClick={() => { setShowEditModal(false); setSelectedUser(null); resetForm(); }} className="!text-gray-400 hover:text-gray-600 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="!p-6 !space-y-4">
                            <div><label className="block text-sm font-medium !text-gray-900 mb-2">Nombre *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg" /></div>
                            <div><label className="block text-sm font-medium !text-gray-900 mb-2">Email *</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium !text-gray-700 mb-2">Rol *</label><select name="role" value={formData.role} onChange={handleInputChange} className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg"><option value="user">Usuario</option><option value="admin">Administrador</option></select></div>
                                <div><label className="block text-sm font-medium !text-gray-700 mb-2">Estado *</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg"><option value="active">Activo</option><option value="inactive">Inactivo</option></select></div>
                            </div>
                            <button type="submit" className="!mt-2 inline-flex items-center gap-2 !px-4 !py-2 bg-blue-600 text-white !rounded-xl hover:bg-blue-700 transition-all shadow-md">Actualizar</button>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200"><h3 className="text-xl font-bold !text-gray-800">Eliminar Usuario</h3></div>
                        <div className="px-6 py-4"><p>¿Seguro que quieres eliminar a <strong>{selectedUser?.name}</strong>?</p></div>
                        <div className="px-6 py-4 flex gap-3 justify-end border-t border-gray-200">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700">Cancelar</button>
                            <button onClick={handleDeleteUser} className="px-4 py-2 rounded-lg bg-red-600 text-white">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
