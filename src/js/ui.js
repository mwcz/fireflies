class UI {
    constructor(images) {
        this.init(images);
    }

    init(images) {
        this.toggleText = ['Show menu', 'Hide menu'];
        this.playPause = ['&#9654;', '&nbsp;&#9612; &#9612;'];

        this.playTimeouts = [];

        this.engine = new Ractive({
            // The `el` option can be a node, an ID, or a CSS selector.
            el: '#container',

            // We could pass in a string, but for the sake of convenience
            // we're passing the ID of the <script> tag above.
            template: '#template',

            // Here, we're passing in some initial data
            data: {
                name: 'world',
                activeImage: 0,
                images,
                toggleText: this.toggleText[1],
                show: true,
                playText: this.playPause[1],
            },
        });

        this.engine.on('setImage', img => {
            this.engine.set('activeImage', this.engine.get('images').indexOf(this._getRelativeSrc(img)));
        });

        this.engine.on('setImageButton', img => {
            this.stopRotate();
            this.setImage(img);
        });

        this.engine.on('toggle', () => {
            this.engine.set('show', !this.engine.get('show'));
            this.engine.set('toggleText', this.toggleText[~~this.engine.get('show')] );
        });

        this.engine.on('togglePlay', () => {
            this.playTimeouts.forEach(clearTimeout);
            this.playTimeouts = [];
            this.engine.set('playText', this.playPause[~~!this.engine.get('rotating')]);
            if (this.engine.get('rotating')) {
                this.stopRotate();
            }
            else {
                this.engine.set('rotating', true);
                const tid = setTimeout(() => {
                    this.setImageByIndex(this.engine.get('activeImage') + 1);
                    this.startRotate();
                }, 800);
                this.playTimeouts.push(tid);
            }
        });
    }

    setImage(img) {
        this.engine.fire('setImage', img);
    }

    _getRelativeSrc(img) {
        let path;
        if (img.node) {
            path = img.node.src;
        }
        else {
            path = img;
        }
        return path.replace(location.href, '');
    }

    onSetImage(f) {
        this.engine.on('setImage', evt => {
            f(this._getRelativeSrc(evt));
        });
    }

    setImageByIndex(index) {
        const imageCount = this.engine.get('images').length;
        if (index === -1) {
            index = imageCount - 1;
        }
        const newIndex = index % imageCount;
        const newImage = this.engine.get('images')[newIndex];
        this.engine.set('activeImage', newIndex);
        this.setImage(newImage);
    }

    startRotate() {
        const INTERVAL = 6900;

        this._intervalId = setInterval(() => {
            this.setImageByIndex(this.engine.get('activeImage') + 1);
        }, INTERVAL);

        this.engine.set('playText', this.playPause[1]);
        this.engine.set('rotating', true);
    }

    stopRotate() {
        clearInterval(this._intervalId);
        this.engine.set('playText', this.playPause[0]);
        this.engine.set('rotating', false);
    }

    addImage(img) {
        const images = this.engine.get('images');
        if (images.indexOf(img) === -1) {
            images.push(img);
            this.engine.set('images', images);
        }
    }
}
