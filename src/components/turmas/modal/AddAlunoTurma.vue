<template>
    <q-card style="min-width: 350px; width: 600px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Gerenciar Alunos da Turma</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
            <q-input v-model="search" outlined dense placeholder="Pesquisar por nome ou matrícula..." class="q-mb-sm">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>

            <div class="row items-center q-mb-sm q-pl-sm" v-if="filteredAlunos.length > 0">
                <q-checkbox v-model="isAllSelected" label="Selecionar todos os resultados visíveis" dense
                    color="primary" />
                <span class="q-ml-md text-caption text-grey">
                    Total selecionado: {{ selectedAlunos.length }}
                </span>
            </div>

            <q-scroll-area style="height: 400px;">
                <div v-if="loadingData" class="row justify-center q-pa-md">
                    <q-spinner color="primary" size="3em" />
                </div>

                <q-list bordered separator v-else-if="filteredAlunos.length > 0">
                    <q-item v-for="aluno in filteredAlunos" :key="getAlunoId(aluno)" tag="label" v-ripple>
                        <q-item-section avatar>
                            <q-checkbox v-model="selectedAlunos" :val="getAlunoId(aluno)" />
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
                                Matrícula: {{ aluno.matricula }}
                                <q-badge v-if="wasOriginallyInClass(aluno)" color="blue-2" text-color="blue-9"
                                    class="q-ml-sm">
                                    Matriculado
                                </q-badge>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>

                <div v-else class="text-center text-grey q-pa-lg">
                    <q-icon name="person_off" size="3em" />
                    <p class="q-mt-sm">Nenhum aluno encontrado.</p>
                </div>
            </q-scroll-area>
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-pa-md">
            <q-btn flat label="Cancelar" v-close-popup />

            <q-btn color="primary" label="Salvar Alterações" :loading="saving" @click="salvarAlteracoes" />
        </q-card-actions>
    </q-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { useTurmaStore } from 'src/stores/turmaStore';

const props = defineProps({
    turmaId: { type: Number, required: true },
    alunosAtuais: { type: Array, default: () => [] }
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

const getAlunoId = (aluno) => aluno.matricula;

const wasOriginallyInClass = (aluno) => {
    return props.alunosAtuais.some(a => getAlunoId(a) === getAlunoId(aluno));
};

const resolveAvatarPath = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = BASE_URL_AXIOS.endsWith('/') ? BASE_URL_AXIOS.slice(0, -1) : BASE_URL_AXIOS;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}/static${cleanPath}`;
};

const filteredAlunos = computed(() => {
    const listaBase = Array.isArray(allAlunos.value) ? allAlunos.value : [];
    const termo = String(search.value || '').trim().toLowerCase();

    return listaBase.filter(aluno => {
        if (!termo) return true;
        const nome = String(aluno.nome || '').toLowerCase();
        const matricula = String(aluno.matricula || '').toLowerCase();
        const id = String(aluno.id || '').toLowerCase();
        return nome.includes(termo) || matricula.includes(termo) || id.includes(termo);
    });
});

const isAllSelected = computed({
    get: () => {
        if (filteredAlunos.value.length === 0) return false;
        return filteredAlunos.value.every(aluno => selectedAlunos.value.includes(getAlunoId(aluno)));
    },
    set: (val) => {
        const idsVisiveis = filteredAlunos.value.map(a => getAlunoId(a));
        if (val) {
            const novos = idsVisiveis.filter(id => !selectedAlunos.value.includes(id));
            selectedAlunos.value = [...selectedAlunos.value, ...novos];
        } else {
            selectedAlunos.value = selectedAlunos.value.filter(id => !idsVisiveis.includes(id));
        }
    }
});

const syncSelection = () => {
    selectedAlunos.value = props.alunosAtuais.map(a => getAlunoId(a));
};

const fetchAllAlunos = async () => {
    loadingData.value = true;
    try {
        const response = await api.get('/alunos');
        if (Array.isArray(response.data)) {
            allAlunos.value = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
            allAlunos.value = response.data.data;
        } else {
            allAlunos.value = [];
        }
        syncSelection();
    } catch (error) {
        console.error(error);
        $q.notify({ type: 'negative', message: 'Erro ao carregar alunos.' });
    } finally {
        loadingData.value = false;
    }
};

const salvarAlteracoes = async () => {
    saving.value = true;
    try {
        const matriculasOriginais = props.alunosAtuais.map(a => getAlunoId(a));
        const matriculasSelecionadas = selectedAlunos.value;
        const adicionar = matriculasSelecionadas.filter(m => !matriculasOriginais.includes(m));
        const remover = matriculasOriginais.filter(m => !matriculasSelecionadas.includes(m));

        if (adicionar.length === 0 && remover.length === 0) {
            $q.notify({ type: 'info', message: 'Nenhuma alteração realizada.' });
            emit('close');
            return;
        }
        await turmaStore.sincronizarAlunos(props.turmaId, adicionar, remover);

        let msg = [];
        if (adicionar.length) msg.push(`${adicionar.length} adicionado(s)`);
        if (remover.length) msg.push(`${remover.length} removido(s)`);

        $q.notify({ type: 'positive', message: 'Sucesso: ' + msg.join(', ') });

        emit('alunos-adicionados'); 
        emit('close');

    } catch (error) {
        console.error(error);
        $q.notify({ type: 'negative', message: 'Erro ao salvar alterações.' });
    } finally {
        saving.value = false;
    }
};

onMounted(() => {
    fetchAllAlunos();
});

watch(() => props.alunosAtuais, () => {
    syncSelection();
}, { deep: true });
</script>