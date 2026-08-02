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

<a id="tuples"></a>

## `features/tuples.ts` — Tuples and type aliases

A **tuple** is an array-like structure in which each position represents a particular property of a record. Its positions have a fixed order and may have different types.

Tuple values look exactly like array literals at runtime. Without a tuple annotation, TypeScript infers an ordinary mixed-type array:

```ts
const pepsi = ["brown", true, 40];
// inferred as (string | number | boolean)[], not as a tuple
```

That inferred array type permits any length and allows its three types in any position. The tuple behavior comes from the explicit tuple type.

For a drink with a color, carbonation status, and sugar content:

```ts
const pepsi: [string, boolean, number] = ["brown", true, 40];
```

The tuple type fixes the meaning and type of each position:

```text
index 0 → color       → string
index 1 → carbonated  → boolean
index 2 → sugar       → number
```

Unlike a mixed-type array such as `(string | boolean | number)[]`, the tuple does not allow those types in arbitrary positions. A boolean must occupy the second position, for example.

An object expresses the same record with visible property labels:

```ts
const pepsi = {
  color: "brown",
  carbonated: true,
  sugar: 40,
};
```

The object is more self-documenting because its property names travel with its values. A basic tuple instead preserves their meaning through a fixed positional convention. Tuples are useful when that compact, fixed-order representation is desired; objects are often clearer when descriptive field names matter.

### Type aliases

A **type alias** gives a reusable name to a type. Instead of repeating `[string, boolean, number]` for every drink, define it once:

```ts
type Drink = [string, boolean, number];

const pepsi: Drink = ["brown", true, 40];
const sprite: Drink = ["clear", true, 40];
const tea: Drink = ["brown", false, 0];
```

`Drink` is now another way to refer to that tuple type. It does not create a runtime value or a new JavaScript data structure; it is reusable compile-time type information. Type aliases will be covered in more detail later.

### When to use a tuple

Tuples can be useful when working with inherently positional data, such as rows read from a CSV file. In ordinary application code, however, their meaning can be difficult to see:

```ts
const carSpecs: [number, number] = [400, 3354];
```

The type guarantees two numbers, but a developer cannot tell at a glance what `400` and `3354` represent. Understanding the record requires remembering or looking up the positional convention.

An object makes the same data self-documenting:

```ts
const carStats = {
  horsepower: 400,
  weight: 3354,
};
```

The property names communicate the meaning of each value wherever the record is used. The course's practical recommendation is therefore to prefer JavaScript objects when modeling records, even in TypeScript. Reserve tuples for cases where a compact positional format is genuinely useful or imposed by the data source.

<a id="interfaces-and-classes"></a>

## Interfaces and classes

An **interface** declares a named object type by describing:

- The property names an object must provide
- The type of value stored in each property
- As later lessons will show, the methods the object can provide

Interfaces let us define types for the structures used by our own application, much as built-in types such as `string` and `boolean` describe built-in values.

The interplay between interfaces and classes will be a major source of code reuse in TypeScript. An interface can describe the capability or structure that code requires, while classes can provide concrete implementations matching that description. This lesson is only an introduction; later examples will develop that relationship.

### The problem with repeated inline object types

The first vehicle example uses an inline object annotation:

```ts
const oldCivic = {
  name: "civic",
  year: 2000,
  broken: true,
};

const printVehicle = (vehicle: {
  name: string;
  year: number;
  broken: boolean;
}): void => {
  console.log(`Name: ${vehicle.name}`);
  console.log(`Year: ${vehicle.year}`);
  console.log(`Broken? ${vehicle.broken}`);
};
```

This works: the parameter annotation tells TypeScript exactly which properties `printVehicle` needs. The downside is that the type is long and embedded directly in the function signature.

If several functions or variables need the same vehicle structure, repeating `{ name: string; year: number; broken: boolean }` creates duplication. An interface will let us give that object shape a meaningful, reusable name in the next lesson.

### Defining and using an interface

The repeated object shape can be extracted into an interface:

```ts
interface Vehicle {
  name: string;
  year: Date;
  broken: boolean;
  summary(): string;
}
```

Interface names conventionally use **UpperCamelCase** (also called PascalCase), as in `Vehicle`.

Defining `Vehicle` creates a reusable type name. It can be thought of loosely as a variable that refers to a type, with one important distinction: it belongs to TypeScript's type system and does not become a JavaScript value at runtime.

