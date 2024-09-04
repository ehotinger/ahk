// USAGE: Put in fishing rod and click fish. Press X. Sit back and relax until done.
class FishingBot {

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
            if (event.key.toLowerCase() === 'x') {
                this.toggleBot();
            }
        });
    }

    toggleBot() {
        this.isRunning = !this.isRunning;
        console.log(this.isRunning ? 'Fishing Bot started' : 'Fishing Bot stopped');
        if (this.isRunning) {
            this.run();
        }
    }

    async run() {
        while (this.isRunning) {
            console.log('run fishing loop')

            // If we have Reel/Snag Counter, try to start fishing
            var firstElem = document.querySelector('a.abutGradBl.skBut:nth-of-type(1)')
            if (firstElem) {
                if (firstElem.textContent === 'Reel') {
                    this.reelButton = document.querySelector('a.abutGradBl.skBut:nth-of-type(1)')
                    this.snagCounterButton = document.querySelector('a.abutGradBl.skBut:nth-of-type(2)')
                } else {
                    this.reelButton = document.querySelector('a.abutGradBl.skBut:nth-of-type(2)')
                    this.snagCounterButton = document.querySelector('a.abutGradBl.skBut:nth-of-type(1)')
                }

                // Set up events to fish.
                await this.reelIn();
            }

            // Block until we can recast.
            await this.waitForRecast();

            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    async waitForRecast() {
        while (this.isRunning) {
            this.recastButton = document.querySelector('a.abutGradBl.skButDone')
            if (this.recastButton) {
                this.recastButton.click();
                this.recastButton = null;
                if(this.meterBoxProg) {
                    this.meterBoxProg.disconnect();
                }
                this.meterBoxProg = null;
                console.log('Clicked Recast Line');
                break;
            }

            // TODO: Code can be improved below here for rods if they're close to breaking.
            // Read in the rod's bar value (style: width) for health and click on Release Line if it gets to below a certain %

            // Delay to avoid hyper loop
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async reelIn() {
        if (this.reelButton) {
            if (!this.meterBoxProg) {
                //console.log('Creating a new Fishing Rod Progress Bar Observer')
                // Fishing Rod progress bar has changed
                this.meterBoxProg = this.observe(".meterBoxProg", {
                    attributesList: ["style"],
                    attributeOldValue: true,
                }, (evt) => {
                    //console.log(evt)
                    var hasSnag = document.querySelector('.popupBox.pbSkillup.cur').innerHTML.indexOf('Snag!') > -1;
                    if (hasSnag) {
                        this.snagCounterButton.click();
                        // console.log('SNAG COUNTER!')
                    } else {
                        this.reelButton.click();
                        // console.log('REEL!')
                    }
                });
            }
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Usage
const bot = new FishingBot();
console.log('Press X to start/stop the fishing bot');
