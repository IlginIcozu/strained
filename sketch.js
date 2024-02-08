var styles = `
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
body {
  overflow: hidden;
  touch-action: none;
  background: #252525;
}
main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
canvas {
  width: auto !important;
  height: auto !important;
  max-width: 100% !important;
  max-height: 100% !important;
 /* box-shadow: 0px 0px 40px #000000;*/
}
`
var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

let w;
let h
let pix = 2
let s, c, pg, pg2, img, sh
let i, f, g, k
let frameMod
let blurShader

let seed1 = 99999999 * mathRand()
let borderStr
let uOctave
let border
let blockColor, blockColor2, blockColor3
let stopCount = 1
let far
let blockW, blockH
let yatayChooser
let sChooser
let mapChooser
let ellipseChooser
let akChooser
let dirChooser
let whEdgeX
let probb
let borderBox

let theVertex1 = `
#ifdef GL_ES
precision highp float;
#endif
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`
let theVertex2 = `
#ifdef GL_ES
  precision highp float;
  #endif
  attribute vec3 aPosition;
  void main(){
    gl_Position=vec4(aPosition,1.0);
  }
`
let fbmfrag = `
precision highp float;
#define PI 3.14159265359
varying vec2 vTexCoord;
uniform sampler2D uTexture0;
uniform float u_time;
uniform vec2 uResolution;
uniform float u_octave;
uniform float u_fbmAmp;
uniform float u_roundness;
uniform float u_angleC;
highp float random(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 fu = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = fu * fu * (3.0 - 2.0 * fu);
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
#define OCTAVES 4
float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = 0.25;
    float frequency = 0.1;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude* noise(st);
        st *= u_octave + u_time/100.0;
        amplitude *= .45; 
    }
    return value;
}
float fbm6( in vec2 p ){
    vec2 q = vec2( fbm( p + vec2(0.0,u_roundness) ),
                   fbm( p + vec2(0.0,2.0) ) );
    vec2 r = vec2( fbm( p + 4.0*q + vec2(4.0,3.0)),
                   fbm( p + 4.0*q + vec2(u_angleC * 4.0,0.0)));
    return fbm( p + u_fbmAmp* r ); // 2.0, 6.0
}
void main() {
  vec2 st = gl_FragCoord.xy/uResolution.xy;
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec2 texelSize = 1.0 / uResolution;
  vec2 offset;
  float scale = 0.1;
  float offset2 = 0.1;
  float angle;

  angle = noise(st + uv * 0.2) * PI * 2.0; //0.01 0.4
  float radius = offset2;
  st *= scale;
  st *= radius * vec2(fract(angle *  st.x), fract(angle / st.y));

  offset = texelSize  * vec2(4.0,4.0) - fbm6(uv) + 0.18;
  vec4 color = vec4(0.0);
  float div;
  
  color += texture2D(uTexture0, uv + vec2(offset.y, st.y)); 
  color += texture2D(uTexture0, uv + vec2(-offset.y, st.y)); 
  color += texture2D(uTexture0, uv + vec2(-offset.x, st.x)); 
  color += texture2D(uTexture0, uv + vec2(offset.x, st.x)); 

  color += texture2D(uTexture0, uv + vec2(offset.y, -st.y)); 
  color += texture2D(uTexture0, uv + vec2(-offset.y, -st.y)); 
  color += texture2D(uTexture0, uv + vec2(-offset.x, -st.x)); 
  color += texture2D(uTexture0, uv + vec2(offset.x, -st.x)); 
  div = 8.0;
  color /= div;      
  gl_FragColor = color;
}
`

