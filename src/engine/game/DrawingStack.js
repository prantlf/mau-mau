import Stack from './../cards/Stack';
import i18n from '../misc/i18n';

class DrawingStack extends Stack {
  
  toString() {
    return i18n.translate('drawing stack');
  }
  
}

export default DrawingStack;
