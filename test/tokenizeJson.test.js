import {
  initialLineState,
  tokenizeLine,
  TokenType,
  TokenMap,
} from '../src/tokenizeJson.js'

const DEBUG = true

const expectTokenize = (text, state = initialLineState.state) => {
  const lineState = {
    stack: [],
    state,
  }
  const tokens = []
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const result = tokenizeLine(lines[i], lineState)
    lineState.state = result.state
    tokens.push(...result.tokens.map((token) => token.type))
    tokens.push(TokenType.NewLine)
  }
  tokens.pop()
  return {
    toEqual(...expectedTokens) {
      if (DEBUG) {
        expect(tokens.map((token) => TokenMap[token])).toEqual(
          expectedTokens.map((token) => TokenMap[token])
        )
      } else {
        expect(tokens).toEqual(expectedTokens)
      }
    },
  }
}

test('empty', () => {
  expectTokenize('').toEqual()
})

test('object', () => {
  expectTokenize('{}').toEqual(TokenType.Punctuation, TokenType.Punctuation)
})

test('array', () => {
  expectTokenize('[]').toEqual(TokenType.Punctuation, TokenType.Punctuation)
})

test('string', () => {
  expectTokenize('""').toEqual(TokenType.Punctuation, TokenType.Punctuation)
})

test('boolean', () => {
  expectTokenize('true').toEqual(TokenType.LanguageConstant)
  expectTokenize('false').toEqual(TokenType.LanguageConstant)
})

test('number', () => {
  expectTokenize('1').toEqual(TokenType.Numeric)
})

test('one property', () => {
  expectTokenize(`{
  "a": "b"
}`).toEqual(
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Punctuation
  )
})

test('multiple properties', () => {
  expectTokenize(`{
  "a": "a",
  "b": "b"
}`).toEqual(
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Punctuation
  )
})

test('nested object', () => {
  expectTokenize(`{
  "scripts": {
    "build": "tsc"
  }
}`).toEqual(
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    // TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Punctuation
  )
  expectTokenize(`{
  "a": {
    "a": {
      "a": {}
    }
  }
}`).toEqual(
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Punctuation
  )
})

test('nested object 2', () => {
  expectTokenize(`{
  "a": {
    "b": "c"
  }
}`).toEqual(
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Punctuation
  )
})

test.skip('nested object 3', () => {
  expectTokenize(`{
  "a": {},
  "b": {}
}`).toEqual([
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
  ])
})

test.skip(`nested object 4`, () => {
  expectTokenize(`{
  "a": {
    "a": "a"
  },
  "b": {}
}`).toEqual([
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.PropertyValueString,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
  ])
})

test.skip('boolean as property value', () => {
  expectTokenize(`{
  "a": 1,
  "b": false
}`).toEqual([
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.LanguageConstantBoolean,
    TokenType.Whitespace,
    TokenType.Punctuation,
  ])
})

test('nested array', () => {
  expectTokenize(`[
  [],
  []
]`).toEqual(
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Punctuation
  )
})

test('line comment', () => {
  expectTokenize(`// comment`).toEqual(TokenType.Comment)
})

test('line comment and array', () => {
  expectTokenize(`[
  1,
  // 2,
  3
]`).toEqual(
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Numeric,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Comment,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Numeric,
    TokenType.NewLine,
    TokenType.Punctuation
  )
})

test.skip('block comment', () => {
  expectTokenize(`/* block comment */`).toEqual([TokenType.Comment])
})

test.skip('multiline block comment', () => {
  expectTokenize(`/*
  multiline block comment
*/`).toEqual([TokenType.Comment])
})

test.skip('unclosed block comment', () => {
  expectTokenize(`/* unclosed block comment`).toEqual([TokenType.Comment])
})

test.skip('objects inside array', () => {
  expectTokenize(`{
    "a": [
      {
        "b": {
          "c": {}
        }
      }
    ]
  }`).toEqual([
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
  ])
})

test.skip('objects inside array 2', () => {
  expectTokenize(`[{},{}]`).toEqual([TokenType.Punctuation])
})

test.skip('partial boolean', () => {
  expectTokenize(`{"x": tru}`).toEqual(
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Unknown,
    TokenType.Punctuation
  )
})

test.skip('invalid number after boolean', () => {
  expectTokenize(`{
  "x": true123,
  "y": true
}`).toEqual([
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.LanguageConstantBoolean,
    TokenType.Error,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.LanguageConstantBoolean,
    TokenType.Whitespace,
    TokenType.Punctuation,
  ])
})

test.skip('duplicate comma', () => {
  expectTokenize(`{
  "x": true,,
}`).toEqual([
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.LanguageConstantBoolean,
    TokenType.Punctuation,
    TokenType.Error,
    TokenType.Whitespace,
    TokenType.Punctuation,
  ])
})

test.skip('missing comma', () => {
  expectTokenize(`{
  "x": true
  "y": true
}`).toEqual([
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.LanguageConstantBoolean,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.LanguageConstantBoolean,
    TokenType.Whitespace,
    TokenType.Punctuation,
  ])
})

test('integer number', () => {
  expectTokenize(`14`).toEqual(TokenType.Numeric)
})

test('integer number as property value', () => {
  expectTokenize(`{ "x": 14 }`).toEqual(
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric,
    TokenType.Whitespace,
    TokenType.Punctuation
  )
})

test.skip('multiple properties', () => {
  expectTokenize(`{
  "editor.fontSize": 14,
  "extensions.autoUpdate": true,
}
`).toEqual(
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric
  )
})

test('line comment and array', () => {
  expectTokenize(`//
[]`).toEqual(
    TokenType.Comment,

    TokenType.NewLine,
    TokenType.Punctuation,
    TokenType.Punctuation
  )
})

test('object', () => {
  expectTokenize(`{ 	"nameShort": "abc" }`).toEqual(
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation
  )
})

test('array as property value', () => {
  expectTokenize(`{ "serverGreeting": [] }`).toEqual(
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation
  )
})

test('string as property value', () => {
  expectTokenize(`{ "serverGreeting": "" }`).toEqual(
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation
  )
})

test('array of strings', () => {
  expectTokenize(`["1", "2"]`).toEqual(
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.Punctuation
  )
})

test('object and string as property values', () => {
  expectTokenize(`{
  "metadata": {
    "publisherId": {},
    "publisherDisplayName": "Microsoft"
  }
}`).toEqual(
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Punctuation
  )
})

test('escaped string', () => {
  expectTokenize('"\\""').toEqual(
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation
  )
})

test('escaped property name string', () => {
  expectTokenize('{"\\"":').toEqual(
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation
  )
})

test('line comment after array', () => {
  expectTokenize('{"x":[],//').toEqual(
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Comment
  )
})

test('bug with comment', () => {
  expectTokenize(
    `{  "no-restricted-globals": [], // non-complete list of globals that are easy to access unintentionally`
  ).toEqual(
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Comment
  )
})

test('imbalanced json', () => {
  expectTokenize(`{"constructor-super": "warn"}, "x": 42}`).toEqual(
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.Text
  )
})

test('regex inside string', () => {
  expectTokenize(
    `{ "testRegex": "/scripts/jest/dont-run-jest-directly\\.js$"`
  ).toEqual(
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.String,
    TokenType.String,
    TokenType.String,
    TokenType.Punctuation
  )
})

test('imbalanced json', () => {
  expectTokenize(`{
  "workbench.colorTheme": ""
}
`).toEqual(
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.JsonPropertyName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Punctuation,
    TokenType.NewLine
  )
})
