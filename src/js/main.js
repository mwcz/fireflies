if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// create a dotter

let dotter = new Dotter({
    jitter: 1.0,
    density: 0.095,
});

dotter.addFilter(Bitter.scale);
dotter.addFilter(Bitter.threshold);

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
    'masks/fireflies.jpg',
    'masks/heart.png',
    'masks/spiral.png',
    'masks/three.png',
    'masks/face.png',
    'masks/tux.jpg',
    'masks/lorenschmidt.jpg',
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

// wire up drag and drop

const dz = new Drop({
    node: 'body',
    dropEffect: 'copy',
});

dz.ondragenter = () => console.log('drag enter');
dz.ondragleave = () => console.log('drag leave');
dz.ondrop = dropData => {
    dropData.files.forEach(f => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            ui.addImage(reader.result);
            ui.stopRotate();
            ui.setImageByIndex(-1);
        });
        reader.readAsDataURL( f.file );
    });
};

document.ondrop = document.ondragover = function(e) { e.preventDefault(); };
