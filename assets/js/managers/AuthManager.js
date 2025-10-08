// Gerenciador de autenticação
class AuthManager {
  constructor() {
    this.apiId = "AKfycbz_CFkrh4YT_9vKaKo_FaDwvLU_Wqg2scbBqjqcC1PSHW3VKBwBAZhdYLDJCtvdw_NO"
    this.baseUrl = `https://script.google.com/macros/s/${this.apiId}/exec`;
    this.token = localStorage.getItem('authToken');
  }

  async login(usuario, senha) {
    try {
      const formData = new FormData();
      formData.append('acao', 'login');
      formData.append('usuario', usuario);
      formData.append('senha', senha);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.sucesso) {
        this.token = data.token;
        localStorage.setItem('authToken', this.token);
        console.log('Login realizado com sucesso!');
        return data;
      } else {
        throw new Error(data.mensagem);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async consultarProduto(idProduto) {
    return this.makeAuthenticatedRequest('consultar_produto', { id_produto: idProduto });
  }

  async listarProdutos() {
    await update();
    return this.makeAuthenticatedRequest('listar_produtos');
  }

  // Método centralizado para requisições autenticadas
  async makeAuthenticatedRequest(acao, extraParams = {}) {
    if (!this.token) {
      this.redirecionarParaLogin('Token não encontrado');
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('acao', acao);
      formData.append('token', this.token);
      
      // Adicionar parâmetros extras
      Object.keys(extraParams).forEach(key => {
        formData.append(key, extraParams[key]);
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      // Verificar se token expirou
      if (!data.sucesso && (data.redirect === 'login' || data.mensagem.includes('Token') || data.mensagem.includes('expirado'))) {
        this.redirecionarParaLogin('Sessão expirada. Faça login novamente.');
        return null;
      }

      if (data.sucesso) {
        return acao === 'listar_produtos' ? data.produtos : data.produto;
      } else {
        throw new Error(data.mensagem);
      }
    } catch (error) {
      console.error(`Erro em ${acao}:`, error);
      
      // Se for erro de rede, pode ser problema de conectividade
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      }
      
      throw error;
    }
  }

  async logout() {
    try {
      if (this.token) {
        const formData = new FormData();
        formData.append('acao', 'logout');
        formData.append('token', this.token);

        await fetch(this.baseUrl, {
          method: 'POST',
          body: formData
        });

      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      this.clearSession();
      this.redirecionarParaLogin('Logout realizado com sucesso');
    }
  }

  clearSession() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  redirecionarParaLogin(mensagem) {
    console.log('Redirecionando para login:', mensagem);

    clearTimeout(timeout);
    
    // Limpar sessão
    this.clearSession();
    
    // Mostrar tela de login
    const telaLogin = document.getElementById("tela_login");
    const telaDash = document.getElementById("tela_dash");
    const popup = document.getElementById("popup");
    
    if (telaLogin) telaLogin.classList.remove("d-none");
    if (telaDash) telaDash.classList.add("d-none");
    if (popup) popup.classList.add("d-none");
    
    // Mostrar mensagem
    if (mensagem) {
      showNotification(mensagem, 'warning', 4000);
    }
    
    // Limpar campos de login
    const usuarioInput = document.getElementById("usuario");
    const senhaInput = document.getElementById("senha");
    if (usuarioInput) usuarioInput.value = '';
    if (senhaInput) senhaInput.value = '';
  }

  isLoggedIn() {
    return this.token !== null;
  }

  // Método para verificar se token ainda é válido
  async validateToken() {
    if (!this.token) return false;
    
    try {
      const produtos = await this.listarProdutos();
      return produtos !== null;
    } catch (error) {
      return false;
    }
  }
}

const authManager = new AuthManager();

window.addEventListener('load', async function() {
  try {
    LoadingState('show');
    
    if (authManager.isLoggedIn()) {
      // Validar se token ainda é válido
      const isValid = await authManager.validateToken();
      
      if (isValid) {
        await initializeDashboard();
        showNotification('Sessão recuperada com sucesso!', 'success');
      } else {
        authManager.redirecionarParaLogin('Sessão expirada. Faça login novamente.');
      }
    } else {
      initializeLogin();
    }
  } catch (error) {
    console.error('Erro na inicialização:', error);
    handleInitializationError(error);
  }
});

async function initializeDashboard(verifi) {
  try {
    switchToScreen('dashboard');
    LoadingState('show');
    
    await atualizarListaProdutos();
    if(!verifi){
      setupEventListeners();  
    }
    
    LoadingState('hide');

  } catch (error) {
    console.error('Erro ao inicializar dashboard:', error);
    authManager.redirecionarParaLogin('Erro ao carregar dados. Faça login novamente.');
  }
}

function initializeLogin() {
  switchToScreen('login');
  LoadingState('hide');
}

async function atualizarListaProdutos() {
  try {
    const produtos = await authManager.listarProdutos();
    if (produtos && dashboardManager) {
      // dashboardManager.updateTable('excelTable', produtos);
      return produtos;
    }
    return null;
  } catch (error) {
    console.error('Erro ao atualizar lista:', error);
    throw error;
  }
}

function switchToScreen(screen) {
  const telaLogin = document.getElementById("tela_login");
  const telaDash = document.getElementById("tela_dash");
  
  if (screen === 'dashboard') {
    if (telaLogin) telaLogin.classList.add("d-none");
    if (telaDash) telaDash.classList.remove("d-none");
  } else if (screen === 'login') {
    if (telaLogin) telaLogin.classList.remove("d-none");
    if (telaDash) telaDash.classList.add("d-none");
  }
}

function showNotification(message, type) {
  if (typeof $ !== 'undefined' && $.notify) {
    $.notify({
      message: message
    }, {
      type: type,
      placement: {
        from: "top",
        align: "center"
      },
      delay: 5000,
      template: '<div data-notify="container" class="col-xs-11 col-sm-4 alert alert-{0}" role="alert" style="min-width: 80%; max-width: 80%; font-size: 1rem; z-index: 9999;">' +
                  '<span data-notify="message">{2}</span>' +
                '</div>'
    });
  } else {
    alert(message);
  }
}

function LoadingState(state) {
  const popup = document.getElementById("popup");
  if (popup) {
    if (state === 'hide') {
      popup.classList.add("d-none");
    } else if (state === 'show') {
      popup.classList.remove("d-none");
    } 
  }
}