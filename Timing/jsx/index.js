(function (thisObj) {

var config = {
  version: version,
  id: "work.xiaolin.timing",
  displayName: "Timing",
  symlink: "local",
  port: 3000,
  servePort: 5000,
  startingDebugPort: 8860,
  extensionManifestVersion: 6.0,
  requiredRuntimeVersion: 9.0,
  hosts: [{
    name: "AEFT",
    version: "[0.0,99.9]"
  }],
  type: "Panel",
  iconDarkNormal: "./src/assets/light-icon.png",
  iconNormal: "./src/assets/dark-icon.png",
  iconDarkNormalRollOver: "./src/assets/light-icon.png",
  iconNormalRollOver: "./src/assets/dark-icon.png",
  parameters: ["--v=0", "--enable-nodejs", "--mixed-context"],
  width: 500,
  height: 550,
  panels: [{
    mainPath: "./main/index.html",
    name: "main",
    panelDisplayName: "Timing",
    autoVisible: true,
    width: 600,
    height: 650
  }],
  build: {
    jsxBin: "off",
    sourceMap: true
  },
  zxp: {
    country: "US",
    province: "CA",
    org: "XiaolinStudio",
    password: "mypassword",
    tsa: "http://timestamp.digicert.com/",
    sourceMap: false,
    jsxBin: "off"
  },
  installModules: [],
  copyAssets: [],
  copyZipAssets: []
};

var ns = config.id;
var AndroidAnimation = {
  physics: {
    spring: "SpringAnimation",
    fling: "FlingAnimation"
  },
  interpolator: {
    accelerate: "AccelerateInterpolator",
    decelerate: "DecelerateInterpolator",
    accelerateDecelerate: "AccelerateDecelerateInterpolator",
    anticipate: "AnticipateInterpolator",
    overshoot: "OvershootInterpolator",
    anticipateOvershoot: "AnticipateOvershootInterpolator",
    cycle: "CycleInterpolator",
    bounce: "BounceInterpolator"
  }
};
var iOSAnimation = {
  spring: {
    perceptualDuration: "Duration",
    frequencyResponse: "Response",
    physics: "Physics"
  }
};

var applyAndroidFlingExpression = function applyAndroidFlingExpression(arg) {
  var comp = app.project.activeItem;
  var errorMessages = [];
  if (comp && comp instanceof CompItem) {
    var layers = comp.selectedLayers;
    if (layers.length > 0) {
      app.beginUndoGroup("Apply Expression");
      for (var i = 0; i < layers.length; i++) {
        var properties = layers[i].selectedProperties;
        if (properties.length > 0) {
          for (var j = 0; j < properties.length; j++) {
            var property = properties[j];
            var keys = property.selectedKeys;
            if (keys.length > 0) {
              property.expression = ExpressionAndroidFling(keys[0], arg.params);
            } else {
              var layerName = layers[i].name;
              var propName = property.name;
              errorMessages.push("Layer: " + layerName + " - Property: " + propName);
            }
          }
        }
      }
      app.endUndoGroup();
    } else {
      alert("Please select some layers.");
    }
  } else {
    alert("Please select some layers.");
  }
  if (errorMessages.length > 0) {
    alert("The layer properties that have not selected enough keyframes are as follows:\n" + errorMessages.join("\n"));
  }
};
var applyExpression = function applyExpression(func) {
  var comp = app.project.activeItem;
  var errorMessages = [];
  if (comp && comp instanceof CompItem) {
    var layers = comp.selectedLayers;
    if (layers.length > 0) {
      app.beginUndoGroup("Apply Expression");
      for (var i = 0; i < layers.length; i++) {
        var properties = layers[i].selectedProperties;
        if (properties.length > 0) {
          for (var j = 0; j < properties.length; j++) {
            var property = properties[j];
            var keys = property.selectedKeys;
            if (keys.length === 2) {
              func(property, keys[0]);
            } else {
              var layerName = layers[i].name;
              var propName = property.name;
              errorMessages.push("Layer: " + layerName + " - Property: " + propName);
            }
          }
        }
      }
      app.endUndoGroup();
    } else {
      alert("Please select some layers.");
    }
  } else {
    alert("Please select some layers.");
  }
  if (errorMessages.length > 0) {
    alert("The layer properties that have not selected enough keyframes are as follows:\n" + errorMessages.join("\n"));
  }
};
var applyAndroidExpression = function applyAndroidExpression(arg) {
  var apply = function apply(property, key) {
    switch (arg.option) {
      case AndroidAnimation.physics.spring:
        property.expression = ExpressionAndroidSpring(key, arg.params);
        break;
      case AndroidAnimation.interpolator.accelerate:
        property.expression = ExpressionAndroidAccelerate(key, arg.params);
        break;
      case AndroidAnimation.interpolator.decelerate:
        property.expression = ExpressionAndroidDecelerate(key, arg.params);
        break;
      case AndroidAnimation.interpolator.accelerateDecelerate:
        property.expression = ExpressionAndroidAccelerateDecelerate(key);
        break;
      case AndroidAnimation.interpolator.anticipate:
        property.expression = ExpressionAndroidAnticipate(key, arg.params);
        break;
      case AndroidAnimation.interpolator.overshoot:
        property.expression = ExpressionAndroidOvershoot(key, arg.params);
        break;
      case AndroidAnimation.interpolator.anticipateOvershoot:
        property.expression = ExpressionAndroidAnticipateOvershoot(key, arg.params);
        break;
      case AndroidAnimation.interpolator.cycle:
        property.expression = ExpressionAndroidCycle(key, arg.params);
        break;
      case AndroidAnimation.interpolator.bounce:
        property.expression = ExpressionAndroidBounce(key);
        break;
    }
  };
  applyExpression(apply);
};
var applyIOSExpression = function applyIOSExpression(arg) {
  var apply = function apply(property, key) {
    switch (arg.option) {
      case iOSAnimation.spring.perceptualDuration:
        property.expression = ExpressionIOSSpringDuration(key, arg.params);
        break;
      case iOSAnimation.spring.frequencyResponse:
        property.expression = ExpressionIOSSpringResponse(key, arg.params);
        break;
      case iOSAnimation.spring.physics:
        property.expression = ExpressionIOSSpringPhysics(key, arg.params);
        break;
    }
  };
  applyExpression(apply);
};
var applyMIUIExpression = function applyMIUIExpression(params) {
  var apply = function apply(property, key) {
    property.expression = ExpressionMIUI(key, params);
  };
  applyExpression(apply);
};
var ExpressionSpring = function ExpressionSpring(clamp) {
  return "\n  var s = from - to;\n  var c = w * z;\n  var a = w * Math.sqrt(Math.abs(1 - z * z));\n\n  if (z > 1) {\n    // Overdamped\n    const A = a * s;\n    const B = v + c * s;\n    return to + (Math.exp(-c * t) * (A * Math.cosh(a * t) + B * Math.sinh(a * t))) / a;\n  } else if (z === 1) {\n    // Critically damped\n    const A = s;\n    const B = v + c * s;\n    return to + Math.exp(-c * t) * (A + B * t);\n  } else {\n    // Underdamped\n    const A = s;\n    const B = (v + c * s) / a;\n    return to + Math.exp(-c * t) * (A * Math.cos(a * t) + B * Math.sin(a * t));\n  }\n}\n\nfunction timing() {\n  try {\n    var from = key(fromKey);\n    var to = key(fromKey + 1);\n  } catch (e) {\n    return null;\n  }\n\n  var dim = 1;\n  try {\n    from[1];\n    dim = 2;\n    from[2];\n    dim = 3;\n  } catch (e) {}\n\n  var t = time - from.time;\n\n  if (time < from.time ".concat(clamp ? "|| time > to.time" : "", ") {\n    return value;\n  }\n\n  var result = [];\n  for (var i = 0; i < dim; i++) {\n    result.push(springTimingFunction(to[i], from[i], t));\n  }\n\n  return dim === 1 ? result[0] : result;\n}\n\ntiming() || value;");
};
var ExpressionAndroidSpring = function ExpressionAndroidSpring(key, params) {
  return "/* Android SpringAnimation Expression */\n// Variables\nvar stiffness = ".concat(params.stiffness, ";\nvar dampingRatio = ").concat(params.dampingRatio, ";\nvar startVelocity = 0;\n\nvar fromKey = ").concat(key, ";\n\n// Functions\nfunction springTimingFunction(to, from, t) {\n  var z = dampingRatio;\n  var w = Math.sqrt(stiffness);\n  var v = startVelocity;\n").concat(ExpressionSpring(params.clamp));
};
var ExpressionAndroidFling = function ExpressionAndroidFling(key, params) {
  return "/* Android FlingAnimation Expression */\n// Variables\nvar startVelocity = ".concat(params.startVelocity, ";\nvar frictionMultiplier = ").concat(params.frictionMultiplier, ";\n\nvar fromKey = ").concat(key, ";\n\n// Functions\nfunction flingTimingFunction(from, velocity, t) {\n  var ExponentialDecayFriction = -4.2;\n  var friction = frictionMultiplier * ExponentialDecayFriction;\n  return from - (velocity / friction) * (1 - Math.exp(friction * t));\n}\n\nfunction timing() {\n  var from;\n  try {\n    from = key(fromKey);\n  } catch (e) {\n    return value;\n  }\n\n  var dim = 1;\n  try {\n    from[1];\n    dim = 2;\n    from[2];\n    dim = 3;\n  } catch (e) {}\n\n  var t = time - from.time;\n\n  if (time < from.time) {\n    return value;\n  }\n\n  var result = [];\n  for (var i = 0; i < dim; i++) {\n    result.push(flingTimingFunction(from[i], startVelocity, t));\n  }\n\n  return dim === 1 ? result[0] : result;\n}\n\ntiming() || value;");
};
var ExpressionInterpolationTemplate = "\nfunction timingFunction(t, b, c, d) {\n  return c * getInterpolation(t/d) + b;\n}\n\nfunction timing() {\n  try {\n    var from = key(startKeyIndex);\n    var to = key(startKeyIndex + 1);\n  } catch (e) {\n    return null;\n  }\n\n  var dim = 1;\n  try {\n    from[1];\n    dim = 2;\n    from[2];\n    dim = 3;\n  } catch (e) {}\n\n  var t = time - from.time;\n  var d = to.time - from.time;\n\n  if (time < from.time || time > to.time) {\n    return value;\n  }\n\n  var result = [];\n  for (var i = 0; i < dim; i++) {\n    result.push(timingFunction(t, from[i], to[i] - from[i], d));\n  }\n\n  return dim === 1 ? result[0] : result;\n}\n\ntiming() || value;";
var ExpressionAndroidAccelerate = function ExpressionAndroidAccelerate(key, params) {
  return "/* Android AccelerateInterpolator Expression */\nvar startKeyIndex = ".concat(key, ";\nfunction getInterpolation(x) {\n  return Math.pow(x, 2 * ").concat(params.factor, ");\n}\n").concat(ExpressionInterpolationTemplate);
};
var ExpressionAndroidDecelerate = function ExpressionAndroidDecelerate(key, params) {
  return "/* Android DecelerateInterpolator Expression */\nvar startKeyIndex = ".concat(key, ";\n\nfunction getInterpolation(x) {\n  return 1 - Math.pow((1 - x), 2 * ").concat(params.factor, ");\n}\n").concat(ExpressionInterpolationTemplate);
};
var ExpressionAndroidAccelerateDecelerate = function ExpressionAndroidAccelerateDecelerate(key) {
  return "/* Android AccelerateDecelerateInterpolator Expression */\nvar startKeyIndex = ".concat(key, ";\nfunction getInterpolation(x) {\n  return (Math.cos((x + 1) * Math.PI) / 2) + 0.5;\n}\n").concat(ExpressionInterpolationTemplate);
};
var ExpressionAndroidAnticipate = function ExpressionAndroidAnticipate(key, params) {
  return "/* Android AnticipateInterpolator Expression */\nvar startKeyIndex = ".concat(key, ";\nfunction getInterpolation(x) {\n  return x * x * ((").concat(params.tension, " + 1) * x - ").concat(params.tension, ");\n}\n").concat(ExpressionInterpolationTemplate);
};
var ExpressionAndroidOvershoot = function ExpressionAndroidOvershoot(key, params) {
  return "/* Android OvershootInterpolator Expression */\nvar startKeyIndex = ".concat(key, ";\nfunction getInterpolation(x) {\n  x -= 1;\n  return x * x * ((").concat(params.tension, " + 1) * x + ").concat(params.tension, ") + 1;\n}\n").concat(ExpressionInterpolationTemplate);
};
var ExpressionAndroidAnticipateOvershoot = function ExpressionAndroidAnticipateOvershoot(key, params) {
  return "/* Android AnticipateOvershootInterpolator Expression */\nvar startKeyIndex = ".concat(key, ";\nfunction getInterpolation(x) {\n  var tension = ").concat(params.tension, " * ").concat(params.extraTension, ";\n  function a(t, s) {\n    return t * t * ((s + 1) * t - s);\n  }\n  function o(t, s) {\n    return t * t * ((s + 1) * t + s);\n  }\n\n  if (x < 0.5) {\n    return 0.5 * a(x * 2, tension);\n  } else {\n    return 0.5 * (o(x * 2 - 2, tension) + 2);\n  }\n}\n").concat(ExpressionInterpolationTemplate);
};
var ExpressionAndroidCycle = function ExpressionAndroidCycle(key, params) {
  return "/* Android CycleInterpolator Expression */\nvar startKeyIndex = ".concat(key, ";\nfunction getInterpolation(x) {\n  return Math.sin(2 * ").concat(params.cycle, " * Math.PI * x);\n}\n").concat(ExpressionInterpolationTemplate);
};
var ExpressionAndroidBounce = function ExpressionAndroidBounce(key) {
  return "/* Android BounceInterpolator Expression */\nvar startKeyIndex = ".concat(key, ";\nfunction getInterpolation(x) {\n  function bounce(t) { return t * t * 8; }\n  \n  x *= 1.1226;\n  if (x < 0.3535) return bounce(x);\n  else if (x < 0.7408) return bounce(x - 0.54719) + 0.7;\n  else if (x < 0.9644) return bounce(x - 0.8526) + 0.9;\n  else return bounce(x - 1.0435) + 0.95;\n}\n").concat(ExpressionInterpolationTemplate);
};
var ExpressionMIUI = function ExpressionMIUI(key, params) {
  return "/* MIUI Folme Spring Expression */\n// Variables\nvar response = ".concat(params.response, ";\nvar damping = ").concat(params.dampingFraction, ";\nvar startVelocity = 0;\n\nvar fromKey = ").concat(key, ";\n\n// Functions\nfunction springTimingFunction(to, from, t) {\n  var z = damping;\n  var w = (2 * Math.PI) / response;\n  var v = startVelocity;\n").concat(ExpressionSpring(params.clamp));
};
var ExpressionIOSSpringDuration = function ExpressionIOSSpringDuration(key, params) {
  return "/* iOS Spring with Duration Expression */\n// Variables\nvar duration = ".concat(params.duration, ";\nvar bounce = ").concat(params.bounce, ";\nvar initialVelocity = 0;\n\nvar fromKey = ").concat(key, ";\n\n// Functions\nfunction springTimingFunction(to, from, t) {\n  var z = 1 - bounce;\n  var w = (2 * Math.PI) / duration;\n  var v = initialVelocity;\n").concat(ExpressionSpring(params.clamp));
};
var ExpressionIOSSpringResponse = function ExpressionIOSSpringResponse(key, params) {
  return "/* iOS Spring with Response Expression */\n// Variables\nvar response = ".concat(params.response, ";\nvar dampingFraction = ").concat(params.dampingFraction, ";\nvar initialVelocity = 0;\n\nvar fromKey = ").concat(key, ";\n\n// Functions\nfunction springTimingFunction(to, from, t) {\n  var z = dampingFraction;\n  var w = (2 * Math.PI) / response;\n  var v = initialVelocity;\n").concat(ExpressionSpring(params.clamp));
};
var ExpressionIOSSpringPhysics = function ExpressionIOSSpringPhysics(key, params) {
  return "/* iOS Spring with Physics Expression */\n// Variables\nvar mass = ".concat(params.mass, ";\nvar stiffness = ").concat(params.stiffness, ";\nvar damping = ").concat(params.damping, ";\nvar initialVelocity = 0;\n\nvar fromKey = ").concat(key, ";\n\n// Functions\nfunction springTimingFunction(to, from, t) {\n  var z = damping / (2 * Math.sqrt(stiffness * mass));\n  var w = Math.sqrt(stiffness / mass);\n  var v = initialVelocity;\n").concat(ExpressionSpring(params.clamp));
};

var aeft = /*#__PURE__*/__objectFreeze({
  __proto__: null,
  applyAndroidFlingExpression: applyAndroidFlingExpression,
  applyAndroidExpression: applyAndroidExpression,
  applyIOSExpression: applyIOSExpression,
  applyMIUIExpression: applyMIUIExpression
});

var main;
switch (BridgeTalk.appName) {
  case "aftereffects":
  case "aftereffectsbeta":
    main = aeft;
    break;
}

var host = typeof $ !== "undefined" ? $ : window;
host[ns] = main;
