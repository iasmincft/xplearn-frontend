import { defineStore } from "pinia";
import { api } from 'src/boot/axios'

const BASE_URL_AXIOS = api.defaults.baseURL;

const getFullPath = (caminhoFoto) => {
    const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS;
    const path = caminhoFoto.startsWith('/') ? caminhoFoto : `/${caminhoFoto}`;

    return `${baseUrl}/static${path}`;
}

export const useAvatarStore = defineStore("avatar", {
    state: () => ({
        items: [],
        loading: false,
        error: null,
        selectedAvatarId: null,
        selectedAvatarUrl: null,
    }),

    getters: {
        getAvatarById: (state) => (id) => {
            return state.items.find(avatar => avatar.id === id);
        }
    },
    actions: {
        async fetchAvatares() {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get("/avatares/");
                this.items = response.data.data;
            } catch (err) {
                this.error = "Falha ao buscar avatares da API.";
                console.error("Erro ao buscar avatares:", err);
            } finally {
                this.loading = false;
            }
        },
    setAvatar(id) {
        this.selectedAvatarId = id;
        const avatar = this.items.find(a => a.id === id);
        
        if (avatar) {
            this.selectedAvatarUrl = getFullPath(avatar.caminho_foto);
        }
    }
    }
});