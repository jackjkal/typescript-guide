# TypeScript Course Notes

## `fetchjson` — First look at TypeScript

This example makes an HTTP request with Axios and logs the returned JSON. Its main purpose is to show the basic TypeScript workflow rather than to introduce lots of new syntax.

### What TypeScript is doing

- TypeScript checks the `.ts` source during development/compilation and reports type-related mistakes before the program runs.
- TypeScript code is converted to JavaScript because Node.js and browsers ultimately execute JavaScript, not TypeScript's type system.
- Type annotations and other type-only information are removed during compilation; they do not perform runtime validation.
- TypeScript can infer many types from context, so useful checking does not always require explicit type annotations. For example, `url` is inferred to be a string.
- Libraries can provide type declarations that describe their JavaScript APIs. That information enables autocomplete and helps TypeScript check calls such as `axios.get(url)`.

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
