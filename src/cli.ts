#!/usr/bin/env node

import { generate } from '.';

const stdin_callbacks = Array<(str: string) => void>();

let stdin_buffer = '';

const stdin_process = () => {
	while (stdin_callbacks.length && stdin_buffer.includes('\n')) {
		const index = stdin_buffer.indexOf('\n');
		const callback = stdin_callbacks.shift();

		if (callback) {
			const returnValue = stdin_buffer.slice(0, index + 1).trim();
			stdin_buffer = stdin_buffer.slice(index + 1);
			setTimeout(() => callback(returnValue));
		}
	}
};

process.stdin.on('data', (chunk) => {
	const key = String(chunk);
	stdin_buffer += key === '\r' ? '\n' : key;
	stdin_process();
});

const readline = (): Promise<string> => {
	return new Promise((resolve) => {
		stdin_callbacks.push(resolve);
		stdin_process();
	});
};

const main = async (): Promise<void> => {
	process.stdin.setRawMode(true);

	process.stderr.write('Enter master password: ');
	const password1 = await readline();
	process.stderr.write('\n');

	process.stderr.write('Enter master password: ');
	const password2 = await readline();
	process.stderr.write('\n');

	if (password1 !== password2) {
		console.error('Passwords do not match.');
		return void setTimeout(main);
	}

	while (true) {
		process.stdin.setRawMode(false);
		process.stderr.write('Enter service name: ');
		const service = await readline();

		const password = generate(
			password1,
			service
				.toLowerCase()
				.replace(/[^a-z0-9]/g, ' ')
				.trim()
				.replace(/ +/g, '-')
		);

		console.log(password);
	}
};

main();
