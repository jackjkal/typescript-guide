# TypeScript Course Notes

## `fetchjson` — First look at TypeScript

This example makes an HTTP request with Axios and logs the returned JSON. Its main purpose is to show the basic TypeScript workflow rather than to introduce lots of new syntax.

### What TypeScript is doing

- TypeScript checks the `.ts` source during development/compilation and reports type-related mistakes before the program runs.
- TypeScript code is converted to JavaScript because Node.js and browsers ultimately execute JavaScript, not TypeScript's type system.
- Type annotations and other type-only information are removed during compilation; they do not perform runtime validation.
- TypeScript can infer many types from context, so useful checking does not always require explicit type annotations. For example, `url` is inferred to be a string.
- Libraries can provide type declarations that describe their JavaScript APIs. That information enables autocomplete and helps TypeScript check calls such as `axios.get(url)`.

### What is a type?

In TypeScript, a **type** is an easy way to refer to the different properties and methods that a value has. In other words, a type describes the value's structure and the operations TypeScript considers valid for it.

Types can be divided into two broad categories:

- **Primitive types:** `number`, `string`, `boolean`, `null`, `undefined`, and similar built-in values.
- **Object types:** objects, arrays, dates, functions, and objects whose structures we define ourselves.

Types matter because:

- The TypeScript compiler uses them to analyze code and report errors.
- They communicate what values represent and how they may be used, making the code easier for other developers to understand.

For example, the `Todo` interface tells both developers and TypeScript that code treating a value as a `Todo` can rely on these properties:

```ts
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

TypeScript can therefore check accesses to those properties and reject references to properties that are not part of the interface. This is a compile-time description, not a runtime guarantee that an external API actually returned matching data.

### Catching incorrect property access

The first version used property names with incorrect names and casing. JavaScript allowed those accesses and produced `undefined` at runtime. TypeScript can catch that mistake before the program runs once it knows the expected structure of the data.

An interface defines the structure of an object:

```ts
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

After treating the response data as a `Todo`, TypeScript knows which properties exist and what value each property should contain. A reference such as `todo.ID`, `todo.Title`, or `todo.finished` is then reported as an error, while `todo.id`, `todo.title`, and `todo.completed` are accepted.

The editor's red underlines and the errors from `tsc` are two ways of seeing TypeScript's analysis. Editor integration gives feedback while writing; compiling provides a definitive project-wide check.

For now, the important idea is that describing the shape of a value lets TypeScript detect incorrect assumptions before runtime. The interface syntax will be explored in more detail later.

### Catching arguments in the wrong order

Moving the output into a helper function created another opportunity for a logic error. Its parameter annotations describe both the expected types and their order:

```ts
const logTodo = (id: number, title: string, completed: boolean) => {
  // ...
};
```

If values are passed in the wrong order, such as placing the `boolean` where the function expects a `string`, TypeScript marks the argument as an error. Correcting the call to `logTodo(id, title, completed)` makes the error disappear.

Type annotations on function parameters therefore act as a contract for every call to that function. TypeScript checks each supplied argument against the corresponding parameter before the code runs.

### Running the program

The explicit two-step workflow is:

```sh
npx tsc
node index.js
```

For small exercises, `tsx` provides a convenient one-command development workflow:

```sh
npx tsx index.ts
```

`tsx` transpiles and runs the TypeScript for you. It is convenient for execution, but running the TypeScript compiler separately is still useful when you specifically want a full project type-check:

```sh
npx tsc --noEmit
```

> **Aside: `tsx` does not perform full type-checking**
>
> `npx tsx index.ts` prioritizes quickly transpiling and running the program. It can execute code even when the editor is showing a TypeScript error, and it does not emit a persistent `.js` file beside the source.
>
> Use the two tools for their separate jobs:
>
> ```sh
> npx tsc --noEmit   # Check the configured project's types
> npx tsx index.ts   # Transpile and run the program
> ```
>
> An editor's red underlines provide immediate feedback, but `npx tsc --noEmit` is the definitive project-wide type check.

> **Aside: `tsconfig.json` is present but will not be loaded**
>
> Running a command such as `npx tsc index.ts` explicitly supplies a source file. In newer TypeScript versions, that conflicts with the nearby `tsconfig.json`: when filenames are given on the command line, TypeScript does not load the project configuration and reports error `TS5112` instead of silently ignoring it.
>
> From the directory containing `tsconfig.json`, compile the configured project with:
>
> ```sh
> npx tsc
> ```
>
> Use `npx tsc --noEmit` to type-check the configured project without creating JavaScript, or `npx tsc --project ./tsconfig.json` to name a configuration explicitly. If the intention really is to compile one isolated file without using the configuration, run `npx tsc index.ts --ignoreConfig`.

