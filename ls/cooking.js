// USAGE: Place item into cooking station, press cook then press Z.
// Once item is cooked, press Z to disable, place in new item and press Z again to enable and repeat.
class CookingBot {

    constructor() {
        this.isRunning = false;
        this.setupKeyListener();
        this.observe = (sel, opt, cb) => {
            const mutationObs = new MutationObserver((m) => [...m].forEach(cb));
            document.querySelectorAll(sel).forEach(el => mutationObs.observe(el, opt));
        };
    }

    setupKeyListener() {
        document.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'z') {
                this.toggleBot();
            }
        });
    }

    toggleBot() {
        this.isRunning = !this.isRunning;
        console.log(this.isRunning ? 'Cooking Bot started' : 'Cooking Bot stopped');
        if (this.isRunning) {
            this.run();
        }
    }

    async run() {
        while (this.isRunning) {
            console.log('run cooking loop')

            // Look for cook/flame counter
            var firstElem = document.querySelector('a.abutGradBl.skBut:nth-of-type(1)')
            if (firstElem) {
                if (firstElem.textContent === 'Cook') {
                    //console.log('First element is cook');
                    this.cookButton = document.querySelector('a.abutGradBl.skBut:nth-of-type(1)')
                    this.flameCounterButton = document.querySelector('a.abutGradBl.skBut:nth-of-type(2)')
                } else {
                    //console.log('First element is Flame Counter');
                    this.cookButton = document.querySelector('a.abutGradBl.skBut:nth-of-type(2)')
                    this.flameCounterButton = document.querySelector('a.abutGradBl.skBut:nth-of-type(1)')
                }

                // Set up events to cook
                await this.cook();
            }

            // Block until we enable it again.
            while(this.isRunning) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    async cook() {
        if (this.cookButton) {
            if (!this.meterBoxProg) {
                // console.log('Creating a new Cooking Progress Bar Observer')
                // Fishing Rod progress bar has changed
                this.meterBoxProg = this.observe(".meterBoxProg", {
                    attributesList: ["style"],
                    attributeOldValue: true,
                }, (evt) => {
                    //console.log(evt)
                    var hasFlame = document.querySelector('.popupBox.pbSkillup.cur').innerHTML.indexOf('Flame!') > -1;
                    if (hasFlame) {
                        this.flameCounterButton.click();
                        // console.log('FLAME COUNTER!')
                    } else {
                        this.cookButton.click();
                        // console.log('COOK!')
                    }
                });
            }
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Usage
const bot = new CookingBot();
console.log('Press Z to start/stop the cooking bot');