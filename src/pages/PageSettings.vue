<template>
  <q-page class="bg-dark text-white">
    <div class="q-pa-xl">
      <div class="row justify-center">
        <div class="col-12 col-md-10 col-lg-8">
          <!-- Seção: Informações do Sistema -->
          <q-card flat class="bg-dark-page q-mb-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">
                <q-icon name="info" class="q-mr-sm" />
                Informações do Sistema
              </div>

              <q-list dark>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="person" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Usuário</q-item-label>
                    <q-item-label caption>{{ userStore.currentUser.nome }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip :color="userStore.isProfessor ? 'deep-orange' : 'blue'" text-color="white" size="sm">
                      {{ userStore.currentUser.role?.toUpperCase() || 'N/A' }}
                    </q-chip>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="badge" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Matrícula</q-item-label>
                    <q-item-label caption>{{ userStore.currentUser.matricula || 'N/A' }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item v-if="userStore.isAluno">
                  <q-item-section avatar>
                    <q-icon name="star" color="amber" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>XP Total</q-item-label>
                    <q-item-label caption>{{ userStore.currentUser.xp || 0 }} pontos</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item v-if="userStore.isAluno">
                  <q-item-section avatar>
                    <q-icon name="trending_up" color="green" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Nível</q-item-label>
                    <q-item-label caption>Nível {{ userStore.currentUser.nivel || 1 }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- Seção: Ajuda e Suporte -->
          <q-card flat class="bg-dark-page q-mb-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">
                <q-icon name="help" class="q-mr-sm" />
                Ajuda e Suporte
              </div>

              <!-- Reportar Erro -->
              <q-expansion-item icon="bug_report" label="Reportar Erro ou Bug" header-class="text-white"
                class="q-mb-sm">
                <q-card class="bg-dark">
                  <q-card-section>
                    <q-input v-model="bugReport.titulo" label="Título do Problema" outlined dark color="primary"
                      class="q-mb-md" :rules="[val => !!val || 'Título é obrigatório']" />
                    <q-input v-model="bugReport.descricao" label="Descreva o problema em detalhes" type="textarea"
                      outlined dark color="primary" rows="4" class="q-mb-md"
                      :rules="[val => !!val || 'Descrição é obrigatória']"
                      hint="Inclua passos para reproduzir o erro, se possível" />
                    <q-input v-model="bugReport.email" label="Email para contato (opcional)" outlined dark
                      color="primary" type="email" class="q-mb-md" />
                    <q-btn unelevated color="primary" label="Enviar Relatório" icon="send" @click="handleReportBug"
                      :loading="sendingBug" />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <!-- Entrar em Contato -->
              <q-expansion-item icon="mail" label="Entrar em Contato" header-class="text-white" class="q-mb-sm">
                <q-card class="bg-dark">
                  <q-card-section>
                    <div class="q-mb-md">
                      <div class="text-subtitle2 q-mb-sm">Escolha o tipo de contato:</div>
                      <q-option-group v-model="contactType" :options="contactOptions" color="primary" dark />
                    </div>
                    <q-input v-model="contactForm.assunto" label="Assunto" outlined dark color="primary" class="q-mb-md"
                      :rules="[val => !!val || 'Assunto é obrigatório']" />
                    <q-input v-model="contactForm.mensagem" label="Mensagem" type="textarea" outlined dark
                      color="primary" rows="5" class="q-mb-md" :rules="[val => !!val || 'Mensagem é obrigatória']" />
                    <q-input v-model="contactForm.email" label="Seu Email" outlined dark color="primary" type="email"
                      class="q-mb-md" :rules="[val => !!val || 'Email é obrigatório']" />
                    <q-btn unelevated color="primary" label="Enviar Mensagem" icon="send" @click="handleContact"
                      :loading="sendingContact" />
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <!-- FAQ -->
              <q-expansion-item icon="quiz" label="Perguntas Frequentes (FAQ)" header-class="text-white"
                class="q-mb-sm">
                <q-card class="bg-dark">
                  <q-card-section>
                    <q-list dark>
                      <q-expansion-item v-for="(faq, index) in faqs" :key="index" :label="faq.pergunta" class="q-mb-sm">
                        <q-card class="bg-dark-page">
                          <q-card-section>
                            <div class="text-body2">{{ faq.resposta }}</div>
                          </q-card-section>
                        </q-card>
                      </q-expansion-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <!-- Tutorial -->
              <q-expansion-item icon="school" label="Tutorial e Guia Rápido" header-class="text-white">
                <q-card class="bg-dark">
                  <q-card-section>
                    <div class="text-body1 q-mb-md">
                      Bem-vindo ao XPLearn! Aqui estão algumas dicas para começar:
                    </div>
                    <q-list dark>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="check_circle" color="green" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Complete atividades para ganhar XP</q-item-label>
                          <q-item-label caption>Quanto mais atividades você completar, mais XP você ganha</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="check_circle" color="green" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Conquiste badges</q-item-label>
                          <q-item-label caption>Complete desafios especiais para desbloquear badges
                            exclusivos</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="check_circle" color="green" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Acompanhe seu ranking</q-item-label>
                          <q-item-label caption>Veja sua posição em relação aos outros alunos da turma</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="check_circle" color="green" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Personalize seu perfil</q-item-label>
                          <q-item-label caption>Escolha um avatar e personalize suas informações</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-card-section>
          </q-card>

          <!-- Seção: Feedback e Sugestões -->
          <q-card flat class="bg-dark-page q-mb-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">
                <q-icon name="feedback" class="q-mr-sm" />
                Feedback e Sugestões
              </div>

              <q-expansion-item icon="lightbulb" label="Enviar Sugestão" header-class="text-white">
                <q-card class="bg-dark">
                  <q-card-section>
                    <q-input v-model="feedbackForm.tipo" label="Tipo de Sugestão" outlined dark color="primary"
                      class="q-mb-md">
                      <template v-slot:prepend>
                        <q-icon name="category" />
                      </template>
                    </q-input>
                    <q-input v-model="feedbackForm.descricao" label="Descreva sua sugestão" type="textarea" outlined
                      dark color="primary" rows="4" class="q-mb-md" :rules="[val => !!val || 'Descrição é obrigatória']"
                      hint="Sua opinião é muito importante para melhorarmos o sistema!" />
                    <q-btn unelevated color="primary" label="Enviar Sugestão" icon="send" @click="handleFeedback"
                      :loading="sendingFeedback" />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-card-section>
          </q-card>

          <!-- Seção: Sobre -->
          <q-card flat class="bg-dark-page q-mb-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">
                <q-icon name="info" class="q-mr-sm" />
                Sobre o Sistema
              </div>

              <q-list dark>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="code" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Versão</q-item-label>
                    <q-item-label caption>XPLearn v1.0.0</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="school" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Desenvolvido para</q-item-label>
                    <q-item-label caption>IFBA - Instituto Federal da Bahia</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable @click="showPrivacyPolicy = true">
                  <q-item-section avatar>
                    <q-icon name="privacy_tip" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Política de Privacidade</q-item-label>
                    <q-item-label caption>Clique para visualizar</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" />
                  </q-item-section>
                </q-item>

                <q-item clickable @click="showTerms = true">
                  <q-item-section avatar>
                    <q-icon name="description" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Termos de Uso</q-item-label>
                    <q-item-label caption>Clique para visualizar</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- Seção: Ações Rápidas -->
          <q-card flat class="bg-dark-page">
            <q-card-section>
              <div class="text-h6 q-mb-md">
                <q-icon name="flash_on" class="q-mr-sm" />
                Ações Rápidas
              </div>

              <div class="row q-gutter-md">
                <q-btn unelevated color="primary" icon="edit" label="Editar Perfil"
                  @click="$router.push('/editarUsuario')" class="col-12 col-sm-6" />
                <q-btn unelevated color="secondary" icon="download" label="Exportar Dados" @click="handleExportData"
                  class="col-12 col-sm-6" />
              </div>
            </q-card-section>
          </q-card>

        </div>
      </div>
    </div>

    <!-- Dialog: Política de Privacidade -->
    <q-dialog v-model="showPrivacyPolicy">
      <q-card class="bg-dark-page text-white" style="min-width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Política de Privacidade</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-body2">
            <p class="q-mb-md">
              O XPLearn respeita sua privacidade e está comprometido em proteger seus dados pessoais.
            </p>
            <p class="q-mb-md">
              <strong>Coleta de Dados:</strong> Coletamos apenas as informações necessárias para o funcionamento do
              sistema,
              incluindo nome, matrícula e dados de progresso acadêmico.
            </p>
            <p class="q-mb-md">
              <strong>Uso dos Dados:</strong> Seus dados são utilizados exclusivamente para fins educacionais e de
              gamificação do aprendizado.
            </p>
            <p>
              <strong>Segurança:</strong> Implementamos medidas de segurança para proteger suas informações contra
              acesso
              não autorizado.
            </p>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: Termos de Uso -->
    <q-dialog v-model="showTerms">
      <q-card class="bg-dark-page text-white" style="min-width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Termos de Uso</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-body2">
            <p class="q-mb-md">
              Ao utilizar o XPLearn, você concorda com os seguintes termos:
            </p>
            <ul class="q-mb-md">
              <li>Uso responsável do sistema</li>
              <li>Respeito aos outros usuários</li>
              <li>Não compartilhamento de credenciais</li>
              <li>Uso exclusivo para fins educacionais</li>
            </ul>
            <p>
              O sistema é fornecido "como está" e pode ser atualizado ou modificado a qualquer momento.
            </p>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/userStore'

const $q = useQuasar()
const userStore = useUserStore()

// Estados dos formulários
const sendingBug = ref(false)
const sendingContact = ref(false)
const sendingFeedback = ref(false)
const showPrivacyPolicy = ref(false)
const showTerms = ref(false)

const bugReport = ref({
  titulo: '',
  descricao: '',
  email: ''
})

const contactType = ref('suporte')
const contactOptions = [
  { label: 'Suporte Técnico', value: 'suporte' },
  { label: 'Dúvida Acadêmica', value: 'academico' },
  { label: 'Outro', value: 'outro' }
]

const contactForm = ref({
  assunto: '',
  mensagem: '',
  email: ''
})

const feedbackForm = ref({
  tipo: '',
  descricao: ''
})

// FAQ
const faqs = [
  {
    pergunta: 'Como ganho XP?',
    resposta: 'Você ganha XP completando atividades atribuídas pelos professores. Cada atividade tem um valor de XP associado.'
  },
  {
    pergunta: 'O que são badges?',
    resposta: 'Badges são conquistas especiais que você pode desbloquear ao completar desafios ou atingir marcos específicos no sistema.'
  },
  {
    pergunta: 'Como vejo meu ranking?',
    resposta: 'Você pode ver seu ranking na página "Ranking" no menu lateral. O ranking é baseado no XP total acumulado.'
  },
  {
    pergunta: 'Posso alterar meu avatar?',
    resposta: 'Sim! Acesse "Editar Perfil" no menu do usuário ou na página de Configurações para trocar seu avatar.'
  },
  {
    pergunta: 'Como altero minha senha?',
    resposta: 'Acesse "Editar Perfil" e preencha os campos de alteração de senha. Você precisará informar sua senha atual.'
  },
  {
    pergunta: 'O que acontece se eu esquecer minha senha?',
    resposta: 'Entre em contato com o suporte técnico através da seção "Entrar em Contato" nesta página.'
  }
]

// Handlers
const handleReportBug = async () => {
  if (!bugReport.value.titulo || !bugReport.value.descricao) {
    $q.notify({
      type: 'negative',
      message: 'Preencha todos os campos obrigatórios',
      icon: 'error'
    })
    return
  }

  sendingBug.value = true

  try {
    // Aqui você pode integrar com um serviço de email ou API
    // Por enquanto, apenas simula o envio
    await new Promise(resolve => setTimeout(resolve, 1000))

    $q.notify({
      type: 'positive',
      message: 'Relatório enviado com sucesso! Obrigado por nos ajudar a melhorar.',
      icon: 'check_circle'
    })

    // Limpa o formulário
    bugReport.value = {
      titulo: '',
      descricao: '',
      email: ''
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao enviar relatório. Tente novamente.',
      icon: 'error'
    })
  } finally {
    sendingBug.value = false
  }
}

const handleContact = async () => {
  if (!contactForm.value.assunto || !contactForm.value.mensagem || !contactForm.value.email) {
    $q.notify({
      type: 'negative',
      message: 'Preencha todos os campos obrigatórios',
      icon: 'error'
    })
    return
  }

  sendingContact.value = true

  try {
    // Aqui você pode integrar com um serviço de email ou API
    await new Promise(resolve => setTimeout(resolve, 1000))

    $q.notify({
      type: 'positive',
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      icon: 'check_circle'
    })

    // Limpa o formulário
    contactForm.value = {
      assunto: '',
      mensagem: '',
      email: ''
    }
    contactType.value = 'suporte'
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao enviar mensagem. Tente novamente.',
      icon: 'error'
    })
  } finally {
    sendingContact.value = false
  }
}

