import { defineStore, acceptHMRUpdate } from "pinia";
import { listAvatares, getAvatarFullUrl } from 'src/services/avatarService'

export const useAvatarStore = defineStore("avatar", {
    state: () => ({
        items: [],
        loading: false,
        error: null,
        selectedAvatarId: null,
        selectedAvatarUrl: '',
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
                const response = await listAvatares();
                if (response && response.data && Array.isArray(response.data)) {
                    this.items = response.data;
                } else if (Array.isArray(response)) {
                    this.items = response;
                } else {
                    this.items = [];
                }
            } catch (err) {
                this.error = "Falha ao buscar avatares da API.";
                console.error("Erro ao buscar avatares:", err);
            } finally {
                this.loading = false;
            }
        },

        setAvatar(id) {
            this.selectedAvatarId = id;
            const avatar = this.items.find(a => a.id == id);
            if (avatar) {
                this.selectedAvatarUrl = getAvatarFullUrl(avatar);
            } else {
                console.warn(`Avatar ID ${id} não encontrado na lista.`);
            }
        },

        clearAvatar() {
            this.selectedAvatarId = null;
            this.selectedAvatarUrl = '';
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAvatarStore, import.meta.hot))
}
