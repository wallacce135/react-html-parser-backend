import { Controller, Get, Req, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Req() request, @Res() response): Promise<any> {
    // let data = await this.appService.getFullPage(request.headers.linking);
    // let {data: document } = await this.appService.getFullPage(request.headers.linking);
    let document = await this.appService.getFullPage(request.headers.linking); 

    // return response.status(HttpStatus.OK).json();
    return response.status(HttpStatus.OK).json({document});
  }
}
