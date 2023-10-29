const timeElem = document.getElementById('time');
const sessionTimeInput = document.getElementById('sessionTime');
const sessionCountInput = document.getElementById('sessionCount');

const startButton = document.getElementById('startButton');
const continueButton = document.getElementById('continueButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const okButton = document.getElementById('okButton');

const audioElem = document.querySelector('audio');

const time = {
    minutes: 0,
    seconds: 0
}

const sessionInfo = {
    minutes: 0,
    seconds: 0,
    count: 0
}

let interval = setInterval(() => {}, 1000)
clearInterval(interval)

function getSessionInfo() {
    const [minutes, seconds] = sessionTimeInput.value.split(':')
    const count = sessionCountInput.value

    if (Number(minutes) !== 0 && !Number(minutes)) return false
    if (Number(seconds) !== 0 && !Number(seconds)) return false
    if (!Number(count)) return false

    sessionInfo.minutes = Number(minutes)
    sessionInfo.seconds = Number(seconds)
    sessionInfo.count = Number(count)

    return true
}

function stop() {
    clearInterval(interval)
    stopButton.classList.remove('show')
    continueButton.classList.add('show')
    resetButton.classList.add('show')
}

function _continue() {
    interval = setInterval(updateTime, 1000)
    continueButton.classList.remove('show')
    resetButton.classList.remove('show')
    stopButton.classList.add('show')
}

function reset() {
    time.minutes = 0,
    time.seconds = 0,
    
    clearInterval(interval)
    updateTimeElem()

    resetButton.classList.remove('show')
    continueButton.classList.remove('show')
    startButton.classList.add('show')
}

function updateTimeElem() {
    const minutesText = time.minutes <= 10 ? '0' + time.minutes : time.minutes
    const secondsText = time.seconds <= 10 ? '0' + time.seconds : time.seconds

    timeElem.innerText = `${minutesText}:${secondsText}`
}

function playAudio() {
    audioElem.play()

    startButton.classList.remove('show')
    resetButton.classList.remove('show')
    continueButton.classList.remove('show')
    okButton.classList.add('show')
}

function ok() {
    audioElem.pause()
    audioElem.currentTime = 0

    okButton.classList.remove('show')
    resetButton.classList.add('show')
    continueButton.classList.add('show')

    if (sessionInfo.count <= 0) {
        startButton.classList.add('show')
    }

    reset()
}

function updateTime() {
    time.seconds += 1

    if (time.seconds >= 60) {
        time.seconds = 0
        time.minutes += 1
    }

    if (
        (time.minutes >= sessionInfo.minutes)
        &&
        (time.seconds >= sessionInfo.seconds)
    ) {
        stop()
        sessionInfo.count -= 1
        sessionCountInput.value = sessionInfo.count

        if (sessionInfo.count <= 0) reset()
        playAudio()
    }

    updateTimeElem()
}

function start() {
    const state = getSessionInfo()
    if (!state) return

    startButton.classList.remove('show')
    stopButton.classList.add('show')

    interval = setInterval(updateTime, 1000)
}

startButton.addEventListener('click', start)
continueButton.addEventListener('click', _continue)
resetButton.addEventListener('click', reset)
stopButton.addEventListener('click', stop)
okButton.addEventListener('click', ok)