<template>
  <q-page class="bg-dark text-white">
    <div class="q-pa-xl">
      <div class="row justify-center">
        <div class="col-12 col-md-8 col-lg-6">

          <q-card flat class="bg-dark-page q-pa-lg">
            <!-- Informações Básicas -->
            <q-card-section>
              <div class="text-h6 q-mb-md">Informações Básicas</div>

              <!-- Nome -->
              <q-input v-model="formData.nome" label="Nome Completo" outlined dark color="primary" class="q-mb-md"
                :rules="[val => !!val || 'Nome é obrigatório']">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <!-- Nickname (apenas para alunos) -->
              <q-input v-if="userStore.isAluno" v-model="formData.nickname" label="Nickname" outlined dark
                color="primary" class="q-mb-md" hint="Seu nome de usuário único" :rules="[
                  val => !val || val.length >= 3 || 'Nickname deve ter no mínimo 3 caracteres',
                  val => !val || /^[a-zA-Z0-9_]+$/.test(val) || 'Apenas letras, números e underscore'
                ]">
                <template v-slot:prepend>
                  <q-icon name="alternate_email" />
                </template>
              </q-input>

              <!-- Avatar Atual -->
              <div class="q-mb-md">
                <div class="text-subtitle2 q-mb-sm">Avatar Atual</div>
                <div class="row items-center q-gutter-md">
                  <q-avatar size="80px">
                    <q-img v-if="avatarUrl" :src="avatarUrl" :alt="formData.nome" />
                    <q-icon v-else name="person" size="40px" />
                  </q-avatar>
                  <q-btn unelevated color="primary" label="Trocar Avatar" icon="photo_camera"
                    @click="showAvatarModal = true" />
                </div>
              </div>

              <!-- Avatar Selecionado -->
              <q-banner v-if="selectedAvatarId && selectedAvatarId !== initialAvatarId"
                class="bg-primary text-white q-mb-md" rounded>
                <template v-slot:avatar>
                  <q-icon name="check_circle" />
                </template>
                Novo avatar selecionado! Clique em "Salvar" para confirmar.
              </q-banner>
            </q-card-section>

            <q-separator dark class="q-my-md" />

            <!-- Alteração de Senha -->
            <q-card-section>
              <div class="text-h6 q-mb-md">Alterar Senha</div>
              <div class="text-caption text-grey-5 q-mb-md">
                Deixe em branco se não desejar alterar a senha
              </div>

              <!-- Senha Atual -->
              <q-input v-model="formData.senhaAtual" label="Senha Atual" type="password" outlined dark color="primary"
                class="q-mb-md" :rules="[
                  val => !formData.novaSenha || !!val || 'Informe a senha atual para alterar'
                ]">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <!-- Nova Senha -->
              <q-input v-model="formData.novaSenha" label="Nova Senha" type="password" outlined dark color="primary"
                class="q-mb-md" :rules="[
                  val => !val || val.length >= 6 || 'Senha deve ter no mínimo 6 caracteres'
                ]">
                <template v-slot:prepend>
                  <q-icon name="lock_outline" />
                </template>
              </q-input>

              <!-- Confirmar Nova Senha -->
              <q-input v-model="formData.confirmarSenha" label="Confirmar Nova Senha" type="password" outlined dark
                color="primary" class="q-mb-md" :rules="[
                  val => !formData.novaSenha || val === formData.novaSenha || 'Senhas não coincidem'
                ]">
                <template v-slot:prepend>
                  <q-icon name="lock_outline" />
                </template>
              </q-input>
            </q-card-section>

            <!-- Botões de Ação -->
            <q-card-actions class="q-px-md q-pb-md">
              <q-space />
              <q-btn flat label="Cancelar" color="grey" @click="handleCancel" class="q-mr-sm" />
              <q-btn unelevated label="Salvar Alterações" color="primary" :loading="loading" @click="handleSave" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Modal de Seleção de Avatar -->
    <q-dialog v-model="showAvatarModal">
      <modalAvatares @close="handleAvatarModalClose" />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/userStore'
import { useAvatarStore } from 'src/stores/avatarStore'
import modalAvatares from 'src/components/auth/modalAvatares.vue'
import { api } from 'src/boot/axios'

const router = useRouter()
const $q = useQuasar()
const userStore = useUserStore()
const avatarStore = useAvatarStore()

