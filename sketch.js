let w;
let h
let pix = 2
let s, c, pg, pg2, img, sh
let i, f, g, k
let frameMod
let satChooser
let blurShader
let seed = 99999999 * fxrand()

let sqChooser
let borderStr
let aniCount
let uOctave
let rect1X, rect1Y, rect1W, rect1H
let rect2X, rect2Y, rect2W, rect2H
let border
let offset = 0
let blockAni

let blockColor, blockColor2, blockColor3
let blockColorA, blockColorA2, blockColorA3
let blockColorB, blockColorB2, blockColorB3
let blockColorC, blockColorC2, blockColorC3
let blockColorD, blockColorD2, blockColorD3
let sqStr
let stopCount = 1
let fr
let blockW, blockH
let randomCanvas
let yatayChooser
let textrS

let sChooser
let mapChooser
let ellipseChooser
let akChooser
let dirChooser

let whX
let whY
let whEdgeX
let whEdgeY
let borX, borY
let probb

console.log(fxhash)

function preload() {

  // seed = 71837388.65764058
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


  noiseSeed(seed)
  randomSeed(seed)



  let frArr = [25, 50, 100, 50, 25, 50, 100, 50, 50] /////////////////ritim


  frameMod = frArr[floor(random(frArr.length))]


  fr = random([30, 25, 25, 25, 30, 25]) * 2
  frameRate(30) /////////////////////////////////////////////

  sqChooser = random(1)

  textrS = random(1)

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


  let h1 = random([0, 20, 30])


  let h2 = random([180, 220, 150])

  let h3 = random([180, 220, 150, 0, 20, 30])


  let v1X = random(w / 2, w / 1.33)
  let v2X = random(w / 4, w / 2)
  let v1Y = random(h / 2, h / 1.33)
  let v2Y = random(h / 4, h / 2)
  let v1H = random(height / 5, height / 2.25) //height/1.75
  let v1W = random(width / 5, width / 2.25)

  let ed = random(width / 19.2, width / 5)
  let edY = random(height / 19.2, height / 5)
  let ed2 = width / 5
  let ed2Y = height / 5

  let orient = random([0.0, 1.0])

  f.beginShape(TRIANGLES)
  for (let i = 0; i < 100; i++) {
    f.fill(h1, random(50, 70) / 4, random(50, 60) / b1)
    f.stroke(h2, random(50, 70) / 4, random(50, 60) / b1, random(0.4))
    let x
    let y
    if (orient == 0.0) {
      x = random(ed, v1X - ed)
      y = random(h / 2 - v1H, h / 2 + v1H)
    } else {
      x = random(w / 2 - v1W, w / 2 + v1W)
      y = random(edY, v1Y - edY)
    }



    f.curveVertex(x, y)
    f.endShape()
  }


  f.beginShape(TRIANGLES)
  for (let i = 0; i < 100; i++) {
    f.fill(h2, random(50, 70) / 4, random(50, 60) / b2)
    f.stroke(h1, random(50, 70) / 4, random(50, 60) / b1, random(0.4))
    let x
    let y
    if (orient == 0.0) {
      x = random(v2X + ed, w - ed)
      y = random(h / 2 - v1H, h / 2 + v1H)
    } else {
      x = random(w / 2 - v1W, w / 2 + v1W)
      y = random(v2Y + edY, h - edY)
    }



    f.curveVertex(x, y)
    f.endShape()
  }

  let third = 1.0 //random([0.0, 1.0])


  if (third == 1.0) {
    f.beginShape(TRIANGLES)
    for (let i = 0; i < 100; i++) {
      f.fill(h3, random(50, 70) / 4, random(50, 60) / b3)
      f.stroke(h1, random(50, 70) / 4, random(50, 60) / b2, random(0.4))
      let x
      let y
      if (orient == 0.0) {
        x = random(w / 2 - ed2, w / 2 + ed2)
        y = random(h / 2 - v1H, h / 2 + v1H)
      } else {
        x = random(w / 2 - v1W, w / 2 + v1W)
        y = random(h / 2 - ed2Y, h / 2 + ed2Y)
      }



      f.curveVertex(x, y)
      f.endShape()
    }
  }




  f.pop();


  minDim = min(width, height)
  s = random([minDim / 10, minDim / 15, minDim / 7]) /////////////////////kare Boyutu


  sChooser = random([1.0, 2.0, 3.0, 1.0])

  if (sChooser == 1.0) {
    s = minDim / 10
  } else if (sChooser == 2.0) {
    s = minDim / 50
  } else if (sChooser == 3.0) {
    s = minDim / 20
  }

  mapChooser = random([0.0, 0.0, 0.0, 0.0, 1.0, 2.0])

  ellipseChooser = random([0.0, 0.0, 1.0, 0.0, 0.0])

  probb = random([0, 1])

  if (frameMod == 25) {
    akChooser = random([1, 2])
  } else {
    akChooser = random([1, 2, 3, 4, 1, 2])
  }

  dirChooser = random([1.0, 2.0, 3.0, 1.0])

  let dX, dY

  if (dX == 1. || dX == -1) {
    dY = 0.0
  } else {
    dY = random([-1, 1])
  }





  shader(sh)

  satChooser = random([0.0, 1.0])
  aniCount = random(1)



  sh.setUniform('resolution', [w * pix, h * pix])
  sh.setUniform("randomTex", randomCanvas);
  sh.setUniform('pg', pg2)
  sh.setUniform('pg2', pg2)
  sh.setUniform('img', f)


  sh.setUniform('dirX', random([-1., 1., 0., 0., 0.])) ////hepsi
  sh.setUniform('dirY', random([-1., 1., 0., 0., 0.]))


  if (akChooser == 1.0) {
    sh.setUniform('ak', 1.)
  } else if (akChooser == 2.0) {
    sh.setUniform('ak', 3.0)
  } else if (akChooser == 3.0) {
    sh.setUniform('ak', 5.0)
  } else if (akChooser == 4.0) {
    sh.setUniform('ak', 10.0)
  }


  sh.setUniform('satOn', satChooser)



  roundInt = 4
  uPi = 1.0

  uOctave = round(random(1.85, 3), roundInt) * 1;
  uFbmAmp = round(random(30.0, 80.0), roundInt);
  uAngleC = round(random(1), roundInt);
  uAniSpeed = random([2250.0, 2250.0, 2500.0, 2500.0, 3000.0, 3000.0, 3000.0, 3000.0])


  // uOctave = 2


  if (sqChooser < 0.50) {
    rect1X = width / 2
    rect1Y = random([height / 4, height - height / 4])
    rect1W = width
    rect1H = height / random(1.9, 2.1)
    sqStr = "yatay"
  }

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


  img.image(g, w / 2, h / 2) ///////////////////////////////////////////////


  // console.log(minDim/7)
  blockColor = 255
  blockColor2 = 255
  blockColor3 = 255

  blockColorA = 255
  blockColorA2 = 255
  blockColorA3 = 255
  blockColorB = 255
  blockColorB2 = 255
  blockColorB3 = 255
  blockColorC = 255
  blockColorC2 = 255
  blockColorC3 = 255
  blockColorD = 255
  blockColorD2 = 255
  blockColorD3 = 255
  blockW = width / 2
  blockH = height / 2
  blockAni = random([0.0, 1.0])




  border = random([0.0, 0.0, 1.0, 1.0, 0.0]) //////////////////////////////////////////////uclu bolunme



  if (border == 1.0) borderStr = "border"
  yatayChooser = random([0.0, 1.0, 2.0, 3.0])


  whEdgeX = minDim / 10
  whEdgeY = minDim / 10



  if (yatayChooser == 2.0) {
    let arX = [width / 1.25, width / 1.5, width / 2, width / 1.5]

    let arY = [height / 1.25, height / 1.5, height / 2, height / 1.5]
    let index = random([0, 1, 2, 3])
    whX = arX[index]
    whY = arY[index]
  } else if (yatayChooser == 3.0) {
    let arX = [width / 1.25, width / 1.5, width / 1.5, width / 1.25]

    let arY = [height / 1.25, height / 1.5, height / 1.5, height / 1.25]
    let index = random([0, 1, 2, 3])
    whX = arX[index]
    whY = arY[index]
  }


  borX = width/2//random([width / 2, width / 2, random(width / 4, width / 1.333)])
  borY = height/2//random([height / 2, height / 2, random(height / 4, height / 1.333)])

}

