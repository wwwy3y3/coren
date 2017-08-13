class PreloadJsPlugin {
  jsDidAppend({link, $head}) {
    $head.prepend(`<link rel="preload" href="${link}" as="script">`);
  }
}

module.exports = PreloadJsPlugin;
