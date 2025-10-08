<template>
  <q-page class="q-pa-xl">
    <div class="row q-col-gutter-lg">
      
      <!-- Configurações do Usuário -->
      <div class="col-12 col-md-6">
        <q-card flat class="bg-dark-page">
          <q-card-section>
            <div class="text-h6 q-mb-md">Perfil do Usuário</div>
            
            <div class="q-gutter-md">
              <q-input
                filled
                v-model="userStore.currentUser.nome"
                label="Nome"
                dark
                readonly
              />
              
              <q-input
                filled
                v-model="userStore.currentUser.email"
                label="Email"
                dark
                readonly
              />
              
              <div class="q-mt-md">
                <div class="text-subtitle2 text-grey-5 q-mb-sm">Role Atual</div>
                <q-chip 
                  :color="userStore.isProfessor ? 'deep-orange' : 'blue'" 
                  text-color="white"
                  icon="person"
                  size="lg"
                >
                  {{ userStore.currentUser.role.toUpperCase() }}
                </q-chip>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Modo de Desenvolvimento -->
      <div class="col-12 col-md-6">
        <q-card flat class="bg-dark-page">
          <q-card-section>
            <div class="text-h6 q-mb-md">Modo Desenvolvedor</div>
            <div class="text-caption text-grey-5 q-mb-md">
              Recursos para testar diferentes permissões durante o desenvolvimento
            </div>
            
            <div class="q-gutter-md">
              <q-separator dark />
              
              <div>
                <div class="text-subtitle2 q-mb-sm">Alternar Role</div>
                <div class="text-caption text-grey-5 q-mb-md">
                  Troque entre Professor e Aluno para testar permissões
                </div>
                <q-btn
                  unelevated
                  color="primary"
                  :icon="userStore.isProfessor ? 'school' : 'person'"
                  :label="`Mudar para ${userStore.isProfessor ? 'Aluno' : 'Professor'}`"
                  @click="handleToggleRole"
                />
              </div>

              <q-separator dark />

              <div>
                <div class="text-subtitle2 q-mb-sm">Informações de Permissões</div>
                <div class="text-caption text-grey-5 q-mb-md">
                  Status atual das suas permissões
                </div>
                
                <q-list dense class="bg-dark rounded-borders">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon 
                        :name="permissions.can.editarAtividade.value ? 'check_circle' : 'cancel'" 
                        :color="permissions.can.editarAtividade.value ? 'positive' : 'grey'"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Editar Atividades</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon 
                        :name="permissions.can.criarAtividade.value ? 'check_circle' : 'cancel'" 
                        :color="permissions.can.criarAtividade.value ? 'positive' : 'grey'"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Criar Atividades</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon 
                        :name="permissions.can.concluirAtividade.value ? 'check_circle' : 'cancel'" 
                        :color="permissions.can.concluirAtividade.value ? 'positive' : 'grey'"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Concluir Atividades</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon 
                        :name="permissions.can.gerenciarTurma.value ? 'check_circle' : 'cancel'" 
                        :color="permissions.can.gerenciarTurma.value ? 'positive' : 'grey'"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Gerenciar Turmas</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon 
                        :name="permissions.can.atribuirBadge.value ? 'check_circle' : 'cancel'" 
                        :color="permissions.can.atribuirBadge.value ? 'positive' : 'grey'"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Atribuir Badges</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/userStore'
import { usePermissions } from 'src/composables/usePermissions'

const userStore = useUserStore()
const permissions = usePermissions()
const $q = useQuasar()

const handleToggleRole = () => {
  const oldRole = userStore.currentUser.role
  userStore.toggleRole()
  const newRole = userStore.currentUser.role
  
  $q.notify({
    type: 'info',
    message: `Role alterado!`,
    caption: `${oldRole} → ${newRole}`,
    icon: 'swap_horiz',
    position: 'top'
  })
}
</script>
