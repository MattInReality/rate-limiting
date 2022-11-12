import 'mocha'
import {assert} from "chai";
import { spy } from "sinon";
import {ProcessQueue} from "../lib/ProcessQueue.js";
import {beforeEach} from "mocha";
import {composeTaskRunner} from "../lib/composition.js";

suite('Base Tests', function () {
    test('Simple Add', function () {
        const result = 2 + 2
        assert.strictEqual(result, 4, 'Values are strict equal.')
    });
    test('Fail Add', function () {
        // const result = ()=> {} + 4
        assert.throws(() => {
            throw new Error('Throwing')
        }, 'Throwing', false, 'Successfully throws')
    })
})

suite('Process Queue', function () {
    const successSpy = spy()
    const errorSpy = spy()
    const calls: number[] = []
    beforeEach(function () {
        successSpy.callCount = 0;
        errorSpy.callCount = 0;
        calls.length = 0;
    })
    suite('Adding and clearing', function () {
        const timeout = 2000
        const runs = 5
        const processQueue = new ProcessQueue(timeout, composeTaskRunner(successSpy, errorSpy))
        test('Adding Tasks', function (done) {
            for (let i = 0; i < runs; i++) {
                processQueue.enQueue(function () {
                    return new Promise((resolve, _reject) => {
                            resolve(true)
                        }
                    )
                })
            }
            assert.equal(processQueue.queue.length, runs, 'The queue length is not equal to the tasks added.')
            done()
        })

        test('Clearing Tasks', function(done) {
            assert.equal(processQueue.queue.length, runs, 'The queue length did not start at the right length')

            processQueue.clear()

            assert.equal(processQueue.queue.length, 0, 'The queue was not cleared properly.')
            done()
        })
    })

    suite('Running tasks', function () {
        this.timeout(30000)
        const timeout = 500
        const runs = 5

        test('Runs all tasks successfully', function(done) {
            const resolveValue = 'Great Success'

            const promiseQueue = new ProcessQueue(timeout, composeTaskRunner(successSpy, errorSpy))

            for (let i = 0; i < runs; i++) {
                promiseQueue.enQueue(function () {
                    return new Promise((resolve, _reject) => {
                            calls.push(Date.now())
                            resolve(resolveValue)
                        }
                    )
                })
            }

            promiseQueue.run()
            promiseQueue.on('done', () => {
                assert.equal(successSpy.callCount, runs)
                assert(successSpy.calledWith(resolveValue))
                done()
            })
        })

        test('Runs all tasks rejecting the promise', function(done) {
            const errorMessage = new Error('Testing Failure')

            const promiseQueue = new ProcessQueue(timeout, composeTaskRunner(successSpy, errorSpy))

            for (let i = 0; i < runs; i++) {
                promiseQueue.enQueue(function () {
                    return new Promise((_resolve, reject) => {
                            calls.push(Date.now())
                            reject(errorMessage)
                        }
                    )
                })
            }

            promiseQueue.run()
            promiseQueue.on('done', () => {
                assert.equal(errorSpy.callCount, runs)
                assert(errorSpy.calledWith(errorMessage))
                done()
            })
        })

        test('Time Between Executions', function(done) {
            const promiseQueue = new ProcessQueue(timeout, composeTaskRunner(successSpy, errorSpy))

            for (let i = 0; i < runs; i++) {
                promiseQueue.enQueue(function () {
                    return new Promise((resolve, _reject) => {
                            calls.push(Date.now())
                            resolve(true)
                        }
                    )
                })
            }

            promiseQueue.run()
            promiseQueue.on('done', () => {
                assert.approximately((calls[1] - calls[0]) - timeout, 0, 4)
                assert.approximately((calls[2] - calls[1]) - timeout, 0, 4)
                assert.approximately((calls[3] - calls[2]) - timeout, 0, 4)
                done()
            })
        })
    })
})