const StringView = require('../lib/string-view');

const Encoder = new TextEncoder();

describe('StringView', () => {
  describe('characters', () => {
    it('iterates over the characters in the StringView', () => {
      const stringView = StringView.fromString('asфы←😀');
      const chars = [];
      for (const character of stringView.characters()) {
        chars.push(character);
      }
      expect(chars).toEqual(['a', 's', 'ф', 'ы', '←', '😀']);
    });
  });

  describe('charAt', () => {
    it('returns a new string consisting of the single UTF character', () => {
      const stringView = StringView.fromString('asфы←😀');
      const chars = [];
      for (let i = 0; i < stringView.size; i++) {
        chars[i] = stringView.charAt(i);
      }
      expect(chars).toEqual(['a', 's', 'ф', 'ы', '←', '😀']);
    });

    it('returns an empty string if the character is not found', () => {
      const invalidString = StringView.from([128, 155, 134]);
      expect(invalidString.charAt()).toBe('');
      expect(invalidString.charAt(1)).toBe('');
      expect(invalidString.charAt(10)).toBe('');
    });
  });

  describe('replace', () => {
    it('replaces a pattern with a replacement', () => {
      const stringView = StringView.fromString('Vimessaid');
      stringView.replace(Encoder.encode('s'), Encoder.encode('x'))
        .replace(Encoder.encode('d'), Encoder.encode('y'));
      expect(stringView.toString()).toBe('Vimexxaiy');
    });
  });

  describe('reverse', () => {
    it('reverses the characters of the StringView in-place', () => {
      const stringView = StringView.fromString('fooа😀←');
      expect(stringView.reverse().toString()).toBe('←😀аoof');
    });
  });

  describe('search', () => {
    it('returns the index of the first occurrence of the specified value', () => {
      const stringView = StringView.fromString('Vimesi');
      expect(stringView.search(Encoder.encode('im'))).toBe(1);
      expect(stringView.search(Encoder.encode('Vi'))).toBe(0);
      expect(stringView.search(Encoder.encode('Vimes'))).toBe(0);
      expect(stringView.search(Encoder.encode('x'))).toBe(-1);
      expect(stringView.search(Encoder.encode('Vix'))).toBe(-1);
      expect(stringView.search(Encoder.encode('s'))).toBe(4);
      expect(stringView.search(Encoder.encode('i'))).toBe(1);
      expect(stringView.search(Encoder.encode('i'), 2)).toBe(5);

      const longString = StringView.from(new Array(300).fill(0)
        .map(() => (Math.random() * 128) | 0));
      longString[0] = 97;
      expect(longString.length).toBe(300);
      expect(longString.search(Encoder.encode('ё'))).toBe(-1);
      expect(longString.search(Encoder.encode('a'))).toBe(0);
    });
  });

  describe('size', () => {
    it('', () => {
      expect(StringView.fromString('asdf').size).toBe(4);
      expect(StringView.fromString('фыва').size).toBe(4);
      expect(StringView.fromString('😀😀fooа😀←').size).toBe(8);
    });
  });

  describe('substring', () => {
    it('returns a new string containing the specified part of the given string', () => {
      const stringView = StringView.fromString('qwertyasфы←😀ячсм');
      expect(stringView.substring(0, 6)).toBe('qwerty');
      expect(stringView.substring(6, 11)).toBe('asфы←');
      expect(stringView.substring(6, 10)).toBe('asфы');
      expect(stringView.substring(6, 13)).toBe('asфы←😀я');
      expect(stringView.substring(10, 12)).toBe('←😀');
    });

    it('returns an empty string if characters are not found', () => {
      const invalidString = StringView.from([128, 155, 134]);
      expect(invalidString.substring()).toBe('');
    });
  });

  describe('toString', () => {
    it('returns a string representation of the StringView', () => {
      const stringView = StringView.fromString('foo', 10);
      expect(stringView.toString()).toBe('foo');
    });
  });

  describe('toJSON', () => {
    it('returns a string representation of the StringView', () => {
      const stringView = StringView.fromString('foo', 10);
      expect(JSON.stringify(stringView)).toBe('"foo"');
    });
  });

  describe('trim', () => {
    it('returns a StringView without trailing zeros', () => {
      const stringView = StringView.fromString('foo', 10);
      expect(stringView.length).toBe(10);
      expect(stringView.trim().length).toBe(3);
    });
  });

  describe('fromString', () => {
    it('creates a StringView from a string', () => {
      const stringView = StringView.fromString('foo');
      expect(stringView.length).toBe(3);
      const stringViewSized = StringView.fromString('foo', 10);
      expect(stringViewSized.length).toBe(10);
      expect(stringView.subarray(0, 3)).toEqual(stringViewSized.subarray(0, 3));
    });
  });

  describe('getByteSize', () => {
    it('returns the size in bytes of a given string', () => {
      expect(StringView.getByteSize('asdf')).toBe(4);
      expect(StringView.getByteSize('фыва')).toBe(8);
      expect(StringView.getByteSize('😀😀fooа😀←')).toBe(20);
    });
  });
});
