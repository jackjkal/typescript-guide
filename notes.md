# TypeScript Course Notes

<a id="fetchjson"></a>

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

<a id="types-and-variable-annotations"></a>

## `features` — Types and variable annotations

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

### When variable inference works

When a variable is declared and initialized on the same line, TypeScript can use the initial value to infer its type:

```ts
const color = "red"; // inferred from the value as a string
```

If the declaration has neither an annotation nor an initial value, TypeScript has no value at that point from which to infer a useful type:

```ts
let apples; // any
apples = 5;
```

Assigning `5` later does not provide the same declaration-time inference demonstrated by `let apples = 5`. The `any` type effectively opts the value out of normal type safety, so it is usually something to avoid; it will be examined in more detail later.

The course's general rule is to **rely on type inference whenever it can determine the intended type**, and add explicit annotations only in the less common situations where inference is insufficient or does not express the intended contract.

### When annotations are required: functions that return `any`

The first of three scenarios where we should manually add an annotation is when a function returns `any`.

`JSON.parse` is the key example. The result depends entirely on the JSON string supplied at runtime:

```ts
JSON.parse("false");              // boolean value
JSON.parse('"hello"');            // string value
JSON.parse('{"x": 10, "y": 20}'); // object value
```

TypeScript cannot determine a single useful result type from the `string` parameter, so `JSON.parse` returns `any`. In the example, we fixed this by explicitly annotating the parsed result with its expected structure:

```ts
const json = '{"x": 10, "y": 20}';
const coordinates: { x: number; y: number } = JSON.parse(json);
```

The annotation replaces the unhelpful inferred `any` for this variable. TypeScript can now check later uses of `coordinates`, including its property names.

> **Aside: beware of `any`**
>
> `any` is a TypeScript type, just like `string` or `boolean`, but it means TypeScript has no useful type information for the value. It largely disables checking for operations involving that value.
>
> If `coordinates` is `any`, even an invalid access such as `coordinates.nonExistent` is accepted. This removes one of TypeScript's main protections, so avoid allowing values to remain `any`.
>
> An annotation restores compile-time checking of how our code uses the parsed value, but it does not validate the JSON at runtime. If the string comes from an untrusted or external source, its actual contents may still differ from the annotated structure.

### When annotations are required: delayed initialization

The second scenario is when a variable is declared first and assigned a value later. Because there is no initial value at the declaration, we provide the intended type explicitly:

```ts
const words = ["red", "green", "blue"];
let foundWord: boolean;

for (let i = 0; i < words.length; i++) {
  if (words[i] === "green") {
    foundWord = true;
  }
}
```

The `: boolean` annotation tells TypeScript what `foundWord` may contain before it sees the later assignment. TypeScript can then reject an incompatible assignment such as `foundWord = "yes"`.

An annotation does not initialize the variable—it only describes its allowed type. Code must still account for the possibility that no assignment occurs. In this example, `foundWord` remains uninitialized if the target word is absent. When an appropriate initial value exists, `let foundWord = false` would avoid that state and allow TypeScript to infer `boolean`; delayed initialization is useful when assigning a meaningful value immediately is not possible.

### When annotations are required: inference is too narrow

The third scenario is a variable intentionally designed to hold more than one type:

```ts
const numbers = [-10, -1, 12];
let numberAboveZero: boolean | number = false;

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > 0) {
    numberAboveZero = numbers[i];
  }
}
```

Without an annotation, TypeScript sees the initial value `false` and infers `boolean`. Assigning a number later would then be an error, even though the program deliberately uses:

- `false` to mean that no positive number has been found
- A `number` when a positive number is found

The `|` means **or**. The annotation `boolean | number` is a **union type**, so `numberAboveZero` may contain either a boolean or a number. Here, the explicit annotation broadens the type beyond what TypeScript could infer from the initial value alone.

<a id="function-annotations"></a>

## `features/annotations/functions.ts` — Annotating functions

Type annotations for functions tell TypeScript:

