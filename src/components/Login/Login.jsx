import { useForm } from "react-hook-form"
import Navbar from "../Navbar/Navbar"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { AuthService } from "../../services/authService"

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ mode: "onChange" })

    const navigate = useNavigate()
    const [loginError, setLoginError] = useState("")

    const onSubmit = async (data) => {
        try {
            const res = await AuthService.login({ email: data.email, password: data.password })
            if (res && res.token) {
                navigate("/dashboard")
                return
            }
            setLoginError("Credenciales inválidas")
        } catch (e) {
            setLoginError(e?.data?.message || "Error al iniciar sesión")
        }
    }

    return (
        <div><Navbar />
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md bg-gray-800 shadow-2xl border border-gray-700 rounded-2xl px-8 pt-8 pb-14 md:px-10 md:pt-10 md:pb-16 flex flex-col gap-6"
                >
                    <div className="text-center mb-4">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Iniciar sesión</h1>
                        {loginError &&(
                            <p className="text-red-400 text-center text-sm mt-2">{loginError}</p>
                        )}
                        <p className="text-sm text-gray-400 mt-2">Ingresa tus credenciales para continuar</p>
                    </div>

                    <div className="space-y-5 px-3">
                        <div>
                            <label className="block text-gray-200 font-medium mb-2" htmlFor="email">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                aria-invalid={!!errors.email}
                                {...register("email", {
                                    required: "El correo electrónico es requerido",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Correo inválido"
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "Mínimo 3 caracteres"
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: "Correo demasiado largo"
                                    }
                                })}
                                placeholder="correo@ejemplo.com"
                                autoComplete="email"
                                className={`w-full px-3 py-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition text-sm
                            ${errors.email ? "border-red-500 ring-2 ring-red-400" : "border-gray-600 focus:ring-pink-500 focus:border-pink-500"}`}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-200 font-medium mb-2" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                aria-invalid={!!errors.password}
                                {...register("password", {
                                    required: "La contraseña es obligatoria",
                                    minLength: {
                                        value: 6,
                                        message: "Mínimo 6 caracteres"
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: "Máximo 20 caracteres"
                                    }
                                })}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className={`w-full px-3 py-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition text-sm
                            ${errors.password ? "border-red-500 ring-2 ring-red-400" : "border-gray-600 focus:ring-pink-500 focus:border-pink-500"}`}
                            />
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        className="self-center w-fit mt-4 min-w-[12rem] px-6 py-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-pink-500/50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded"
                        type="submit"
                    >
                        Iniciar sesión
                    </button>

                    <div className="text-center text-sm mt-4 pt-4 mb-4 border-t border-gray-700">
                        <span className="text-gray-400">¿No tienes cuenta? </span>
                        <a href="/registro" className="text-pink-400 hover:text-pink-300 hover:underline font-semibold transition">
                            Regístrate
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
