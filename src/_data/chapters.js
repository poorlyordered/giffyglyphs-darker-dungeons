'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const manifest = require('../collections/giffyglyphs_darker_dungeons.json');
const darkerDungeons = require('../modules/darker_dungeons.js');

module.exports = async function() {
  const chapters = [];
  for (const section of manifest.contents) {
    if (section.type !== 'SECTION') continue;
    for (const chapter of section.chapters) {
      // Skip book-only chapters
      if (chapter.formats && chapter.formats.includes('book') && chapter.formats.length === 1) continue;

      const filename = chapter.filename.toLowerCase() + '.html';
      const fragmentPath = path.join(__dirname, '..', 'fragments', filename);
      if (!fs.existsSync(fragmentPath)) {
        console.warn(`[chapters.js] Fragment not found: ${filename}`);
        continue;
      }

      const html = fs.readFileSync(fragmentPath, 'utf8');
      const dom = new JSDOM(html);
      const document = dom.window.document;

      try {
        darkerDungeons.apply(document, 'website', 'en');
      } catch (err) {
        console.warn(`[chapters.js] Error applying modules to ${filename}:`, err.message);
      }

      const book = document.querySelector('book');
      const content = book ? book.outerHTML : document.body.innerHTML;

      chapters.push({
        id: chapter.id,
        title: chapter.title,
        description: chapter.description,
        filename: chapter.filename,
        sectionHighlight: section.title.highlight,
        sectionTitle: section.title.main,
        isAppendix: section.isAppendix === 'true',
        content
      });
    }
  }
  return chapters;
};