let pixfrag = `
#ifdef GL_ES
precision highp float;
#endif
#define PI 3.14159265359
const float PHI = 1.61803398874989484820459;
const float SEED = 43758.0;
uniform vec2 resolution;
uniform sampler2D pg;
uniform sampler2D pg2;
uniform sampler2D img;
uniform float ak;
uniform float dirX;
uniform float dirY;
uniform float satOn;
uniform float proD;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  uv.y = 1. - uv.y;

  vec2 offset;
  vec2 pgCol;
  offset = vec2(texture2D(pg2, uv).r * 10. * ak ) * vec2(1./resolution.x, 1./resolution.y)  * random(uv/1.0);
  pgCol = vec2(texture2D(pg, uv));

  if(satOn == 1.0){/////sadece düz
    if(pgCol.x < proD) offset.x *= dirX * -1.;
     else offset.x *= dirX;
    if(pgCol.y < proD) offset.y *= dirY * -1.;
     else  offset.y *= dirY;
  }else if(satOn == 2.0){////bu kose
    if(pgCol.x < .5) offset.x *= -1.;
      else if(pgCol.x < 1.) offset.x *= dirX;
    if(pgCol.y < .5) offset.y *= -1.;
      else if(pgCol.y < 1.) offset.y *= dirY;
  }else{////////bu da hepsi
    if(pgCol.x < .1) offset.x *= -1.;
      else offset.x *= dirX;
    if(pgCol.y < .1) offset.y *= -1.;
      else  offset.y *= dirY;
  }

  vec3 c = texture2D(img, uv + offset).rgb ;
  
  vec3 hsv = rgb2hsv(c.rgb);
  hsv.y *= 1.0005;
  c.rgb = hsv2rgb(hsv);

  c -= texture2D(img, uv + random(uv/1.0) - offset).rgb;
  c += texture2D(img, uv + random(uv/1.0) + offset).rgb;

  c.rgb = ((c.rgb - vec3(0.5)) * 1.005 + vec3(0.5));


  gl_FragColor = vec4(c, 1.0);
  }
`

