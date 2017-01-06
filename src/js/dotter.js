class Dotter {
    constructor({ density=0.5, jitter=0.5 } = {}) {
        this.density = density;
        this.jitter = jitter;
    }

    process(src) {
        return this._fetchImage(src)
            .then(this._processImage.bind(this));
    }

    _fetchImage(src) {
        return new Promise(
            (resolve, reject) => {
                if (typeof src === 'string') {
                    let img = new Image();
                    img.onload = evt => resolve(evt.target);
                    img.onerror = reject;
                    img.src = src;
                }
                else {
                    resolve(src);
                }
            }
        );
    }

    _processImage(img) {
        const canvas = this._drawCanvas(img);
        const pixels = this._getPixels(canvas);
        const dots = this._sample(canvas, pixels);
        console.log(dots);
        document.body.appendChild(canvas.el);
    }

    _drawCanvas(img) {
        const el = document.createElement('canvas');
        const ctx = el.getContext('2d');
        el.width = img.width;
        el.height = img.height;
        ctx.drawImage(img, 0, 0);
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

        for (let x = 0; x < w; x += step) {
            for (let y = 0; y < h; y += step) {
                i = Math.floor((x + y*w) * 4);
                r = pixels.data[i];
                g = pixels.data[i+1];
                b = pixels.data[i+2];

                // look for black pixels
                if (r+g+b === 0) {
                    let xJitter = Math.floor(Math.random() * this.jitter * step);
                    let yJitter = Math.floor(Math.random() * this.jitter * step);
                    points.push(x + xJitter);
                    points.push(y + yJitter);
                }
            }
        }

        console.log(`${points.length} points found`);
        this._drawPoints(canvas, points);

        return points;
    }

    _clamp(n, hi, lo) {
        return Math.max(0, Math.min(1, n));
    }

    // for debugging, draw the found points on a canvas
    _drawPoints(canvas, points) {
        canvas.ctx.fillStyle = '#47CD36';

        for (let i = 0; i < points.length; i += 2) {
            const x = points[i];
            const y = points[i+1];
            canvas.ctx.fillRect( x, y, 1, 1 );
        }
    }
}

let img1 = 'data:image/png;base64,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J3du9I7893AUbu3dlACcUP6HysbSpdWlux4DAE4CtwgBAIYJLACAYQILAGCYwAIAGCawAACGCSwAgGECCwBgmMACABgmsAAAhgksAIBhAgsAYJjAAgAYJrAAAIYJLACAYQILAGCYwAIAGCawAACGCSwAgGECCwBgmMACABgmsAAAhgksAIBhAgsAYJjAAgAYJrAAAIYJLACAYQILAGCYwAIAGCawAACGCSwAgGECCwBgmMACABgmsAAAhgksAIBhAgsAYJjAAgAYJrAAAIYJLACAYQILAGCYwAIAGCawAACGCSwAgGECCwBgmMACABgmsAAAhgksAIBhAgsAYJjAAgAYJrAAAIYJLACAYQILAGCYwAIAGCawAACGCSwAgGECCwBgmMACABgmsAAAhgksAIBhAgsAYJjAAgAYJrAAAIYJLACAYQILAGCYwAIAGCawAACGCSwAgGECCwBgmMACABgmsAAAhgksAIBhAgsAYJjAAgAYJrAAAIYJLACAYQILAGCYwAIAGCawAACGCSwAgGECCwBgmMACABgmsAAAhgksAIBhAgsAYJjAAgAYJrAAAIYJLACAYQILAGCYwAIAGCawAACGCSwAgGECCwBgmMACABgmsAAAhgksAIBhAgsAYJjAAgAYJrAAAIYJLACAYQILAGCYwAIAGCawAACGCSwAgGECCwBgmMACABgmsAAAhgksAIBhAgsAYJjAAgAYJrAAAIYJLACAYQILAGCYwAIAGCawAACGCSwAgGECCwBgmMACABgmsAAAhgksAIBhAgsAYJjAAgAYJrAAAIYJLACAYQILAGCYwAIAGCawAACGCSwAgGECCwBgmMACABgmsAAAhgksAIBhAgsAYJjAAgAYJrAAAIYJLACAYQILAGCYwAIAGCawAACGCSwAgGECCwBgmMACABgmsAAAhgksAIBhAgsAYJjAAgAYJrAAAIYtF1118XqM57uh+tgxng8AoOqCjvHC0jnHdaJTzqrudsznBAA4Vm4RAgAME1gAAMMEFgDAMIEFADBMYAEADBNYAADDBBYAwDCBBQAwTGABAAwTWAAAwwQWAMAwgQUAMExgAQAME1gAAMMEFgDAMIEFADBMYAEADBNYAADDBBYAwDCBBQAwTGABAAwTWAAAwwQWAMAwgQUAMExgAQAME1gAAMP+H/0nGT5jc7cHAAAAAElFTkSuQmCC';
let img2 = 'test.png';

let d = new Dotter({ density: 0.14, jitter: 1.0 });

// d.process(img1)
d.process(img2)


