import jwt from 'jsonwebtoken'
import { sleep } from './utils.js'

const secret = 'secret'

async function test() {
    const data = { name: 'test' }
    const expiresIn = '2s'
    const token = jwt.sign(data, secret, { expiresIn })
    console.log(token)
    await sleep(3000)
    const decoded = jwt.decode(token, secret)
    console.log(decoded)
}


test()