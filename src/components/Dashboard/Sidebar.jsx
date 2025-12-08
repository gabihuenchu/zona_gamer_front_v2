const Sidebar = ({ activeSection, setActiveSection }) => {
    const menuItems = [
        {
            id: 'products',
            name: 'Productos',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            )
        },
        {
            id: 'users',
            name: 'Usuarios',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
                </svg>
            )
        }
    ];

    return (
        <aside className="relative left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200">
                <h1 className="text-2xl font-bold !text-gray-900 text-center">Panel Admin</h1>
                <p className="text-sm text-gray-900 mt-1 text-right !mr-2">ZonaGamer</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-2 py-3 transition-all duration-200 ${activeSection === item.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3">   
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 leading-tight">Admin</p>
                        <p className="text-xs text-gray-500 leading-tight">Administrador</p>
                        <a href="/registro" className="text-xs text-gray-500 leading-tight">Salir</a>
                    </div>
                </div>
            </div>
        </aside>
    );
};
    
export default Sidebar;
