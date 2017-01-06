let dotter = new Dotter({ jitter: 1.0 });

let view = new ParticleView(4040/2);

function show(img) {
    dotter.process(img).then(view.shape.bind(view));
}

show('test.png');
