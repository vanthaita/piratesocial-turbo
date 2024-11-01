import {
  Controller,
  Get,
  UseGuards,
  Request,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard as JWTAuthGuard } from './auth.gaurd';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(
    @Request() req: ExpressRequest,
    @Res() res: Response,
  ) {
    const googleToken = req.user?.accessToken;

    const authRes = await this.authService.authenticate(googleToken);

    res.cookie('access_token', authRes.access_token, { httpOnly: true });
    res.redirect(`${process.env.Client_URL}/messages`);
    // res.send({
    //   message: 'Successfully logged in',
    //   access_token: authRes.access_token,
    // });
  }

  @UseGuards(JWTAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: ExpressRequest) {
    const accessToken = req.cookies['access_token'];

    if (accessToken) return await this.authService.getUser(req.user?.email);

    throw new UnauthorizedException('No access token');
  }

  @Get('logout')
  async logout(@Req() req: ExpressRequest, @Res() res: Response) {
    res.clearCookie('access_token');

    res.redirect(process.env.PUBLIC_URL);
  }
}