function draw() {



  let x = (random(w / s) ^ (frameCount / s)) * s
  let y = (random(h / s) ^ (frameCount / s)) * s

  pg.fill(random([0, 255, 127]), random([0, 255, 127]), random([0, 255, 127]))

  pg.rect(x, y, s * 2, s * 2)


  pg2.fill(random([0, 255, 127]), random([0, 255, 127]), random([0, 255, 127]))

  pg2.rect(x, y, s * 2, s * 2)
  // pg2.rect(x, y, s, s)
  // pg2.rect(x, y, s / 2, s / 2)


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

    } else if (yatayChooser == 2.0) {

      pg2.push()
      pg2.rectMode(CORNER)
      // pg2.translate(borX, borY)
      pg2.rect(borX - (minDim/10)/2, 0, minDim / 10, height)
      pg2.rect(0, borY- (minDim/10)/2, width, minDim / 10)
      pg2.pop()


    } else if (yatayChooser == 3.0) {
      pg2.push()
      pg2.rectMode(CORNER)


      // pg2.fill(blockColorA, blockColorA2, blockColorA3)
      pg2.rect(0, 0, width, whEdgeX)
      // pg2.fill(blockColorB, blockColorB2, blockColorB3)
      pg2.rect(width, 0, -whEdgeX, height)
      // pg2.fill(blockColorC, blockColorC2, blockColorC3)
      pg2.rect(0, height, width, -whEdgeX)
      // pg2.fill(blockColorD, blockColorD2, blockColorD3)
      pg2.rect(0, 0, whEdgeX, height)
      pg2.pop()
    }


    pg2.pop()
  }



  c.image(img, w / 2, h / 2)


  img.image(c, w / 2, h / 2)
  // img.image(f, w / 2, h / 2)


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
            if (x < width / 2) {
              s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
            } else {
              s = random([minDim / 50, minDim / 20, minDim / 50, minDim / 20])
            }
          } else {
            if (x > width / 2) {
              s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
            } else {
              s = random([minDim / 50, minDim / 20, minDim / 50, minDim / 20])
            }
          }


        } else {
          if (probb == 0) {
            if (y < height / 2) {
              s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
            } else {
              s = random([minDim / 50, minDim / 20, minDim / 50, minDim / 20])
            }
          } else {
            if (y > height / 2) {
              s = random([minDim / 10, minDim / 5, minDim / 10, minDim / 5])
            } else {
              s = random([minDim / 50, minDim / 20, minDim / 50, minDim / 20])
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

    ////////////////////////////////////////////////////////////////////////////////aniSpeed

    if (akChooser == 1.0) {
      sh.setUniform('ak', random([1., 1., 2.0, 1., 1., 2.0, 3., 1., 1., 1.]))
    } else if (akChooser == 2.0) {
      sh.setUniform('ak', 3.0)
    } else if (akChooser == 3.0) {
      sh.setUniform('ak', 5.0)
    } else if (akChooser == 4.0) {
      sh.setUniform('ak', 10.0)
    }


    if (blockAni == 1.0) {
      blockColorA = random([0, 255])
      blockColorA2 = random([0, 255])
      blockColorA3 = random([0, 255])
      blockColorB = random([0, 255])
      blockColorB2 = random([0, 255])
      blockColorB3 = random([0, 255])
      blockColorC = random([0, 255])
      blockColorC2 = random([0, 255])
      blockColorC3 = random([0, 255])
      blockColorD = random([0, 255])
      blockColorD2 = random([0, 255])
      blockColorD3 = random([0, 255])
    }


    /////////////////////////////////////////////////////////////////direction
    let dX = random([1., -1., 0.0, 0.0])
    let dY

    if (dX == 1. || dX == -1) {
      dY = 0.0
    } else {
      dY = random([-1, 1])
    }

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


    blockColor = random([255, 127])
    blockColor2 = random([255, 127])
    blockColor3 = random([255, 127])

    blockW = random([width / 2, width / 4, width / 1.3333])

    blockH = random([height / 2, height / 4, height / 1.3333])

    // borX = random([width / 2, width / 2, random(width / 4, width / 1.333)])
    // borY = random([height / 2, height / 2, random(height / 4, height / 1.333)])



    if (borderStr == "border") {
      border = random([1.0, 1.0, 0.0, 1.0, 1.0])
    }

  }


  sh.setUniform('u_time', millis() / 1000.0)
  sh.setUniform("randomTex", randomCanvas);

  sh.setUniform('pg', pg2) ///pg2

  sh.setUniform('img', img)

  sh.setUniform('pg2', pg2)


  // rotate(PI * millis())

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



function sun(sunX, sunY, sunRad, count, hu, satu, bri) {


  for (let i = 0; i < count; i++) {

    let r = random(1)
    if (r > 0.60) {
      f.beginShape(LINES)
    } else if (r > 0.40) {
      if (random(1) < 0.70) {
        if (count == 100) {
          f.beginShape()
        } else {
          f.beginShape(TRIANGLE_FAN)
        }
      } else {
        f.beginShape()
      }
    } else {
      f.beginShape(TRIANGLES)
    }

    for (let a = 0; a < TAU; a += 0.01) {

      let n = map(noise(offset, a * 0.001), 0, 1, -50, 50);
      offset += 0.001
      let x = sunX + sin(a) * (sunRad - i * sunRad / 20) + n / 2
      let y = sunY + cos(a) * (sunRad - i * sunRad / 20) + n

      f.noFill()
      f.strokeWeight(random(1, 2) * 1.2)


      f.stroke(hu, satu, bri, random(0.2, 1))

      if (textrS < 0.50) {
        f.curveVertex(x, y)
      } else {
        f.curveVertex(x ^ a, y ^ a)
      }
    }
    f.endShape()
  }

}
