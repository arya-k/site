// Animate links:
annotate = RoughNotation.annotate
document.querySelectorAll("a").forEach((item) => {
    item.animation = annotate(item, { type: 'highlight', color: '#26c98c' })
    item.onmouseover = (_) => { item.animation.show(); item.classList.remove('un'); }
    item.onmouseout = (_) => { item.animation.hide(); }

});

// Canvas mouse tracking:
const canvas = document.getElementById('animation')
const ctx = canvas.getContext('2d');
let [mx, my, mt] = [NaN, NaN, 0]
window.onmousemove = (e) => [mx, my, mt] = [e.clientX, e.clientY, Date.now()];

// Actual animation:
class Walker {
    constructor(clone) {
        if (clone !== undefined) {
            [this.x, this.y, this.hue] = [clone.x, clone.y, clone.hue];
        } else {
            [this.x, this.y] = [window.innerWidth, window.innerHeight];
            this.hue = 160;
        }
    }

    draw() {
        const forward = Math.random() * 3;
        const lateral = (Math.random() * 6) - 3;

        const norm2 = (mx - this.x) ** 2 + (my - this.y) ** 2;
        if (norm2 < 300 ** 2 && Date.now() - mt < 100) {
            const [dy, dx] = [(my - this.y) / (norm2 ** .5), (mx - this.x) / (norm2 ** .5)];
            this.x += (dx * forward) + (dy * lateral);
            this.y += (dy * forward) - (dx * lateral);
        } else {
            this.x -= forward + lateral;
            this.y -= forward - lateral;
        }

        this.hue = (this.hue + (Math.random() * 6) - 3) % 360;
        if (this.x < 0) this.x += canvas.width;
        if (this.y < 0) this.y += canvas.height;

        ctx.fillStyle = "hsla(" + this.hue + ",100%,50%,0.5)";
        ctx.fillRect(this.x, this.y, 7, 7)
    }
}

class WalkerManager {
    constructor() {
        this.reset()
    }

    reset() {
        ctx.fillStyle = "rgb(254, 251, 244)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.walkers = [new Walker()]
    }

    draw() {
        let idx = Math.floor(Math.random() * this.walkers.length);
        if (this.walkers.length < 100 && Math.random() < 0.007) {
            this.walkers.push(new Walker(this.walkers[idx]));
        }
        if (this.walkers.length > 2 && Math.random() < (0.002 * this.walkers.length)) {
            this.walkers.shift();
        }
        this.walkers.forEach((walker) => walker.draw());
    }
}
var wm = new WalkerManager()

// Animation loop
function update() {
    ctx.fillStyle = "rgba(254, 251, 244, 0.03)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    wm.draw();
    requestAnimationFrame(update);
}

function reset() {
    [canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];
    wm.reset();
}

window.onresize = reset;
window.onload = () => { reset(); requestAnimationFrame(update); }