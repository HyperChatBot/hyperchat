import path from 'path'
import fs from 'fs'
import process from 'process'
import { capitalCase } from 'capital-case'

const files = fs.readdirSync('./src/assets/svgs')

files.forEach((file) => {
  if (file.endsWith('.svg')) {
    const data = fs.readFileSync(
      path.join(process.cwd(), 'src/assets/svgs', file),
      'utf-8'
    )

    const name = capitalCase(file.split('.')[0]).split(' ').join('') + 'Icon'

    const text = `
import { FC } from 'react'

const ${name}: FC = () => (
    ${data}
  )
  
  export default ${name}`

  fs.writeFileSync(path.join(process.cwd(), 'src/assets/svgs', file), text)

  fs.renameSync(file, `${name}.tsx`)
  }



//   fs.renameSync()
})
