require('@testing-library/jest-dom/extend-expect')

// jsdom環境ではTextEncoder/TextDecoderやfetchが未定義になり得るため、必要に応じて補う
const { TextDecoder, TextEncoder } = require('util')
const { ReadableStream, WritableStream, TransformStream } = require('node:stream/web')

if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder
if (!globalThis.ReadableStream) globalThis.ReadableStream = ReadableStream
if (!globalThis.WritableStream) globalThis.WritableStream = WritableStream
if (!globalThis.TransformStream) globalThis.TransformStream = TransformStream

if (!globalThis.fetch) {
  const { fetch, Headers, Request, Response } = require('undici')
  globalThis.fetch = fetch
  globalThis.Headers = Headers
  globalThis.Request = Request
  globalThis.Response = Response
}
