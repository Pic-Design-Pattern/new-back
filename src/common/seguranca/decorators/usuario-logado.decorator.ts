import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UsuarioLogado = createParamDecorator(
  (campo: string | undefined, contexto: ExecutionContext) => {
    const request = contexto.switchToHttp().getRequest();
    const usuario = request['usuario'];

    return campo ? usuario?.[campo] : usuario;
  },
);