function setup() {


  w = windowWidth
  h = windowHeight

  c = createCanvas(w, h, WEBGL)
  pixelDensity(pix)
  f = createGraphics(w, h)
  f.pixelDensity(pix)
  f.colorMode(HSB, 360, 100, 100, 1)
  pg = createGraphics(w, h)
  pg.pixelDensity(pix)
  pg.noStroke()

  g = createGraphics(w, h, WEBGL)
  g.pixelDensity(pix)
  g.colorMode(HSB, 360, 100, 100, 1)
  g.background(0, 0, 80)

  f.background(0, 0, 10)

  pg2 = createGraphics(w, h)
  pg2.pixelDensity(pix)
  pg2.noStroke()

  img = createGraphics(w, h)
  img.pixelDensity(pix)
  img.imageMode(CENTER)
  img.colorMode(HSB, 360, 100, 100, 1)
  img.rectMode(CENTER)

  f.rectMode(CENTER)

  blurShader = g.createShader(theVertex1, fbmfrag)
  sh = createShader(theVertex2, pixfrag)

  // seed1 = 40160455.87489417
  console.log(seed1)
  noiseSeed(seed1)
  randomSeed(seed1)


  let frArr = [25, 50, 75, 50, 25, 50, 75, 50, 50, 75]


  frameMod = frArr[floor(random(frArr.length))]


  far = 30
  frameRate(far)


  f.push();
  f.rectMode(CENTER)
  f.fill(40, 10, 70);
  f.rect(w / 2, h / 2, w * 2, h * 2)
  for (let i = 0; i < 4000; i++) {
    let x = random(-200, width + 200)
    let y = random(-200, height + 200)
    let n = noise(x * 0.01, y * 0.01) / 50

    f.noFill()
    f.stroke(0, 0, 10, random(0.8))
    f.ellipse(x + random(-10, 10), y + random(-10, 10), random(100))
  }

  let b1 = random([1, 2])
  let b2 = random([1, 2])
  let b3 = 1


  let h1 = random([0, 20, 30, 10, 25, 35, 40, 45])


  let h2 = random([180, 220, 150, 160, 170, 190, 200, 240])

  let h3 = random([180, 220, 150, 160, 170, 190, 200, 240, 0, 20, 30, 10, 25, 35, 40, 45])

  let v1X = random(w / 2, w / 1.33)
  let v2X = random(w / 4, w / 2)
  let v1Y = random(h / 2, h / 1.33)
  let v2Y = random(h / 4, h / 2)
  let v1H = random(height / 5, height / 2.25)
  let v1W = random(width / 5, width / 2.25)
  let ed = random(width / 19.2, width / 5)
  let edY = random(height / 19.2, height / 5)
  let ed2 = width / 5
  let ed2Y = height / 5
  let orient = random([0.0, 1.0])


  f.push()
  let yoff1
  if (orient == 0.0) {
    yoff1 = random(-height / 10, height / 10)
    f.translate(0, yoff1)
  } else {
    yoff1 = random(-width / 10, width / 10)
    f.translate(yoff1, 0)
  }


  f.beginShape(TRIANGLES)
  for (let i = 0; i < 200; i++) {
    f.fill(h1 + random(-8, 8), random(50, 70) / 4, random(50, 60) / b1)
    f.stroke(h2, random(50, 70) / 4, random(50, 60) / b1, random(0.4))
    let x
    let y
    let yan = 100
    if (orient == 0.0) {
      x = random(random(ed - yan, ed + yan), v1X - random(ed - yan, ed + yan))
      y = random(h / 2 - random(v1H - yan, v1H + yan), h / 2 + random(v1H - yan, v1H + yan))
    } else {
      x = random(w / 2 - random(v1W - yan, v1W + yan), w / 2 + random(v1W - yan, v1W + yan))
      y = random(random(edY - yan, edY + yan), v1Y - random(edY - yan, edY + yan))
    }

    f.curveVertex(x, y)

    f.endShape()
  }

  f.pop()


  f.push()
  let yoff2
  if (orient == 0.0) {
    yoff2 = random(-height / 10, height / 10)
    f.translate(0, yoff2)
  } else {
    yoff2 = random(-width / 10, width / 10)
    f.translate(yoff2, 0)
  }
  f.beginShape(TRIANGLES)
  for (let i = 0; i < 200; i++) {
    f.fill(h2 + random(-8, 8), random(50, 70) / 4, random(50, 60) / b2)
    f.stroke(h1, random(50, 70) / 4, random(50, 60) / b1, random(0.4))
    let x
    let y
    let yan = 100
    if (orient == 0.0) {
      x = random(v2X + random(ed - yan, ed + yan), w - random(ed - yan, ed + yan))
      y = random(h / 2 - random(v1H - yan, v1H + yan), h / 2 + random(v1H - yan, v1H + yan))
    } else {
      x = random(w / 2 - random(v1W - yan, v1W + yan), w / 2 + random(v1W - yan, v1W + yan))
      y = random(v2Y + random(edY - yan, edY + yan), h - random(edY - yan, edY + yan))
    }


    f.curveVertex(x, y)

    f.endShape()
  }
  f.pop()
  let third = 1.0
  f.push()
  let yoff3
  if (orient == 0.0) {
    yoff3 = random(-height / 10, height / 10)
    f.translate(0, yoff3)
  } else {
    yoff3 = random(-width / 10, width / 10)
    f.translate(yoff3, 0)
  }
  if (third == 1.0) {
    f.beginShape(TRIANGLES)
    for (let i = 0; i < 200; i++) {
      f.fill(h3 + random(-8, 8), random(50, 70) / 4, random(50, 60) / b3)
      f.stroke(h1, random(50, 70) / 4, random(50, 60) / b2, random(0.4))
      let x
      let y
      let yan = 100
      if (orient == 0.0) {
        x = random(w / 2 - random(ed2 - yan, ed2 + yan), w / 2 + random(ed2 - yan, ed2 + yan))
        y = random(h / 2 - random(v1H - yan, v1H + yan), h / 2 + random(v1H - yan, v1H + yan))
      } else {
        x = random(w / 2 - random(v1W - yan, v1W + yan), w / 2 + random(v1W - yan, v1W + yan))
        y = random(h / 2 - random(ed2Y - yan, ed2Y + yan), h / 2 + random(ed2Y - yan, ed2Y + yan))
      }

      f.curveVertex(x, y)
      f.endShape()
    }
  }
  f.pop()

  f.pop();


  minDim = min(width, height)

  sChooser = random([1.0, 2.0, 3.0, 1.0])

  if (sChooser == 1.0) {
    s = minDim / 10
  } else if (sChooser == 2.0) {
    s = minDim / 50
  } else if (sChooser == 3.0) {
    s = minDim / 20
  }

  mapChooser = random([0.0, 0.0, 0.0, 0.0, 1.0, 2.0, 0.0, 0.0])

  ellipseChooser = random([0.0, 0.0, 1.0, 0.0, 0.0])

  if (mapChooser !== 0.0) {
    ellipseChooser = 0
  }

  probb = random([0, 1])

  if (frameMod == 25) {
    akChooser = random([1, 2])
  } else {
    akChooser = random([1, 2, 3, 4, 1, 2])
  }

  dirChooser = random([1.0, 2.0, 3.0, 3.0])


  let dX = random([1., -1., 0.0, 0.0])
  let dY

  if (dX == 1. || dX == -1) {
    dY = 0.0
  } else {
    dY = random([-1, 1])
  }

  let proD = random([.1, .5])


  shader(sh)

  sh.setUniform('resolution', [w * pix, h * pix])
  sh.setUniform('pg', pg2)
  sh.setUniform('pg2', pg2)
  sh.setUniform('img', f)
  sh.setUniform('proD', proD)



  if (dirChooser == 1.0) {
    sh.setUniform('dirX', dX) ///sadece dikeyYatay
    sh.setUniform('dirY', dY)
  } else if (dirChooser == 2.0) {
    sh.setUniform('dirX', random([-1., 1.])) ///sadece kose
    sh.setUniform('dirY', random([-1., 1.]))
  } else if (dirChooser == 3.0) {
    sh.setUniform('dirX', random([-1., 1., 0., 0., 0.])) ////hepsi
    sh.setUniform('dirY', random([-1., 1., 0., 0., 0.]))
  }


  if (akChooser == 1.0) {
    sh.setUniform('ak', 1.)
  } else if (akChooser == 2.0) {
    sh.setUniform('ak', 3.0)
  } else if (akChooser == 3.0) {
    sh.setUniform('ak', 5.0)
  } else if (akChooser == 4.0) {
    sh.setUniform('ak', 10.0)
  }


  sh.setUniform('satOn', dirChooser)



  roundInt = 4
  uPi = 1.0

  uFbmAmp = round(random(30.0, 80.0), roundInt);
  uAngleC = round(random(1), roundInt);
  uAniSpeed = random([2250.0, 2250.0, 2500.0, 2500.0, 3000.0, 3000.0, 3000.0, 3000.0])

  uOctave = 5

  for (let i = 0; i < 2; i++) {
    blurShader.setUniform("uTexture0", f);
    blurShader.setUniform('u_time', millis() / 1000.0)
    blurShader.setUniform("uResolution", [width * pix, height * pix]);

    blurShader.setUniform("u_octave", uOctave);
    blurShader.setUniform("u_fbmAmp", uFbmAmp);
    blurShader.setUniform("u_angleC", uAngleC);

    blurShader.setUniform("u_anispd", uAniSpeed);
    blurShader.setUniform("u_roundness", random(0.1, 1.0));


    g.noStroke()

    g.shader(blurShader);
    g.translate(-width / 2, -height / 2)
    g.rect(0, 0, width, height);


  }

  img.image(g, w / 2, h / 2)

  blockColor = 255
  blockColor2 = 255
  blockColor3 = 255

  blockW = width / 2
  blockH = height / 2
  blockAni = random([0.0, 1.0])

  border = random([0.0, 0.0, 1.0, 1.0, 0.0])

  if (border == 1.0) borderStr = "border"
  yatayChooser = random([0.0, 1.0, 2.0, 4.0, 2.0, 4.0])

  borderBox = random([1, 2])

  whEdgeX = minDim / 10

  noCursor()

}