- What type of value each parameter will receive
- What type of value the function will return

The first example is:

```ts
const add = (a: number, b: number): number => {
  return a + b;
};
```

This annotates the function itself:

- `a: number` says the `a` parameter must be a number.
- `b: number` says the `b` parameter must be a number.
- `: number` after the parameter list says the function must return a number.

This differs from the earlier example:

```ts
const logNumber: (i: number) => void = (i: number) => {
  console.log(i);
};
```

There, `(i: number) => void` annotates the **variable** `logNumber` with the kind of function it may reference. In `add`, the annotations are attached directly to the function's parameters and return value.

### Function inference

TypeScript can inspect a function's `return` statements and infer its return type. For `return a + b`, it can determine that `add` returns a number once it knows that both parameters are numbers.

TypeScript generally does not infer standalone function parameter types from the function body. Parameters therefore need annotations unless their types are supplied by some surrounding context.

Although TypeScript can infer return types, the course recommends explicitly annotating them too. Inference describes what the implementation actually does, which may differ from what the developer intended:

```ts
const subtract = (a: number, b: number) => {
  a - b;
};
```

The missing `return` is a developer mistake. TypeScript correctly infers `void` because the function does not return a value, but inference does not know that the developer intended to return a number.

Adding a return annotation turns that intention into a contract:

```ts
const subtract = (a: number, b: number): number => {
  a - b; // Error: a function declared to return number returns nothing
};
```

The compiler now exposes the missing `return`. The course's rule is therefore: **always annotate function parameters and return values.** Parameter annotations supply information TypeScript usually cannot infer, while return annotations help catch implementations that do not match their intended result.

### Anonymous function annotations

An anonymous function has no name of its own and is often assigned to a variable. Its parameters and return value are annotated in the same positions as a named function declaration:

```ts
const multiply = function (a: number, b: number): number {
  return a * b;
};
```

- Parameter annotations follow each parameter name.
- The return annotation follows the closing parenthesis.
- `multiply` is the variable's name; the function expression after `=` is anonymous.

### `void` and `never`

`void` describes a function that completes without returning a useful value:

```ts
const logger = (message: string): void => {
  console.log(message);
};
```

At runtime, a JavaScript function with no `return` statement evaluates to `undefined`. With modern strict null checking, `null` is distinct from `void`; older or non-strict TypeScript configurations may allow `null` in places where they otherwise would not.

`never` describes a function that cannot complete normally—it never reaches a point where it returns to its caller. A function that always throws is the standard example:

```ts
const throwError = (message: string): never => {
  throw new Error(message);
};
```

This is a special case. A function that throws only on one path but returns normally on another should use the type of its normal return value, not `never`:

```ts
const throwError = (message: string): string => {
  if (!message) {
    throw new Error(message);
  }

  return message;
};
```

The throwing path does not add another return type. This function is annotated as `string` because every path that completes normally returns a string.

### Destructured parameters

ES2015 destructuring and TypeScript annotations remain separate. Replace the ordinary parameter name with a destructuring pattern, then place the type annotation after that entire pattern:

```ts
const logWeather = (
  { date, weather }: { date: Date; weather: string }
): void => {
  console.log(date);
  console.log(weather);
};
```

The two neighboring object-shaped pieces serve different purposes:

- `{ date, weather }` is JavaScript destructuring. It extracts the two properties into local variables.
- `: { date: Date; weather: string }` is the TypeScript annotation. It describes the object accepted by the function.
- The final `: void` annotates the function's return value.

Without destructuring, the same parameter type could be written as:

```ts
const logWeather = (
  forecast: { date: Date; weather: string }
): void => {
  console.log(forecast.date);
  console.log(forecast.weather);
};
```

<a id="object-annotations"></a>

## `features/annotations/objects.ts` — Object annotations

TypeScript can infer the shape of an object literal, including nested objects and methods:

```ts
const profile = {
  name: "alex",
  age: 20,
  coords: {
    lat: 0,
    lng: 15,
  },
  setAge(age: number): void {
    this.age = age;
  },
};
```

