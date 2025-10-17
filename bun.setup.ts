import '@testing-library/jest-dom'
import { beforeAll, afterEach } from 'bun:test'
import { cleanup } from '@testing-library/react'
import { Window } from 'happy-dom'

// Set up happy-dom for React component tests
const window = new Window()
const document = window.document

// Set global window and document
globalThis.window = window as any
globalThis.document = document as any
globalThis.navigator = window.navigator as any

// Set up mocks for tests
beforeAll(() => {
  // Mock crypto for tests
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => 'test-uuid-1234',
    },
    writable: true,
    configurable: true,
  })

  // Mock WebSocket for tests
  ;(globalThis as any).WebSocket = class WebSocket {
    addEventListener() {}
    removeEventListener() {}
    send() {}
    close() {}
  }
})

// Clean up DOM after each test
afterEach(() => {
  // Clear the document body for next test
  if (globalThis.document && globalThis.document.body) {
    globalThis.document.body.innerHTML = ''
  }
})