const loading = ref(false)
const showAvatarModal = ref(false)
const selectedAvatarId = ref(null)
const initialAvatarId = ref(null) // Avatar inicial do usuário

const formData = ref({
  nome: '',
  nickname: '',
  senhaAtual: '',
  novaSenha: '',
  confirmarSenha: ''
})

// URL do avatar atual
const avatarUrl = computed(() => {
  if (userStore.currentUser.avatar?.caminho_foto) {
    const baseUrl = api.defaults.baseURL.endsWith('/')
      ? api.defaults.baseURL.slice(0, -1)
      : api.defaults.baseURL
    const path = userStore.currentUser.avatar.caminho_foto.startsWith('/')
      ? userStore.currentUser.avatar.caminho_foto
      : `/${userStore.currentUser.avatar.caminho_foto}`
    return `${baseUrl}/static${path}`
  }
  return null
})

// Carrega dados do usuário
onMounted(async () => {
  try {
    // Carrega avatares se necessário
    if (!avatarStore.items || avatarStore.items.length === 0) {
      await avatarStore.fetchAvatares()
    }

    // Preenche formulário com dados atuais
    formData.value.nome = userStore.currentUser.nome || ''
    formData.value.nickname = userStore.currentUser.nickname || ''

    // Define avatar inicial e selecionado como o atual
    const currentAvatarId = userStore.currentUser.avatar_id_fk || userStore.currentUser.avatar?.id
    initialAvatarId.value = currentAvatarId
    selectedAvatarId.value = currentAvatarId

    // Sincroniza o avatarStore com o avatar atual
    if (currentAvatarId) {
      avatarStore.setAvatar(currentAvatarId)
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados do usuário',
      icon: 'error'
    })
  }
})

// Handler para fechar modal de avatar
const handleAvatarModalClose = () => {
  // Quando o modal fecha, pega o avatar selecionado do store
  selectedAvatarId.value = avatarStore.selectedAvatarId
  showAvatarModal.value = false
}

// Handler para cancelar
const handleCancel = () => {
  router.push('/home')
}

// Handler para salvar
const handleSave = async () => {
  try {
    // Validações
    if (!formData.value.nome.trim()) {
      $q.notify({
        type: 'negative',
        message: 'Nome é obrigatório',
        icon: 'error'
      })
      return
    }

    // Validação de senha
    if (formData.value.novaSenha) {
      if (!formData.value.senhaAtual) {
        $q.notify({
          type: 'negative',
          message: 'Informe a senha atual para alterar a senha',
          icon: 'error'
        })
        return
      }

      if (formData.value.novaSenha !== formData.value.confirmarSenha) {
        $q.notify({
          type: 'negative',
          message: 'As senhas não coincidem',
          icon: 'error'
        })
        return
      }

      if (formData.value.novaSenha.length < 6) {
        $q.notify({
          type: 'negative',
          message: 'A nova senha deve ter no mínimo 6 caracteres',
          icon: 'error'
        })
        return
      }
    }

    loading.value = true

    // Monta payload
    const payload = {
      nome: formData.value.nome.trim()
    }

    // Adiciona nickname apenas para alunos
    if (userStore.isAluno) {
      payload.nickname = formData.value.nickname?.trim() || null
    }

    // Adiciona avatar apenas se foi alterado
    if (selectedAvatarId.value && selectedAvatarId.value !== initialAvatarId.value) {
      payload.avatar_id_fk = selectedAvatarId.value
    }

    // Adiciona senha se fornecida
    if (formData.value.novaSenha) {
      payload.senha_atual = formData.value.senhaAtual
      payload.nova_senha = formData.value.novaSenha
    }

    // Atualiza perfil
    await userStore.updateUserProfile(payload)

    // Sincroniza avatar
    if (selectedAvatarId.value) {
      await userStore.syncAvatar()
    }

    $q.notify({
      type: 'positive',
      message: 'Perfil atualizado com sucesso!',
      icon: 'check_circle'
    })

    // Redireciona para home após 1 segundo
    setTimeout(() => {
      router.push('/home')
    }, 1000)

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)

    let errorMessage = 'Erro ao atualizar perfil'
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail
    } else if (error.message) {
      errorMessage = error.message
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      icon: 'error',
      timeout: 5000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.bg-dark-page {
  background-color: $dark-page;
}
</style>
