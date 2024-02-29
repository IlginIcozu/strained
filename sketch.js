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

let seed1 = ~~(Genify.random() * 123456789);
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

function preload() {

  // seed1 = 173199570.63442616
  console.log(seed1)
  noiseSeed(seed1)
  randomSeed(seed1)

  sh = loadShader("pix.vert", "pix.frag");
  blurShader = loadShader('blur.vert', 'blur.frag')

}

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

  dirChooser = random([1.0, 2.0, 3.0, 3.0, 4.0])




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

  border = random([0.0, 0.0, 1.0, 1.0, 1.0])



  if (border == 1.0) borderStr = "border"
  yatayChooser = random([0.0, 1.0, 2.0, 3.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0])

  borderBox = random([1, 2])

  whEdgeX = minDim / 10

  // noCursor()

}

function draw() {

  let x = (random(w / s) ^ (frameCount / s)) * s
  let y = (random(h / s) ^ (frameCount / s)) * s

  for (let i = 0; i < 3; i += 1) {
    pg.fill(random([0, 255, 127]), random([0, 255, 127]), random([0, 255, 127]))
    pg.rect(x, y, s * 2, s * 2)

    pg2.fill(random([0, 255, 127]), random([0, 255, 127]), random([0, 255, 127]))
    pg2.rect(x, y, s * 2, s * 2)
  }

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
    } else if (yatayChooser == 3.0) {
      pg2.push()
      pg2.rectMode(CENTER)
      if (borderBox == 1) {
        pg2.rect(width / 2, height / 2, width, height / 2)
      } else {
        pg2.rect(width / 2, height / 2, min(width, height) / 2, height)
      }
      pg2.pop()
    } else if (yatayChooser == 4.0) {
      pg2.push()
      pg2.ellipse(width / 2, height / 2, min(width, height) / 1.25)
      pg2.pop()
    } else if (yatayChooser == 5.0) {
      pg2.push()
      pg2.rectMode(CORNER)
      if (borderBox == 1) {
        pg2.rect(0, 0, width / 2, height)
      } else {
        pg2.rect(0, 0, width, height / 2)
      }


      pg2.pop()
    } else if (yatayChooser == 6.0) {
      pg2.push()
      pg2.rectMode(CORNER)


      if (borderBox == 1) {
        pg2.rect(width / 2, 0, width / 2, height)
      } else {
        pg2.rect(0, height / 2, width, height / 2)
      }
      pg2.pop()
    } else if (yatayChooser == 7.0) {
      pg2.push()

      pg2.rectMode(CENTER)


      if (borderBox == 1) {
        pg2.rect(width / 2, height / 2, width / 3, height)
      } else {
        pg2.rect(width / 2, height / 2, width, height / 3)
      }
      pg2.pop()
    }




    pg2.pop()
  }



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

  sh.setUniform('u_time', frameCount / 50.0)

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