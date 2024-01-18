let w;
let h
let pix = 2
let s, c, pg, pg2, img, sh
let i, f, g, k
let frameMod
let pgStr
let aniChooser
let hyperMeter
let blurShader
let rect1C
let rect2C
let pitchShift
let seed = 99999999 * fxrand()
let contChooser
let colCChooser
let celColChooser
let onOffChooser
let satChooser
let sqChooser, sqTriChooser
let borderStr
let aniCount


let player1, player2, player3

let buffer1, buffer2, buffer3, buffer4, buffer5, buffer6, buffer7
let uOctave
let monoStr
let bgStr

let coun = 0
let shaderChooser, shaderChooser2
let rect1X, rect1Y, rect1W, rect1H
let rect2X, rect2Y, rect2W, rect2H
let border
let triChooser
let blockChooser
let blockColor, blockColor2
let sqStr
let stopCount = 1
let fr
let dirC, durC
let satOnOff
let imageBuf
let vid
let blockColor3
let blockW, blockH
let randomCanvas

let yatayChooser



console.log(fxhash)

function preload() {


  console.log(seed)
  noiseSeed(seed)
  randomSeed(seed)

  sh = loadShader("pix.vert", "pix.frag");
  blurShader = loadShader('blur.vert', 'blur.frag')

}

function drawRandomTexture(r, w) {
  randomCanvas = createImage(w, w * r);
  randomCanvas.loadPixels();
  for (let i = 0; i < randomCanvas.width; i++) {
    for (let j = 0; j < randomCanvas.height; j++) {
      randomCanvas.set(i, j, color(random(255)));
    }
  }
  randomCanvas.updatePixels();
  randomSeed(seed)
}