const handleFeedback = async () => {
  if (!feedbackForm.value.descricao) {
    $q.notify({
      type: 'negative',
      message: 'Preencha a descrição da sugestão',
      icon: 'error'
    })
    return
  }

  sendingFeedback.value = true

  try {
    // Aqui você pode integrar com um serviço de feedback ou API
    await new Promise(resolve => setTimeout(resolve, 1000))

    $q.notify({
      type: 'positive',
      message: 'Sugestão enviada com sucesso! Obrigado pelo feedback.',
      icon: 'check_circle'
    })

    // Limpa o formulário
    feedbackForm.value = {
      tipo: '',
      descricao: ''
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao enviar sugestão. Tente novamente.',
      icon: 'error'
    })
  } finally {
    sendingFeedback.value = false
  }
}

const handleExportData = () => {
  const userData = {
    nome: userStore.currentUser.nome,
    matricula: userStore.currentUser.matricula,
    role: userStore.currentUser.role,
    xp: userStore.currentUser.xp,
    nivel: userStore.currentUser.nivel,
    nickname: userStore.currentUser.nickname,
    dataExportacao: new Date().toISOString()
  }

  const dataStr = JSON.stringify(userData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `xplearn-dados-${userStore.currentUser.matricula}-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)

  $q.notify({
    type: 'positive',
    message: 'Dados exportados com sucesso!',
    icon: 'download'
  })
}
</script>

<style lang="scss" scoped>
.bg-dark-page {
  background-color: $dark-page;
}
</style>
