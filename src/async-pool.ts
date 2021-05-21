export default class AsyncPool<T> {
    #pendingQueue: {
        task: () => Promise<T>;
        resolve: (value: T) => void;
        reject: (value: T) => void;
    }[] = [];
    #execQueue: Promise<T>[] = [];

    constructor(private asyncLimit: number) {
        if (Number.isInteger(asyncLimit) && this.asyncLimit <= 0) {
            throw Error('async task limit must more than zero');
        }
    }

    pushTask(
        task: () => Promise<T>,
        preResolve?: (value: T) => void,
        preReject?: (value: T) => void,
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            if (this.#execQueue.length < this.asyncLimit) {
                let p = task();
                p.then((value: T) => {
                    if (preResolve) {
                        preResolve(value);
                    } else {
                        resolve(value);
                    }
                    // pop the task
                    this.#execQueue.splice(this.#execQueue.indexOf(p), 1);

                    if (this.#pendingQueue.length > 0) {
                        // has pending task
                        let nextTask = this.#pendingQueue.shift();
                        if (nextTask) {
                            this.pushTask(
                                nextTask.task,
                                nextTask.resolve,
                                nextTask.reject,
                            );
                        }
                    }
                }).catch(err => {
                    if (preReject) {
                        preReject(err);
                    } else {
                        reject(err);
                    }
                });

                this.#execQueue.push(p);
            } else {
                this.#pendingQueue.push({
                    task,
                    resolve,
                    reject,
                });
            }
        });
    }
}