function setup() {


  w = windowWidth
  h = windowHeight

  let ar = w / h

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


  k = createGraphics(w, h, WEBGL)
  k.colorMode(HSB, 360, 100, 100, 1);
  k.background(30, 8, 90);
  k.pixelDensity(pix);

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

  drawRandomTexture(ar, w)

  pgCh = random([1., 2., 3., 1., 2.])

  let frArr = [25, 50, 100, 50, 25, 50, 100, 50, 50]


  frameMod = frArr[floor(random(frArr.length))]

  s = random([50, 50, 100, 100, 300, 200])

  pgStr = random([0, 255, 255, 255, 255])

  pgCh = random([1., 2., 3., 1., 2.])

  aniChooser = random(1)

  rect1C = random(1)
  rect2C = random(1)


  onOffChooser = random([0, 1, 0, 0])
  celColChooser = random(1)
  satChooser = random(1)
  contChooser = random(1)
  colCChooser = random(1)
  shaderChooser = random(1)
  shaderChooser2 = random(1)
  triChooser = random(1)
  blockChooser = random(1)
  sqTriChooser = random(1)
  dirC = random(1)
  durC = random(1)

  celColChooser = 1.0

  if (celColChooser > 0.65) monoStr = "mono"

  if (monoStr == "mono") dirC = random([1.0, 1.0, 0.0, 1.0, 1.0])

  if (pgCh == 3.) pgStr = 0

  pgStr = 255


  hyperMeter = random([4, 8, 8, 8, 12, 12, 8, 8, 4, 4]) / 2
  fr = random([30, 25, 25, 25, 30, 25]) * 2
  frameRate(30)

  sqChooser = random(1)


  if (monoStr == "mono") {
    random(1) < 0.25 ? darkSat = 0 : darkSat = 80
  } else {
    darkSat = 80
  }


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


  let h1 = random([0, 20, 30])


  let h2 = random([180, 220, 150])


  let v1X = random(w / 2, w / 1.33)
  let v2X = random(w / 4, w / 2)
  let v1H = random(100, 500)
  let v2H = random(100, 500)

  f.beginShape(TRIANGLES)
  for (let i = 0; i < 100; i++) {
    f.fill(h1, random(50, 70) / 4, random(50, 60) / b1)
    f.stroke(h2, random(50, 70) / 4, random(50, 60) / b1, random(0.4))
    let x = random(0, v1X)
    let y = random(h / 2 - v1H, h / 2 + v1H)
    f.curveVertex(x, y)
    f.endShape()
  }


  f.beginShape(TRIANGLES)
  for (let i = 0; i < 100; i++) {
    f.fill(h2, random(50, 70) / 4, random(50, 60) / b2)
    f.stroke(h1, random(50, 70) / 4, random(50, 60) / b1, random(0.4))
    f.curveVertex(random(v2X, w), random(h / 2 - v2H, h / 2 + v2H))
    f.endShape()
  }


  f.pop();


  noiseSeed(seed)
  randomSeed(seed)

  shader(sh)

  aniChooser = random([0.0, 1.0])
  aniCount = random(1)

  sh.setUniform('resolution', [w * pix, h * pix])
  sh.setUniform("randomTex", randomCanvas);
  sh.setUniform('pg', pg)
  sh.setUniform('pg2', pg2)
  sh.setUniform('img', f)
  sh.setUniform('ak', 1.)
  sh.setUniform('dirX', random([-1., 1., 0., 0.]))
  sh.setUniform('dirY', random([-1., 1., 0., 0.]))
  sh.setUniform('dirX1', random([-1., 1., -1., 0.]))
  sh.setUniform('dirY1', random([-1., 1., -1., 0.]))
  sh.setUniform('pgC', pgCh)
  sh.setUniform('aniC', aniChooser)
  sh.setUniform('timeM', random([2.0, 4.0, 8.0, 2.0, 4.0, 8.0, 12.0]))
  sh.setUniform('onOff', onOffChooser)
  sh.setUniform('celCol', celColChooser)
  sh.setUniform('satC', satChooser)
  sh.setUniform('contC', contChooser)
  sh.setUniform('colC', colCChooser)
  sh.setUniform('satOn', aniChooser)


  uSqr = 0.0
  roundInt = 4
  uPi = 1.0
  uAmp = random(0.25, 0.35)
  uOctave = round(random(1.0, 2.5), roundInt) * 2;
  uFbmAmp = round(random(30.0, 80.0), roundInt);
  uAngleC = round(random(1), roundInt);
  uAniSpeed = random([2250.0, 2250.0, 2500.0, 2500.0, 3000.0, 3000.0, 3000.0, 3000.0])

  uAmp2 = random(0.25, 0.35)
  uOctave2 = round(random(1.0, 2.5), roundInt)
  uFbmAmp2 = round(random(30.0, 80.0), roundInt);
  uAngleC2 = round(random(1), roundInt);
  uAniSpeed2 = random([2250.0, 2250.0, 2500.0, 2500.0, 3000.0, 3000.0, 3000.0, 3000.0])



  if (sqChooser < 0.50) {
    rect1X = width / 2
    rect1Y = random([height / 4, height - height / 4])
    rect1W = width
    rect1H = height / random(1.9, 2.1)
    sqStr = "yatay"
    if (sqTriChooser < 0.50) {
      rect1X = width / 2
      rect1Y = height / 8
      rect1W = width
      rect1H = height / 3.333

      rect2X = width / 2
      rect2Y = height - height / 8
    }


  } else {
    rect1X = random([width / 4, width - width / 4])
    rect1Y = height / 2
    rect1W = width / random(1.9, 2.1)
    rect1H = height
    sqStr = "dikey"
    if (sqTriChooser < 0.50) {
      rect1X = width / 8
      rect1Y = height / 2
      rect1W = width / 3.333
      rect1H = height

      rect2X = width - width / 8
      rect2Y = height / 2
    }
  }

  for (let i = 0; i < 2; i++) {
    blurShader.setUniform("uTexture0", f);
    blurShader.setUniform('u_time', millis() / 1000.0)
    blurShader.setUniform("uResolution", [width * pix, height * pix]);
    blurShader.setUniform("u_amp", uAmp);
    blurShader.setUniform("u_octave", uOctave);
    blurShader.setUniform("u_fbmAmp", uFbmAmp);
    blurShader.setUniform("u_angleC", uAngleC);
    blurShader.setUniform("u_sqr", uSqr);
    blurShader.setUniform("u_anispd", uAniSpeed);

    g.noStroke()

    g.shader(blurShader);
    g.translate(-width / 2, -height / 2)
    g.rect(0, 0, width, height);


  }
  img.image(g, w / 2, h / 2)

  minDim = min(width, height)
  s = random([minDim / 10, minDim / 15, minDim / 7])

  // console.log(minDim/7)

  blockColor = 255
  blockColor2 = 255
  blockColor3 = 255
  blockW = width / 2
  blockH = height / 2



  border = random([0.0, 1.0, 1.0, 1.0])

  if (border == 1.0) borderStr = "border"
  yatayChooser = random([1.0, 0.0])



}