The function annotation becomes much shorter:

```ts
const printVehicle = (vehicle: Vehicle): void => {
  console.log(`Name: ${vehicle.name}`);
  console.log(`Year: ${vehicle.year}`);
  console.log(`Broken? ${vehicle.broken}`);
};
```

Wherever `Vehicle` appears as a type, it stands for the full required structure:

```ts
{
  name: string;
  year: Date;
  broken: boolean;
  summary(): string;
}
```

This removes duplication, gives the concept a meaningful name, and provides one place to update the shared contract.

### Object properties and function signatures

Interface properties are not limited to primitive types. They can refer to built-in objects, arrays, custom types, and other structures. Changing `year` from `number` to `Date` requires matching objects to provide a `Date`:

```ts
interface Vehicle {
  name: string;
  year: Date;
  broken: boolean;
  summary(): string;
}
```

An interface can also describe a method with a function signature:

```ts
summary(): string;
```

This says that a matching object must have a method named `summary` which takes no arguments and returns a string. The interface describes the method's contract, not its implementation.

The object supplies the implementation:

```ts
const oldCivic = {
  name: "civic",
  year: new Date(),
  broken: true,
  summary(): string {
    return `Name: ${this.name}`;
  },
};
```

Because `oldCivic` has all the required properties with compatible types—including the `summary` method—it can be passed to a function expecting a `Vehicle`.

### Structural typing and capability-based interfaces

The interface was reduced to the only capability the printing function actually needs:

```ts
interface Reportable {
  summary(): string;
}

const printSummary = (item: Reportable): void => {
  console.log(item.summary());
};
```

When `oldCivic` is passed to `printSummary`, TypeScript asks one essential question: **does this value contain a compatible `summary()` method?** The answer is yes, so the call is allowed.

This is **structural typing**. A value satisfies an interface by having at least the required structure; it does not need to explicitly declare that it implements the interface. Additional properties such as `name`, `year`, and `broken` do not prevent `oldCivic` from being used as a `Reportable`.

Once the interface describes only the ability to produce a summary, `Vehicle` is too specific a name. `Reportable` communicates the capability instead of tying the interface to one kind of object. Any otherwise unrelated object can be passed to `printSummary` if it supplies a compatible `summary()` method.

> **Aside: excess property checks**
>
> TypeScript generally allows an existing value to have more properties than an interface requires, as with `oldCivic` here. It may perform an additional “excess property” check when a fresh object literal is assigned or passed directly to a narrowly typed location. That special check catches likely typos, but it does not change the central structural-typing rule.

### Reusing one function across different objects

A drink has very different data from a vehicle, but it can provide the same `summary()` capability:

```ts
const drink = {
  color: "brown",
  carbonated: true,
  sugar: 40,
  summary(): string {
    return `My drink has ${this.sugar} grams of sugar`;
  },
};
```

Both `oldCivic` and `drink` satisfy `Reportable`, so the same function accepts either one:

```ts
printSummary(oldCivic);
printSummary(drink);
```

Their other properties do not need to match. `printSummary` depends only on the small common contract it actually uses:

```ts
interface Reportable {
  summary(): string;
}
```

This avoids writing separate `printVehicle()` and `printDrink()` functions that would perform the same operation. Interfaces encourage reusable, general-purpose functions by allowing them to depend on a capability instead of one specific kind of object.

The broader pattern is:

```text
different object shapes
        ↓
shared interface capability
        ↓
one reusable function
```

Here, “general-purpose” should not be confused with TypeScript **generics**, which are a separate language feature.

### Interfaces as gatekeepers

An interface can be thought of as a compile-time gatekeeper for a function:

```ts
const printSummary = (item: Reportable): void => {
  console.log(item.summary());
};
```

Before TypeScript permits a value through the `printSummary` gate, it checks that the value satisfies `Reportable`:

```text
oldCivic ─┐
          ├─ has summary(): string ─→ Reportable gate ─→ printSummary
drink ────┘
```

If a value lacks a compatible `summary()` method, TypeScript rejects the call. If it has that method, it passes the gate regardless of what other properties it contains.

In this context, saying an object “implements `Reportable`” means that its structure satisfies the interface. The `oldCivic` and `drink` object literals do not need an explicit `implements` declaration.

