import { CException } from "@mmk21/c"
import { For } from "voby"
import iconOctagonX from "../icons/octagon-x"

export interface ProgramOutputData {
  output: string
  exceptions: CException[]
}

export default function ProgramOutput({ data }: { data: ProgramOutputData }) {
  return (
    <div class="flex flex-col items-center">
      <pre class="overflow-auto leading-none py-2">{data.output}</pre>
      <For values={data.exceptions}>
        {(exception) => (
          <div role="alert" class="alert alert-error max-w-5xl">
            {iconOctagonX}
            <span>
              <strong>{exception.name}</strong>: {exception.message}
            </span>
          </div>
        )}
      </For>
    </div>
  )
}