function draw() {

  let x = (random(w / s) ^ (frameCount / s)) * s
  let y = (random(h / s) ^ (frameCount / s)) * s

  pg.fill(random([0, 255, 127]), random([0, 255, 127]), random([0, 255, 127]))
  pg.rect(x, y, s * 2, s * 2)

  pg2.fill(random([0, 255, 127]), random([0, 255, 127]), random([0, 255, 127]))
  pg2.rect(x, y, s * 2, s * 2)

  if (border == 1.0) {
    pg2.push()
    pg2.fill(blockColor, blockColor2, blockColor3)
    pg2.rectMode(CENTER)
    if (yatayChooser == 0.0) {
      pg2.push()
      pg2.translate(blockW, height / 2)
      pg2.rect(0, 0, width / 10, height)
      pg2.pop()

      pg2.push()
      pg2.translate(blockW - width / 5, height / 2)
      pg2.rect(0, 0, width / 10, height)
      pg2.pop()

      pg2.push()
      pg2.translate(blockW + width / 5, height / 2)
      pg2.rect(0, 0, width / 10, height)
      pg2.pop()

    } else if (yatayChooser == 1.0) {
      pg2.push()
      pg2.translate(width / 2, blockH)
      pg2.rect(0, 0, width, height / 10)
      pg2.pop()

      pg2.push()
      pg2.translate(width / 2, blockH - height / 5)
      pg2.rect(0, 0, width, height / 10)
      pg2.pop()

      pg2.push()
      pg2.translate(width / 2, blockH + height / 5)
      pg2.rect(0, 0, width, height / 10)
      pg2.pop()

    } else if (yatayChooser == 2.0) {
      pg2.push()
      pg2.rectMode(CORNER)
      if (borderBox == 1) {
        pg2.rect(0, 0, width / 2, height / 2)
        pg2.rect(width / 2, height / 2, width, height)
      } else {
        pg2.rect(width / 2, 0, width, height / 2)
        pg2.rect(0, height / 2, width / 2, height)
      }
      pg2.pop()
    } else if (yatayChooser == 4.0) {
      pg2.push()
      pg2.rectMode(CENTER)
      if (borderBox == 1) {
        pg2.rect(width / 2, height / 2, width, height / 2)
      } else {
        pg2.rect(width / 2, height / 2, min(width, height) / 2, height)
      }
      pg2.pop()
    }


    pg2.pop()
  }


  c.image(img, w / 2, h / 2)
  img.image(c, w / 2, h / 2)

  if (frameCount % frameMod == 0) {
    minDim = min(width, height)
    if (sChooser == 1.0) {
      s = random([minDim / 10, minDim / 5, minDim / 20, minDim / 10, minDim / 50])
    } else if (sChooser == 2.0) {
      s = random([minDim / 50, minDim / 20, minDim / 50, minDim / 20])
    } else if (sChooser == 3.0) {
      s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
    }


    for (let y = 0; y < h; y += s) {
      for (let x = 0; x < w; x += s) {
        if (mapChooser == 0) {

        } else if (mapChooser == 1) {
          if (probb == 0) {
            if (x <= width / 2 - s * 2) {
              s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
            } else {
              s = random([minDim / 40, minDim / 20, minDim / 40, minDim / 20])
            }
          } else {
            if (x >= width / 2 - s * 2) {
              s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
            } else {
              s = random([minDim / 40, minDim / 20, minDim / 40, minDim / 20])
            }
          }
        } else {
          if (probb == 0) {
            if (y <= height / 2 - s * 2) {
              s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
            } else {
              s = random([minDim / 40, minDim / 20, minDim / 40, minDim / 20])
            }
          } else {
            if (y >= height / 2 - s * 2) {
              s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
            } else {
              s = random([minDim / 40, minDim / 20, minDim / 40, minDim / 20])
            }
          }
        }

        pg2.fill(random([0, 255, 127]), random([0, 255, 127]), random([0, 255, 127]))

        if (ellipseChooser == 0.0) {
          pg2.rect(x, y, s, s)
        } else {
          pg2.ellipse(x, y, s, s)
        }
      }
    }

    if (akChooser == 1.0) {
      sh.setUniform('ak', random([1., 1., 2.0, 1., 1., 2.0, 3., 1., 1., 1.]))
    } else if (akChooser == 2.0) {
      sh.setUniform('ak', 3.0)
    } else if (akChooser == 3.0) {
      sh.setUniform('ak', 5.0)
    } else if (akChooser == 4.0) {
      sh.setUniform('ak', 10.0)
    }

    let dX = random([1., -1., 0.0, 0.0])
    let dY

    if (dX == 1. || dX == -1) {
      dY = 0.0
    } else {
      dY = random([-1, 1])
    }

    if (dirChooser == 1.0) {
      sh.setUniform('dirX', dX)
      sh.setUniform('dirY', dY)
    } else if (dirChooser == 2.0) {
      sh.setUniform('dirX', random([-1., 1.]))
      sh.setUniform('dirY', random([-1., 1.]))
    } else if (dirChooser == 3.0) {
      sh.setUniform('dirX', random([-1., 1., 0., 0., 0.]))
      sh.setUniform('dirY', random([-1., 1., 0., 0., 0.]))
    }

    blockColor = random([255, 127])
    blockColor2 = random([255, 127])
    blockColor3 = random([255, 127])

    blockW = random([width / 2, width / 4, width / 1.3333])
    blockH = random([height / 2, height / 4, height / 1.3333])

    if (borderStr == "border") {
      border = random([1.0, 1.0, 0.0, 1.0, 1.0])
    }
  }

  sh.setUniform('u_time', millis() / 1000.0)
  sh.setUniform('pg', pg2)
  sh.setUniform('img', img)
  sh.setUniform('pg2', pg2)
  quad(-1, -1, 1, -1, 1, 1, -1, 1)
}


function keyPressed() {
  if (key == ' ') {
    stopCount += 1
    if (stopCount % 2 == 0) {
      frameRate(0)
    } else {
      frameRate(far)
    }
  }
  if (key == "s") {
    saveCanvas("strained", "png")
  }
}
