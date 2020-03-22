class NM {
  constructor() {
    this.wrapper = notificationWrapperDOM
  }

  addNotification = text => {
    const wrapDOM = document.createElement('div')
    wrapDOM.classList.add('notification')

    const svgDOM = document.createElement('img')
    svgDOM.src = 'assets/information.svg'

    wrapDOM.appendChild(svgDOM)

    const textDOM = document.createElement('span')
    textDOM.innerHTML = text

    wrapDOM.appendChild(textDOM)

    this.wrapper.appendChild(wrapDOM)

    wrapDOM.style.opacity = 1

    const disappearTimeout = setTimeout(() => {
      wrapDOM.style.opacity = 0
      const opacityTimeout = setTimeout(() => {
        this.wrapper.removeChild(wrapDOM)
        clearTimeout(opacityTimeout)
      }, 2000)
      clearTimeout(disappearTimeout)
    }, 2000)
  }
}

const NotificationManager = (function() {
  let instance = null

  return {
    getInstance() {
      if (!instance) instance = new NM()
      return instance
    }
  }
})()
