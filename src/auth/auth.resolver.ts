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
import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AuthService } from './auth.service'
import { AuthDTO, LoginDTO, LogoutDTO } from './dto/auth.dto'
import { JwtAuthGuard } from './jwt/auth.jwt.guard'

@Resolver()
export class AuthResolver {
  public constructor(private readonly userService: AuthService) {}

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  protected testJWT() {
    return '로그인 되어 있습니다.'
  }

  @Mutation(() => String)
  protected async register(@Args('authDTO') authDTO: AuthDTO) {
    return this.userService.register(authDTO.userid, authDTO.passwd)
  }

  @Mutation(() => String)
  protected async unregister(@Args('id') id: number) {
    return this.userService.unregister(id)
  }

  @Mutation(() => String)
  protected async getUserID(@Args('id') id: number) {
    return this.userService.getUserID(id)
  }

  @Mutation(() => LoginDTO)
  protected async login(@Context() context: any, @Args('authDTO') authDTO: AuthDTO) {
    return this.userService.login(context.res, authDTO.userid, authDTO.passwd)
  }

  @Mutation(() => LogoutDTO)
  protected async logout(@Context() context: any, @Args('authDTO') authDTO: AuthDTO) {
    return this.userService.logout(context.res, authDTO.userid, authDTO.passwd)
  }
}
