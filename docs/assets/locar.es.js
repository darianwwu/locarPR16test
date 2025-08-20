var V = (a) => {
  throw TypeError(a);
};
var S = (a, i, e) => i.has(a) || V("Cannot " + e);
var o = (a, i, e) => (S(a, i, "read from private field"), e ? e.call(a) : i.get(a)), f = (a, i, e) => i.has(a) ? V("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(a) : i.set(a, e), u = (a, i, e, t) => (S(a, i, "write to private field"), t ? t.call(a, e) : i.set(a, e), e), O = (a, i, e) => (S(a, i, "access private method"), e);
var G = (a, i, e, t) => ({
  set _(r) {
    u(a, i, r, e);
  },
  get _() {
    return o(a, i, t);
  }
});
import * as R from "three";
import { Vector3 as J, Euler as Y, Quaternion as j, EventDispatcher as $, MathUtils as y } from "three";
var P, z, X, Q, Z;
class tt {
  /**
   * Create a SphMercProjection.
   */
  constructor() {
    f(this, P);
    this.EARTH = 4007501668e-2, this.HALF_EARTH = 2003750834e-2;
  }
  /**
   * Project a longitude and latitude into Spherical Mercator.
   * @param {number} lon - the longitude.
   * @param {number} lat - the latitude.
   * @return {Array} Two-member array containing easting and northing.
   */
  project(i, e) {
    return [O(this, P, z).call(this, i), O(this, P, X).call(this, e)];
  }
  /**
   * Unproject a Spherical Mercator easting and northing.
   * @param {Array} projected - Two-member array containing easting and northing
   * @return {Array} Two-member array containing longitude and latitude 
   */
  unproject(i) {
    return [O(this, P, Q).call(this, i[0]), O(this, P, Z).call(this, i[1])];
  }
  /**
   * Return the projection's ID.
   * @return {string} The value "epsg:3857".
   */
  getID() {
    return "epsg:3857";
  }
}
P = new WeakSet(), z = function(i) {
  return i / 180 * this.HALF_EARTH;
}, X = function(i) {
  var e = Math.log(Math.tan((90 + i) * Math.PI / 360)) / (Math.PI / 180);
  return e * this.HALF_EARTH / 180;
}, Q = function(i) {
  return i / this.HALF_EARTH * 180;
}, Z = function(i) {
  var e = i / this.HALF_EARTH * 180;
  return e = 180 / Math.PI * (2 * Math.atan(Math.exp(e * Math.PI / 180)) - Math.PI / 2), e;
};
class k {
  constructor() {
    this.eventHandlers = {};
  }
  /**
   * Add an event handler.
   * @param {string} eventName - the event to handle.
   * @param {Function} eventHandler - the event handler function.
   */
  on(i, e) {
    this.eventHandlers[i] = e;
  }
  /**
   * Emit an event. 
   * @param {string} eventName - the event to emit.
   * @param ...params - parameters to pass to the event handler. 
   */
  emit(i, ...e) {
    var t;
    (t = this.eventHandlers[i]) == null || t.call(this, ...e);
  }
}
var D, W, A, b, L, I, w, _, C, M, v, F, B, q, K;
class at extends k {
  /**
   * @param {THREE.Scene} scene - The Three.js scene to use.
   * @param {THREE.Camera} camera - The Three.js camera to use. Should usually 
   * be a THREE.PerspectiveCamera.
   * @param {Object} options - Initialisation options for the GPS; see
   * setGpsOptions() below.
   * @param {Object} serverLogger - an object which can optionally log GPS position to a server for debugging. null by default, so no logging will be done. This object should implement a sendData() method to send data (2nd arg) to a given endpoint (1st arg). Please see source code for details. Ensure you comply with privacy laws (GDPR or equivalent) if implementing this.
   */
  constructor(e, t, r = {}, d = null) {
    super();
    f(this, v);
    f(this, D);
    f(this, W);
    f(this, A);
    f(this, b);
    f(this, L);
    f(this, I);
    f(this, w);
    f(this, _);
    f(this, C);
    f(this, M);
    this.scene = e, this.camera = t, u(this, D, new tt()), u(this, A, null), u(this, b, 0), u(this, L, 100), u(this, I, null), this.setGpsOptions(r), u(this, w, null), u(this, _, 0), u(this, C, 0), u(this, M, d);
  }
  /**
   * Set the projection to use.
   * @param {Object} any object which includes a project() method 
   * taking longitude and latitude as arguments and returning an array 
   * containing easting and northing.
   */
  setProjection(e) {
    u(this, D, e);
  }
  /**
   * Set the GPS options.
   * @param {Object} object containing gpsMinDistance and/or gpsMinAccuracy
   * properties. The former specifies the number of metres which the device
   * must move to process a new GPS reading, and the latter specifies the 
   * minimum accuracy, in metres, for a GPS reading to be counted.
   */
  setGpsOptions(e = {}) {
    e.gpsMinDistance !== void 0 && u(this, b, e.gpsMinDistance), e.gpsMinAccuracy !== void 0 && u(this, L, e.gpsMinAccuracy);
  }
  /**
   * Start the GPS on a real device
   * @return {boolean} code indicating whether the GPS was started successfully.
   * GPS errors can be handled by handling the gpserror event.
   */
  async startGps() {
    if (o(this, M)) {
      const t = await (await o(this, M).sendData("/gps/start", {
        gpsMinDistance: o(this, b),
        gpsMinAccuracy: o(this, L)
      })).json();
      u(this, C, t.session);
    }
    return o(this, I) === null ? (u(this, I, navigator.geolocation.watchPosition(
      (e) => {
        O(this, v, q).call(this, e);
      },
      (e) => {
        this.emit("gpserror", e);
      },
      {
        enableHighAccuracy: !0
      }
    )), !0) : !1;
  }
  /**
   * Stop the GPS on a real device
   * @return {boolean} true if the GPS was stopped, false if it could not be
   * stopped (i.e. it was never started).
   */
  stopGps() {
    return o(this, I) !== null ? (navigator.geolocation.clearWatch(o(this, I)), u(this, I, null), !0) : !1;
  }
  /**
   * Send a fake GPS signal. Useful for testing on a desktop or laptop.
   * @param {number} lon - The longitude.
   * @param {number} lat - The latitude.
   * @param {number} elev - The elevation in metres. (optional, set to null
   * for no elevation).
   * @param {number} acc - The accuracy of the GPS reading in metres. May be
   * ignored if lower than the specified minimum accuracy.
   */
  fakeGps(e, t, r = null, d = 0) {
    r !== null && this.setElevation(r), O(this, v, q).call(this, {
      coords: {
        longitude: e,
        latitude: t,
        accuracy: d
      }
    });
  }
  /**
   * Convert longitude and latitude to three.js/WebGL world coordinates.
   * Uses the specified projection, and negates the northing (in typical
   * projections, northings increase northwards, but in the WebGL coordinate
   * system, we face negative z if the camera is at the origin with default
   * rotation).
   * Must not be called until an initial position is determined.
   * @param {number} lon - The longitude.
   * @param {number} lat - The latitude.
   * @return {Array} a two member array containing the WebGL x and z coordinates
   */
  lonLatToWorldCoords(e, t) {
    const r = o(this, D).project(e, t);
    if (o(this, w))
      r[0] -= o(this, w)[0], r[1] -= o(this, w)[1];
    else
      throw "No initial position determined";
    return [r[0], -r[1]];
  }
  /**
   * Add a new AR object at a given latitude, longitude and elevation.
   * @param {THREE.Mesh} object the object
   * @param {number} lon - the longitude.
   * @param {number} lat - the latitude.
   * @param {number} elev - the elevation in metres 
   * (if not specified, 0 is assigned)
   * @param {Object} properties - properties describing the object (for example,
   * the contents of the GeoJSON properties field).
   */
  add(e, t, r, d, m = {}) {
    var n;
    e.properties = m, O(this, v, F).call(this, e, t, r, d), this.scene.add(e), (n = o(this, M)) == null || n.sendData("/object/new", {
      position: e.position,
      x: e.position.x,
      z: e.position.z,
      session: o(this, C),
      properties: m
    });
  }
  /**
   * Set the elevation (y coordinate) of the camera.
   * @param {number} elev - the elevation in metres.
   */
  setElevation(e) {
    this.camera.position.y = e;
  }
}
D = new WeakMap(), W = new WeakMap(), A = new WeakMap(), b = new WeakMap(), L = new WeakMap(), I = new WeakMap(), w = new WeakMap(), _ = new WeakMap(), C = new WeakMap(), M = new WeakMap(), v = new WeakSet(), F = function(e, t, r, d) {
  const m = this.lonLatToWorldCoords(t, r);
  d !== void 0 && (e.position.y = d), [e.position.x, e.position.z] = m;
}, B = function(e, t) {
  u(this, w, o(this, D).project(e, t));
}, q = function(e) {
  var r, d, m;
  let t = Number.MAX_VALUE;
  G(this, _)._++, (r = o(this, M)) == null || r.sendData("/gps/new", {
    gpsCount: o(this, _),
    lat: e.coords.latitude,
    lon: e.coords.longitude,
    acc: e.coords.accuracy,
    session: o(this, C)
  }), e.coords.accuracy <= o(this, L) && (o(this, A) === null ? u(this, A, {
    latitude: e.coords.latitude,
    longitude: e.coords.longitude
  }) : t = O(this, v, K).call(this, o(this, A), e.coords), t >= o(this, b) && (o(this, A).longitude = e.coords.longitude, o(this, A).latitude = e.coords.latitude, o(this, w) || (O(this, v, B).call(this, e.coords.longitude, e.coords.latitude), (d = o(this, M)) == null || d.sendData("/worldorigin/new", {
    gpsCount: o(this, _),
    lat: e.coords.latitude,
    lon: e.coords.longitude,
    session: o(this, C),
    initialPosition: o(this, w)
  })), O(this, v, F).call(this, this.camera, e.coords.longitude, e.coords.latitude), (m = o(this, M)) == null || m.sendData("/gps/accepted", {
    gpsCount: o(this, _),
    cameraX: this.camera.position.x,
    cameraZ: this.camera.position.z,
    session: o(this, C),
    distMoved: t
  }), this.emit("gpsupdate", { position: e, distMoved: t })));
}, /**
 * Calculate haversine distance between two lat/lon pairs.
 *
 * Taken from original A-Frame AR.js location-based components
 */
K = function(e, t) {
  const r = R.MathUtils.degToRad(t.longitude - e.longitude), d = R.MathUtils.degToRad(t.latitude - e.latitude), m = Math.sin(d / 2) * Math.sin(d / 2) + Math.cos(R.MathUtils.degToRad(e.latitude)) * Math.cos(R.MathUtils.degToRad(t.latitude)) * (Math.sin(r / 2) * Math.sin(r / 2));
  return 2 * Math.atan2(Math.sqrt(m), Math.sqrt(1 - m)) * 6371e3;
};
class rt extends k {
  /**
   * Create a Webcam.
   * @param options {Object} - options to use for initialising the camera. 
   * Currently idealWidth and idealHeight properties are understood as well as 
   * This takes a THREE.VideoTexture as an argument which can be used to set 
   * the background of your three.js scene within a callback.
   * @param {string} videoElementSelector - selector to obtain the HTML video 
   * element to render the webcam feed. If a falsy value (e.g. null or 
   * undefined), a video element will be created.
   */
  constructor(i = {}, e) {
    super(), this.sceneWebcam = new R.Scene();
    let t;
    if (e ? t = document.querySelector(e) : (t = document.createElement("video"), t.setAttribute("autoplay", !0), t.setAttribute("playsinline", !0), t.style.display = "none", document.body.appendChild(t)), this.texture = new R.VideoTexture(t), navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const r = {
        video: {
          width: { ideal: i.idealWidth || 1280 },
          height: { ideal: i.idealHeight || 720 },
          facingMode: "environment"
        }
      };
      navigator.mediaDevices.getUserMedia(r).then((d) => {
        t.addEventListener("loadedmetadata", () => {
          t.setAttribute("width", t.videoWidth), t.setAttribute("height", t.videoHeight), t.play(), this.emit("webcamstarted", { texture: this.texture });
        }), t.srcObject = d;
      }).catch((d) => {
        this.emit("webcamerror", {
          code: d.name,
          message: d.message
        });
      });
    } else
      this.emit("webcamerror", {
        code: "LOCAR_NO_MEDIA_DEVICES_API",
        message: "Media devices API not supported"
      });
  }
  /**
   * Free up the memory associated with the webcam.
   * Should be called when your application closes.
   */
  dispose() {
    this.texture.dispose();
  }
}
const N = navigator.userAgent.match(/iPhone|iPad|iPod/i) || /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints != null && navigator.maxTouchPoints > 1, et = new J(0, 0, 1), U = new Y(), it = new j(), nt = new j(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
class ct extends $ {
  /**
    * Create an instance of DeviceOrientationControls.
    * @param {Object} object - the object to attach the controls to
    * (usually your Three.js camera)
    * @param {Object} options - options for DeviceOrientationControls: currently accepts smoothingFactor, enablePermissionDialog
    */
  constructor(i, e = {}) {
    super(), this.eventEmitter = new k();
    const t = this;
    this.object = i, this.object.rotation.reorder("YXZ"), this.enabled = !0, this.deviceOrientation = null, this.screenOrientation = 0, this.alphaOffset = 0, this.orientationOffset = 0, this.initialOffset = null, this.lastCompassY = void 0, this.lastOrientation = null, this.TWO_PI = 2 * Math.PI, this.HALF_PI = 0.5 * Math.PI, this.orientationChangeEventName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation", console.log("Device Orientation Event Name:", this.orientationChangeEventName), this.smoothingFactor = e.smoothingFactor || 1, this.enablePermissionDialog = e.enablePermissionDialog ?? !0;
    const r = function({
      alpha: n,
      beta: s,
      gamma: l,
      webkitCompassHeading: h
    }) {
      if (N) {
        const c = 360 - h;
        t.alphaOffset = y.degToRad(c - n), t.deviceOrientation = { alpha: n, beta: s, gamma: l, webkitCompassHeading: h };
      } else
        n < 0 && (n += 360), t.deviceOrientation = { alpha: n, beta: s, gamma: l };
      window.dispatchEvent(
        new CustomEvent("camera-rotation-change", {
          detail: { cameraRotation: i.rotation }
        })
      );
    }, d = function() {
      t.screenOrientation = window.orientation || 0, N && (t.screenOrientation === 90 ? t.orientationOffset = -t.HALF_PI : t.screenOrientation === -90 ? t.orientationOffset = t.HALF_PI : t.orientationOffset = 0);
    }, m = function(n, s, l, h, c) {
      U.set(l, s, -h, "YXZ"), n.setFromEuler(U), n.multiply(nt), n.multiply(it.setFromAxisAngle(et, -c));
    };
    this.connect = function() {
      d(), window.addEventListener(
        "orientationchange",
        d
      ), window.addEventListener(
        t.orientationChangeEventName,
        r
      ), t.enabled = !0;
    }, this.disconnect = function() {
      window.removeEventListener(
        "orientationchange",
        d
      ), window.removeEventListener(
        t.orientationChangeEventName,
        r
      ), t.enabled = !1, t.initialOffset = !1, t.deviceOrientation = null;
    }, this.requestOrientationPermissions = function() {
      window.DeviceOrientationEvent !== void 0 && typeof window.DeviceOrientationEvent.requestPermission == "function" ? window.DeviceOrientationEvent.requestPermission().then((n) => {
        n === "granted" ? this.eventEmitter.emit("deviceorientationgranted", {
          target: this
        }) : this.eventEmitter.emit("deviceorientationerror", {
          code: "LOCAR_DEVICE_ORIENTATION_PERMISSION_DENIED",
          message: "Permission for device orientation denied - AR will not work correctly"
        });
      }).catch(function(n) {
        this.eventEmitter.emit("deviceorientationerror", {
          code: "LOCAR_DEVICE_ORIENTATION_PERMISSION_FAILED",
          message: "Permission request for device orientation failed - AR will not work correctly"
        });
      }) : this.eventEmitter.emit("deviceorientationerror", {
        code: "LOCAR_DEVICE_ORIENTATION_INTERNAL_ERROR",
        message: "Internal error: no requestPermission() found although requestOrientationPermissions() was called - please raise an issue on GitHub"
      });
    }, this.update = function({ theta: n = 0 } = { theta: 0 }) {
      if (t.enabled === !1) return;
      const s = t.deviceOrientation;
      if (s) {
        let l = s.alpha ? y.degToRad(s.alpha) + t.alphaOffset : 0, h = s.beta ? y.degToRad(s.beta) : 0, c = s.gamma ? y.degToRad(s.gamma) : 0;
        const T = t.screenOrientation ? y.degToRad(t.screenOrientation) : 0;
        if (t.smoothingFactor < 1) {
          if (t.lastOrientation) {
            const g = t.smoothingFactor;
            l = t._getSmoothedAngle(
              l,
              t.lastOrientation.alpha,
              g
            ), h = t._getSmoothedAngle(
              h + Math.PI,
              t.lastOrientation.beta,
              g
            ), c = t._getSmoothedAngle(
              c + t.HALF_PI,
              t.lastOrientation.gamma,
              g,
              Math.PI
            );
          } else
            h += Math.PI, c += t.HALF_PI;
          t.lastOrientation = {
            alpha: l,
            beta: h,
            gamma: c
          };
        }
        if (N) {
          const g = new j();
          m(
            g,
            l,
            t.smoothingFactor < 1 ? h - Math.PI : h,
            t.smoothingFactor < 1 ? c - Math.PI / 2 : c,
            T
          );
          const E = new Y().setFromQuaternion(
            g,
            "YXZ"
          );
          let H = y.degToRad(360 - s.webkitCompassHeading);
          t.smoothingFactor < 1 && t.lastCompassY !== void 0 && (H = t._getSmoothedAngle(H, t.lastCompassY, t.smoothingFactor)), t.lastCompassY = H, E.y = H + (t.orientationOffset || 0), g.setFromEuler(E), t.object.quaternion.copy(g);
        } else
          m(
            t.object.quaternion,
            N ? l + t.alphaOffset : l,
            t.smoothingFactor < 1 ? h - Math.PI : h,
            t.smoothingFactor < 1 ? c - Math.PI / 2 : c,
            T
          );
      }
    }, this.getCorrectedHeading = function() {
      const { deviceOrientation: n } = t;
      if (!n) return 0;
      let s = 0;
      return N ? (s = 360 - n.webkitCompassHeading, t.orientationOffset && (s += t.orientationOffset * (180 / Math.PI), s = (s + 360) % 360)) : (n.absolute === !0 || t.orientationChangeEventName, s = n.alpha ? n.alpha : 0, s = (360 - s) % 360, s < 0 && (s += 360)), s;
    }, this._orderAngle = function(n, s, l = t.TWO_PI) {
      return s > n && Math.abs(s - n) < l / 2 || n > s && Math.abs(s - n) > l / 2 ? { left: n, right: s } : { left: s, right: n };
    }, this._getSmoothedAngle = function(n, s, l, h = t.TWO_PI) {
      const c = t._orderAngle(n, s, h), T = c.left, g = c.right;
      c.left = 0, c.right -= T, c.right < 0 && (c.right += h);
      let E = g == s ? (1 - l) * c.right + l * c.left : l * c.right + (1 - l) * c.left;
      return E += T, E >= h && (E -= h), E;
    }, this.updateAlphaOffset = function() {
      t.initialOffset = !1;
    }, this.dispose = function() {
      t.disconnect();
    }, this.getAlpha = function() {
      const { deviceOrientation: n } = t;
      return n && n.alpha ? y.degToRad(n.alpha) + t.alphaOffset : 0;
    }, this.getBeta = function() {
      const { deviceOrientation: n } = t;
      return n && n.beta ? y.degToRad(n.beta) : 0;
    }, this.getGamma = function() {
      const { deviceOrientation: n } = t;
      return n && n.gamma ? y.degToRad(n.gamma) : 0;
    }, this.obtainPermissionGesture = function() {
      const n = document.createElement("div"), s = document.createElement("div"), l = document.createElement("div"), h = document.createElement("div");
      document.body.appendChild(n);
      const c = {
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center"
      }, T = {
        backgroundColor: "white",
        padding: "6px",
        borderRadius: "3px",
        width: "36rem",
        height: "24rem"
      }, g = {
        width: "100%",
        height: "70%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }, E = {
        display: "inline-flex",
        width: "100%",
        height: "30%",
        justifyContent: "center",
        alignItems: "center"
      };
      for (let p in c)
        n.style[p] = c[p];
      for (let p in T)
        s.style[p] = T[p];
      for (let p in g)
        l.style[p] = g[p];
      for (let p in E)
        h.style[p] = E[p];
      n.appendChild(s), s.appendChild(l), s.appendChild(h), l.innerHTML = '<div style="font-size: 24pt; margin: 1rem;">This immersive website requires access to your device motion sensors.</div>';
      const H = () => {
        this.requestOrientationPermissions(), n.style.display = "none";
      }, x = document.createElement("button");
      x.addEventListener("click", H), x.style.width = "50%", x.style.height = "80%", x.style.fontSize = "20pt", x.appendChild(document.createTextNode("OK")), h.appendChild(x), document.body.appendChild(n);
    };
  }
  on(i, e) {
    this.eventEmitter.on(i, e);
  }
  init() {
    window.DeviceOrientationEvent === void 0 ? this.eventEmitter.emit("deviceorientationerror", {
      code: "LOCAR_DEVICE_ORIENTATION_NOT_SUPPORTED",
      message: "Device orientation API not supported"
    }) : window.isSecureContext === !1 ? this.eventEmitter.emit("deviceorientationerror", {
      code: "LOCAR_DEVICE_ORIENTATION_NO_HTTPS",
      message: "DeviceOrientationEvent is only available in secure contexts (https)"
    }) : typeof window.DeviceOrientationEvent.requestPermission == "function" && this.enablePermissionDialog ? this.obtainPermissionGesture() : this.eventEmitter.emit("deviceorientationgranted", { target: this });
  }
}
class dt {
  /**
   * Create a ClickHandler.
   * @param {THREE.WebGLRenderer} - The Three.js renderer on which the click
   * events will be handled.
   */
  constructor(i) {
    this.raycaster = new R.Raycaster(), this.normalisedMousePosition = new R.Vector2(null, null), i.domElement.addEventListener("click", (e) => {
      this.normalisedMousePosition.set(
        e.clientX / i.domElement.clientWidth * 2 - 1,
        -(e.clientY / i.domElement.clientHeight * 2) + 1
      );
    });
  }
  /**
   * Cast a ray into the scene to detect objects.
   * @param {THREE.Camera} - The active Three.js camera, from which the ray
   * will be cast.
   * @param {THREE.Scene} - The active Three.js scene, which the ray will be
   * cast into.
   * @return {Array} - array of all intersected objects.
   */
  raycast(i, e) {
    if (this.normalisedMousePosition.x !== null && this.normalisedMousePosition.y !== null) {
      this.raycaster.setFromCamera(this.normalisedMousePosition, i);
      const t = this.raycaster.intersectObjects(e.children, !1);
      return this.normalisedMousePosition.set(null, null), t;
    }
    return [];
  }
}
const lt = "0.0.13-pre3";
export {
  dt as ClickHandler,
  ct as DeviceOrientationControls,
  k as EventEmitter,
  at as LocationBased,
  tt as SphMercProjection,
  rt as Webcam,
  lt as version
};
