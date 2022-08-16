import _ from 'lodash';
import { lang } from 'src/locales';

export class TranslateHelper {
  static translate(path: string) {
    return _.get(lang, path, false);
  }
}
