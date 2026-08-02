/**
 * Token de injeção de dependência (Symbol) para o SenhaAdapter.
 */
export const SenhaAdapterToken = Symbol('SENHA_ADAPTER');


export interface SenhaAdapter {
  criptografar(senhaPlana: string): Promise<string>;
  comparar(senhaPlana: string, senhaCriptografada: string): Promise<boolean>;
}
