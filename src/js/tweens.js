class Tween {
    static linearTween(t, b, c, d) {
        return c*t/d + b;
    }

    // quadratic easing in - accelerating from zero velocity
    static easeInQuad(t, b, c, d) {
        t /= d;
        return c*t*t + b;
    }

    // quadratic easing out - decelerating to zero velocity
    static easeOutQuad(t, b, c, d) {
        t /= d;
        return -c * t*(t-2) + b;
    }

    // quadratic easing in/out - acceleration until halfway, then deceleration
    static easeInOutQuad(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    }

    // cubic easing in - accelerating from zero velocity
    static easeInCubic(t, b, c, d) {
        t /= d;
        return c*t*t*t + b;
    }

    // cubic easing out - decelerating to zero velocity
    static easeOutCubic(t, b, c, d) {
        t /= d;
        t--;
        return c*(t*t*t + 1) + b;
    }

    // cubic easing in/out - acceleration until halfway, then deceleration
    static easeInOutCubic(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    }

    // quartic easing in - accelerating from zero velocity
    static easeInQuart(t, b, c, d) {
        t /= d;
        return c*t*t*t*t + b;
    }

    // quartic easing out - decelerating to zero velocity
    static easeOutQuart(t, b, c, d) {
        t /= d;
        t--;
        return -c * (t*t*t*t - 1) + b;
    }

    // quartic easing in/out - acceleration until halfway, then deceleration
    static easeInOutQuart(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t*t + b;
        t -= 2;
        return -c/2 * (t*t*t*t - 2) + b;
    }

    // quintic easing in - accelerating from zero velocity
    static easeInQuint(t, b, c, d) {
        t /= d;
        return c*t*t*t*t*t + b;
    }

    // quintic easing out - decelerating to zero velocity
    static easeOutQuint(t, b, c, d) {
        t /= d;
        t--;
        return c*(t*t*t*t*t + 1) + b;
    }

    // quintic easing in/out - acceleration until halfway, then deceleration
    static easeInOutQuint(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t*t*t + 2) + b;
    }

    // sinusoidal easing in - accelerating from zero velocity
    static easeInSine(t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    }

    // sinusoidal easing out - decelerating to zero velocity
    static easeOutSine(t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    }

    // sinusoidal easing in/out - accelerating until halfway, then decelerating
    static easeInOutSine(t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    }

    // exponential easing in - accelerating from zero velocity
    static easeInExpo(t, b, c, d) {
        return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
    }

    // exponential easing out - decelerating to zero velocity
    static easeOutExpo(t, b, c, d) {
        return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
    }

    // exponential easing in/out - accelerating until halfway, then decelerating
    static easeInOutExpo(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
        t--;
        return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
    }

    // circular easing in - accelerating from zero velocity
    static easeInCirc(t, b, c, d) {
        t /= d;
        return -c * (sqrt(1 - t*t) - 1) + b;
    }

    // circular easing out - decelerating to zero velocity
    static easeOutCirc(t, b, c, d) {
        t /= d;
        t--;
        return c * sqrt(1 - t*t) + b;
    }

    // circular easing in/out - acceleration until halfway, then deceleration
    static easeInOutCirc(t, b, c, d) {
        t /= d/2;
        if (t < 1) return -c/2 * (sqrt(1 - t*t) - 1) + b;
        t -= 2;
        return c/2 * (sqrt(1 - t*t) + 1) + b;
    }
}