This gatekeeper pattern is a primary way interfaces promote reuse: write functions against small shared contracts, then allow many otherwise unrelated values to pass through by providing the required capabilities.

### General strategy for reusable TypeScript code

1. Define an interface describing only the properties or methods an operation requires.
2. Type the function's parameter with that interface.
3. Create objects or classes that satisfy the interface when they need to work with that function.

In abstract form:

```ts
interface XYZ {
  requiredCapability(): string;
}

const functionX = (value: XYZ): void => {
  console.log(value.requiredCapability());
};
```

Different values can now use the same function:

```text
object x ─┐
          ├─ satisfies XYZ ─→ functionX()
object y ─┘
```

The interface is the gatekeeper to the function. Objects satisfy it structurally by providing the required members; classes may additionally declare the relationship explicitly with `implements`. The reusable function remains concerned only with the shared contract, not with every detail of each concrete object or class.

<a id="classes"></a>

## `features/classes.ts` — Classes

A **class** is a blueprint for creating objects that represent a particular kind of thing. It can describe:

- **Fields:** values stored by each object
- **Methods:** functions that each object can perform

Calling a class with `new` creates an **instance** of that class:

```ts
class Vehicle {
  drive(): void {
    console.log("chugga chugga");
  }
}

const vehicle = new Vehicle();
vehicle.drive();
```

`Vehicle` is the class—the blueprint—while `vehicle` is a concrete object created from it. The instance has access to the `drive()` method defined by its class.

### Inheritance

TypeScript classes build on JavaScript's class and inheritance syntax while adding type checking and additional class features.

The `extends` keyword creates an inheritance relationship:

```ts
class Vehicle {
  drive(): void {
    console.log("chugga chugga");
  }

  honk(): void {
    console.log("beep");
  }
}

class Car extends Vehicle {
  drive(): void {
    console.log("vroom");
  }
}
```

- `Vehicle` is the **parent class**, **base class**, or **superclass**.
- `Car` is the **child class**, **derived class**, or **subclass**.
- A `Car` instance inherits the accessible members of `Vehicle`.

The child may use an inherited method without redefining it:

```ts
const car = new Car();
car.honk(); // inherited from Vehicle
```

It may also **override** an inherited method by defining its own compatible version:

```ts
car.drive(); // uses Car.drive() and prints "vroom"
```

Inheritance models an “is a” relationship: a `Car` is a specialized kind of `Vehicle`. Anything promised by the parent class is available on the child unless the child provides an override.

### Member visibility modifiers

Visibility modifiers are keywords placed on class fields or methods to restrict where they may be accessed:

- `public`: accessible anywhere. This is the default, so writing `public` is optional.
- `private`: accessible only within the class that declares the member—not from subclasses or outside code.
- `protected`: accessible within the declaring class and its subclasses, but not from outside code.

The lesson's example uses all three visibility levels:

```ts
class Vehicle {
  protected honk(): void {
    console.log("beep");
  }
}

class Car extends Vehicle {
  private drive(): void {
    console.log("vroom");
  }

  startDrivingProcess(): void {
    this.drive(); // Allowed: inside Car
    this.honk();  // Allowed: inherited protected method
  }
}

const car = new Car();
car.startDrivingProcess(); // Allowed: public by default
car.honk();                 // Error: honk is protected
```

The intentionally invalid calls demonstrate TypeScript's checks:

- `vehicle.honk()` and `car.honk()` are errors because outside code cannot call a protected method.
- `car.drive()` would be an error because outside code cannot call a private method.
- `startDrivingProcess()` can call both methods from an allowed location and provide a public entry point.

TypeScript's `private` and `protected` modifiers primarily communicate and enforce intended usage during type checking. They help prevent other developers from depending on internal implementation details, but should not be treated as an application security boundary.

> **Modern JavaScript clarification**
>
> JavaScript classes have evolved since the course was recorded. JavaScript now supports public class fields and runtime-enforced private elements written with `#`, such as `#drive()`. JavaScript still does not have TypeScript's `protected` modifier.
>
> TypeScript `private drive()` is generally **soft private**: TypeScript rejects improper access during type checking, but the emitted JavaScript member is not necessarily hidden at runtime. JavaScript `#drive()` is **hard private** and JavaScript itself prevents outside access. Choose `#` when runtime privacy is required; use TypeScript modifiers when compile-time API design is the goal.

