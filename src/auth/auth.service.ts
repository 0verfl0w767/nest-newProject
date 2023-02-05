/**
 *    ____                  __________
 *   / __ \_   _____  _____/ __/ / __ \_      __
 *  / / / / | / / _ \/ ___/ /_/ / / / / | /| / /
 * / /_/ /| |/ /  __/ /  / __/ / /_/ /| |/ |/ /
 * \____/ |___/\___/_/  /_/ /_/\____/ |__/|__/
 *
 * The copyright indication and this authorization indication shall be
 * recorded in all copies or in important parts of the Software.
 *
 * @author 0verfl0w767
 * @link https://github.com/0verfl0w767
 * @license MIT LICENSE
 *
 */
import { Repository } from 'typeorm'

import { Injectable, Res, UseGuards } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'

import { LoginDTO, LogoutDTO } from './dto/auth.dto'
import { AuthUser } from './entity/auth.entity'

@Injectable()
export class AuthService {
  public constructor(
    @InjectRepository(AuthUser)
    private readonly userRepository: Repository<AuthUser>,
    private readonly jwtService: JwtService,
  ) {}

  public async register(userid: string, passwd: string): Promise<string> {
    const registerUser = await this.userRepository.findOne({
      where: { userid },
    })
    if (registerUser) {
      return '이미 회원가입이 되어있습니다.'
    }
    await this.userRepository.save(this.userRepository.create({ userid, passwd }))
    return '성공적으로 회원가입을 했습니다.'
  }

  public async unregister(id: number): Promise<string> {
    const registerUser = await this.userRepository.findOne({
      where: { id },
    })
    if (!registerUser) {
      return '회원가입이 되어있지 않습니다.'
    }
    await this.userRepository.delete({ id })
    return '성공적으로 회원탈퇴를 했습니다.'
  }

  public async getUserID(id: number): Promise<string> {
    const registerUser = await this.userRepository.findOne({
      where: { id },
    })
    if (!registerUser) {
      return '회원가입이 되어있지 않습니다.'
    }
    return registerUser.userid
  }

  public async login(@Res() res: any, userid: string, passwd: string): Promise<LoginDTO> {
    const registerUser = await this.userRepository.findOne({
      where: { userid },
    })
    if (!registerUser) {
      return { message: '회원가입이 되어있지 않습니다.' }
    }
    if (registerUser.passwd != passwd) {
      return { message: '비밀번호가 일치하지 않습니다.' }
    }
    const AccessToken = this.JWT_AcessToken(registerUser)
    const RefreshToken = this.JWT_RefreshToken(registerUser)
    res.cookie('accessToken', AccessToken, {
      domain: 'localhost',
      path: '/',
    })
    res.cookie('refreshToken', RefreshToken, {
      domain: 'localhost',
      path: '/',
    })
    return {
      message: '성공적으로 로그인을 했습니다.',
      accessToken: AccessToken,
      refreshToken: RefreshToken,
    }
  }

  public async logout(@Res() res: any, userid: string, passwd: string): Promise<LogoutDTO> {
    const registerUser = await this.userRepository.findOne({
      where: { userid },
    })
    if (!registerUser) {
      return { message: '회원가입이 되어있지 않습니다.' }
    }
    if (registerUser.passwd != passwd) {
      return { message: '비밀번호가 일치하지 않습니다.' }
    }
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    return { message: '성공적으로 로그아웃을 했습니다.' }
  }

  public JWT_AcessToken(registerUser: AuthUser): string {
    const payload = { id: registerUser.id, userid: registerUser.userid }
    return this.jwtService.sign(payload, { expiresIn: '1h' })
  }

  public JWT_RefreshToken(registerUser: AuthUser): string {
    const payload = { id: registerUser.id, userid: registerUser.userid }
    return this.jwtService.sign(payload, { expiresIn: '1d' })
  }
}
