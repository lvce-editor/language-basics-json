import { execaCommand } from 'execa'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const REPO = 'https://github.com/json-parser/json-parser'
const COMMIT = '90f94ae175b2a25a034909efe26f56bab55c43d9'

const getTestName = (line) => {
  return (
    'json-parser-' +
    line.toLowerCase().trim().replaceAll(' ', '-').replaceAll('/', '-')
  )
}

const getAllTests = async (folder) => {
  const dirents = await readdir(folder, { recursive: true })
  const allTests = []
  for (const dirent of dirents) {
    if (!dirent.endsWith('.json')) {
      continue
    }
    const filePath = `${folder}/${dirent}`
    const testName = getTestName(dirent)
    const fileContent = await readFile(filePath, 'utf8')
    allTests.push({
      testName,
      testContent: fileContent,
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
  await execaCommand(`git clone ${REPO} .tmp/json-parser`)
  process.chdir(`${root}/.tmp/json-parser`)
  await execaCommand(`git checkout ${COMMIT}`)
  process.chdir(root)
  await cp(`${root}/.tmp/json-parser/tests`, `${root}/.tmp/json-parser-tests`, {
    recursive: true,
  })
  const allTests = await getAllTests(`${root}/.tmp/json-parser-tests`)
  await writeTestFiles(allTests)
}

main()