### Class fields and constructors

A class field is a property stored on each instance. One way to initialize a field is directly in its declaration:

```ts
class Vehicle {
  color: string = "red";
}
```

When the value must be supplied while creating the instance, the special `constructor` method can initialize it instead:

```ts
class Vehicle {
  color: string;

  constructor(color: string) {
    this.color = color;
  }
}

const vehicle = new Vehicle("orange");
```

TypeScript provides a **parameter property** shortcut for that declaration-and-assignment pattern:

```ts
class Vehicle {
  constructor(public color: string) {}
}
```

Writing a visibility modifier on the constructor parameter makes TypeScript do three jobs:

1. Accept `color` as a constructor argument.
2. Declare `color` as an instance field.
3. Assign the argument to `this.color` automatically.

The result can be accessed on the instance because it is public:

```ts
const vehicle = new Vehicle("orange");
console.log(vehicle.color);
```

Visibility modifiers apply to fields as well as methods. Constructor parameter properties can therefore use `public`, `private`, or `protected`. Without one of these modifiers, `color: string` would be only an ordinary constructor parameter and would not automatically create `this.color`.

### Constructors in derived classes

If a child class does not define a constructor, constructing the child automatically forwards the arguments to the parent constructor. Because `Vehicle` requires a color, `Car` does too:

```ts
class Car extends Vehicle {}

const car = new Car("red");
```

If a derived class defines its own constructor, it must call `super()` before using `this`. `super()` invokes the parent class's constructor:

```ts
class Car extends Vehicle {
  constructor(
    public wheels: number,
    color: string,
  ) {
    super(color);
  }
}

const car = new Car(4, "red");
```

The parameters have intentionally different forms:

- `public wheels: number` creates and initializes a new `wheels` field belonging to `Car`.
- `color: string` is only a constructor parameter. It is forwarded to `super(color)` so `Vehicle` can initialize the `color` field that it owns.

Adding `public` to `color` in the child constructor would declare another parameter property on `Car`, unnecessarily duplicating the inherited field. Let the class responsible for declaring a field initialize it through its own constructor.

### Why classes matter

Classes and interfaces work together as a code-reuse strategy:

- An **interface** defines a shared contract or required capability.
- A **class** packages fields and method implementations into a reusable blueprint.
- Different classes can satisfy the same interface and therefore work with the same functions or other components.

```text
interface defines the contract
              ↓
classes provide implementations
              ↓
shared code works with the interface
```

The course will use classes heavily and connect them through interfaces. This encourages code to depend on small contracts instead of the internal details of particular implementations. Not every modern TypeScript application is class-heavy, but this class-and-interface style is central to the design patterns taught in the upcoming projects.

### End of the syntax overview

This concludes the introductory survey of TypeScript syntax. The next section applies these features through project-based design patterns. Because the course and its project dependencies are several years old, commands, library APIs, configuration defaults, and runtime behavior may differ from the recorded lessons; verify those details against the installed versions when problems arise.

<a id="maps-project"></a>

## `maps` — Maps application

The first project in the design-patterns portion of the course will:

1. Randomly generate a `User` and a `Company`.
2. Give each entity a location.
3. Display both entities as markers on a map in the browser.

The main learning goal is to practice using classes and interfaces together for code reuse. The user, company, and map-related pieces will have different responsibilities, while interfaces will provide the contracts that allow them to work together.

### Project setup

The supplied starter project lives in `maps` and contains its dependency manifest and lockfile. From the repository root, the setup commands are:

```sh
cd maps
npm install
npx parcel index.html
```

Run `npm install` before starting Parcel. The `npx` prefix executes the project's Parcel command without requiring a global installation.

### Parcel's role

Parcel is a web bundler and development tool. Starting it with the HTML entry point allows it to follow the page's referenced files, process TypeScript for the browser, bundle the application's dependencies, serve the result locally, and update the browser during development.

For this project, Parcel replaces the earlier direct Node execution workflow because the application must run in a browser and load browser-oriented dependencies. It temporarily hides much of the manual build configuration so the lessons can focus on TypeScript design. A later section will set up a TypeScript project more explicitly.

