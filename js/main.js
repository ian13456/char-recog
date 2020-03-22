class Main {
  constructor() {
    this.initializeNumbers()
  }

  initializeNumbers = () => {
    this.numberCanvases = []

    for (let i = 0; i < 10; i++) {
      const data = DATA[i]

      const numInstance = new GridP5Definition(false, `num${i}`, 8, data)
      new p5(numInstance.getBlueprint())

      this.numberCanvases[i] = numInstance

      document.getElementById(`num${i}`).addEventListener('click', () => {
        mainGrid.grid.initialize(numInstance.getValues())
      })
    }
  }
}
