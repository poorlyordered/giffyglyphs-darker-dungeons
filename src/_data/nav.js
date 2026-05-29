'use strict';
const manifest = require('../collections/giffyglyphs_darker_dungeons.json');

module.exports = function() {
  return manifest.contents
    .filter(entry => entry.type === 'SECTION')
    .map(section => ({
      highlight: section.title.highlight,
      title: section.title.main,
      isAppendix: section.isAppendix === 'true',
      chapters: section.chapters
        .filter(ch => !(ch.formats && ch.formats.includes('book') && ch.formats.length === 1))
        .map(ch => ({ id: ch.id, title: ch.title, description: ch.description }))
    }))
    .filter(section => section.chapters.length > 0);
};