> **Compatibility watch**
>
> This starter comes from an older course and includes older dependencies, notably `faker` 4.1.0. Parcel is not currently listed in the starter's `package.json`, so running it through `npx` may fetch a much newer Parcel release than the course originally used. Treat differences in commands, module behavior, or library APIs as possible version mismatches rather than immediately assuming the lesson code is wrong.

### First Parcel build

The HTML file identifies both the browser entry page and the TypeScript entry module:

```html
<html>
  <body>
    <script type="module" src="./src/index.ts"></script>
  </body>
</html>
```

The source `index.html` points directly to `index.ts`. A browser does not compile that TypeScript itself. When Parcel is started with:

```sh
npx parcel index.html
```

Parcel:

1. Treats `index.html` as the application entry point.
2. Finds the referenced `./src/index.ts` dependency.
3. Transforms the TypeScript into browser-executable JavaScript.
4. Produces and serves an HTML/JavaScript build with the appropriate generated asset reference.
5. Starts a development server, normally at `http://localhost:1234`.

```text
index.html ──references──> src/index.ts
     │                          │
     └────── Parcel build ──────┘
                    ↓
          browser-ready HTML + JavaScript
                    ↓
            http://localhost:1234
```

The first TypeScript entry point confirms that the generated bundle executes in the browser:

```ts
console.log("Hello, world!");
```

Parcel does not need to permanently rewrite the source `index.html`; it transforms and serves the build output while the development server is running.

### Project structure: one primary class per file

The application will be split into a collection of focused source files. Each class will normally live in a file whose primary responsibility is to define and export that class:

```text
maps/
└── src/
    ├── index.ts
    └── User.ts
```

The first class file begins with:

```ts
class User {}
```

For this course, class-focused filenames use **UpperCamelCase/PascalCase**, matching the class name: `User` lives in `User.ts`. This makes the file's main export and purpose easy to identify. It is a project convention rather than a TypeScript language requirement; other codebases may use lowercase or kebab-case filenames.

Separating classes into files keeps responsibilities focused and makes them independently importable and reusable. `index.ts` serves as the application's entry point and will eventually create and connect instances of those classes.

The instructor is supplying the initial class breakdown for this project. In future applications, deciding which concepts deserve their own classes—and how those classes should collaborate—will be part of the design work.

### Importing Faker and missing type declarations

The `User` class will use the `faker` npm package to generate random fake data such as names and locations:

```ts
import faker from "faker";

class User {
  name: string;
  location: {
    lat: number;
    lng: number;
  };

  constructor() {}
}
```

TypeScript uses the same standard `import` syntax as modern JavaScript. The import identifies the runtime package, while TypeScript additionally looks for type declarations describing that package's API.

The errors in this version are intentional. In particular, TypeScript reports that it cannot find a declaration file for the `faker` module. The installed `faker` 4.1.0 package contains JavaScript but does not provide TypeScript declarations, so TypeScript can locate code to run without yet having type information with which to analyze that code. The next lesson will address that missing type information.

### Type declaration files for JavaScript libraries

TypeScript can use ordinary JavaScript from npm packages, local files, and other sources. The JavaScript contains the runtime implementation, but it may not contain enough information for TypeScript to check how the code is being used.

A **type declaration file**, normally ending in `.d.ts`, describes a JavaScript API to TypeScript. It can declare:

- The functions and classes a library exports
- The parameters accepted by its functions
- The return types of those functions
- The shapes of its objects and other public types

The declaration acts as an adapter between TypeScript application code and JavaScript library code:

```text
TypeScript application
        ↓ checked using
declaration file (.d.ts)
        ↓ describes
JavaScript library (.js)
        ↓ executes at runtime
```

The declaration file does not replace the JavaScript library and normally contains no runtime implementation. It gives the compiler and editor a typed description of code that still executes as JavaScript.

Libraries may bundle their own declarations, as Axios does, or require a separate community-maintained type package. The course's installed `faker` 4.1.0 package does not bundle declarations, so the upcoming solution uses `@types/faker` from **DefinitelyTyped**, the repository behind the `@types/*` package namespace.

### Reading Faker's declarations

Installing the compatible declaration package resolves the missing-types warning:

```sh
npm install @types/faker@5.5.9
```

Following the `faker` import with the editor's “Go to Definition” command opens its `index.d.ts`. The `.d.ts` suffix identifies a declaration file. It contains API descriptions rather than implementations, for example:

