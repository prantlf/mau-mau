import {expect} from 'chai';
import i18n from '../../../node/engine/misc/i18n';

// Avoid checking the describe() for maximum nested callbacks
/*eslint max-nested-callbacks: [2, 4]*/ 

describe('Localization', function () {

  it('defaults to the English language', function () {
    var seven = i18n.translate('seven');
    expect(seven).to.be.equal('seven');
  });

  it('provides the complete German language', function () {
    includesLanguage('de');
  });

  it('provides the complete Czech language', function () {
    includesLanguage('cs');
  });

  describe('when the language is switched', function () {

    afterEach(function () {
      i18n.setLocale('en');
    });

    it('fails if an unknown language is requested', function () {
      expect(function () {
        i18n.setLocaleSafely('xy');
      }).to.throw(Error);
    });

    it('does not change the locale, if the switch failed', function () {
      try {
        i18n.setLocaleSafely('xy');
      } catch (error) {
        var seven = i18n.translate('seven');
        expect(seven).to.be.equal('seven');
      }
    });

    it('succeeds with a supported language', function () {
      i18n.setLocaleSafely('de');
      var seven = i18n.translate('seven');
      expect(seven).to.be.equal('Sieben');
    });

    it('succeeds using a full locale too', function () {
      i18n.setLocaleSafely('cs-CZ');
      var seven = i18n.translate('seven');
      expect(seven).to.be.equal('sedma');
    });

  });

});

function includesLanguage(locale) {
  var translations = i18n.getTranslations();
  Object.keys(translations).forEach(function (text) {
    var localizations = translations[text];
    expect(localizations).to.include.property(locale);
  });
}