const deepCopy = arr => JSON.parse(JSON.stringify(arr))

const shuffle = a => {
  let j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}

const indexOfBiggest = a => {
  let highest = 0
  for (let i = 1; i < a.length; i++) {
    if (a[i] > a[highest]) highest = i
  }
  return highest
}
