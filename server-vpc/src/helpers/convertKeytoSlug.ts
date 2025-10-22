import slugify from 'slugify';
class Helper {
  public static convertKeysToSlug (obj: any) {
    const convertedObj: any = {};

    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const slug: any = slugify(key.toLowerCase(), '_');
        convertedObj[slug] = { label: key, value };
      }
    }

    return convertedObj;
  }
}

export default Helper;
