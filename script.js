const timeElem = document.getElementById('time');
const sessionTimeElem = document.getElementById('sessionTime');
const sessionCountElem = document.getElementById('sessionCount');

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

const sessionTime = {
    minutes: 0,
    seconds: 0
}

let sessionCount = 0

function start(isContinue = false) {
    stopButton.removeEventListener('click', () => { })

    if (!isContinue) {
        const [minutes, seconds] = sessionTimeElem.value.split(':')
        sessionCount = +sessionCountElem.value

        sessionTime.minutes = +minutes
        sessionTime.seconds = +seconds
    }

    if (
        !Number(sessionCount) ||
        (
            !Number(sessionTime.minutes)
            && Number(sessionTime.minutes) !== 0
        ) ||
        (
            !Number(sessionTime.seconds)
            && Number(sessionTime.seconds) !== 0
        )
    ) {
        reset()
        return
    }

    startButton.classList.remove('show')
    stopButton.classList.add('show')
    resetButton.classList.remove('show')
    continueButton.classList.remove('show')

    const stop = () => {
        stopButton.classList.remove('show')
        continueButton.classList.add('show')
        resetButton.classList.add('show')

        continueButton.removeEventListener('click', () => { })
        clearInterval(interval)
        continueButton.addEventListener('click', () => start(true))
    }

    let interval = setInterval(() => {
        time.seconds += 1;

        if (time.seconds === 60) {
            time.seconds = 0
            time.minutes += 1
        }

        if (time.minutes >= sessionTime.minutes && time.seconds >= sessionTime.seconds) {
            audioElem.play()
            sessionCount -= 1
            stop()
            okButton.classList.add('show')
            okButton.addEventListener('click', ok)
        }

        updateTimeElem()
    }, 1000)

    stopButton.addEventListener('click', stop)
}

function ok() {
    audioElem.pause()
    audioElem.currentTime = 0
    okButton.removeEventListener('click', () => { })
    okButton.classList.remove('show')
    time.minutes = 0
    time.seconds = 0
    sessionCountElem.value = sessionCount

    if (sessionCount === 0) {
        reset()
    }
}

function reset() {
    time.seconds = 0
    time.minutes = 0

    startButton.classList.add('show')
    stopButton.classList.remove('show')
    resetButton.classList.remove('show')
    continueButton.classList.remove('show')

    updateTimeElem()
}

function updateTimeElem() {
    timeElem.innerText = `${time.minutes < 10 ? '0' + time.minutes : time.minutes}:${time.seconds < 10 ? '0' + time.seconds : time.seconds}`
}

startButton.addEventListener('click', () => start(false))
resetButton.addEventListener('click', reset)