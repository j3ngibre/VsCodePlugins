# ada-block-comments README

Ada Block Comments is a simple VS Code extension that lets you comment blocks of Ada code quickly without manually adding -- to every line. Just use the special marker -/ to mark the start and end of a block, and the extension will automatically comment all lines in between.

## Features
Automatic block commenting: Write -/ around a block, and all lines (including the markers) will be prepended with --.

Works on .adb and .ads files: Only affects Ada source files.

Real-time commenting: Comments are applied automatically when opening or editing files.


## How to use


Surround the lines you want to comment with -/ markers:

-/

Hi

How are you?

-/


After the extension runs (automatically or via command), the block will be transformed to:


-- -/

-- Hi

-- How are you?

-- -/

## Installation

    Download the .vsix package.

    In VS Code, go to Extensions → Install from VSIX... and select the file.

    The extension will be installed and ready to use.

    Source: https://github.com/j3ngibre/VsCodePlugins/tree/main/releases


**Enjoy!**
