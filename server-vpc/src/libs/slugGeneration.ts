class SlugGeneration {
  public static execute (input: string) {
    let output = input.toLowerCase();
    output = output.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    output = output.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    output = output.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    output = output.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    output = output.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    output = output.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    output = output.replace(/(đ)/g, 'd');
    output = output.replace(/([^0-9a-z-\s])/g, '');
    output = output.replace(/(\s+)/g, '-');
    output = output.replace(/^-+/g, '');
    output = output.replace(/-+$/g, '');
    return output;
  }
}

export default SlugGeneration;
