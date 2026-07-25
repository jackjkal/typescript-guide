# TypeScript Course Notebook

Notes and exercises from Stephen Grider's TypeScript course. The detailed notebook is in [notes.md](notes.md); this page serves as its table of contents and as the repository's GitHub landing page.

## Table of contents

### 1. [First look at TypeScript](notes.md#fetchjson)

Source: [`fetchjson/index.ts`](fetchjson/index.ts)

- What TypeScript does
- Primitive and object types
- Interfaces and object structure
- Catching incorrect property access
- Catching arguments passed in the wrong order
- Compiling with `tsc` and running with `tsx`
- `tsx` type-checking caveat
- `tsconfig.json` command-line behavior

### 2. [Types, inference, and variable annotations](notes.md#types-and-variable-annotations)

Sources:

- [`features/types.ts`](features/types.ts)
- [`features/annotations/variables.ts`](features/annotations/variables.ts)

Topics:

- Built-in types and inferred types
- Type annotations versus type inference
- Primitive, array, object-literal, class, and function-variable annotations
- When variable inference works
- The `any` type and `JSON.parse`
- Delayed initialization
- Union types with `|`
- The three situations where manual variable annotations are useful

### 3. [Function annotations](notes.md#function-annotations)

Source: [`features/annotations/functions.ts`](features/annotations/functions.ts)

- Parameter and return-type annotations
- Return-type inference and missing `return` errors
- Arrow, named, and anonymous functions
- `void` and `never`
- Destructured parameter annotations

### 4. [Object annotations](notes.md#object-annotations)

Source: [`features/annotations/objects.ts`](features/annotations/objects.ts)

- Inferring object-literal structure
- Annotating object destructuring
- Nested object destructuring
- Mirroring an object's shape in its type annotation

## Running the examples

Run a TypeScript file directly:

```sh
npx tsx path/to/file.ts
```

For a configured project such as `fetchjson`, run a complete type-check from that directory:

```sh
npx tsc --noEmit
```

`tsx` executes TypeScript quickly but does not perform a full type-check. See the [course notes](notes.md#fetchjson) for the complete explanation.
