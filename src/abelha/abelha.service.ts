import { Inject, Injectable } from '@nestjs/common';
import { AbelhaRepositoryToken } from './repositorios/abelha.repository';
import type { AbelhaRepository } from './repositorios/abelha.repository';
import { AbelhaEntity } from './entidades/abelha.entity';
import { RoupaAbelhaEntity } from './entidades/roupa-abelha.entity';
import { CadastrarAbelhaInlineDto } from '../jogador/dtos/cadastrar-abelha-inline.dto';


@Injectable()
export class AbelhaService {
  constructor(
    @Inject(AbelhaRepositoryToken)
    private readonly abelhaRepositorio: AbelhaRepository,
  ) { }


  async criarAbelha(dados: CadastrarAbelhaInlineDto): Promise<AbelhaEntity> {
    let roupa: Partial<RoupaAbelhaEntity> | null = null;

    if (dados.roupa) {
      roupa = {
        caminhoRosto: dados.roupa.caminhoRosto,
        caminhoCaracteristicas: dados.roupa.caminhoCaracteristicas,
        caminhoOculos: dados.roupa.caminhoOculos,
        caminhoCorpo: dados.roupa.caminhoCorpo,
        caminhoAcessorios: dados.roupa.caminhoAcessorios,
        caminhoCabelo: dados.roupa.caminhoCabelo,
      };
    }

    const novaAbelha = new AbelhaEntity();
    novaAbelha.nome = dados.nome;
    if (dados.tamanho) novaAbelha.tamanho = dados.tamanho;
    novaAbelha.ehNpc = false;
    if (roupa) novaAbelha.roupa = roupa as RoupaAbelhaEntity;

    return this.abelhaRepositorio.salvar(novaAbelha);
  }

  async buscarPorId(id: string): Promise<AbelhaEntity | null> {
    return this.abelhaRepositorio.buscarPorId(id);
  }
}
