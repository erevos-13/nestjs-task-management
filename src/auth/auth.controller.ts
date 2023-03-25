import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authSrv: AuthService) {}
  @Post('/signup')
  signUp(@Body() credentials: AuthCredentialsDto): Promise<void> {
    return this.authSrv.signUp(credentials);
  }

  @Post('/signin')
  signIn(
    @Body() credentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authSrv.signIn(credentials);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
