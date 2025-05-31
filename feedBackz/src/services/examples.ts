/**
 * EXEMPLOS DE USO DOS SERVIÇOS
 * 
 * Este arquivo contém exemplos de como usar cada serviço criado.
 * Não deve ser importado na aplicação, serve apenas como documentação.
 */

import { 
  authService, 
  feedbackService, 
  reactionService, 
  productService, 
  groupService,
  ReactionType 
} from './index';

// ==================== EXEMPLOS DE AUTENTICAÇÃO ====================

async function exemploAuth() {
  try {
    // Login
    const loginResponse = await authService.login({
      email: 'usuario@exemplo.com',
      password: 'minhasenha123'
    });
    console.log('Token:', loginResponse.data.token);

    // Registro
    const registerResponse = await authService.register({
      name: 'João Silva',
      email: 'joao@exemplo.com',
      password: 'senha123',
      description: 'Desenvolvedor Frontend'
    });

    // Obter perfil
    const profile = await authService.getProfile();
    console.log('Usuário:', profile.data);

    // Atualizar perfil
    await authService.updateProfile({
      name: 'João Silva Santos',
      description: 'Senior Frontend Developer'
    });

  } catch (error) {
    console.error('Erro na autenticação:', error);
  }
}

// ==================== EXEMPLOS DE FEEDBACKS ====================

async function exemploFeedbacks() {
  try {
    // Criar feedback
    const novoFeedback = await feedbackService.createFeedback({
      content: 'Sugestão para melhorar o sistema de login',
      groupId: 'grupo-123',
      isAnonymous: false
    });

    // Listar feedbacks com filtros
    const feedbacks = await feedbackService.getFeedbacks({
      page: 1,
      limit: 10,
      groupId: 'grupo-123',
      search: 'login'
    });

    // Obter feedback específico
    const feedback = await feedbackService.getFeedbackById('feedback-123');

    // Obter meus feedbacks
    const meusFeedbacks = await feedbackService.getMyFeedbacks({
      page: 1,
      limit: 5
    });

    // Buscar feedbacks
    const resultadoBusca = await feedbackService.searchFeedbacks('bug sistema');

  } catch (error) {
    console.error('Erro nos feedbacks:', error);
  }
}

// ==================== EXEMPLOS DE REAÇÕES ====================

async function exemploReacoes() {
  try {
    // Adicionar reação
    const reacao = await reactionService.createReaction({
      feedbackId: 'feedback-123',
      type: ReactionType.THUMBS_UP
    });

    // Toggle de reação (mais prático)
    const toggle = await reactionService.toggleReaction('feedback-123', ReactionType.LIGHT_BULB);
    console.log('Ação realizada:', toggle.data.action); // 'created', 'updated', ou 'removed'

    // Obter contagem de reações
    const contagem = await reactionService.getReactionCounts('feedback-123');
    console.log('Likes:', contagem.data.THUMBS_UP);

    // Verificar minha reação
    const minhaReacao = await reactionService.getMyReaction('feedback-123');

  } catch (error) {
    console.error('Erro nas reações:', error);
  }
}

// ==================== EXEMPLOS DE PRODUTOS (REWARDS) ====================

async function exemploProdutos() {
  try {
    // Listar produtos disponíveis
    const produtos = await productService.getProducts({
      page: 1,
      limit: 10,
      maxCost: 100
    });

    // Verificar se posso comprar
    const podeComprar = await productService.canPurchaseProduct('produto-123');
    
    if (podeComprar.data.canPurchase) {
      // Comprar produto
      const compra = await productService.purchaseProduct({
        productId: 'produto-123'
      });
      console.log('Moedas restantes:', compra.data.remainingCoins);
    }

    // Produtos que posso pagar
    const produtosPagaveis = await productService.getAfffordableProducts();

    // Meus produtos comprados
    const meusProdutos = await productService.getMyProducts();

  } catch (error) {
    console.error('Erro nos produtos:', error);
  }
}

// ==================== EXEMPLOS DE GRUPOS ====================

async function exemploGrupos() {
  try {
    // Criar grupo
    const novoGrupo = await groupService.createGroup({
      name: 'Desenvolvimento Frontend',
      level: 1
    });

    // Criar subgrupo
    const subgrupo = await groupService.createGroup({
      name: 'React Team',
      level: 2,
      parentId: novoGrupo.data.id
    });

    // Entrar em grupo
    await groupService.joinGroup('grupo-123');

    // Obter hierarquia de grupos
    const hierarquia = await groupService.getGroupHierarchy();

    // Grupos sugeridos
    const sugestoes = await groupService.getSuggestedGroups();

    // Meus grupos
    const meusGrupos = await groupService.getMyGroups();

    // Estatísticas do grupo
    const stats = await groupService.getGroupStats('grupo-123');
    console.log('Membros:', stats.data.memberCount);
    console.log('Feedbacks:', stats.data.feedbackCount);

  } catch (error) {
    console.error('Erro nos grupos:', error);
  }
}

// ==================== EXEMPLO DE FLUXO COMPLETO ====================

async function exemploFluxoCompleto() {
  try {
    // 1. Fazer login
    await authService.login({
      email: 'usuario@exemplo.com',
      password: 'senha123'
    });

    // 2. Obter grupos disponíveis
    const grupos = await groupService.getMyGroups();
    const grupoAtivo = grupos.data[0];

    // 3. Criar feedback no grupo
    const feedback = await feedbackService.createFeedback({
      content: 'Seria legal ter notificações push',
      groupId: grupoAtivo.id,
      isAnonymous: false
    });

    // 4. Reagir ao feedback
    await reactionService.toggleReaction(feedback.data.id, ReactionType.LIGHT_BULB);

    // 5. Verificar moedas e comprar produto
    const profile = await authService.getProfile();
    console.log('Minhas moedas:', profile.data.coins);

    const produtosPagaveis = await productService.getAfffordableProducts();
    if (produtosPagaveis.data.length > 0) {
      await productService.purchaseProduct({
        productId: produtosPagaveis.data[0].id
      });
    }

  } catch (error) {
    console.error('Erro no fluxo:', error);
  }
}

export {
  exemploAuth,
  exemploFeedbacks,
  exemploReacoes,
  exemploProdutos,
  exemploGrupos,
  exemploFluxoCompleto
}; 