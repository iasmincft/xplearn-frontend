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
                this.items = await listAvatares();
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
                this.selectedAvatarUrl = getAvatarFullUrl(avatar);
            }
        },
        clearAvatar() {
            this.selectedAvatarId = null;
            this.selectedAvatarUrl = '';
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAvatarStore, import.meta.hot))
}