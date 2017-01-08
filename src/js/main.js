let dotter = new Dotter({
    jitter: 1.0,
    density: 0.12,
});

let view = new ParticleView({
    size: 10,
    count: 20000,
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
        duration: 360, // fps
        xfunc: Tween.easeInOutCubic,
        yfunc: Tween.easeInOutCubic,
        ofunc: Tween.easeInOutCubic,
    },
});

function show(img) {
    dotter.process(img).then(view.shape.bind(view));
}

const INTERVAL = 4000;

const previewImages = [
    'masks/heart.png',
    'masks/spiral.png',
    'masks/face.png',
    'masks/yinyang.png',
    'masks/test.png',
];

show(previewImages[previewImages.length-1]);

setInterval(() => {
    const img = previewImages.shift();
    previewImages.push(img);
    show(img);
}, INTERVAL);
