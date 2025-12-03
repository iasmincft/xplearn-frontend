import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null// Já inicia tentando pegar do storage
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        async login(email, password) {
            const response = await api.post('/login', { email, password })
            const token = response.data.token
            const user = response.data.user

            this.token = token
            this.user = user

            localStorage.setItem('token', token)

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            return true
            
        },

        logout() {
            this.token = null
            this.user = null
            localStorage.removeItem('token')
            api.defaults.headers.common['Authorization'] = ''
        },
        checkAuth() {
            if (this.token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

            }
        }
    }
})