import { execaCommand } from 'execa'
import path, { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const REPO = 'https://github.com/SwiftyJSON/SwiftyJSON'
const COMMIT = '58391413ad113d98ea7f434354dceb8cb751b54e'

const getAllTests = async (folder) => {
  const file = join(folder, 'Tests.json')
  const testContent = await readFile(file, 'utf8')
  const testName = 'swifty'
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
  await execaCommand(`git clone ${REPO} .tmp/swifty-json`)
  process.chdir(`${root}/.tmp/swifty-json`)
  await execaCommand(`git checkout ${COMMIT}`)
  process.chdir(root)
  await cp(
    `${root}/.tmp/swifty-json/Tests/Tes`,
    `${root}/.tmp/swifty-json-tests`,
    {
      recursive: true,
    },
  )
  const allTests = await getAllTests(`${root}/.tmp/swifty-json-tests`)
  await writeTestFiles(allTests)
}

main()
