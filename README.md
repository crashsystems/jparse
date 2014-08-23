# jparse.js

jparse is a command line tool for parsing JSON. It uses normal JavaScript syntax for accessing properties, and includes syntax highlighting.

## Install

jparse uses pygments for syntax highlighting. On Ubuntu or other Debian based distros, run the following to install it:

    apt-get install python-pygments

On OSX, you can use Python's `easy_install` program to install it:

    easy_install pygments

## Usage

To parse JSON, just pipe JSON output from another command into jparse, then specify the properties to access as CLI parameters.

**Example:**

    cat someFile.json | jparse foo.bar


You can also use JavaScript's [bracket notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_Accessors#Bracket_notation) to access properties who's names are not valid JavaScript identifiers. Note that due to how Bash handles quotes inside parameters, when using this method you must surround your entire selection in quotes.

**Example:**

    cat someFile.json | jparse "foo['another property']"


By default, jparse performs syntax highlighting. However, if the output of jparse is being piped into another program, this may cause the other program to fail when parsing the JSON's syntax. To prevent this, use the `--nohighlight` flag before your parameter list.

**Example:**

    cat someFile.json | jparse --nohighlight foo.baz
