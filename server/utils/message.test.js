const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        const from = 'Jane';
        const text = 'Some message';
        const message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({ from, text });
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location message', () => {
        const from = 'Dab';
        const lat = 15;
        const long = 19;
        const url = 'https://www.google.com/maps?q=15,19';
        const message = generateLocationMessage(from, lat, long);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({ from, url })
    });
});