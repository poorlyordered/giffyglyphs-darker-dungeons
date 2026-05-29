'use strict';
const path = require('path');
const sass = require('sass');

module.exports = function(eleventyConfig) {
  // Passthrough copy for images
  eleventyConfig.addPassthroughCopy({ 'src/images': 'images' });

  // SCSS template format
  eleventyConfig.addTemplateFormats('scss');
  eleventyConfig.addExtension('scss', {
    outputFileExtension: 'css',
    compile: function(inputContent, inputPath) {
      if (path.basename(inputPath).startsWith('_')) {
        return undefined;
      }
      return async () => {
        const result = sass.compile(inputPath, { style: 'compressed' });
        return result.css;
      };
    }
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      data: '_data'
    },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