function draw() {



  let x = (random(w / s) ^ (frameCount / s)) * s
  let y = (random(h / s) ^ (frameCount / s)) * s


  pg.fill(random([0, 255, 127]), random([0, 255, 127]), random([0, 255, 127]))
  pg.rect(x, y, s * 2)
  pg.rect(x, y, s)
  pg.rect(x, y, s / 2)
  pg.rect(x, y, s / 2)


  pg2.fill(random([0, 255, 127]), random([0, 255, 127]), random([0, 255, 127]))

  pg2.rect(x, y, s * 2, s * 2)
  pg2.rect(x, y, s, s)
  pg2.rect(x, y, s / 2, s / 2)


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

    } else {
      /////////////////////////////////////////////yatay
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

    }


    pg2.pop()
  }



  c.image(img, w / 2, h / 2)

  img.image(c, w / 2, h / 2)


  if (frameCount % frameMod == 0) {
    minDim = min(width, height)
    s = random([minDim / 10, minDim / 5, minDim / 20, , minDim / 50]) / 2

    for (let y = 0; y < h; y += s) {
      for (let x = 0; x < w; x += s) {
        pg2.fill(random([0, 255, 127]), random([0, 255, 127]), random([0, 255, 127]))
        pg2.rect(x, y, s * 2, s * 2)
      }
    }


    sh.setUniform('ak', random([1., 1., 2.0, 1., 1., 2.0, 3., 1., 1., 1.]))



    sh.setUniform('dirX', random([-1., 1., 0., 0., 0.]))
    sh.setUniform('dirY', random([-1., 1., 0., 0., 0.]))

    onOffChooser = random([0, 1])

    blockColor = random([255, 127])
    blockColor2 = random([255, 127])
    blockColor3 = random([255, 127])

    blockW = random([width / 2, width / 4, width / 1.3333])

    blockH = random([height / 2, height / 4, height / 1.3333])



    if (aniCount < 0.50) {
      sh.setUniform('satOn', random([0.0, 0.0, 1.0]))
    } else {
      sh.setUniform('satOn', aniChooser)
    }

    if (borderStr == "border") {
      border = random([1.0, 1.0, 0.0])
    }

  }


  sh.setUniform('u_time', millis() / 1000.0)
  sh.setUniform("randomTex", randomCanvas);

  sh.setUniform('pg', pg2) ///pg2

  sh.setUniform('img', img)

  sh.setUniform('pg2', pg2)


  sh.setUniform('time', millis())
  sh.setUniform('onOff', onOffChooser)

  rotate(PI * millis())
  quad(-1, -1, 1, -1, 1, 1, -1, 1)


}


function keyPressed() {
  if (key == ' ') {
    stopCount += 1
    if (stopCount % 2 == 0) {
      frameRate(0)
    } else {
      frameRate(fr)
    }
  }
  if (key == "s") {
    saveCanvas("strained", "png")
  }

}