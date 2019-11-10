const QUOTE = "\"";

module.exports = (input, options = {}) => {

	const separator = options.separator || ",";
	const newLine = options.newLine || "\r\n";

	if(input.slice(-newLine.length)) {
		// a final new line is allowed and should start a new list of values
		input = input.slice(0, -newLine.length);
	}

	if(!input) return [];

	let index = 0;
	let value = [];
	let line = [value];
	let data = [line];

	/**
	 * Checks whether the end of input was reasched.
	 */
	const canRead = () => index < input.length;

	/**
	 * Gets the next character in the input string and
	 * increments the readingindex.
	 */
	const next = () => input.charAt(index++);

	/**
	 * Throws an error with the given message at the current
	 * reading index.
	 */
	const error = message => {
		const lines = input.substr(0, index).split("\n");
		throw new Error(`Line ${lines.length}, column ${lines.pop().length + 1}: ${message}`);
	};

	/**
	 * Adds a new value to the current line and sets it as
	 * the active value, where new characters are added.
	 */
	const endValue = () => {
		value = [];
		line.push(value);
	};

	/**
	* Adds a new line to the data and sets it as the active
	* line, where new values are added.
	*/
	const endLine = () => {
		line = [value = []];
		data.push(line);
	};

	/**
	 * Checks whether the current reading index matches the given
	 * sequence and increses the index by the length of the given
	 * sequence if it does.
	 * @returns Whether the given sequence matches.
	 */
	const readSeq = seq => {
		if(input.substr(index, seq.length) === seq) {
			index += seq.length;
			return true;
		}
	};

	/**
	 * Checks whether the next sequence is a separator.
	 */
	const readSeparator = () => readSeq(separator);

	/**
	 * Checks whether the next sequence is a new line.
	 */
	const readNewLine = () => readSeq(newLine);

	/**
	 * Reads a value that was started with quotes.
	 */
	const readQuoted = () => {
		const n = next();
		if(n === QUOTE) {
			if(input.charAt(index) === QUOTE) {
				// just an escaped quote
				index++;
				value.push(QUOTE);
			} else {
				// closing quote
				if(readNewLine()) {
					endLine();
				} else if(readSeparator()) {
					endValue();
				} else if(canRead()) {
					error("expected separator or new line after closing quote.");
				}
				reader = readUnquoted;
			}
		} else {
			value.push(n);
		}
	};

	/**
	 * Reads a value was not started with quotes.
	 */
	const readUnquoted = () => {
		if(readSeparator()) {
			endValue();
		} else if(readNewLine()) {
			endLine();
		} else {
			const n = next();
			if(n === QUOTE) {
				if(value.length) error("quote only expected at the start of value.");
				reader = readQuoted;
			} else {
				value.push(n);
			}
		}
	};

	let reader = readUnquoted;
	while(canRead()) reader();

	return data.map(line => line.map(values => values.join("")));

};
