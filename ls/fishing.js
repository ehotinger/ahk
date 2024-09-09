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

            // Delay to avoid looping between next fish too quickly
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
                    console.log(evt)
                    var rodHealth = parseWidthAsInteger(evt.oldValue)
                    // console.log(rodHealth)
                    if(rodHealth && rodHealth <= 40) {
                        console.log('Avoid rod break, cancel')
                        this.releaseButton = document.querySelectorAll('a.abutGradBl.skBut')[2]
                        if (this.releaseButton) {
                            console.log('Clicked release')
                            this.releaseButton.click();
                        }
                    }
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

function parseWidthAsInteger(styleString) {
    if(!styleString) return null;
    // Use a regular expression to find the width value
    const widthMatch = styleString.match(/width:\s*(\d+)%/);
    
    // If a match is found, parse it as an integer and return
    if (widthMatch && widthMatch[1]) {
        return parseInt(widthMatch[1], 10);
    }
    
    // Return null or a default value if no width is found
    return null;
}

// Usage
const bot = new FishingBot();
console.log('Press X to start/stop the fishing bot');
