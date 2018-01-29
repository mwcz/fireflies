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
        bottom: '#6FA5F2',
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
    // flee: {
    //     distance: 5,
    //     proximity: 40,
    //     reflex: 0.03,
    // },
});

// rotate through these pictures

const masks = [
    '../masks/pbp.png',
    '../masks/three.png',
    '../masks/tux.jpg',
];

// wire up ui to particleview

let i = 0;
setInterval(() => {
    dotter.process(masks[i]).then(view.shape.bind(view));
    i += 1;
    i %= masks.length;
}, 8000);
