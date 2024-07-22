import { Injectable } from '@angular/core';
import * as Prismic from '@prismicio/client';

@Injectable({
  providedIn: 'root',
})
export class PrismicService {
  public instance: Prismic.Client;
  constructor() {
    this.instance = Prismic.createClient(
      'https://ymovier.cdn.prismic.io/api/v2', //Variável Ambiente com o Endpoint
      {
        accessToken:
          'MC5aTGdEMEJFQUFDSUFEdjRV.dDLvv70W77-977-977-977-977-9VAfvv715H--_vWzvv71MYe-_ve-_vREA77-9U0vvv73vv73vv70E77-9QQ', //Variável Ambiente com o Token de Segurança
      }
    );
  }
}
