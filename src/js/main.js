let dotter = new Dotter({ jitter: 1.0 });

let view = new ParticleView({
    count: 5000,
    fidget: {
        speed: 2.0,
        distance: 0.1,
    }
});

function show(img) {
    dotter.process(img).then(view.shape.bind(view));
}

const INTERVAL = 3000;
show('test.png');
setTimeout(() => show('test2.png'), INTERVAL*1);
setTimeout(() => show('spiral.png'), INTERVAL*2);
setTimeout(() => show('face.png'), INTERVAL*3);
setTimeout(() => show('shadowman.png'), INTERVAL*4);
