<p align="center">
  <img src="npx-wrench.svg" alt="NPX Wrench Logo">
</p>

# gen_named_exports

gen_named_exports is a tool that helps generate the index.js or main.js for an npm package by scanning the source files and collecting all the named exports.  The tool then generates a file that impost all those named exports and then exports those function names.

gen_named_exports does **not** require *any* additional changes to your code or method of development. You can direct the output to a file.

# Usage

```bash
cd src
npx gen_named_exports . >index.js
```

Notice: a single > will overwrite the index.js file

# License

MIT [http://rem.mit-license.org](http://rem.mit-license.org)