```ts
latitude(max?: number, min?: number, precision?: number): string;
longitude(max?: number, min?: number, precision?: number): string;
```

Declaration files can serve as useful API documentation: they reveal available functions, parameter types, return types, and object structures. They are especially useful alongside the library's official documentation, though declarations can occasionally be incomplete or out of sync with the runtime package.

The Faker declarations reveal that latitude and longitude are returned as strings, while this application wants numeric coordinates.

### Initializing the `User` fields

A field annotation describes a property's type but does not construct its runtime value:

```ts
location: {
  lat: number;
  lng: number;
};
```

Creating `new User()` does not automatically turn `location` into an object. Until the class assigns a meaningful value, reading an uninitialized field produces `undefined`; TypeScript's type syntax alone does not manufacture runtime data.

The constructor is responsible for initializing both fields:

```ts
constructor() {
  this.name = faker.name.firstName();
  this.location = {
    lat: parseFloat(faker.address.latitude()),
    lng: parseFloat(faker.address.longitude()),
  };
}
```

`parseFloat()` explicitly converts Faker's coordinate strings into the `number` values required by the `location` type. If a string cannot be parsed as a number, `parseFloat()` produces `NaN`, so external or untrusted strings may require additional runtime validation; Faker's coordinate methods are expected to produce numeric strings here.

### Exporting classes and using them from the entry point

A class-focused module normally defines and exports its class without also creating application instances:

```ts
// User.ts
export class User {
  // ...
}
```

A central entry point imports the building blocks and connects or uses them:

```ts
// index.ts
import { User } from "./User";

const user = new User();
console.log(user);
```

This separates definition from application setup: `User.ts` owns what a user is and how one is initialized, while `index.ts` decides when to create one. Parcel follows the import from the entry point and includes `User.ts` in the browser bundle. The generated user's data can then be inspected in the browser console.

### Named exports versus default exports

`User` is a **named export**, so its import uses curly braces:

```ts
export class User {}
import { User } from "./User";
```

A default export is imported without curly braces:

```ts
export default class User {}
import User from "./User";
```

The course adopts a convention of preferring named exports for our own TypeScript modules. Using one consistent style avoids having to remember which local imports require braces and keeps the imported name connected to the exported name.

This is not a TypeScript requirement or a universal TypeScript-community rule. Default exports are valid, and many projects use them. For third-party packages, use the import style supported by that package's exports and type declarations; the existing Faker import is a default import:

```ts
import faker from "faker";
```

### Modeling a company

The second map entity follows the same class-per-file pattern as `User`:

```ts
// Company.ts
import faker from "faker";

export class Company {
  companyName: string;
  catchPhrase: string;
  location: {
    lat: number;
    lng: number;
  };

  constructor() {
    this.companyName = faker.company.companyName();
    this.catchPhrase = faker.company.catchPhrase();
    this.location = {
      lat: parseFloat(faker.address.latitude()),
      lng: parseFloat(faker.address.longitude()),
    };
  }
}
```

`Company` and `User` contain different identifying data, but both initialize the same numeric `location` shape. The application entry point imports and creates one of each:

```ts
import { User } from "./User";
import { Company } from "./Company";

const user = new User();
const company = new Company();

console.log(user);
console.log(company);
```

The browser console now confirms that both independently generated entities are included in the Parcel bundle and created successfully.

### Loading the Google Maps JavaScript API

The page loads the Google Maps JavaScript API before loading the TypeScript application entry point:

```html
<script
  src="https://maps.googleapis.com/maps/api/js?key=<API_KEY>&callback=Function.prototype"
></script>
<script type="module" src="./src/index.ts"></script>
```

The first script is hosted by Google and makes the Maps JavaScript API available in the browser. The second script enters the local Parcel application. Keeping the Google script first ensures its global API is available before the application attempts to use it.

The API key selects and authorizes a Google Cloud project; it is not a TypeScript feature. Browser Maps keys are necessarily sent to clients, so their protection relies on restricting them to the required Google API and permitted website referrers. Do not commit an unrestricted personal key to a public repository.

The course supplies a shared pre-generated key for the exercise, but an older shared key may have expired, been revoked, exceeded its quota, or been restricted. If the map fails, inspect the browser console for a Google Maps authentication or billing error before debugging the TypeScript code.

