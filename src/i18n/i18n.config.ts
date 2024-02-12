const { I18n } = require('i18n');
const path = require('path');

const i18n = new I18n({
  locales: ['en_US', 'fr_FR', 'ar_AR'],
  defaultLocale: 'en_US',
  directory: path.join('./', 'locales'),
  updateFiles: false,
});

module.exports = i18n;
