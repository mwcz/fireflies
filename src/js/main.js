if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// create a dotter

let dotter = new Dotter({
    jitter: 1.0,
    density: 0.095,
});

// create a particle view

let view = new ParticleView({
    size: 14,
    count: 14000,
    color: {
        top: '#FFA317',
        bottom: '#E6141B',
        background: '#252142',
    },
    fidget: {
        speed: 2.4,
        distance: 1.4,
    },
    tween: {
        duration: 500, // fps
        xfunc: Tween.easeInOutCubic,
        yfunc: Tween.easeInOutCubic,
        ofunc: Tween.easeInOutCubic,
    },
});

// some images to start with

const previewImages = [
    'masks/heart.png',
    'masks/spiral.png',
    'masks/yinyang.png',
    'masks/face.png',
];

// start the Ui

const ui = new UI(previewImages);

// wire up ui to particleview

ui.onSetImage(img => {
    dotter.process(img).then(view.shape.bind(view));
});

// show the first image and start rotation
ui.setImageByIndex(0);
ui.startRotate();
