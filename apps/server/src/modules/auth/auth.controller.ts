import {
  Controller,
  Get,
  UseGuards,
  Request,
  Res,
  Req,
  UnauthorizedException,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard as JWTAuthGuard } from './auth.gaurd';
import { SignInDto, SignUpDto } from 'src/dto/authDto/create-auth.dto';
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
  @Post('check-token')
  async checkToken(@Body() body: { refresh_token: string }): Promise<any> {
    try {
      const refreshToken = body.refresh_token;
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }
      const { access_token } =
        await this.authService.getAccessTokenUser(refreshToken);
      return { message: 'Token is valid', access_token };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Token validation failed');
    }
  }
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto,
    @Res() res: Response,
  ) {
    try {
      const { access_token, refresh_token } =
        await this.authService.signIn(signInDto);
        res.cookie('access_token', access_token, { httpOnly: true });
      return { access_token, refresh_token };
    } catch (error) {
      console.error(error);
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    await this.authService.signUp(signUpDto);
    return { message: 'Sign Up successful' };
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
