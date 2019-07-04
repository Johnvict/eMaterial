import { Injectable } from '@angular/core';
import { LoginUser } from '../../interfaces/interface';

import * as BCRYPT from 'bcryptjs';

// import BCRYPT = require('bcryptjs');


@Injectable({
  providedIn: 'root'
})
export class AuthlocalService {

  constructor() {}


  async loginDevice(user: LoginUser) {
    return await this.checkPassword(user);
  }
  private checkPassword(pass: LoginUser) {
    return BCRYPT.compareSync(pass.password, pass.harsh);
  }

  hashPassword(pass: string) {
    const salt = BCRYPT.genSaltSync(2, 10);
    const hash = BCRYPT.hashSync(pass, salt);
    return hash;
  }

}
