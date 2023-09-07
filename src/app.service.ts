import { HttpService } from '@nestjs/axios/dist';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) { }
  async getFullPage(link: string): Promise<any> {
    
    let html = await firstValueFrom(await this.httpService.get(link, {}));

    const regExpStylesLinks: RegExp = /<link(.*?)href="(.*?).css"(.*?)>/g;

    const styleLinks: Array<string> = html.data.match(regExpStylesLinks);
    let formattedArr: Array<string> = []

    for (let index = 0; index < styleLinks.length; index++) { 
      if(!styleLinks[index].includes('https://')){
        let item = styleLinks[index].replaceAll('"', '').replaceAll('<link rel=stylesheet', '').replaceAll('>', '').replaceAll('href=', '').replaceAll(' ', '').replaceAll('type=text/css', '');
        formattedArr.push(item);
      }
    }
    
    let formattedDomain = link.match(/.*\//);
    console.log(formattedDomain);
    for (let index = 0; index < formattedArr.length; index++) {
      formattedArr[index] = `${formattedDomain}${formattedArr[index]}`
    }
    

    let styles: string = ''
    for (let index = 0; index < formattedArr.length; index++) {
      
      let styleData = await firstValueFrom(this.httpService.get(formattedArr[index]));
      styles += `<style>\n ${styleData.data} \n</style>`;

    }

    const head = '<head>';
    let headTagID = html.data.indexOf('<head>') + head.length;
    let documentArr = html.data.split('');
    documentArr.splice(headTagID, 0, styles);

    html = documentArr.join('');

    // console.log(html);

    return html
    
  }
}
