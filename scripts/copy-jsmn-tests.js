import { execaCommand } from 'execa'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const REPO = 'https://github.com/zserge/jsmn'
const COMMIT = '25647e692c7906b96ffd2b05ca54c097948e879c'

const getTestName = (index) => {
  return 'jsmn-' + index + ''
}

const trim = (line) => {
  return line.trim()
}

const getAllTests = async (file) => {
  const content = await readFile(file, 'utf8')
  const lines = content.split('\n')
  const trimmedLines = lines.map(trim)
  const allTests = []
  for (const line of trimmedLines) {
    // console.log({ trimmedLines })
    const checkParseIndex = line.indexOf('check(parse("')
    if (checkParseIndex === -1) {
      continue
    }
    const start = checkParseIndex + 'check(parse("'.length
    let end = start
    console.log({ line })
    while (++end < line.length) {
      const char = line[end]
      if (char === '\\') {
        end++
      } else if (char === '"') {
        break
      }
    }
    const content = line
      .slice(start, end)
      .replaceAll('\\"', '"')
      .replaceAll('\\\\', '\\')
      .replaceAll('\\n', '\n')
    allTests.push({
      testName: getTestName(allTests.length + 1),
      testContent: content,
    })
  }
  return allTests
}

const writeTestFiles = async (allTests) => {
  for (const test of allTests) {
    await writeFile(
      `${root}/test/cases/${test.testName}.json`,
      test.testContent,
    )
  }
}

const main = async () => {
  process.chdir(root)
  await rm(`${root}/.tmp`, { recursive: true, force: true })
  await execaCommand(`git clone ${REPO} .tmp/jsmn`)
  process.chdir(`${root}/.tmp/jsmn`)
  await execaCommand(`git checkout ${COMMIT}`)
  process.chdir(root)
  await cp(`${root}/.tmp/jsmn/test`, `${root}/.tmp/jsmn-test`, {
    recursive: true,
  })
  const allTests = await getAllTests(`${root}/.tmp/jsmn-test/tests.c`)
  await writeTestFiles(allTests)
}

main()
