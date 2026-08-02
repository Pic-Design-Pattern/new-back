import { HttpStatus, Injectable } from '@nestjs/common';

export class ControllerResponse<T = any> {
  public readonly sucesso: boolean;
  public readonly mensagem: string;
  public readonly status: HttpStatus;
  public readonly dados?: T;

  constructor(sucesso: boolean, mensagem: string, status: HttpStatus, dados?: T) {
    this.sucesso = sucesso;
    this.mensagem = mensagem;
    this.status = status;
    this.dados = dados;
  }
}

@Injectable()
export class ResponseFactory {
  public createSuccessResponse<T>(dados: T | undefined, mensagem: string): ControllerResponse<T> {
    return new ControllerResponse<T>(true, mensagem, HttpStatus.OK, dados);
  }

  public createCreatedResponse<T>(dados: T | undefined, mensagem: string): ControllerResponse<T> {
    return new ControllerResponse<T>(true, mensagem, HttpStatus.CREATED, dados);
  }

  public createErrorResponse<T>(status: HttpStatus, mensagem: string, dados?: T): ControllerResponse<T> {
    return new ControllerResponse<T>(false, mensagem, status, dados);
  }

  public createResponse<T>(sucesso: boolean, mensagem: string, status: HttpStatus, dados?: T): ControllerResponse<T> {
    return new ControllerResponse<T>(sucesso, mensagem, status, dados);
  }
}