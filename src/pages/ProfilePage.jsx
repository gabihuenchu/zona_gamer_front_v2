import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import { UserService } from '../services/userService'
import { usersCRUD } from '../lib/api/usersCRUD'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        lastname: '', // Nuevo campo
        phone: '', // Nuevo campo
        address: ''
    })
    const navigate = useNavigate()

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        setLoading(true)
        try {
            // Intentar API
            try {
                const profile = await UserService.getMyProfile()
                if (profile) {
                    setUser(profile)
                    setFormData({
                        name: profile.name || '',
                        lastname: profile.lastname || '',
                        phone: profile.phone || '',
                        address: profile.address || ''
                    })
                    setLoading(false)
                    return
                }
            } catch (e) {
                // Fallo API
            }

            // Intentar Local Storage
            const localData = localStorage.getItem('userData')
            if (localData) {
                const parsed = JSON.parse(localData)
                setUser(parsed)
                setFormData({
                    name: parsed.name || '',
                    lastname: parsed.lastname || '',
                    phone: parsed.phone || '',
                    address: parsed.address || ''
                })
            } else {
                navigate('/login') // Si no hay usuario, ir a login
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = async () => {
        try {
            // Actualizar localmente primero
            if (user.id) {
                // Si es un usuario local del usersCRUD
                await usersCRUD.update(user.id, {
                    name: formData.name,
                    lastname: formData.lastname,
                    phone: formData.phone,
                    address: formData.address
                })
                
                // Actualizar estado local y localStorage para reflejar cambios inmediatos
                const updatedUser = { ...user, ...formData }
                localStorage.setItem('userData', JSON.stringify(updatedUser))
                setUser(updatedUser)
                setIsEditing(false)
                alert("Perfil actualizado correctamente")
            } else {
                 // Si es API, aquí iría la llamada a UserService.updateProfile(formData)
                 // Como fallback simulamos
                 alert("Funcionalidad de API pendiente de implementación")
            }
        } catch (error) {
            console.error(error)
            alert("Error al actualizar el perfil")
        }
    }

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="bg-light min-vh-100">
            <Navbar />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 rounded-lg">
                            <div className="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
                                <h2 className="h4 mb-0 text-gray-800">Mi Perfil</h2>
                                <button 
                                    className={`btn ${isEditing ? 'btn-success' : 'btn-outline-primary'}`}
                                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                >
                                    {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                                </button>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-4">
                                    <div className="col-md-4 text-center">
                                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px' }}>
                                            <span className="h1 text-primary mb-0">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                                        </div>
                                        <h3 className="h5 mb-1">{user.name || 'Usuario'}</h3>
                                        <p className="text-muted small mb-3">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
                                        {isEditing && (
                                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsEditing(false)}>Cancelar</button>
                                        )}
                                    </div>
                                    <div className="col-md-8">
                                        <h4 className="h6 text-uppercase text-muted mb-3">Información Personal</h4>
                                        
                                        <div className="mb-3">
                                            <label className="small text-muted d-block mb-1">Nombre</label>
                                            {isEditing ? (
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="name" 
                                                    value={formData.name} 
                                                    onChange={handleChange} 
                                                />
                                            ) : (
                                                <span className="fw-medium">{user.name || 'No especificado'}</span>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="small text-muted d-block mb-1">Apellido</label>
                                            {isEditing ? (
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="lastname" 
                                                    value={formData.lastname} 
                                                    onChange={handleChange} 
                                                    placeholder="Ingresa tu apellido"
                                                />
                                            ) : (
                                                <span className="fw-medium">{user.lastname || 'No especificado'}</span>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="small text-muted d-block mb-1">Teléfono</label>
                                            {isEditing ? (
                                                <input 
                                                    type="tel" 
                                                    className="form-control" 
                                                    name="phone" 
                                                    value={formData.phone} 
                                                    onChange={handleChange} 
                                                    placeholder="Ingresa tu teléfono"
                                                />
                                            ) : (
                                                <span className="fw-medium">{user.phone || 'No especificado'}</span>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="small text-muted d-block mb-1">Correo Electrónico</label>
                                            <span className="fw-medium text-dark bg-light p-2 rounded d-block border">{user.email}</span>
                                            <small className="text-muted fst-italic">* El correo no se puede cambiar</small>
                                        </div>

                                        <div className="mb-3">
                                            <label className="small text-muted d-block mb-1">Dirección de Envío</label>
                                            {isEditing ? (
                                                <textarea 
                                                    className="form-control" 
                                                    name="address" 
                                                    rows="2"
                                                    value={formData.address} 
                                                    onChange={handleChange} 
                                                />
                                            ) : (
                                                <span className="fw-medium">{user.address || 'No especificada'}</span>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="small text-muted d-block">Estado de Cuenta</label>
                                            <span className={`badge ${(user.active === true || user.status === 'active') ? 'bg-success' : 'bg-secondary'}`}>
                                                {(user.active === true || user.status === 'active') ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
