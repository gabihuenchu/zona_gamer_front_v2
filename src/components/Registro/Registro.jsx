import { useForm } from "react-hook-form"
import Navbar from "../Navbar/Navbar"
import { AuthService } from "../../services/authService"
import { useNavigate } from "react-router-dom"

const Register = () => {


    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({ mode: "onChange" })
    
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try {
            await AuthService.register({
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                password: data.password
            });
            alert("Registro exitoso");
            navigate("/login");
        } catch (error) {
            console.error(error)
            alert("Error al registrar usuario")
        }
        reset()
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <form onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md bg-gray-800 shadow-2xl border border-gray-700 rounded-2xl px-8 pt-8 pb-14 md:px-10 md:pt-10 md:pb-16 flex flex-col gap-6"
                >
                    <div className="text-center mb-4">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Registro</h1>
                        <p className="text-sm text-slate-500 mt-1">Ingresa tus credenciales para registrarte</p>
                    </div>
                    <div className="p-3">
                        <label className="block text-gray-200 font-medium mb-2" htmlFor="nombre">Nombre</label>
                        <input
                            {...register("nombre", {
                                required: "El nombre es obligatorio",
                                minLength: { value: 2, message: "Nombre demasiado corto" },
                                maxLength: { value: 40, message: "Nombre demasiado largo" }
                            })}
                            className={`w-full px-3 py-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition text-sm
                            ${errors.nombre ? "border-red-500 ring-2 ring-red-400" : "border-gray-600 focus:ring-pink-500 focus:border-pink-500"}`}
                            autoComplete="given-name"
                            name="nombre"
                            placeholder="Nombre"
                            type="text" />
                        {errors.nombre && (
                            <p className="text-red-500 text-sm mt-2 ml-2">{errors.nombre.message}</p>
                        )}
                    </div>
                    <div className="p-3">
                        <label className="block text-gray-200 font-medium mb-2" htmlFor="apellido">Apellido</label>
                        <input
                            {...register("apellido", {
                                required: "El apellido es obligatorio",
                                minLength: { value: 2, message: "Apellido demasiado corto" },
                                maxLength: { value: 40, message: "Apellido demasiado largo" }
                            })}
                            className={`w-full px-3 py-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition text-sm
                            ${errors.apellido ? "border-red-500 ring-2 ring-red-400" : "border-gray-600 focus:ring-pink-500 focus:border-pink-500"}`}
                            autoComplete="family-name"
                            name="apellido"
                            placeholder="Apellido"
                            type="text" />
                        {errors.apellido && (
                            <p className="text-red-500 text-sm mt-2 ml-2">{errors.apellido.message}</p>
                        )}
                    </div>
                    <div className="p-3">
                        <label className="block text-gray-200 font-medium mb-2" htmlFor="password">Contraseña</label>
                        <input
                            {...register("password", {
                                required: "La contraseña es obligatoria",
                                minLength: {
                                    value: 3,
                                    message: "Contraseña demasiado corta"
                                },
                                maxLength: {
                                    value: 21,
                                    message: "Contraseña excede el largo maximo"
                                }
                            })}
                            className={`w-full px-3 py-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition text-sm
                            ${errors.password ? "border-red-500 ring-2 ring-red-400" : "border-gray-600 focus:ring-pink-500 focus:border-pink-500"}`}
                            autoComplete="current-password"
                            name="password"
                            placeholder="Contraseña"
                            type="password" />
                        {
                            errors.password && (
                                <p className="text-red-500 text-sm mt-2 ml-2">{errors.password.message}</p>
                            )
                        }
                    </div>
                    <div className="p-3">
                        <label className="block text-gray-200 font-medium mb-2" htmlFor="email">Email</label>
                        <input
                            {...register("email", {
                                required: "El correo electronico es obligatorio",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Correo invalido"
                                },
                                minLength: {
                                    value: 3,
                                    message: "Correo electronico demasiado corto"
                                },
                                maxLength: {
                                    value: 40,
                                    message: "Correo excede el maximo de caracteres"
                                }
                            })}
                            className={`w-full px-3 py-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition text-sm
                            ${errors.email ? "border-red-500 ring-2 ring-red-400" : "border-gray-600 focus:ring-pink-500 focus:border-pink-500"}`}
                            placeholder="Correo electronico"
                            name="email"
                            autoComplete="email" />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-2 ml-2">{errors.email.message}</p>
                        )}
                    </div>
                    <button className="self-center w-fit mt-4 min-w-[12rem] px-6 py-2 mb-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-pink-500/50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded" type="submit">Registrarse</button>
                </form>
            </div>
        </div>
    )
}

export default Register
