import { Controller, Get } from '@nestjs/common';
import { AuthService } from './guard/auth.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get('token')
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
        example: {
          token:
            'eyJhbGciOiJIUzI1NiJ9.bGltZQ.e_L57ocpYb2bQD48V0u30XujW_b4mitUEhj_7a2ho_k',
        },
      },
    },
  })
  async getToken() {
    const token = this.authService.generateToken();
    return { token };
  }
}
