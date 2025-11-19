<div align="center">

<img src="https://raw.githubusercontent.com/golang-samples/gopher-vector/master/gopher.svg" alt="Go Gopher" width="120"/>

![Go Result](./assets/logo.svg)

# go-result

### Lightweight Go-style error handling for TypeScript

[![npm version](https://img.shields.io/npm/v/go-result.svg)](https://www.npmjs.com/package/go-result)
[![npm downloads](https://img.shields.io/npm/dm/go-result.svg)](https://www.npmjs.com/package/go-result)
[![bundle size](https://img.shields.io/bundlephobia/minzip/go-result)](https://bundlephobia.com/package/go-result)
[![license](https://img.shields.io/npm/l/go-result.svg)](https://github.com/sunshower1127/go-result/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**The simplest Result type library for TypeScript.**
Shorter and more intuitive than Effect.js or neverthrow.

[Installation](#installation) • [Quick Start](#quick-start) • [Why Explicit Errors?](#why-explicit-error-handling) • [AI-Friendly](#ai-friendly-design) • [API](#api) • [Comparison](#comparison-go-result-vs-neverthrow-vs-effectjs)

</div>

---

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
const [value, err1] = divide(10, 2);
if (err1) {
  return err(err1);
}
console.log(value);
```

Nearly identical syntax and flow!

## Why Explicit Error Handling?

### The Problem with try-catch

Traditional `try-catch` in TypeScript has several issues:

```typescript
// ❌ Problems with try-catch:
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("division by zero");  // 1. Not visible in type signature
  }
  return a / b;
}

// Caller has no idea this can throw!
const result = divide(10, 0);  // 2. Easy to forget error handling
console.log(result);  // 3. Runtime crash
```

**Issues:**
1. **Invisible errors**: Function signature doesn't show it can fail
2. **Easy to forget**: No compiler reminder to handle errors
3. **Runtime crashes**: Unhandled exceptions crash your app
4. **Hard to trace**: Exception stack traces can be misleading
5. **Performance**: Try-catch blocks prevent JS engine optimizations

### Modern Languages Choose Explicit Errors

Many modern languages have moved away from exceptions:

- **Go**: Returns `(value, error)` tuples
- **Rust**: Uses `Result<T, E>` enum
- **Swift**: Uses `Result<Success, Failure>`
- **Zig**: Explicit error unions
- **OCaml/F#**: `Result` type
- **Scala**: `Either` and `Try`

**Why?** Explicit error handling makes code more reliable, maintainable, and self-documenting.

### go-result Makes Errors Explicit

```typescript
// ✅ With go-result:
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err("division by zero");  // 1. Error is in the type!
  }
  return ok(a / b);
}

// Type signature forces you to handle errors
const [value, error] = divide(10, 0);  // 2. Compiler reminds you
if (error) {
  console.error(error);  // 3. Explicit handling
  return;
}
console.log(value);  // 4. Safe to use
```

**Benefits:**
- ✅ Errors are **visible in types**
- ✅ Compiler **forces handling**
- ✅ No runtime crashes
- ✅ Better performance (no try-catch overhead)
- ✅ Self-documenting code

## AI-Friendly Design

go-result is designed to be extremely simple for both humans and AI. LLMs can generate go-result code with minimal hallucination because there's almost no API to remember.

### Perfect for VIBE Coding

When coding with AI assistants (Cursor, GitHub Copilot, Claude, etc.), error handling is often incomplete or incorrect. **go-result solves this.**

Simply give your AI this rule:

> **Rule for AI**: When writing functions that can fail, ALWAYS use `go-result`. Wrap any error-prone operations (file I/O, network calls, parsing, etc.) with this library. Return `Result<Success, Error>` and handle errors with destructuring.

**Example AI prompt:**
```
Use go-result library for all error handling.
Any function that can fail must return Result<T, E>.
Always destructure with [value, error] and check error first.
```

### For AI/LLM Code Generation

**Rules:**

1. **Import the library**
   ```typescript
   import { ok, err, type Result } from "go-result";
   ```

2. **Wrap ALL error-prone functions**
   ```typescript
   // ✅ Any operation that can fail MUST be wrapped
   function parseJSON(input: string): Result<any, string> {
     try {
       return ok(JSON.parse(input));
     } catch (e) {
       return err(`Invalid JSON: ${e.message}`);
     }
   }

   async function fetchUser(id: string): Result<User, string> {
     try {
       const response = await fetch(`/api/users/${id}`);
       if (!response.ok) return err(`HTTP ${response.status}`);
       const user = await response.json();
       return ok(user);
     } catch (e) {
       return err(`Network error: ${e.message}`);
     }
   }
   ```

3. **Always use destructuring pattern**
   ```typescript
   const [data, error] = parseJSON(input);
   if (error) return err(error);  // Early return on error
   // data is type-safe here
   ```

**Why this works for AI:**
- Simple pattern that LLMs rarely hallucinate
- Forces explicit error handling at every step
- Type system catches missing error checks
- **Even in VIBE coding, your errors are handled correctly**

That's it. No methods, no pipes, no runtime overhead. Just tuples and if statements.

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
const [value, err1] = divide(10, 2);
if (err1) return err(err1); // Early return on error
console.log(value); // Type-safe: value is guaranteed to be number here
```

### 2. Error Handling Pattern

```typescript
// Handle error with custom logic
const [value, err1] = divide(10, 0);
if (err1) {
  console.error("Division failed:", err1); // Log the error
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
const divideEffect = (a: number, b: number) => (b === 0 ? Effect.fail("division by zero") : Effect.succeed(a / b));

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
const divide = (a: number, b: number): Result<number, string> => (b === 0 ? err("division by zero") : ok(a / b));

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
const divide = (a: number, b: number): Result<number, string> => (b === 0 ? err("division by zero") : ok(a / b));

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
