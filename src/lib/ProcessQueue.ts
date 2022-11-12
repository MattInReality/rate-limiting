import {EventEmitter} from "events";

export class ProcessQueue extends EventEmitter{
    public queue: promiseFunc[] = []
    public running: boolean = false
    public timer: any
    public history: number[]

    constructor(public timeout: number, public taskRunner: promiseFunc) {
        super()
        this.timer = undefined;
        this.history = []
    }

    enQueue = (fn: promiseFunc) => {
        this.queue.push(fn)
    }

    run = () => {
        if (this.queue.length > 0) {
            const task = this.queue.shift()
            this.running = true
            this.history.push(Date.now())
            this.taskRunner(task).finally(() => {
                if(this.history.length === 0) {
                    this.timer = setTimeout(this.run, this.timeout)
                } else {
                    this.timer = setTimeout(this.run, (this.timeout - (Date.now() - this.history[this.history.length -1])))
                }
            })
        } else {
            this.running = false
            this.history = []
            this.emit('done')
        }
    }

    stop = () => {
        if(this.timer) {
            clearTimeout(this.timer)
        }
    }

    clear = () => {
        if(this.queue.length) {
            this.queue = []
        }
        this.stop()
    }
}