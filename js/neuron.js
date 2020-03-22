class Neuron {
  constructor(count, eta) {
    this.count = count

    this.w = []
    this.w.push(Math.random() * 2 - 1)

    for (let i = 0; i < count; i++) this.w.push(Math.random() * 2 - 1)

    this.eta = eta
  }

  crossEntropy = (yHat, y) => {
    if (y === 1) return -Math.log(yHat)
    return -Math.log(1 - yHat)
  }

  sigmoid = z => 1 / (1 + Math.pow(Math.E, -z))

  derivativeCrossEntropy = (yHat, y) => {
    if (y === 1) return -1 / yHat
    return 1 / (1 - yHat)
  }

  derivativeSigmoid = x => x * (1 - x)

  step = samples => {
    const e = []

    samples = shuffle([...samples])

    for (let j = 0; j < samples.length; j++) {
      const sample = samples[j][0]
      const target = samples[j][1]

      const Z = this.output(sample)

      const yHat = this.sigmoid(Z)
      e.push(this.crossEntropy(yHat, target))

      const dEdW0 = this.derivativeCrossEntropy(yHat, target) * this.derivativeSigmoid(yHat)
      this.w[0] -= this.eta * dEdW0

      for (let i = 0; i < sample.length; i++) {
        const dEd = dEdW0 * sample[i]
        this.w[i + 1] -= this.eta * dEd
      }
    }

    const avgError = e.reduce((a, b) => a + b, 0) / samples.length

    return avgError
  }

  test = sample => {
    const yHat = this.sigmoid(this.output(sample))
    return yHat
  }

  output = sample => {
    let Z = this.w[0]
    for (let i = 1; i <= this.count; i++) Z += sample[i - 1] * this.w[i]
    return Z
  }
}
