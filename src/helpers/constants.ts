export namespace Constants {
    export const HOST = 'https://salesforcecommercecloud.github.io';
    export const HOST_SEARCH_INDEX = '/b2c-dev-doc/search.json';
    export const ERROR_BUILD_SEARCH_INDEX = 'Error on building the search index';
    export const REG_EX_ARRAY = [
        /<script.*?>([\w\W\d\D\s\S\0\n\f\r\t\v\b\B]*?)<\/script>/gi,
        /<link.*?>/gi,
        /<meta.*?>/gi,
        /<div id="homeLink">([\w\W\d\D\s\S\0\n\f\r\t\v\b\B]*?)<\/div>/gi,
        /<footer.*?>([\w\W\d\D\s\S\0\n\f\r\t\v\b\B]*?)<\/footer>/gi,
        /<div class="copyright">([\w\W\d\D\s\S\0\n\f\r\t\v\b\B]*?)<\/div>/gi,
        /<img.*?>/gi,
        /<div class="bannerItem">([\w\W\d\D\s\S\0\n\f\r\t\v\b\B]*?)<\/div>/gi,
        /onload="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/gi
      ];
}