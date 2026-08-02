import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';


interface RespostaErro {
  sucesso: boolean;
  mensagem: string;
  status: number;
  dados: unknown | null;
}


@Catch()
export class ExcecaoNegocioFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExcecaoNegocioFilter.name);

  catch(excecao: unknown, host: ArgumentsHost): void {
    const contextoHttp = host.switchToHttp();
    const resposta = contextoHttp.getResponse<Response>();

    const { status, mensagem } = this.extrairDetalhes(excecao);

    const corpoResposta: RespostaErro = {
      sucesso: false,
      mensagem,
      status,
      dados: null,
    };

    this.logger.error(`[${status}] ${mensagem}`, excecao instanceof Error ? excecao.stack : '');

    resposta.status(status).json(corpoResposta);
  }

  private extrairDetalhes(excecao: unknown): {
    status: number;
    mensagem: string;
  } {
    if (excecao instanceof HttpException) {
      const respostaExcecao = excecao.getResponse();
      const mensagem =
        typeof respostaExcecao === 'string'
          ? respostaExcecao
          : (respostaExcecao as any)?.message || excecao.message;

      return {
        status: excecao.getStatus(),
        mensagem: Array.isArray(mensagem) ? mensagem.join(', ') : mensagem,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      mensagem: 'Erro interno do servidor',
    };
  }
}