### Things to remember

- TypeScript helps primarily before runtime; it does not eliminate runtime failures such as network errors or unexpected API data.
- `tsconfig.json` controls project-wide compiler behavior, including the JavaScript target, module format, and strictness.
- Prefer running `npx tsc` from the directory containing `tsconfig.json` when you want that project configuration applied.
- `response.data` is external data. Eventually, describing its expected shape with a TypeScript type will make code that uses it safer, but a type alone cannot prove that the server actually returned that shape.

## `features` — Exploring inferred types

TypeScript maintains descriptions of JavaScript's built-in types, including their available properties and methods. This allows it to understand a value created with `new Date()` and recognize methods such as `getMonth()` without any type annotation from us.

TypeScript can also infer types from code we define:

```ts
const today = new Date(); // Date

const person = {
  age: 20,
}; // { age: number }

class Color {}
const red = new Color(); // Color
```

- A constructor such as `Date` determines the type of the instance it creates.
- An object literal's type is inferred from its property names and values.
- An instance of a custom class has that class as its type.

Hovering over these variables in VS Code reveals the types TypeScript inferred. VS Code uses TypeScript's language tooling to provide this information, along with autocomplete, navigation, and inline error feedback. Type inference means TypeScript can understand and check many values even when no explicit type annotation was written.

### Type annotations vs. type inference

- A **type annotation** is a small piece of code we add to tell TypeScript what type of value a variable will refer to.
- **Type inference** is TypeScript attempting to determine a variable's type from the code and value assigned to it.

```ts
const inferredName = "Ada";         // TypeScript infers string
const annotatedName: string = "Ada"; // We explicitly state string
```

These ideas can initially seem at odds: why write a type when TypeScript can infer it? They are complementary tools. Inference avoids unnecessary type annotations when the intended type is obvious, while annotations are useful in situations where TypeScript lacks enough information or where we want to state and enforce an intended type explicitly. Future lessons will explore when each approach is appropriate.

### Variable annotations

For a variable, the type annotation appears after the variable name and before the assignment:

```ts
let variableName: type = value;
```

Examples with primitive types:

```ts
let apples: number = 5;
let speed: string = "fast";
let hasName: boolean = true;
let nothingMuch: null = null;
let nothing: undefined = undefined;
```

Built-in object types can be annotations too:

```ts
let now: Date = new Date();
```

The annotation tells TypeScript what values may later be assigned to that variable. For example, after `apples` is declared as a `number`, assigning a `string` to it is a type error.

### Array and object annotations

An array annotation states the type of values the array contains by placing `[]` after the element type:

```ts
let colors: string[] = ["red", "green", "blue"];
let myNumbers: number[] = [1, 2, 3];
let truths: boolean[] = [true, true, false];
```

For example, `string[]` means “an array of strings.” TypeScript can use this information to reject an element of the wrong type and to provide the properties and methods available on both the array and its elements.

An object literal annotation lists the required properties and the type of each one:

```ts
let point: {
  x: number;
  y: number;
} = {
  x: 10,
  y: 20,
};
```

Here, `point` must have numeric `x` and `y` properties. TypeScript reports an error when a required property is missing or has an incompatible value.

A class name can also be used as the type of its instances:

```ts
class Car {}
let car: Car = new Car();
```

### Function annotations

A variable that refers to a function can be annotated with the types of its parameters and return value:

```ts
const logNumber: (i: number) => void = (i: number) => {
  console.log(i);
};
```

This declaration contains similar-looking type information and executable code:

- `(i: number) => void` on the left is the type annotation for `logNumber`. It says the value must be a function that accepts a `number` and returns no useful value.
- `(i: number) => { console.log(i); }` on the right is the actual function assigned to the variable.
- In a function type, the arrow is followed by the **return type** (`void`). In the function implementation, the arrow is followed by the **function body**.

The repeated syntax can look noisy at first. TypeScript can often infer some of it from the other side of the assignment, so both sides do not always need to repeat the same information.

### Inference can replace obvious annotations

When a variable is initialized in its declaration, TypeScript uses the assigned value to infer its type:

```ts
let apples = 5;       // inferred as number
let speed = "fast";   // inferred as string
let hasName = true;   // inferred as boolean
let now = new Date(); // inferred as Date
```

Hovering over `apples` in VS Code still shows `number` after the explicit `: number` annotation is removed. The annotation disappeared from the source, but the variable did not lose its type—TypeScript inferred the same information from `5`.

The same applies to the initialized arrays, class instance, and object literal in this lesson. Their explicit variable annotations are redundant because their assigned values give TypeScript enough information. This demonstrates the tension the next lesson will explore: use inference when TypeScript can determine the intended type accurately, and add annotations when it cannot or when an explicit contract is useful.
