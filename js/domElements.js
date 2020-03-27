const generateDOM = document.getElementById('generate')
const trainDOM = document.getElementById('train')
const noiseDOM = document.getElementById('noise')
const predictDOM = document.getElementById('predict')
const clearDOM = document.getElementById('clear')
const notificationWrapperDOM = document.getElementById('notif-wrapper')
const centerButtonsDOM = document.getElementById('center-buttons')
const saveButtonDOM = document.getElementById('save')
const resetButtonDOM = document.getElementById('reset')
const scoresDOM = document.getElementById('scores')

/* -------------------------------------------------------------------------- */
/*                                  LISTENERS                                 */
/* -------------------------------------------------------------------------- */
generateDOM.addEventListener('click', () => {
  main.clearPrediction()
  main.generate()
})

trainDOM.addEventListener('click', e => {
  e.preventDefault()
  if (!main.generated) NotificationManager.getInstance().addNotification('Generate first!')
  else {
    main.clearPrediction()
    main.train()
  }
})

noiseDOM.addEventListener('click', e => {
  e.preventDefault()
  mainGrid.grid.initialize(mainGrid.grid.noisify())
  main.clearPrediction()
})

predictDOM.addEventListener('click', e => {
  e.preventDefault()
  main.predict()
})

clearDOM.addEventListener('click', e => {
  e.preventDefault()
  mainGrid.grid.clear()
  NotificationManager.getInstance().addNotification('Canvas cleared!')
  main.clearPrediction()
})

saveButtonDOM.addEventListener('click', e => {
  e.preventDefault()
  main.save()
  main.clearPrediction()
})

resetButtonDOM.addEventListener('click', e => {
  e.preventDefault()
  main.reset()
  main.clearPrediction()
})
