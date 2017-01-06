let dotter = new Dotter({ jitter: 1.0 });

let view = new ParticleView({
    count: 5000,
    fidget: {
        speed: 2.0,
        distance: 1.1,
    },
    tween: {
        duration: 260, // fps
    },
});

function show(img) {
    dotter.process(img).then(view.shape.bind(view));
}

const INTERVAL = 4000;

const previewImages = [
    'shape1.png',
    'shape2.png',
    'shape3.png',
    'shape4.png',
    'spiral.png',
    'face.png',
];

setInterval(() => {
    const img = previewImages.shift();
    previewImages.push(img);
    show(img);
}, INTERVAL);
