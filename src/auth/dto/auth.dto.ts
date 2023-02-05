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
 * @reference https://github.com/earlgrey02
 * @link https://github.com/0verfl0w767
 * @license MIT LICENSE
 *
 */
import { IsString, MaxLength, MinLength } from 'class-validator'

import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
export class AuthDTO {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Field({ nullable: false })
  userid: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Field({ nullable: false })
  passwd: string
}

@ObjectType()
export class LoginDTO {
  @Field({ nullable: false })
  message: string

  @Field({ nullable: true })
  accessToken?: string

  @Field({ nullable: true })
  refreshToken?: string
}

@ObjectType()
export class LogoutDTO {
  @Field({ nullable: false })
  message: string

  @Field({ nullable: true })
  accessToken?: string

  @Field({ nullable: true })
  refreshToken?: string
}
