class Main {
  constructor() {
    this.net = new Net(0.01, 0.01, 1000)

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

  generate = () => {
    if (this.generating) {
      NotificationManager.getInstance().addNotification('Already generating...')
      return
    }

    const COUNT_PER_NUM = 30

    this.trainingData = []
    this.generated = false
    this.generating = true

    mainGrid.grid.toggleDraw()

    const runN = n => {
      if (n > 9) {
        this.finishGenerating()
        return
      }

      this.trainingData.push([])
      const nInstance = this.numberCanvases[n]

      let count = 0
      const nInterval = setInterval(() => {
        if (count === COUNT_PER_NUM) {
          runN(n + 1)

          clearInterval(nInterval)
          return
        }

        const newData = nInstance.grid.noisify(0.7)
        this.trainingData[n].push(newData.flat())

        mainGrid.grid.initialize(newData)

        count++
      })
    }

    runN(0)
  }

  train = () => {
    this.net.train(this.trainingData)
    this.trained = true
  }

  predict = () => {
    if (mainGrid.grid.cells.flat().filter(e => e !== 0).length === 0) {
      NotificationManager.getInstance().addNotification('Cannot predict empty canvas!')
      return
    }

    if (!this.trained) {
      NotificationManager.getInstance().addNotification('Not trained yet! Wild guess...')
    }

    const index = this.net.predict(mainGrid.getValues())

    if (!index) {
      mainGrid.grid.initialize(ERROR)
      NotificationManager.getInstance().addNotification('No character predicted...')
    } else mainGrid.grid.initialize(DATA[index])
  }

  finishGenerating = () => {
    mainGrid.grid.clear()
    mainGrid.grid.toggleDraw()
    NotificationManager.getInstance().addNotification('Done generating!')
    this.generating = false
    this.generated = true
    this.trainingData = this.trainingData.map((e, index) => e.map(ee => [ee, index])).flat()
  }
}
