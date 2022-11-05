import { appendFile} from "fs/promises";

const promiseFunc = (value: number) => {
    return new Promise<void>((resolve, reject) => {
        const now = new Date()
        if (now.getSeconds() % 3) {
            console.log('Hello', value)
            resolve()
        } else {
            return reject(`Error: ${value}`)
        }
    })
}

const tasks: any[] = []

const runTask =() => {
    if(tasks.length > 0) {
        const task = tasks.shift()
        task().then().catch((err: any) => {
            console.error(err)
        }).finally(() => {
            setTimeout(runTask, 10000)
        })
    }
}

const getDataAndWriteIt = async (value:number): Promise<void> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${value}`)
    const data = await response.json()
    console.log(data)
    await appendFile('test.csv', `${value},${data.title}\n`)
}


// Tasks have to be pushed in a wrapper. The return of arrow function is what will be executed.
for (let i = 0; i < 100; i++) {
    // tasks.push(() => getDataAndWriteIt(i + 1))
tasks.push(() => promiseFunc(i))
}

runTask()


export {}