import Promise from 'pinkie';
import * as RequireAnalyzer from './legacy/analysis/require_analyzer';
import remove from '../utils/array-remove';


export default class RequireReader {
    constructor (descriptorsCache, hammerheadProcessScript) {
        this.descriptorsCache        = descriptorsCache || {};
        this.readings                = [];
        this.waiters                 = {};
        this.hammerheadProcessScript = hammerheadProcessScript;
    }

    async _analyzeRequire (require, filename, sourceIndex) {
        this.readings.push(require);

        return new Promise(resolve => {
            RequireAnalyzer.run(require, filename, sourceIndex, this.hammerheadProcessScript, (errs, descriptor) => {
                this.descriptorsCache[require] = descriptor;

                remove(this.readings, require);
                resolve({ errs, descriptor });

                if (this.waiters[require]) {
                    this.waiters[require].forEach(waiter => waiter(descriptor));
                    this.waiters[require] = null;
                }
            });
        });
    }

    async _waitForReading (require) {
        return new Promise(resolve => {
            if (!this.waiters[require])
                this.waiters[require] = [];

            this.waiters[require].push(descriptor => resolve({ descriptor, fromCache: true }));
        });
    }

    async read (require, filename, sourceIndex) {
        if (this.descriptorsCache[require]) {
            return {
                descriptor: this.descriptorsCache[require],
                fromCache:  true
            };
        }

        if (this.readings.indexOf(require) > -1)
            return await this._waitForReading(require);

        return this._analyzeRequire(require, filename, sourceIndex);
    }
}
