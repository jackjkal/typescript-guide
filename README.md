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

### 5. [Typed arrays](notes.md#typed-arrays)

Source: [`features/arrays.ts`](features/arrays.ts)

- Inferring array element types
- Annotating empty arrays
- Reading `string[]` and `Date[]`
- Multidimensional arrays such as `string[][]`
- Mixed-type arrays with unions such as `(Date | string)[]`

### 6. [Tuples and type aliases](notes.md#tuples)

Source: [`features/tuples.ts`](features/tuples.ts)

- Why tuple values are inferred as arrays without annotations
- Fixed position and element types
- Choosing between arrays, tuples, and objects
- Reusing tuple definitions with type aliases

### 7. [Interfaces and classes](notes.md#interfaces-and-classes)

Source: [`features/interfaces.ts`](features/interfaces.ts)

- Defining named object types
- Describing required property names and value types
- Replacing repeated inline object annotations
- Structural typing and extra properties
- Naming interfaces after capabilities such as `Reportable`
- Using interfaces and classes for code reuse

### 8. [Classes](notes.md#classes)

Source: [`features/classes.ts`](features/classes.ts)

- Classes as object blueprints
- Fields and methods
- Creating instances with `new`
- Inheritance with `extends`
- Parent and child classes
- Inherited and overridden methods
- `public`, `private`, and `protected` visibility
- TypeScript soft privacy versus JavaScript `#` private elements
- Class fields and constructor initialization
- Constructor parameter-property shortcuts
- Derived constructors and `super()`
- Combining classes and interfaces for code reuse

## Next: Design patterns with TypeScript

The syntax overview is complete. Upcoming project-based lessons apply these features to design patterns; notes will call out compatibility differences caused by newer runtimes, compilers, and dependencies.

### 9. [Maps application](notes.md#maps-project)

Source directory: [`maps`](maps)

- Randomly generating user and company entities
- Displaying entity locations on a map
- Practicing class-and-interface code reuse
- Running browser TypeScript with Parcel
- Following the HTML-to-TypeScript dependency graph
- Serving the generated browser bundle on localhost
- Organizing primary classes into PascalCase files
- Importing Faker and recognizing missing declaration files
- Using `.d.ts` files and DefinitelyTyped with JavaScript libraries
- Reading declaration files as API documentation
- Initializing typed class fields with Faker data
- Modeling and generating `User` and `Company` instances
- Exporting class modules and composing them in `index.ts`
- Named exports versus default exports
- Reading the `google.maps.Map` constructor declaration
- DOM nullability and `as HTMLElement` assertions
- Encapsulating the Google map behind an application-owned wrapper
- A private `googleMap` field and configurable container ID
- Classes as both runtime values and instance types
- Refactoring duplicated user/company marker methods
- Legacy `Marker` versus `AdvancedMarkerElement`
- Watching for older starter dependency incompatibilities

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
