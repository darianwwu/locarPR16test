import { Webcam, LocationBased, DeviceOrientationControls } from "locar";
AFRAME.registerComponent("locar-webcam", {
  schema: {
    idealWidth: {
      type: "number",
      default: 1024
    },
    idealHeight: {
      type: "number",
      default: 768
    },
    videoElement: {
      type: "string",
      default: ""
    }
  },
  init: function() {
    const cam = new Webcam({
      idealWidth: this.data.idealWidth,
      idealHeight: this.data.idealHeight
    }, this.data.videoElement || null);
    cam.on("webcamstarted", (ev) => {
      this.el.object3D.background = ev.texture;
    });
    cam.on("webcamerror", (error) => {
      this.el.emit("webcamerror", error);
    });
  }
});
AFRAME.registerComponent("locar-camera", {
  schema: {
    simulateLatitude: {
      type: "number",
      default: 0
    },
    simulateLongitude: {
      type: "number",
      default: 0
    },
    simulateAltitude: {
      type: "number",
      default: -Number.MAX_VALUE
    },
    positionMinAccuracy: {
      type: "number",
      default: 100
    },
    smoothingFactor: {
      type: "number",
      default: 1
    }
  },
  init: function() {
    this.locar = new LocationBased(
      this.el.sceneEl.object3D,
      this.el.object3D
    );
    this.locar.on("gpsupdate", (ev) => {
      this.el.emit("gpsupdate", ev);
    });
    this.locar.on("gpserror", (ev) => {
      this.el.emit("gpserror", ev);
    });
    if (this._isMobile()) {
      this.deviceOrientationControls = new DeviceOrientationControls(this.el.object3D, { smoothingFactor: this.data.smoothingFactor });
      this.deviceOrientationControls.on("deviceorientationgranted", (ev) => {
        ev.target.connect();
      });
      this.deviceOrientationControls.on("deviceorientationerror", (error) => {
        alert(`Device orientation error: code ${error.code} message ${error.message}`);
      });
      this.deviceOrientationControls.init();
    }
  },
  update: function(oldData) {
    this.locar.setGpsOptions({
      gpsMinAccuracy: this.data.positionMinAccuracy,
      gpsMinDistance: this.data.gpsMinDistance
    });
    if (this.data.simulateLatitude != (oldData == null ? void 0 : oldData.simulateLatitude) || this.data.simulateLongitude != (oldData == null ? void 0 : oldData.simulateLongitude)) {
      this.locar.stopGps();
      this.locar.fakeGps(
        this.data.simulateLongitude,
        this.data.simulateLatitude
      );
      this.data.simulateLongitude = 0;
      this.data.simulateLatitude = 0;
    }
    if (this.data.simulateAltitude > -Number.MAX_VALUE) {
      this.locar.setElevation(this.data.simulateAltitude + 1.6);
    }
  },
  play: function() {
    this.locar.startGps();
  },
  pause: function() {
    this.locar.stopGps();
  },
  /**
   * Convert longitude and latitude to three.js/WebGL world coordinates.
   * Uses the specified projection, and negates the northing (in typical
   * projections, northings increase northwards, but in the WebGL coordinate
   * system, we face negative z if the camera is at the origin with default
   * rotation).
   * @param {number} lon - The longitude.
   * @param {number} lat - The latitude.
   * @return {Array} a two member array containing the WebGL x and z coordinates
   */
  lonLatToWorldCoords: function(lon, lat) {
    return this.locar.lonLatToWorldCoords(lon, lat);
  },
  tick: function() {
    var _a;
    (_a = this.deviceOrientationControls) == null ? void 0 : _a.update();
  },
  _isMobile: function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints != null && navigator.maxTouchPoints > 1;
  }
});
AFRAME.registerComponent("locar-entity-place", {
  schema: {
    latitude: {
      type: "number",
      default: 0
    },
    longitude: {
      type: "number",
      default: 0
    }
  },
  init: function() {
    const locarEl = this.el.sceneEl.querySelector("[locar-camera]");
    this.locarCamera = locarEl.components["locar-camera"];
  },
  update: function(oldData) {
    if (!this.locarCamera) {
      console.error("Cannot update locar-entity-place without a locar-camera component on the scene camera.");
    }
    const projCoords = this.locarCamera.lonLatToWorldCoords(
      this.data.longitude,
      this.data.latitude
    );
    this.el.object3D.position.set(
      projCoords[0],
      this.el.object3D.position.y,
      projCoords[1]
    );
  }
});
