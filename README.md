
<p align="center">
  <img src="npx-wrench.svg" alt="NPX Wrench Logo">
</p>

<!-- cSpell:ignore unplugin -->

# gen_named_exports

gen_named_exports is a tool that helps generate the index.js or main.js for an
npm package by scanning the source files and collecting all the named exports.  The
tool then generates a file that imports all those function names and then
exports those function names.

gen_named_exports does **not** require *any* additional changes to your code or
method of development. You can direct the output to a file.

# Usage

```bash
cd src
npx gen_named_exports . >index.js
```

Notice: a single > will overwrite the index.js file

Version 0.9.5 and later skips *.test.* and *.spec.* files

# Known problems:

- gen_named_exports uses unplugin-export-collector/core's expCollector, which uses
  @swc/core to parse.  If you use JSX syntax in .js files, parsing that file will
  crash and the file will be skipped from the generated output.

  **Current work-around:** rename files containing JSX syntax to .jsx file extension
  and .jsx files will be parsed more crudely.

# License

GPL 3.0 [https://www.gnu.org/licenses/gpl-3.0.en.html](https://www.gnu.org/licenses/gpl-3.0.en.html)
