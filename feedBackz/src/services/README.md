# Serviços de API - FeedBackz

Este diretório contém todos os serviços para comunicação com o backend do sistema FeedBackz. Os serviços foram criados baseados no schema Prisma fornecido.

## 📁 Estrutura dos Arquivos

```
services/
├── api.ts              # Cliente base da API
├── authService.ts      # Serviços de autenticação
├── feedbackService.ts  # Serviços de feedbacks
├── reactionService.ts  # Serviços de reações
├── productService.ts   # Serviços de produtos/rewards
├── groupService.ts     # Serviços de grupos
├── index.ts           # Exportações centralizadas
├── examples.ts        # Exemplos de uso
└── README.md          # Esta documentação
```

## 🚀 Como Usar

### Importação

```typescript
import { 
  authService, 
  feedbackService, 
  reactionService, 
  productService, 
  groupService,
  ReactionType 
} from '@/services';
```

### Configuração da API

Por padrão, a API aponta para `http://localhost:3000/api`. Para alterar:

```typescript
// No arquivo .env ou .env.local
EXPO_PUBLIC_API_URL=https://sua-api.com/api
```

## 📋 Rotas Implementadas

### 🔐 Autenticação (`/auth`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login do usuário |
| POST | `/auth/register` | Registro de novo usuário |
| POST | `/auth/logout` | Logout do usuário |
| GET | `/auth/profile` | Obter perfil atual |
| PUT | `/auth/profile` | Atualizar perfil |
| POST | `/auth/forgot-password` | Solicitar reset de senha |
| POST | `/auth/reset-password` | Redefinir senha |
| GET | `/auth/verify-token` | Verificar validade do token |
| POST | `/auth/refresh` | Renovar token |
| GET | `/auth/coins` | Obter moedas do usuário |

### 💬 Feedbacks (`/feedbacks`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/feedbacks` | Criar feedback |
| GET | `/feedbacks` | Listar feedbacks (com filtros) |
| GET | `/feedbacks/:id` | Obter feedback específico |
| PUT | `/feedbacks/:id` | Atualizar feedback |
| DELETE | `/feedbacks/:id` | Deletar feedback |
| GET | `/feedbacks/my` | Feedbacks do usuário atual |
| GET | `/feedbacks/group/:groupId` | Feedbacks de um grupo |
| POST | `/feedbacks/:id/report` | Reportar feedback |
| POST | `/feedbacks/upload` | Upload de arquivo |
| GET | `/feedbacks/search` | Buscar feedbacks |

### 👍 Reações (`/reactions`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/reactions` | Criar reação |
| DELETE | `/reactions/feedback/:feedbackId` | Remover reação |
| GET | `/reactions/feedback/:feedbackId` | Reações de um feedback |
| GET | `/reactions/feedback/:feedbackId/counts` | Contagem de reações |
| GET | `/reactions/feedback/:feedbackId/my` | Minha reação |
| PUT | `/reactions/feedback/:feedbackId` | Atualizar reação |
| GET | `/reactions/my` | Minhas reações |
| GET | `/reactions/stats` | Estatísticas de reações |
| POST | `/reactions/toggle` | Toggle de reação |

### 🎁 Produtos/Rewards (`/products`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/products` | Criar produto (admin) |
| GET | `/products` | Listar produtos |
| GET | `/products/:id` | Obter produto específico |
| PUT | `/products/:id` | Atualizar produto (admin) |
| DELETE | `/products/:id` | Deletar produto (admin) |
| POST | `/products/purchase` | Comprar produto |
| GET | `/products/my` | Meus produtos |
| GET | `/products/popular` | Produtos populares |
| GET | `/products/affordable` | Produtos que posso comprar |
| GET | `/products/search` | Buscar produtos |
| GET | `/products/stats` | Estatísticas de produtos |
| POST | `/products/upload-image` | Upload de imagem |
| GET | `/products/:id/can-purchase` | Verificar se posso comprar |

### 👥 Grupos (`/groups`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/groups` | Criar grupo |
| GET | `/groups` | Listar grupos |
| GET | `/groups/:id` | Obter grupo específico |
| PUT | `/groups/:id` | Atualizar grupo |
| DELETE | `/groups/:id` | Deletar grupo |
| POST | `/groups/:id/join` | Entrar no grupo |
| POST | `/groups/:id/leave` | Sair do grupo |
| GET | `/groups/:id/members` | Membros do grupo |
| GET | `/groups/roots` | Grupos raiz |
| GET | `/groups/:id/subgroups` | Subgrupos |
| GET | `/groups/hierarchy` | Hierarquia de grupos |
| GET | `/groups/my` | Meus grupos |
| GET | `/groups/search` | Buscar grupos |
| GET | `/groups/:id/stats` | Estatísticas do grupo |
| GET | `/groups/stats` | Estatísticas gerais |
| POST | `/groups/:id/invite` | Convidar usuário (admin) |
| DELETE | `/groups/:id/members/:userId` | Remover membro (admin) |
| POST | `/groups/:id/promote/:userId` | Promover a admin |
| POST | `/groups/:id/demote/:userId` | Remover de admin |
| GET | `/groups/:id/membership` | Verificar membership |
| GET | `/groups/suggestions` | Grupos sugeridos |

## 🎯 Tipos de Reação

```typescript
enum ReactionType {
  THUMBS_UP = 'THUMBS_UP',
  THUMBS_DOWN = 'THUMBS_DOWN',
  LIGHT_BULB = 'LIGHT_BULB',
  SAD_FACE = 'SAD_FACE',
  THUNDER = 'THUNDER'
}
```

## 🔧 Funcionalidades Especiais

### Paginação
Todos os endpoints de listagem suportam paginação:
```typescript
{
  page: 1,
  limit: 10,
  sort: 'createdAt',
  order: 'desc'
}
```

### Filtros
Cada serviço possui filtros específicos:
- **Feedbacks**: groupId, authorId, isAnonymous, search, dates
- **Grupos**: parentId, level, search
- **Produtos**: maxCost, minCost, search, available

### Upload de Arquivos
Para uploads, use FormData:
```typescript
const formData = new FormData();
formData.append('file', file);
await feedbackService.uploadFile(formData);
```

### Tratamento de Erros
Todos os serviços retornam erros padronizados:
```typescript
interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
```

## 📝 Exemplo de Uso Completo

```typescript
import { authService, feedbackService, reactionService, ReactionType } from '@/services';

// 1. Login
await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// 2. Criar feedback
const feedback = await feedbackService.createFeedback({
  content: 'Sugestão de melhoria',
  groupId: 'group-id',
  isAnonymous: false
});

// 3. Reagir ao feedback
await reactionService.toggleReaction(feedback.data.id, ReactionType.THUMBS_UP);
```

## 🚨 Notas Importantes

1. **Token de Autenticação**: Após login/registro, o token é automaticamente definido para todas as requisições subsequentes.

2. **Variáveis de Ambiente**: Configure `EXPO_PUBLIC_API_URL` para apontar para seu backend.

3. **Tipos TypeScript**: Todos os tipos estão definidos em `types/index.ts` baseados no schema Prisma.

4. **Exemplos**: Veja `examples.ts` para mais exemplos de uso de cada serviço.

---

**Criado para o projeto FeedBackz - Sistema de Feedbacks com Gamificação** 🚀 