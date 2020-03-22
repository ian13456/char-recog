function GridP5Definition(enableDraw, parentId, cellWidth, initValue = null) {
  const GridP5 = sketch => {
    sketch.setup = () => {
      const cWidth = CANVAS_CELL_WC * cellWidth
      const cHeight = CANVAS_CELL_HC * cellWidth
      const myCanvas = sketch.createCanvas(cWidth, cHeight)
      myCanvas.parent(parentId)
      myCanvas.elt.addEventListener('contextmenu', e => {
        this.grid.handleDraw()
        e.preventDefault()
      })

      myCanvas.elt.style.width = `${cWidth}px`
      myCanvas.elt.style.height = `${cHeight}px`

      this.grid = new Grid(sketch, enableDraw, cellWidth, initValue)
    }

    sketch.draw = () => {
      sketch.clear()

      this.grid.draw()
    }

    sketch.mouseClicked = () => {
      this.grid.handleDraw()
    }

    sketch.mouseDragged = () => {
      this.grid.handleDraw()
    }
  }

  this.getBlueprint = () => GridP5
  this.getValues = () => this.grid.cells
}

class Grid {
  constructor(sketch, enableDraw, cellWidth, initValue) {
    this.p5 = sketch
    this.enableDraw = enableDraw
    this.cellWidth = cellWidth

    this.cells = new Array(CANVAS_CELL_HC)
    for (let i = 0; i < CANVAS_CELL_HC; i++) {
      this.cells[i] = new Array(CANVAS_CELL_WC)
    }

    this.initialize(initValue)
  }

  initialize = value => {
    if (value) {
      for (let r = 0; r < CANVAS_CELL_HC; r++) {
        for (let c = 0; c < CANVAS_CELL_WC; c++) {
          this.cells[r][c] = value[r][c]
        }
      }
    } else {
      for (let r = 0; r < CANVAS_CELL_HC; r++) {
        for (let c = 0; c < CANVAS_CELL_WC; c++) {
          this.cells[r][c] = 1
        }
      }
    }
  }

  draw = () => {
    for (let r = 0; r < CANVAS_CELL_HC; r++) {
      for (let c = 0; c < CANVAS_CELL_WC; c++) {
        this.drawCell(r, c)
      }
    }
  }

  drawCell = (r, c) => {
    const mappedR = r * this.cellWidth
    const mappedC = c * this.cellWidth

    this.p5.push()
    this.p5.noStroke()
    this.p5.fill(this.cells[r][c] * 255)
    this.p5.rect(mappedC, mappedR, this.cellWidth, this.cellWidth)
    this.p5.pop()
  }

  handleDraw = () => {
    if (!this.enableDraw) return

    const { r, c } = this.XYToRC(this.p5.mouseX, this.p5.mouseY)

    if (r >= CANVAS_CELL_HC || r < 0 || c >= CANVAS_CELL_WC || c < 0) return

    let value = 0
    if (this.p5.mouseButton === this.p5.RIGHT) value = 1

    this.setCell(r, c, value)
  }

  setCell = (r, c, value) => {
    this.cells[r][c] = value
  }

  XYToRC = (x, y) => {
    const mappedX = Math.floor(x / CANVAS_CELL_DIM)
    const mappedY = Math.floor(y / CANVAS_CELL_DIM)

    return { r: mappedY, c: mappedX }
  }
}
