const STORAGE_KEY = 'users_local'

class UsersCRUDService {
  constructor() {
    this.initialized = false
  }

  async initialize() {
    if (this.initialized) return
    const local = localStorage.getItem(STORAGE_KEY)
    if (!local) {
      const seed = [
        { id: 'u1', name: 'Juan Pérez', email: 'juan@example.com', role: 'admin', status: 'active', active: true, password: '123' },
        { id: 'u2', name: 'María García', email: 'maria@example.com', role: 'user', status: 'active', active: true, password: '123' },
        { id: 'u3', name: 'Carlos López', email: 'carlos@example.com', role: 'user', status: 'inactive', active: false, password: '123' },
      ]
      this.save(seed)
    }
    this.initialized = true
  }

  async getAll() {
    await this.initialize()
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.read()), 250)
    })
  }

  async getById(id) {
    const list = await this.getAll()
    return list.find((u) => u.id === id) || null
  }

  async create(data) {
    await this.initialize()
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const list = this.read()
          const user = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            role: data.role || 'user',
            status: data.status || 'active',
            active: (typeof data.active === 'boolean') ? data.active : (data.status ? data.status === 'active' : true),
            password: data.password, // Añadido para autenticación local
          }
          list.push(user)
          this.save(list)
          resolve(user)
        } catch (error) {
          console.error(error)
          reject(new Error('Error al crear usuario'))
        }
      }, 250)
    })
  }

  async update(id, data) {
    await this.initialize()
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const list = this.read()
          const idx = list.findIndex((u) => u.id === id)
          if (idx === -1) return reject(new Error('Usuario no encontrado'))
          list[idx] = { ...list[idx], ...data }
          this.save(list)
          resolve(list[idx])
        } catch (error) {
          console.error(error)
          reject(new Error('Error al actualizar usuario'))
        }
      }, 250)
    })
  }

  async delete(id) {
    await this.initialize()
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const list = this.read()
          const next = list.filter((u) => u.id !== id)
          if (next.length === list.length) return reject(new Error('Usuario no encontrado'))
          this.save(next)
          resolve({ success: true })
        } catch (error) {
          console.error(error)
          reject(new Error('Error al eliminar usuario'))
        }
      }, 250)
    })
  }

  async getStats() {
    const list = await this.getAll()
    return {
      total: list.length,
      admins: list.filter((u) => u.role === 'admin').length,
      active: list.filter((u) => (u.active === true) || (u.status === 'active')).length,
    }
  }

  read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  save(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch (error) {
      console.error(error)
    }
  }
}

export const usersCRUD = new UsersCRUDService()
export default usersCRUD
