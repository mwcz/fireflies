if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// create a dotter

const dotter = new Dotter({
    jitter: 1.2,
    density: 0.28,
});

// scale is broken in firefox/safari, disabling for now
dotter.addFilter(Bitter.scale);
// dotter.addFilter(Bitter.threshold);

// create a particle view

const view = new ParticleView({
    size: {
        min: 15,
        max: 25,
    },
    count: 18000,
    color: {
        top: '#FFEC21',
        bottom: '#39AD10',
        // background: '#374330',
        // top: '#ffffff',
        // bottom: '#ee0000',
        background: '#191F16',
        opacity: 0.9,
    },
    fidget: {
        speed: 1.0,
        distance: 0.6,
    },
    tween: {
        duration: 300, // fps
        xfunc: Tween.easeInOutCubic,
        yfunc: Tween.easeInOutCubic,
        ofunc: Tween.easeInOutCubic,
    },
    canvas: {
        width: 1920,
        height: 1080,
        domElement: document.querySelector('#fireflies-canvas'),
    },
    sprite: 'hand.png',
    flee: {
        distance: 5,
        proximity: 40,
        reflex: 0.03,
    },
});

// rotate through these pictures

const masks = [
    'masks/ian/1.png',
    'masks/ian/2.png',
    'masks/ian/3.png',
    'masks/ian/4.png',
    'masks/ian/5.png',
    'masks/ian/6.png',
    'masks/ian/7.png',
    'masks/ian/8.png',
    'masks/ian/9.png',
];

// wire up ui to particleview

// process first mask
// rotate through subsequent masks on a timer
let i = 0;
let tid = 0;
const next = () => {
    dotter.process(masks[i]).then(view.shape.bind(view));
    i += 1;
    if (tid) {
        clearTimeout(tid);
        console.log(`[main] cleared pending mask (tid: ${tid})`);
    }
    if (i < masks.length) {
        tid = setTimeout(next, 7000);
    }
}
next();
view.renderer.domElement.addEventListener('click', next);
