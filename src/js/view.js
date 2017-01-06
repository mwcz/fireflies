class ParticleView {
    constructor(particleCount) {
        this.particleCount = particleCount || 100000;

        this.init();
        this.animate();

    }
    init() {
        var renderer, scene, camera;
        var particleSystem, uniforms, geometry;
        var WIDTH = window.innerWidth;
        var HEIGHT = window.innerHeight;
        camera = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 1, 10000 );
        camera.position.z = 200;
        scene = new THREE.Scene();
        uniforms = {
            color:     { value: new THREE.Color( 0xffffff ) },
            texture:   { value: new THREE.TextureLoader().load( "spark1.png" ) }
        };
        var shaderMaterial = new THREE.ShaderMaterial( {
            uniforms:       uniforms,
            vertexShader:   document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
            blending:       THREE.AdditiveBlending,
            depthTest:      false,
            transparent:    true
        });
        var radius = 200;
        geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array( this.particleCount * 3 );
        this.velocity = new Float32Array( this.particleCount * 3 );
        this.acceleration = new Float32Array( this.particleCount * 3 );
        this.destinations = new Float32Array( this.particleCount * 3 );
        var colors = new Float32Array( this.particleCount * 3 );
        this.opacity = new Float32Array( this.particleCount );
        var sizes = new Float32Array( this.particleCount );
        var color = new THREE.Color();
        for ( var i = 0, i3 = 0; i < this.particleCount; i ++, i3 += 3 ) {
            this.positions[ i3 + 0 ] = ( Math.random() * 2 - 1 ) * 10;;
            this.positions[ i3 + 1 ] = ( Math.random() * 2 - 1 ) * 10;;
            // this.positions[ i3 + 2 ] = 0;
            // this.velocity[ i3 + 0 ] = 0;
            // this.velocity[ i3 + 1 ] = 0;
            // this.velocity[ i3 + 2 ] = 0;
            // this.acceleration[ i3 + 0 ] = 0;
            // this.acceleration[ i3 + 1 ] = 0;
            // this.acceleration[ i3 + 2 ] = 0;
            color.setHSL( (i / this.particleCount) * 0.15 + 0, 1.0, 0.5 );
            colors[ i3 + 0 ] = color.r;
            colors[ i3 + 1 ] = color.g;
            colors[ i3 + 2 ] = color.b;
            sizes[ i ] = 10;
        }
        geometry.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
        geometry.addAttribute( 'opacity', new THREE.BufferAttribute( this.opacity, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
        particleSystem = new THREE.Points( geometry, shaderMaterial );
        scene.add( particleSystem );
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( WIDTH, HEIGHT );
        document.body.appendChild( renderer.domElement );
        //
        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
        this.renderer       = renderer;
        this.scene          = scene;
        this.camera         = camera;
        this.particleSystem = particleSystem;
        this.uniforms       = uniforms;
        this.geometry       = geometry;
    }
    render() {
        // var time = Date.now() * 0.005;
        // particleSystem.rotation.z = 0.01 * time;
        // var sizes = geometry.attributes.size.array;
        // for ( var i = 0; i < this.particleCount; i++ ) {
        //     sizes[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + time ) );
        // }
        // geometry.attributes.size.needsUpdate = true;

        // this.updateAcceleration();
        // this.updateVelocity();
        // this.updatePositions();
        this.updatePositionsLerp();
        this.renderer.render( this.scene, this.camera );
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
    animate() {
        requestAnimationFrame( this.animate.bind(this) );
        this.render();
    }
    updateAcceleration() {
        for ( var i = 0, i3 = 0; i < this.particleCount; i ++, i3 += 3 ) {
            const x = this.positions[ i3 + 0 ];
            const y = this.positions[ i3 + 1 ];
            const destx = this.destinations[ i3 + 0 ];
            const desty = this.destinations[ i3 + 1 ];

            const grav = this.gravity(x, y, destx, desty);

            this.acceleration[ i3 + 0 ] = grav[0];
            this.acceleration[ i3 + 1 ] = grav[1];
            this.acceleration[ i3 + 2 ] = 0;
        }
    }
    updateVelocity() {
        const MAX_VELOCITY = 1;
        for ( var i = 0, i3 = 0; i < this.particleCount; i ++, i3 += 3 ) {
            this.velocity[ i3 + 0 ] += this.acceleration[ i3 + 0 ];
            this.velocity[ i3 + 1 ] += this.acceleration[ i3 + 1 ];
            this.velocity[ i3 + 2 ] += this.acceleration[ i3 + 2 ];
            const mag = Math.sqrt(Math.pow(this.velocity[ i3 ], 2) + Math.pow(this.velocity[ i3 + 1 ], 2));
            if (mag > MAX_VELOCITY) {
            }
        }
    }
    updatePositions() {
        for ( var i = 0, i3 = 0; i < this.particleCount; i ++, i3 += 3 ) {
             this.positions[ i3 + 0 ] += this.velocity[ i3 + 0 ];
             this.positions[ i3 + 1 ] += this.velocity[ i3 + 1 ];
             this.positions[ i3 + 2 ] += this.velocity[ i3 + 2 ];
        }
        this.geometry.attributes.position.needsUpdate = true;
    }
    updatePositionsLerp() {
        const RATIO = 0.97;
        for ( var i = 0, i3 = 0; i < this.particleCount; i ++, i3 += 3 ) {
             this.positions[ i3 + 0 ] = RATIO * this.positions[ i3 + 0 ] + (1 - RATIO) * this.destinations[ i3 + 0 ];
             this.positions[ i3 + 1 ] = RATIO * this.positions[ i3 + 1 ] + (1 - RATIO) * this.destinations[ i3 + 1 ];
             this.positions[ i3 + 2 ] = RATIO * this.positions[ i3 + 2 ] + (1 - RATIO) * this.destinations[ i3 + 2 ];
        }
        this.geometry.attributes.position.needsUpdate = true;
    }
    shape(dotterResult) {
        const w = dotterResult.original.canvas.el.width/6;
        const h = dotterResult.original.canvas.el.height/6;

        // for (let i = 0; i < dotterResult.dots.length; i += 2) {
        //     const i3 = i * 3/2;
        //     const x = dotterResult.dots[i] - 0.5;
        //     const y = -dotterResult.dots[i+1] + 0.5;

        //     this.destinations[i3]   = x * w;
        //     this.destinations[i3+1] = y * h;
        // }
        for ( let i = 0, i2 = 0, i3 = 0; i < this.particleCount; i++, i2 += 2, i3 += 3 ) {
            if (i2 < dotterResult.dots.length) {
                // update destinations for each particle which has a corresponding destination
                const x = dotterResult.dots[i2] - 0.5;
                const y = -dotterResult.dots[i2+1] + 0.5;

                this.destinations[i3]   = x * w;
                this.destinations[i3+1] = y * h;
                this.opacity[i] = 1;
            }
            else {
                // for particles without a destination in this mask image, hide them and move them to origin
                this.destinations[i3]   = ( Math.random() * 2 - 1 ) * 100;
                this.destinations[i3+1] = ( Math.random() * 2 - 1 ) * 100;
                this.opacity[i] = 0;
            }
        }
        this.geometry.attributes.opacity.needsUpdate = true;
    }
    gravity(p1x, p1y, p2x, p2y) {
        const MASS = 1;
        const MAX_ACCEL = 0.1;

        const xd = p2x - p1x;
        const yd = p2y - p1y;

        const xd2 = Math.pow( xd, 2 );
        const yd2 = Math.pow( yd, 2 );
        const r = xd2 + yd2;

        const nv = Math.sqrt(r);

        if (nv === 0) return [0, 0];

        const ux = xd / nv;
        const uy = yd / nv;

        let mag = MASS / r;

        if (Math.abs(mag) > MAX_ACCEL) {
            mag = MAX_ACCEL * Math.abs(mag) / mag;
        }

        let ax = ux * mag;
        let ay = uy * mag;

        return [ax, ay];
    };
}
