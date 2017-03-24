class Dotter {
    constructor({ density=0.15, jitter=1.0 } = {}) {
        this.density = density;
        this.jitter = jitter;
        this.filters = [];
    }

    process(src) {
        return new Promise(
            (resolve, reject) => {
                this._fetchImage(src)
                    .then(img => {
                        resolve(this._processImage(img));
                    })
                    .catch(reject);
            }
        );
    }

    _fetchImage(src) {
        return new Promise(
            (resolve, reject) => {
                if (typeof src === 'string') {
                    let img = new Image();
                    img.addEventListener('load', evt => resolve(evt.target));
                    img.addEventListener('error', reject);
                    console.log('[dotter] setting img.src');
                    img.src = src;
                }
                else {
                    resolve(src);
                }
            }
        );
    }

    _processImage(image) {
        const canvas = this._drawCanvas(image);
        const pixels = this._getPixels(canvas);
        const dots = this._sample(canvas, pixels);

        return {
            dots,
            original: {
                image,
                pixels,
                canvas,
                aspect: canvas.width / canvas.height,
            },
        };
    }

    _drawCanvas(img) {
        const el = document.createElement('canvas');
        const ctx = el.getContext('2d');
        el.width = img.width;
        el.height = img.height;
        ctx.drawImage(img, 0, 0);

        // call any registered filters on this canvas

        this.filters.forEach(filter => filter({ el, ctx }));

        return { el, ctx };
    }

    _getPixels(canvas) {
        return canvas.ctx.getImageData(0, 0, canvas.el.width, canvas.el.height);
    }

    _sample(canvas, pixels) {
        if (this.density <= 0) return [];

        const points = [];

        const w = canvas.el.width;
        const h = canvas.el.height;

        const step = Math.floor(1 / this.density);

        console.log(`step: ${step}`);

        let i = 0;
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;

        for (let x = 0; x < w; x += step) {
            for (let y = 0; y < h; y += step) {
                i = Math.floor((x + y*w) * 4);
                r = pixels.data[i];
                g = pixels.data[i+1];
                b = pixels.data[i+2];
                a = pixels.data[i+3];

                // look for black pixels or totally transparent pixels
                if (r+g+b === 0 && a !== 0) {
                    let xJitter = Math.floor(Math.random() * this.jitter * step);
                    let yJitter = Math.floor(Math.random() * this.jitter * step);
                    points.push((x + xJitter) / w);
                    points.push((y + yJitter) / h);
                }
            }
        }

        console.log(`${points.length/2} points found`);
        this._drawPoints(canvas, points);
        // document.body.appendChild(canvas.el);

        return points;
    }

    // for debugging, draw the found points on a canvas
    _drawPoints(canvas, points) {
        canvas.ctx.fillStyle = '#47CD36';

        for (let i = 0; i < points.length; i += 2) {
            const x = points[i];
            const y = points[i+1];
            canvas.ctx.fillRect( x * canvas.el.width, y * canvas.el.height, 1, 1 );
        }
    }

    addFilter(filterFunc) {
        this.filters.push(filterFunc);
    }
}
