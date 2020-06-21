# Solution - Tennis Calculator

This is written using [Deno](https://deno.land), a Node.js-like runtime with built-in TypeScript support. It also replaces npm & package.json with URL-based module loading.

### Editor support

There's a VS Code plugin for Deno to support module loading, typings and other features it implements. I'd recommend you install it if you'd like to explore the code, otherwise, you'll see error messages in your editor.

## Execution

To run the program with `full_tournament.txt`, run:

```
deno run --allow-read src/main.ts full_tournament.txt
```

The program will then ask the user to enter a query, and also show what queries are possible. The user can enter as many different queries as they like until they press return without writing a query (or write an invalid query).

I believe this diverges from the example input command provided in the problem definition, where it's expecting you to give it a file name and then a list of queries to run which are then printed out sequentially. I've done this on purpose as I feel it's more flexible and easier to use.

_Note_: The `--allow-read` flag allows our code to access the file system which is needed to access `full_tournament.txt`.

## Testing

```
deno test
```

_Note_: I haven't written tests for `main.ts` primarily because Deno's test framework isn't advanced enough to support CLI testing yet _(lacks the ability to spawn processes then send them input and read their output)_.

`main.ts` only reads a file and then based on user input, runs the core functions to print out the results. Testing that flow doesn't bring much value to us either, as the logic/functions to extract tournament results from a string is the core of the program which we've tested end to end.

To learn more about Deno's built-in test framework, please visit [https://deno.land/manual/testing](https://deno.land/manual/testing).

## Installing Deno

Shell (Mac, Linux):

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

PowerShell (Windows):

```
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

Homebrew (Mac):

```
brew install deno
```

For more info, please visit [https://deno.land/#installation](https://deno.land/#installation).
