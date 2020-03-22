class Net {
  constructor(eta, maxError, epochs) {
    this.eta = eta
    this.maxError = maxError
    this.epochs = epochs

    this.initializeNeurons()
  }

  initializeNeurons = () => {
    this.neurons = []

    for (let i = 0; i < 10; i++) {
      this.neurons.push(new Neuron(35, this.eta))
    }
  }

  train = trainingData => {
    for (let i = 0; i < 10; i++) {
      const neuron = this.neurons[i]

      const samples = deepCopy(trainingData).map(arr => [arr[0], arr[1] === i ? 1 : 0])

      for (let i = 0; i < this.epochs; i++) {
        const error = neuron.step(samples)
        if (error < this.maxError) break
      }
    }

    // for (let i = 0; i < trainingData; i++) {
    //   const neuron = this.neurons[i]
    //   const samples = trainingData[i]

    //   for (let i = 0; i < this.epochs; i++) {
    //     const error = neuron.step(samples, i)
    //     if (error < this.maxError) break
    //   }
    // }
    NotificationManager.getInstance().addNotification('Done training!')
  }

  predict = cells => {
    const GUESS_THRESHOLD = 0.2

    cells = cells.flat()

    const errors = []

    for (let i = 0; i < 10; i++) {
      errors.push(this.neurons[i].test(cells))
    }

    const prediction = indexOfBiggest(errors)
    if (errors[prediction] < GUESS_THRESHOLD) return null
    return prediction
  }
}