### Adding types for the global `google.maps` API

Loading the Google Maps script creates a runtime global named `google`, but that script does not automatically tell TypeScript about the global's structure. The installed `@types/google.maps` package supplies the declarations, and the lesson explicitly includes them at the top of the entry file:

```ts
/// <reference types="@types/google.maps" />
```

A triple-slash `types` directive is a compiler instruction that declares a dependency on a type declaration package. It is conceptually similar to importing type information, but it emits no JavaScript and does not load the Google Maps runtime script. The HTML `<script>` element remains responsible for the runtime API; the directive is only for compile-time checking and editor assistance.

Triple-slash directives must appear at the top of the file before executable statements. With the declarations included, TypeScript can recognize names under `google.maps` and provide checking and autocomplete for the Maps API.

### Reading the `google.maps.Map` declaration

The Google Maps declaration file is another source of API documentation:

```text
node_modules/@types/google.maps/index.d.ts
```

Its `Map` declaration includes inheritance and constructor information:

```ts
export class Map extends google.maps.MVCObject {
  constructor(mapDiv: HTMLElement, opts?: google.maps.MapOptions);
}
```

This tells us that:

- `Map` inherits from `google.maps.MVCObject`.
- Its first constructor argument must be an `HTMLElement` in which the map can render.
- Its second `MapOptions` argument is optional, as indicated by `?`.

The HTML therefore needs a map container:

```html
<div id="map" style="height: 100%;"></div>
```

The application retrieves it and passes it to the constructor:

```ts
new google.maps.Map(
  document.getElementById("map") as HTMLElement
);
```

`document.getElementById()` has the type `HTMLElement | null` because the requested element might not exist. The Maps constructor accepts only `HTMLElement`, so TypeScript reports an error until the nullable possibility is handled.

`as HTMLElement` is a **type assertion**: it tells TypeScript that we know this result is an element. It does not create the element, check the DOM, or prevent `null` at runtime. The assertion is reasonable only because the matching element is deliberately present in the HTML; an explicit null check would provide stronger runtime protection.

### Initializing the map

The completed constructor call supplies both the map container and its initial options:

```ts
new google.maps.Map(document.getElementById("map") as HTMLElement, {
  zoom: 1,
  center: {
    lat: 0,
    lng: 0,
  },
});
```

- The first argument identifies the DOM element that Google Maps should fill.
- `zoom` controls the initial map scale; `1` shows a broad view of the world.
- `center` supplies the initial latitude and longitude.
- The options object is checked against the `google.maps.MapOptions` type discovered in the declaration file.

The map container also needs a nonzero height in the HTML. With `height: 100%`, the initialized map is visible in the browser rather than rendering into a zero-height `div`.

### Hiding the third-party map behind our own class

The raw `google.maps.Map` object exposes a large API. If it remains directly available throughout the application, any code can call any of its methods, including operations the application did not intend to support.

The planned refactor introduces an application-owned map class that creates and stores the Google map internally:

```text
application code
      ↓ uses a small supported API
our map wrapper
      ↓ delegates internally
google.maps.Map
```

This wrapper acts as a controlled boundary:

- Application code sees only the operations our class deliberately exposes.
- Google-specific construction and configuration live in one place.
- Other developers are guided away from calling arbitrary Google Maps methods directly.
- If the third-party API or initialization changes, fewer application files need to change.

This is encapsulation rather than a security mechanism. The goal is to reduce accidental misuse and coupling by hiding implementation details behind a smaller, application-specific API. The concern is deliberately simple in this project, but the pattern becomes valuable when wrapping large or unstable third-party libraries.

The wrapper is implemented in its own class module:

```ts
export class CustomMap {
  private googleMap: google.maps.Map;

  constructor(divId: string) {
    this.googleMap = new google.maps.Map(
      document.getElementById(divId) as HTMLElement,
      {
        zoom: 1,
        center: {
          lat: 0,
          lng: 0,
        },
      },
    );
  }
}
```

The `private googleMap` field holds the real third-party map. Outside code cannot access that field through TypeScript, so it no longer sees the full `google.maps.Map` API. Only methods intentionally added to `CustomMap` will become part of the application's supported map API.

The constructor accepts a `divId: string` rather than hard-coding `"map"`. This makes the wrapper reusable with any appropriately configured HTML container:

