<div align="center">

<img src="https://raw.githubusercontent.com/golang-samples/gopher-vector/master/gopher.svg" alt="Go Gopher" width="120"/>

![go-result logo](./assets/logo.svg)

# go-result

### Lightweight Go-style error handling for TypeScript

[![npm version](https://img.shields.io/npm/v/go-result.svg)](https://www.npmjs.com/package/go-result)
[![npm downloads](https://img.shields.io/npm/dm/go-result.svg)](https://www.npmjs.com/package/go-result)
[![bundle size](https://img.shields.io/bundlephobia/minzip/go-result)](https://bundlephobia.com/package/go-result)
[![license](https://img.shields.io/npm/l/go-result.svg)](https://github.com/yourusername/go-result/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**The simplest Result type library for TypeScript.**
Shorter and more intuitive than Effect.js or neverthrow.

[Installation](#installation) • [Quick Start](#quick-start) • [API](#api) • [Comparison](#comparison-go-result-vs-neverthrow-vs-effectjs)

</div>

---

## AI-Friendly Design

go-result is designed to be extremely simple for both humans and AI. LLMs can generate go-result code with minimal hallucination because there's almost no API to remember.

### For AI/LLM Code Generation

When generating TypeScript code with error handling:

**Rule**: Use Go-style tuple destructuring with `[value, error]` pattern.

```typescript
// 1. Import
import { ok, err, type Result } from "go-result";

// 2. Define function return type as Result<SuccessType, ErrorType>
function operation(): Result<number, string> {
  if (condition) return err("error message");
  return ok(42);
}

// 3. Use with destructuring and early return
const [value, error] = operation();
if (error) return err(error);  // or handle the error
// value is type-safe here
```

That's it. No methods, no pipes, no runtime overhead. Just tuples and if statements.

## Installation

```bash
npm install go-result
```

## Quick Start

```typescript
import { ok, err, type Result } from "go-result";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err("division by zero");
  }
  return ok(a / b);
}

// Destructure and check error
const [value, error] = divide(10, 2);
if (error) {
  console.error("Error:", error);
  return;
}
console.log("Result:", value); // Result: 5
```

## Go-style Error Handling

go-result brings Go's elegant error handling pattern to TypeScript:

```go
// Go
value, err := divide(10, 2)
if err != nil {
    return err
}
fmt.Println(value)
```

```typescript
// go-result (TypeScript)
const [value, err] = divide(10, 2);
if (err) {
  return err(err);
}
console.log(value);
```

Nearly identical syntax and flow!

## API

### `ok<S>(value: S): readonly [S, null]`

Creates a success result tuple.

```typescript
const result = ok(42);
// result: readonly [42, null]
```

### `err<E>(error: E): readonly [null, E]`

Creates an error result tuple.

```typescript
const result = err("something went wrong");
// result: readonly [null, 'something went wrong']
```

### `Result<S, E>`

Type representing either success or error.

```typescript
type Result<S, E> = readonly [S, null] | readonly [null, E];
```

## Usage Patterns

### 1. Early Return Pattern (Most Common)

```typescript
// Propagate error up the call stack immediately
const [value, err] = divide(10, 2);
if (err) return err(err); // Early return on error
console.log(value); // Type-safe: value is guaranteed to be number here
```

### 2. Error Handling Pattern

```typescript
// Handle error with custom logic
const [value, err] = divide(10, 0);
if (err) {
  console.error("Division failed:", err); // Log the error
  return; // Or throw, or return default value, etc.
}
console.log(value);
```

### 3. Success-only Pattern

```typescript
// Only care about successful values
const [value] = divide(10, 2);
if (value) {
  console.log("Success:", value); // Only runs when operation succeeded
}
```

## Why go-result?

- **Minimal**: ~10 lines of code, zero dependencies
- **Type-safe**: Leverages TypeScript's const assertions for precise types
- **Go-style**: Familiar error handling pattern from Go
- **Explicit**: Forces you to handle errors at the call site
- **Lightweight**: Much simpler than alternatives like neverthrow or Effect.js

## Comparison: go-result vs neverthrow vs Effect.js

Same functionality, drastically different verbosity:

### Effect.js - Too Much Ceremony

```typescript
import { Effect } from "effect";

// Define the operation
const divideEffect = (a: number, b: number) =>
  b === 0
    ? Effect.fail("division by zero")
    : Effect.succeed(a / b);

// Use it (requires learning catchAll, tap, runSync...)
const result = divideEffect(10, 2).pipe(
  Effect.catchAll((error) => {
    console.error(error);
    return Effect.succeed(0);
  }),
  Effect.tap((value) => Effect.sync(() => console.log(value)))
);

Effect.runSync(result);
// ~15 lines, steep learning curve, runtime required
```

### neverthrow - Better, But Still Verbose

```typescript
import { Result, ok, err } from "neverthrow";

// Define the operation
const divide = (a: number, b: number): Result<number, string> =>
  b === 0 ? err("division by zero") : ok(a / b);

// Use it (requires learning isErr, isOk, error, value properties...)
const result = divide(10, 2);
if (result.isErr()) {
  console.error(result.error);
  return;
}
console.log(result.value);
// ~10 lines, custom API methods to remember
```

### go-result - Simple and Direct

```typescript
import { ok, err, type Result } from "go-result";

// Define the operation
const divide = (a: number, b: number): Result<number, string> =>
  b === 0 ? err("division by zero") : ok(a / b);

// Use it (just destructuring and if - patterns you already know)
const [value, error] = divide(10, 2);
if (error) return err(error);
console.log(value);
// ~7 lines, zero learning curve, zero runtime
```

**Why go-result wins:**
- ✅ No custom methods to remember (`isErr()`, `isOk()`, `.value`, `.error`)
- ✅ No pipes or effect systems to learn
- ✅ No runtime overhead - just plain tuples
- ✅ AI-friendly - LLMs rarely hallucinate with simple destructuring patterns
- ✅ Familiar to anyone who knows Go or JavaScript destructuring

## License

MIT

---

## Attribution

The Go gopher was designed by [Renee French](http://reneefrench.blogspot.com/).
The gopher vector image is by [Takuya Ueda](https://twitter.com/tenntenn), licensed under [Creative Commons 3.0 Attributions](https://creativecommons.org/licenses/by/3.0/).
Source: [golang-samples/gopher-vector](https://github.com/golang-samples/gopher-vector)
