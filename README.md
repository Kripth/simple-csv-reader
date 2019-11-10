simple-csv-reader
=================

![npm](https://img.shields.io/npm/v/simple-csv-reader)

Converts a CSV string into a JavaScript array according to the [RFC 4180 standard](https://tools.ietf.org/html/rfc4180).

## Usage

**simple-csv-reader** can be imported as an AMD module or globally as the `readcsv` function.
The first argument must be a string, containing the encoded CSV.
The second argument is an optional object that can be used to change the default separator using the `separator` key (default is `,`) and the default line separator using the `newLine` key (default is `\r\n`).

This library only deserializes the input and does not perform any check on the length of the lines.

```js
import readcsv from "simple-csv-reader";

readcsv(
`1,simple text
2,"with ""quotes"""
3,"with separator, and 
newline"`
);
```
```js
[
	["1", "simple text"],
	["2", "with \"quotes\""],
	["3", "with separator, and \nnewline"]
]
```