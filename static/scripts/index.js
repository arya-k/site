// Animate links:
annotate = RoughNotation.annotate
document.querySelectorAll("a").forEach((item) => {
    item.animation = annotate(item, { type: 'circle', color: '#26c98c', iterations: 1, strokeWidth: 3 })
    item.onmouseover = (_) => { item.animation.show(); item.classList.remove('un'); }
    item.onmouseout = (_) => { item.animation.hide(); }

});

// Canvas mouse tracking:
const canvas = document.getElementById('animation')
const ctx = canvas.getContext('2d');
let [mx, my] = [0, 0]
window.onmousemove = (e) => { [mx, my] = [e.clientX, e.clientY]; }

// Actual animation:
class Walker {
    constructor() {
        [this.x, this.y] = [window.innerWidth, window.innerHeight];
        this.hue = 160;
    }
    draw() {
        const forward = Math.random() * 3;
        const lateral = (Math.random() * 6) - 3;

        // interactive: mouse movement:
        if ((mx - this.x) ** 2 + (my - this.y) ** 2 < 50 ** 2) {
            console.log("TODO:interactivity");
        }

        this.x -= forward + lateral;
        this.y -= forward - lateral;
        this.hue += (Math.random() * 6) - 3;

        if (this.x < 0) this.x += canvas.width;
        if (this.y < 0) this.y += canvas.height;
        this.hue %= 360;

        ctx.fillStyle = "hsla(" + this.hue + ",100%,50%,0.5)";
        ctx.fillRect(this.x, this.y, 7, 7)
    }
}
var walker = new Walker()

// Animation loop
function update() {
    ctx.fillStyle = "rgba(254, 251, 244, 0.03)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    walker.draw();
    requestAnimationFrame(update);
}

function init() {
    [canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];
}

window.onresize = init;
window.onload = () => { init(); requestAnimationFrame(update); }