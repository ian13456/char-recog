const generateDOM = document.getElementById('generate')
const trainDOM = document.getElementById('train')
const noiseDOM = document.getElementById('noise')
const predictDOM = document.getElementById('predict')
const clearDOM = document.getElementById('clear')
const notificationWrapperDOM = document.getElementById('notif-wrapper')
const centerButtonsDOM = document.getElementById('center-buttons')
const saveButtonDOM = document.getElementById('save')
const resetButtonDOM = document.getElementById('reset')

/* -------------------------------------------------------------------------- */
/*                                  LISTENERS                                 */
/* -------------------------------------------------------------------------- */
generateDOM.addEventListener('click', e => {
  main.generate()
})

trainDOM.addEventListener('click', e => {
  e.preventDefault()
  if (!main.generated) NotificationManager.getInstance().addNotification('Generate first!')
  else main.train()
})

noiseDOM.addEventListener('click', e => {
  e.preventDefault()
  mainGrid.grid.initialize(mainGrid.grid.noisify())
})

predictDOM.addEventListener('click', e => {
  e.preventDefault()
  main.predict()
})

clearDOM.addEventListener('click', e => {
  e.preventDefault()
  mainGrid.grid.clear()
  NotificationManager.getInstance().addNotification('Canvas cleared!')
})

saveButtonDOM.addEventListener('click', e => {
  e.preventDefault()
  main.save()
})

resetButtonDOM.addEventListener('click', e => {
  e.preventDefault()
  main.reset()
})
