export default (context, inject) => {
    const checkLocale = () => context.i18n.localeProperties.code === 'vi';
    inject('localeVn', checkLocale);
};
