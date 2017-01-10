class Bitter {
    constructor() {
    }

    static scale({ el, ctx }) {
        const TOTAL_PIXELS = 4e5;
        const ASPECT = el.width / el.height;
        const NEW_WIDTH = Math.sqrt( TOTAL_PIXELS * ASPECT );
        const NEW_HEIGHT = NEW_WIDTH / ASPECT;
        const img = document.createElement('img');
        img.src = el.toDataURL();
        // img.width = NEW_WIDTH;
        // img.height = NEW_HEIGHT;
        el.width = NEW_WIDTH;
        el.height = NEW_HEIGHT;
        console.log(`resized image to ${NEW_WIDTH} x ${NEW_HEIGHT}`);
        ctx.drawImage(img, 0, 0, NEW_WIDTH, NEW_HEIGHT);
    }

    static threshold({ el, ctx }) {
        const THRESHOLD = 129;
        const imagedata = ctx.getImageData(0, 0, el.width, el.height);
        const data = imagedata.data;
        for( let i = data.length-1; i >= 0; i-=4 ) {
            let b = Math.max(
                data[i-3],
                data[i-2],
                data[i-1]
            );
            data[i-3] = data[i-2] = data[i-1] = ( b >= THRESHOLD ) ?  255: 0;
        }
        console.log(`thresholded image to black and white`);
        ctx.putImageData(imagedata, 0, 0);
    }
}
