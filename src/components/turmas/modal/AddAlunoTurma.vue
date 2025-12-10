<template>
    <q-card style="min-width: 350px; width: 600px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Adicionar Alunos à Turma</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
            <q-input v-model="search" outlined dense placeholder="Pesquisar por nome ou matrícula..." class="q-mb-md">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>

            <q-scroll-area style="height: 400px;">
                <div v-if="loadingData" class="row justify-center q-pa-md">
                    <q-spinner color="primary" size="3em" />
                </div>

                <q-list bordered separator v-else-if="filteredAlunos.length > 0">
                    <q-item v-for="aluno in filteredAlunos" :key="aluno.id" tag="label" v-ripple>
                        <q-item-section avatar>
                            <q-checkbox v-model="selectedAlunos" :val="aluno.id" />
                        </q-item-section>

                        <q-item-section avatar>
                            <q-avatar>
                                <img v-if="aluno.avatar" :src="resolveAvatarPath(aluno.avatar.caminho_foto)">
                                <q-icon v-else name="person" color="grey-5" />
                            </q-avatar>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label>{{ aluno.nome }}</q-item-label>
                            <q-item-label caption>
                                Matrícula: {{ aluno.matricula }} | @{{ aluno.nickname }}
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>

                <div v-else class="text-center text-grey q-pa-lg">
                    <q-icon name="person_off" size="3em" />
                    <p class="q-mt-sm">Nenhum aluno encontrado para adicionar.</p>
                </div>
            </q-scroll-area>
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-pa-md">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn color="primary" label="Salvar Alunos" :loading="saving" :disable="selectedAlunos.length === 0"
                @click="salvarAlunos" />
        </q-card-actions>
    </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { useTurmaStore } from 'src/stores/turmaStore';

const props = defineProps({
    turmaId: {
        type: Number,
        required: true
    },
    alunosAtuais: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['close', 'alunos-adicionados']);

const $q = useQuasar();
const turmaStore = useTurmaStore();

const search = ref('');
const allAlunos = ref([]);
const selectedAlunos = ref([]);
const saving = ref(false);
const loadingData = ref(true);

const BASE_URL_AXIOS = api.defaults.baseURL;

const resolveAvatarPath = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}/static${cleanPath}`;
};

const filteredAlunos = computed(() => {
    const listaBase = Array.isArray(allAlunos.value) ? allAlunos.value : [];

    const termo = search.value.toLowerCase();

    let lista = listaBase.filter(aluno => {
        const nome = aluno.nome ? aluno.nome.toLowerCase() : '';
        const matricula = aluno.matricula ? String(aluno.matricula) : '';
        return nome.includes(termo) || matricula.includes(termo);
    });

    const idsAtuais = (props.alunosAtuais || []).map(a => a.id);
    return lista.filter(aluno => !idsAtuais.includes(aluno.id));
});

const fetchAllAlunos = async () => {
    loadingData.value = true;
    try {
        const response = await api.get('/alunos');

        console.log('Resposta API Alunos:', response.data);

        if (Array.isArray(response.data)) {
            allAlunos.value = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
            allAlunos.value = response.data.data;
        } else {
            console.warn('Formato inesperado na resposta de alunos:', response.data);
            allAlunos.value = [];
        }

    } catch (error) {
        console.error(error);
        $q.notify({ type: 'negative', message: 'Erro ao carregar lista de alunos.' });
        allAlunos.value = [];
    } finally {
        loadingData.value = false;
    }
};

const salvarAlunos = async () => {
    saving.value = true;
    try {
        
        await turmaStore.adicionarAlunos(props.turmaId, selectedAlunos.value);

        $q.notify({ type: 'positive', message: 'Alunos adicionados com sucesso!' });
        emit('alunos-adicionados');
        emit('close');
    } catch (error) {
        console.error(error);
        $q.notify({ type: 'negative', message: 'Erro ao adicionar alunos: ' + (error.message || 'Erro desconhecido') });
    } finally {
        saving.value = false;
    }
};

onMounted(() => {
    fetchAllAlunos();
});
</script>