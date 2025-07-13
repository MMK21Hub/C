#!/usr/bin/env node
import { readFile } from "node:fs/promises"
import { parseArgs, ParseArgsConfig } from "node:util"
import { Interpreter } from "./interpreter.js"

const argsConfig: ParseArgsConfig = {
  allowPositionals: true,
  strict: true,
  options: {},
}

export async function run() {
  const args = parseArgs(argsConfig)
  const sourceFile = args.positionals.at(0)
  if (!sourceFile) {
    console.error("Provide a path to a C program to run.")
    console.error(`Usage: ${process.argv0} ${process.argv[1]} <file>`)
    process.exit(1)
  }

  const fileData = await readFile(sourceFile, "utf-8").catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
  const interpreter = new Interpreter()
  interpreter.run(fileData)
  console.log(interpreter.boardToFormattedString())
}

if (process.argv[1] === import.meta.filename) {
  run()
}