```ts
const customMap = new CustomMap("map");
```

The entry point now depends on `CustomMap` instead of constructing a Google map directly. This significantly reduces the API surface visible to the rest of the application and makes the intended operations clearer to other engineers.

### Preparing to add markers: classes as values and types

`CustomMap` imports both entity classes as it begins adding marker operations:

```ts
import { Company } from "./Company";
import { User } from "./User";
```

A TypeScript class has a dual nature:

- As a **runtime value**, it is a constructor that can create instances: `new User()`.
- As a **type**, its name describes instances of that class: `user: User`.

This is why the same imported class name can be used both in executable code and in a type annotation. TypeScript has other declarations that occupy the value space, type space, or both; later lessons will explore that distinction further.

The intentionally poor first design creates separate marker methods for users and companies:

```ts
addUserMarker() {}
addCompanyMarker() {}
```

Both operations are expected to perform almost the same work, so their separate methods will create duplication. The implementation is being written this way first so the later interface-based refactor has a concrete design problem to solve.

> **Compatibility watch: legacy markers**
>
> The course uses `new google.maps.Marker(...)`. Google deprecated that class in February 2024 in favor of `google.maps.marker.AdvancedMarkerElement`. The legacy class still works and Google has not scheduled its removal, so it can be used temporarily to follow the course's TypeScript refactor.
>
> A modern migration adds unrelated setup: the marker library must be loaded and the map must have a map ID. To keep the design-pattern lesson focused, it is reasonable to finish the interface refactor with the legacy API and modernize the marker implementation separately afterward.

### Adding the first legacy marker

The first intentionally specific method accepts a `User` instance:

```ts
addUserMarker(user: User): void {
  new google.maps.Marker({
    map: this.googleMap,
    position: {
      lat: user.location.lat,
      lng: user.location.lng,
    },
  });
}
```

The legacy marker constructor receives an options object containing:

- `map`: the private Google map on which the marker should appear.
- `position`: the latitude and longitude taken from the supplied user.

The entry point creates the collaborating objects and passes the user to the wrapper:

```ts
const user = new User();
const customMap = new CustomMap("map");

customMap.addUserMarker(user);
```

The marker now appears at the randomly generated user's location in the browser. The empty `addCompanyMarker()` method remains as the duplicated implementation path that the upcoming refactor will address.

### Completing the intentionally duplicated implementation

The company-specific method repeats the same marker construction:

```ts
addCompanyMarker(company: Company): void {
  new google.maps.Marker({
    map: this.googleMap,
    position: {
      lat: company.location.lat,
      lng: company.location.lng,
    },
  });
}
```

The entry point now displays both generated locations:

```ts
customMap.addUserMarker(user);
customMap.addCompanyMarker(company);
```

Both markers work, but the two methods differ only in their parameter names and types. Each one reads the same `location.lat` and `location.lng` structure and performs the same Google Maps operation.

```text
addUserMarker(user)       ─┐
                           ├─ same marker creation logic
addCompanyMarker(company) ─┘
```

This duplication makes `CustomMap` harder to extend: every new mappable entity would appear to require another nearly identical method. The next lesson will refactor around the shared structure required to place any entity on the map.

### First refactor: a union parameter

The two marker methods can be combined by allowing the parameter to be either entity type:

```ts
addMarker(mappable: User | Company): void {
  new google.maps.Marker({
    map: this.googleMap,
    position: {
      lat: mappable.location.lat,
      lng: mappable.location.lng,
    },
  });
}
```

The `|` creates a union: `mappable` may be a `User` **or** a `Company`. Until code determines which member of the union it received, TypeScript permits direct access only to properties that are safe on every possible type.

```text
User properties:       name, location
Company properties:    companyName, catchPhrase, location
Safe without narrowing:                    location
```

That is why VS Code autocomplete shows only `location` after typing `mappable.`. A user-specific property such as `name` is unsafe because the value might be a company; a company-specific property such as `companyName` is unsafe because it might be a user. Accessing those properties would require first narrowing the union to a particular member.

This removes the duplicated marker logic, but the design still does not scale. `CustomMap` must import every supported class and list it in the union:

```ts
User | Company | CarLot | Park
```

Every new mappable entity would require editing `CustomMap`, even though the method cares only about the shared `location` structure. The next refactor will remove that unnecessary knowledge of concrete classes.
