import { execaCommand } from 'execa'
import { readFile, rm, writeFile } from 'node:fs/promises'
import path, { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const REPO = 'https://github.com/zemirco/sf-city-lots-json'
const COMMIT = '33c27c137784a96d0fbd7f329dceda6cc7f49fa3'

const getAllTests = async (folder) => {
  const testName = 'sf-city-lots'
  const path = join(folder, 'citylots.json')
  const testContent = await readFile(path, 'utf8')
  const allTests = [
    {
      testName,
      testContent,
    },
  ]
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
  await execaCommand(`git clone ${REPO} .tmp/sf-city-lots`)
  process.chdir(`${root}/.tmp/sf-city-lots`)
  await execaCommand(`git checkout ${COMMIT}`)
  process.chdir(root)
  const allTests = await getAllTests(`${root}/.tmp/sf-city-lots`)
  await writeTestFiles(allTests)
}

main()
