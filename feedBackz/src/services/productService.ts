import { apiClient, type ApiResponse } from './api';
import type { 
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  PurchaseProductRequest,
  ProductFilters,
  PaginatedResponse
} from '../types';

class ProductService {
  /**
   * Cria um novo produto (apenas para admins)
   */
  async createProduct(productData: CreateProductRequest): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>('/products', productData);
  }

  /**
   * Obtém todos os produtos disponíveis com filtros e paginação
   */
  async getProducts(filters?: ProductFilters): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return apiClient.get<PaginatedResponse<Product>>(endpoint);
  }

  /**
   * Obtém um produto específico por ID
   */
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/products/${id}`);
  }

  /**
   * Atualiza um produto (apenas para admins)
   */
  async updateProduct(id: string, productData: UpdateProductRequest): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(`/products/${id}`, productData);
  }

  /**
   * Deleta um produto (apenas para admins)
   */
  async deleteProduct(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/products/${id}`);
  }

  /**
   * Resgata/compra um produto com moedas
   */
  async purchaseProduct(purchaseData: PurchaseProductRequest): Promise<ApiResponse<{
    product: Product;
    remainingCoins: number;
    message: string;
  }>> {
    return apiClient.post<{
      product: Product;
      remainingCoins: number;
      message: string;
    }>('/products/purchase', purchaseData);
  }

  /**
   * Obtém produtos comprados pelo usuário atual
   */
  async getMyProducts(): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products/my');
  }

  /**
   * Obtém produtos mais populares
   */
  async getPopularProducts(limit: number = 10): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`/products/popular?limit=${limit}`);
  }

  /**
   * Obtém produtos que o usuário pode comprar com suas moedas atuais
   */
  async getAfffordableProducts(): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products/affordable');
  }

  /**
   * Busca produtos por nome ou descrição
   */
  async searchProducts(query: string, filters?: Omit<ProductFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = new URLSearchParams({ search: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    return apiClient.get<PaginatedResponse<Product>>(`/products/search?${params.toString()}`);
  }

  /**
   * Obtém estatísticas de produtos
   */
  async getProductStats(): Promise<ApiResponse<{
    totalProducts: number;
    totalPurchases: number;
    mostPurchased: Array<{
      product: Product;
      purchaseCount: number;
    }>;
    averageCost: number;
  }>> {
    return apiClient.get('/products/stats');
  }

  /**
   * Upload de imagem para produto
   */
  async uploadProductImage(file: FormData): Promise<ApiResponse<{ imageUrl: string }>> {
    // Para upload de arquivos, precisamos de headers específicos
    const response = await fetch(`${apiClient['baseUrl']}/products/upload-image`, {
      method: 'POST',
      headers: {
        // Não definir Content-Type para FormData, o browser define automaticamente
        ...(apiClient['token'] && { Authorization: `Bearer ${apiClient['token']}` }),
      },
      body: file,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'Erro no upload da imagem',
        status: response.status,
        errors: data.errors,
      };
    }

    return {
      data: data.data || data,
      message: data.message,
      status: response.status,
    };
  }

  /**
   * Verifica se o usuário pode comprar um produto específico
   */
  async canPurchaseProduct(productId: string): Promise<ApiResponse<{
    canPurchase: boolean;
    reason?: string;
    userCoins: number;
    productCost: number;
  }>> {
    return apiClient.get<{
      canPurchase: boolean;
      reason?: string;
      userCoins: number;
      productCost: number;
    }>(`/products/${productId}/can-purchase`);
  }
}

export const productService = new ProductService(); 