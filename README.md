# minq-repl
interactive querying for mongodb a la [minq](https://github.com/jden/minq)

## installation

    $ npm install -g minq-repl

## usage

    $ minq [options] <connectionString>

    Options:

      -h, --help     output usage information
      -V, --version  output minq version number
      -v, --verbose  output additional query information


`connectionString` should be a MongoDB [Connection URI](http://docs.mongodb.org/manual/reference/connection-string/)

Includes experimental support for ES6 syntax (arrow functions, yay!) via [six](https://npm.im/six).

## running the tests

feel free to contribute some :)

## contributors

- jden <jason@denizac.org>


## license

MIT. (c) 2013 jden <jason@denizac.org>. See LICENSE.md