When destructuring an object with an explicit annotation, the destructuring pattern comes first and the type describing that pattern follows it:

```ts
const { age }: { age: number } = profile;
```

Nested destructuring follows the same rule:

```ts
const {
  coords: { lat, lng },
}: {
  coords: {
    lat: number;
    lng: number;
  };
} = profile;
```

The type annotation mirrors the object structure being destructured. Here, the destructuring pattern reaches through `coords` to extract `lat` and `lng`, so the annotation describes a `coords` property containing numeric `lat` and `lng` properties.

The syntax is visually dense because two similar structures appear beside each other:

- `{ coords: { lat, lng } }` performs the JavaScript destructuring.
- `{ coords: { lat: number; lng: number } }` describes the TypeScript type.

They resemble each other, but the first is executable JavaScript and the second is compile-time type information.

<a id="typed-arrays"></a>

## `features/arrays.ts` — Typed arrays

A **typed array** is an array whose elements are expected to have a consistent type.

When an array is initialized with elements, TypeScript can infer the element type:

```ts
const carMakers = ["ford", "toyota", "chevy"]; // string[]
const dates = [new Date(), new Date()];         // Date[]
```

The `[]` in a type means “array of,” so:

- `string[]` means an array of strings.
- `Date[]` means an array of `Date` objects.

An empty array provides no elements from which to infer the intended type. In that situation, use an explicit annotation:

```ts
const carMakers: string[] = [];
```

Without useful context, an empty array may receive an overly broad type such as `any[]` in the course configuration, losing protection against inserting the wrong kinds of values. Compiler settings and context can affect the precise inferred empty-array type, but the practical rule remains: annotate an empty array when its intended element type is known.

### Multidimensional arrays

Each additional pair of brackets represents another array level:

```ts
const carsByMake = [["f150"], ["corolla"], ["camaro"]];
// inferred as string[][]
```

Read `string[][]` as “an array of arrays of strings”:

```text
string[][] → outer array → inner string[] arrays → string elements
```

### Why typed arrays matter

Knowing an array's element type lets TypeScript carry useful information through common array operations.

**Inference when extracting values**

```ts
const car = carMakers[0];
const myCar = carMakers.pop();
```

TypeScript knows that values obtained from `carMakers` are strings. An operation such as `pop()` can also produce `undefined` when the array is empty; whether that possibility appears in all indexed-access types depends on the compiler's strictness settings.

**Preventing incompatible additions**

```ts
carMakers.push(100); // Error: number is not assignable to string
```

Because `carMakers` is a `string[]`, TypeScript prevents a number from being added accidentally.

**Help inside array callbacks**

```ts
carMakers.map((car: string): string => {
  return car.toUpperCase();
});
```

Array methods such as `map`, `forEach`, and `filter` know the array's element type. That gives their callback parameters useful checking and autocomplete. In this example, TypeScript can already infer that `car` is a string from `carMakers`, though the course's explicit function-annotation style makes the contract visible.

### Arrays with multiple element types

Typed arrays are not limited to one possible element type. A union can deliberately allow several:

```ts
const importantDates: (Date | string)[] = [
  new Date(),
  "2030-10-10",
];
```

Read `(Date | string)[]` as “an array whose elements may be a `Date` or a `string`.” The parentheses group the union before `[]` makes it an array type.

Both permitted types can be added:

```ts
importantDates.push("2030-10-10");
importantDates.push(new Date());
```

Other types are still rejected:

```ts
importantDates.push(100); // Error: number is not Date or string
```

The array is flexible but remains type-safe because its allowed element types are explicitly limited.

### When to use an array

Use an array to represent a collection of similar records where the order is not tied to a fixed meaning for each position. The collection may be sorted or rearranged, but an item remains the same kind of item regardless of its index.

TypeScript also provides **tuples**, a similar-looking structure where each position has a particular meaning and type. The next lesson will introduce tuples and clarify when to choose a tuple instead of an array.
