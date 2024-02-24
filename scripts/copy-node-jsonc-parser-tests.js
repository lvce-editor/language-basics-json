import { execaCommand } from 'execa'
import path, { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const REPO = 'https://github.com/microsoft/node-jsonc-parser'
const COMMIT = 'b6b34ba39da3f5bee17d41004c03a86686dade4c'

const getTestName = (line) => {
  return (
    'node-jsonc-parser-' +
    line
      .toLowerCase()
      .trim()
      .replaceAll(' ', '-')
      .replaceAll('/', '-')
      .replaceAll(':', '-')
      .replaceAll(',', '-')
      .replaceAll('--', '-')
  )
}

const trimLine = (line) => {
  return line.trim()
}

let context = ''
let index = 0

const prefixes = [
  'assertKinds',
  'assertScanError',
  'assertValidParse',
  'assertInvalidParse',
  'assertLocation',
  'assertTree',
  'assertVisit',
  'assertNodeAtLocation',
  'assertMatchesLocation',
]

const getTestContents = (line) => {
  if (line.startsWith("test('")) {
    const startIndex = "test('".length
    const endIndex = line.indexOf("'", startIndex)
    context = line.slice(startIndex, endIndex)
    index = 0
    return []
  }
  for (const prefix of prefixes) {
    if (line.startsWith(`${prefix}('`)) {
      const startIndex = `${prefix}('`.length
      const endIndex = line.indexOf("'", startIndex)
      const testContent = line.slice(startIndex, endIndex)
      return [
        {
          testName: getTestName(`${context}-${index++}`),
          testContent,
        },
      ]
    }
  }
  return []
}

const parseContent = (content) => {
  const lines = content.split('\n').map(trimLine)
  const testContents = lines.flatMap(getTestContents)
  return testContents
}

const getAllTests = async (folder) => {
  const filePath = join(folder, 'src', 'test', 'json.test.ts')
  const content = await readFile(filePath, 'utf8')
  const allTests = parseContent(content)
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
  await execaCommand(`git clone ${REPO} .tmp/node-jsonc-parser`)
  process.chdir(`${root}/.tmp/node-jsonc-parser`)
  await execaCommand(`git checkout ${COMMIT}`)
  process.chdir(root)
  const allTests = await getAllTests(`${root}/.tmp/node-jsonc-parser`)
  await writeTestFiles(allTests)
}

main()
