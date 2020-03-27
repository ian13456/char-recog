class Main {
  constructor() {
    this.net = new Net(0.01, 0.01, 1000)

    this.state = {
      isOnChar: false,
      charIndex: null
    }

    this.initializeCharDOMs()
  }

  initializeCharDOMs = () => {
    this.charCanvases = []

    for (let i = 0; i < 10; i++) {
      const data = DATA[i]

      const numInstance = new GridP5Definition(false, `num${i}`, 8, data)
      new p5(numInstance.getBlueprint())

      this.charCanvases[i] = numInstance

      document.getElementById(`num${i}`).addEventListener('click', () => {
        mainGrid.grid.initialize(numInstance.getValues())

        this.state.isOnChar = false
        this.state.charIndex = null

        this.hideCenterButtons()
      })
    }

    for (let i = 0; i < 2; i++) {
      const data = UNKNOWN[i]

      const charInstance = new GridP5Definition(false, `char${i}`, 8, data)
      new p5(charInstance.getBlueprint())

      this.charCanvases[i + 10] = charInstance
      document.getElementById(`char${i}`).addEventListener('click', () => {
        mainGrid.grid.initialize(charInstance.getValues())

        this.state.isOnChar = true
        this.state.charIndex = i

        this.showCenterButtons()
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

    const cachedDrawings = deepCopy(mainGrid.getValues())

    mainGrid.grid.toggleDraw()

    const runN = n => {
      if (n > 11) {
        this.finishGenerating(cachedDrawings)
        return
      }

      this.trainingData.push([])
      const nInstance = this.charCanvases[n]

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

  showCenterButtons = () => {
    centerButtonsDOM.style.display = 'flex'
  }

  hideCenterButtons = () => {
    centerButtonsDOM.style.display = 'none'
  }

  save = () => {
    this.trained = false
    this.generated = false
    this.charCanvases[this.state.charIndex + 10].grid.initialize(mainGrid.grid.cells)

    NotificationManager.getInstance().addNotification('Dataset changed. Train again!')
  }

  reset = () => {
    this.charCanvases[this.state.charIndex + 10].grid.initialize(UNKNOWN[this.state.charIndex])
    mainGrid.grid.initialize(UNKNOWN[this.state.charIndex])
  }

  train = () => {
    this.net.train(this.trainingData)
    this.trained = true
  }

  clearPrediction = () => (scoresDOM.innerHTML = '')

  predict = () => {
    if (mainGrid.grid.cells.flat().filter(e => e !== 0).length === 0) {
      NotificationManager.getInstance().addNotification('Cannot predict empty canvas!')
      return
    }

    if (!this.trained) {
      NotificationManager.getInstance().addNotification('Not trained yet! Wild guess...')
    }

    const { index, scores } = this.net.predict(mainGrid.getValues())

    if (index === null) {
      mainGrid.grid.initialize(ERROR)
      NotificationManager.getInstance().addNotification('No character predicted...')
    } else {
      mainGrid.grid.initialize(this.charCanvases[index].getValues())
    }

    this.clearPrediction()

    const listWrapper = document.createElement('table')
    const createNode = (i, score, type = 'td') => {
      const node = document.createElement('tr')
      if (i === index) {
        node.classList.add('highlighted')
      }

      const first = document.createElement(type)
      first.innerHTML = i

      const second = document.createElement(type)
      second.innerHTML = typeof score === 'number' ? score.toFixed(3) : score

      node.appendChild(first)
      node.appendChild(second)

      return node
    }

    listWrapper.appendChild(createNode('#', 'score', 'th'))

    for (let i = 0; i < scores.length; i++) {
      const score = scores[i]
      const node = createNode(i, score)
      listWrapper.appendChild(node)
    }

    scoresDOM.appendChild(listWrapper)
  }

  finishGenerating = cached => {
    mainGrid.grid.clear()
    mainGrid.grid.initialize(cached)
    mainGrid.grid.toggleDraw()
    NotificationManager.getInstance().addNotification('Done generating!')
    this.generating = false
    this.generated = true
    this.trainingData = this.trainingData.map((e, index) => e.map(ee => [ee, index])).flat()
  }
}
