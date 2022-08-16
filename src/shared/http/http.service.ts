import { Injectable } from '@nestjs/common';
import { HttpService as NestHttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ErrorHelper } from 'src/helpers/error.utils';
import { FACEBOOK_ID } from 'src/environments';
import { messageError } from 'src/messages';
@Injectable()
export class HttpService {
  constructor(private httpService: NestHttpService) {}

  async getProfileFacebook(access_token: string) {
    const urlGraphFacebook = `https://graph.facebook.com/${FACEBOOK_ID}?field=id&access_token=${access_token}`;
    try {
      const { data } = await firstValueFrom(this.httpService.get(urlGraphFacebook));
      return data;
    } catch (error) {
      const message = error.response.data?.error?.message || messageError.FB_ERROR;
      ErrorHelper.DynamicHttpException(message, error.response?.status);
    }
  }

  async getProfileGoogle(access_token: string) {
    const urlGoogelApis = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${access_token}`;
    try {
      const { data } = await firstValueFrom(this.httpService.get(urlGoogelApis));
      return data;
    } catch (error) {
      const message = error.response.data?.error || messageError.GOOGLE_ERROR;
      ErrorHelper.DynamicHttpException(message, error.response?.status);
    }
  }

  async getProfileLine(access_token: string) {
    const urlLineApis = `https://api.line.me/oauth2/v2.1/verify?access_token=${access_token}`;
    try {
      const { data } = await firstValueFrom(this.httpService.get(urlLineApis));
      return data;
    } catch (error) {
      const message = error.response.data?.error || messageError.LINE_ERROR;
      ErrorHelper.DynamicHttpException(message, error.response?.status);
    }
  }
}
