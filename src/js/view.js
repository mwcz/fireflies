class ParticleView {
    constructor({size=10, count = 10000, fidget={}, color={}, tween={}} = {}) {
        this.count = count;
        this.fidget = fidget;
        this.tween = tween;
        this.size = size;
        this.color = color;

        fidget.speed = fidget.speed || 0.1;
        fidget.distance = fidget.distance || 0.1;

        tween.duration = tween.duration || 60;
        tween.xfunc = tween.xfunc || Tween.easeInOutQuad;
        tween.xfunc = tween.xfunc || Tween.easeInOutQuad;
        tween.ofunc = tween.ofunc || Tween.linearTween;

        color.top = new THREE.Color(color.top || '#FFFFFF');
        color.bottom = new THREE.Color(color.bottom || '#FFFFFF');
        color.background = new THREE.Color(color.background || '#000000');

        this.init();
        this.animate();
    }
    init() {
        let renderer, scene, camera;
        let particleSystem, uniforms, geometry;
        let WIDTH = window.innerWidth;
        let HEIGHT = window.innerHeight;
        this.heightScale = HEIGHT / 1000;
        this.widthScale = WIDTH / 1000;
        this.clock = new THREE.Clock();
        camera = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 1, 10000 );
        camera.position.z = 260;
        scene = new THREE.Scene();
        uniforms = {
            color:     { value: new THREE.Color( 0xffffff ) },
            texture:   { value: new THREE.TextureLoader().load( "spark1.png" ) }
        };
        let shaderMaterial = new THREE.ShaderMaterial( {
            uniforms:       uniforms,
            vertexShader:   document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
            blending:       THREE.AdditiveBlending,
            depthTest:      false,
            transparent:    true
        });
        let radius = 200;
        geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array( this.count * 3 );
        this.velocity = new Float32Array( this.count * 3 );
        this.acceleration = new Float32Array( this.count * 3 );
        this.destinations = new Float32Array( this.count * 3 );
        this.fidgetSpeed = new Float32Array( this.count * 3 );
        this.fidgetDistance = new Float32Array( this.count * 3 );
        this.colors = new Float32Array( this.count * 3 );
        this.colorTargets = new Float32Array( this.count * 3 );
        this.opacity = new Float32Array( this.count );
        this.opacityDest = new Float32Array( this.count );
        this.tweenTimer = new Float32Array( this.count );
        this.sizes = new Float32Array( this.count );
        for ( let i = 0, i3 = 0; i < this.count; i ++, i3 += 3 ) {
            this.positions[ i3 + 0 ] = ( Math.random() * 2 - 1 ) * 40;
            this.positions[ i3 + 1 ] = ( Math.random() * 2 - 1 ) * 40;
            this.opacity[ i ] = 1;
            this.fidgetSpeed[ i3 + 0 ] = this.fidget.speed * Math.random() + 0.1;
            this.fidgetSpeed[ i3 + 1 ] = this.fidget.speed * Math.random() + 0.1;
            this.fidgetSpeed[ i3 + 2 ] = 0;
            this.fidgetDistance[ i3 + 0 ] = this.fidget.distance * (Math.random() - 0.5);
            this.fidgetDistance[ i3 + 1 ] = this.fidgetDistance[ i3 + 0 ];
            this.fidgetDistance[ i3 + 2 ] = 0;
            // this.colors[ i3 + 0 ] = color.r;
            // this.colors[ i3 + 1 ] = color.g;
            // this.colors[ i3 + 2 ] = color.b;
            this.sizes[ i ] = this.heightScale * this.size + Math.random()*this.size/2;
        }
        geometry.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( this.colors, 3 ) );
        geometry.addAttribute( 'opacity', new THREE.BufferAttribute( this.opacity, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( this.sizes, 1 ) );
        particleSystem = new THREE.Points( geometry, shaderMaterial );
        scene.add( particleSystem );
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( WIDTH, HEIGHT );
        renderer.setClearColor(new THREE.Color(this.color.background));
        document.body.appendChild( renderer.domElement );
        //
        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
        this.renderer       = renderer;
        this.scene          = scene;
        this.camera         = camera;
        this.particleSystem = particleSystem;
        this.uniforms       = uniforms;
        this.geometry       = geometry;
        this.setViewportRelativeFields();
    }
    render() {
        this.updateTweenTimers();
        this.updatePositionsTween();
        this.updateOpacityTween();
        this.updateColorTween();
        this.renderer.render( this.scene, this.camera );
    }
    onWindowResize() {
        this.heightScale = window.innerHeight / 1000;
        this.widthScale = window.innerWidth / 1000;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.setViewportRelativeFields();
    }
    setViewportRelativeFields() {
        for ( let i = 0, i3 = 0; i < this.count; i ++, i3 += 3 ) {
            this.fidgetDistance[ i3 + 0 ] = this.fidget.distance * (Math.random() - 0.5);
            this.fidgetDistance[ i3 + 1 ] = this.fidgetDistance[ i3 + 0 ];
            this.sizes[ i ] = this.heightScale * this.size + Math.random()*this.size/2;
        }
        this.geometry.attributes.size.needsUpdate = true;
    }
    animate() {
        requestAnimationFrame( this.animate.bind(this) );
        this.render();
    }
    updateColorTween() {
        for ( let i = 0, i3 = 0; i < this.count; i ++, i3 += 3 ) {
            const c = this.colors[i];
            const cTarget = this.colorTargets[i];
            const time = this.tweenTimer[i];
            // const cnew = this.tween.ofunc(time, c, cTarget-c, this.tween.duration);
            const t = time / this.tween.duration;
            const cnew = (1-t) * c + t * cTarget;
            this.geometry.attributes.customColor.array[i] = cnew;
        }
        this.geometry.attributes.customColor.needsUpdate = true;
    }
    updateOpacityTween() {
        for ( let i = 0, i3 = 0; i < this.count; i ++, i3 += 3 ) {
            const o = this.opacity[i];
            const oDest = this.opacityDest[i];
            const time = this.tweenTimer[i];
            const onew = this.tween.ofunc(time, o, oDest-o, this.tween.duration);
            this.opacity[i] = onew;
        }
        this.geometry.attributes.opacity.needsUpdate = true;
    }
    updateTweenTimers() {
        for ( let i = 0; i < this.count; i++ ) {
            this.tweenTimer[i] = Math.min(this.tweenTimer[i] + 1, this.tween.duration);
        }
    }
    updatePositionsTween() {
        const t = this.clock.getElapsedTime();
        for ( let i = 0, i3 = 0; i < this.count; i ++, i3 += 3 ) {
            if (this.opacity[i] === 0) break;
            const x = this.positions[ i3 + 0 ];
            const y = this.positions[ i3 + 1 ];
            const xdest = this.destinations[ i3 + 0 ];
            const ydest = this.destinations[ i3 + 1 ];
            const fsx = this.fidgetSpeed[ i3 + 0 ];
            const fsy = this.fidgetSpeed[ i3 + 1 ];
            const fdx = this.fidgetDistance[ i3 + 0 ];
            const fdy = this.fidgetDistance[ i3 + 1 ];
            const time = this.tweenTimer[i];
            const xnew = this.tween.xfunc(time, x, xdest-x, this.tween.duration) + Math.sin(t*fsx) * fdx;
            const ynew = this.tween.yfunc(time, y, ydest-y, this.tween.duration) - Math.cos(t*fsy) * fdy;
            //                         current position + destination position + fidget
            this.positions[ i3 + 0 ] = xnew;
            this.positions[ i3 + 1 ] = ynew;
            // this.positions[ i3 + 2 ] = RATIO * this.positions[ i3 + 2 ] + (1 - RATIO) * this.destinations[ i3 + 2 ] + Math.sin(t) * this.fidgetArray[ i3 + 2 ];
        }
        this.geometry.attributes.position.needsUpdate = true;
    }
    shape(dotterResult) {
        const w = dotterResult.original.canvas.el.width/6;
        const h = dotterResult.original.canvas.el.height/6;
        const color = new THREE.Color();

        // for (let i = 0; i < dotterResult.dots.length; i += 2) {
        //     const i3 = i * 3/2;
        //     const x = dotterResult.dots[i] - 0.5;
        //     const y = -dotterResult.dots[i+1] + 0.5;

        //     this.destinations[i3]   = x * w;
        //     this.destinations[i3+1] = y * h;
        // }
        for ( let i = 0, i2 = 0, i3 = 0; i < this.count; i++, i2 += 2, i3 += 3 ) {
            if (i2 < dotterResult.dots.length) {
                // update destinations for each particle which has a corresponding destination
                const x = dotterResult.dots[i2] - 0.5;
                const y = -dotterResult.dots[i2+1] + 0.5;

                color.copy(this.color.top).lerp(this.color.bottom, dotterResult.dots[i2+1]);
                this.colorTargets[ i3 + 0 ] = color.r;
                this.colorTargets[ i3 + 1 ] = color.g;
                this.colorTargets[ i3 + 2 ] = color.b;

                this.destinations[i3]   = x * w;
                this.destinations[i3+1] = y * h;
                this.opacityDest[i] = 1;
            }
            else {
                const dotCount3 = dotterResult.dots.length * 3/2;
                // for particles without a destination in this mask image, hide them and move them to the same location as a living particle
                this.destinations[i3]   = this.destinations[ (i3+0) % dotCount3 ];
                this.destinations[i3+1] = this.destinations[ (i3+1) % dotCount3 ];
                this.opacityDest[i] = 0;
            }
        }
        this.geometry.attributes.opacity.needsUpdate = true;
        this.geometry.attributes.customColor.needsUpdate = true;

        // refresh the tween timers
        this.tweenTimer.fill(0);
    }
}
