import { blake2s, blake2sHex } from 'blakets';
import { encode, hash, verify } from 'doge-passwd';

export function generate(password: string, service: string, outlen = 64) {
	const salt = encode(blake2s(service)).slice(0, outlen >> 1);

	return hash(`${blake2sHex(password)}${blake2sHex(service)}}`, outlen, salt);
}
