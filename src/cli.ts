#!/usr/bin/env node
import { parseArgs, ParseArgsConfig } from "node:util"

const argsConfig: ParseArgsConfig = {
  allowPositionals: true,
  strict: true,
  options: {},
}

export function run() {
  const args = parseArgs(argsConfig)
  const sourceFile = args.positionals.at(0)
  if (!sourceFile) {
    console.error("Provide a path to a C program to run.")
    console.error(`Usage: ${process.argv0} ${process.argv[1]} <file>`)
    process.exit(1)
  }
  console.log(`Running C program: ${sourceFile}`)
}

if (process.argv[1] === import.meta.filename) {
  run()
}
