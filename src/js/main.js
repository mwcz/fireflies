if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// create a dotter

const dotter = new Dotter({
    jitter: 1.0,
    density: 0.195,
});

// scale is broken in firefox/safari, disabling for now
// dotter.addFilter(Bitter.scale);
dotter.addFilter(Bitter.threshold);

// create a particle view

const view = new ParticleView({
    size: 8,
    count: 6000,
    color: {
        top: '#ADCFFF',
        bottom: '#4579C4',
        background: '#000000',
    },
    fidget: {
        speed: 2.4,
        distance: 2.2,
    },
    tween: {
        duration: 500, // fps
        xfunc: Tween.easeInOutCubic,
        yfunc: Tween.easeInOutCubic,
        ofunc: Tween.easeInOutCubic,
    },
    canvas: {
        width: 960,
        height: 720,
    },
    sprite: 'spark1.png',
    // flee: {
    //     distance: 5,
    //     proximity: 40,
    //     reflex: 0.03,
    // },
});

// rotate through these pictures

const masks = [
    // '../masks/dot.png',
    '../masks/pbp.png',
    '../masks/js.png',
    '../masks/wasm.png',
    '../masks/tux.png',
];

// wire up ui to particleview

// process first mask
// rotate through subsequent masks on a timer
let i = 0;
let tid = 0;
const next = () => {
    dotter.process(masks[i]).then(view.shape.bind(view));
    i += 1;
    i %= masks.length;
    if (tid) {
        clearTimeout(tid);
        console.log(`[main] cleared pending mask (tid: ${tid})`);
    }
    tid = setTimeout(next, 10000);
}
next();
view.renderer.domElement.addEventListener('click', next);
