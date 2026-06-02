import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dir = path.dirname(fileURLToPath(import.meta.url))

export async function setupTestBrinsFixture() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dir, 'create_test_brins_fixture.rb')
    const ruby = spawn('ruby', [scriptPath])

    let stderr = ''

    ruby.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    ruby.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Ruby script failed with code ${code}: ${stderr}`))
      } else {
        resolve()
      }
    })
  })
}
