import React, { Component } from 'react'

export default class Timer extends Component {
  state = {
    work: true,
    // in seconds
    workTimer: 30 * 60,
    breakTimer: 5 * 60,
    timeLeft: null,
    timer: null,
    disableStart: false,
    numSessions: 0,
    showMessage: false,
  }

  componentDidMount() {
    this.setState({ timeLeft: this.state.workTimer })
  }

  animate = () => {
    // console.log(this.state.work)
    let workLabel = document.querySelector('#work')
    let breakLabel = document.querySelector('#break')
    if (!this.state.work) {
      workLabel.style.transform = 'translate3d(0, 100px, 0)'
      breakLabel.style.transform = 'translate3d(0, 0, 0)'
    } else {
      workLabel.style.transform = 'translate3d(0, 0, 0)'
      breakLabel.style.transform = 'translate3d(0, -100px, 0)'
    }
  }

  takeBreak = () => {
    if (this.state.work) {
      this.setState((prevState) => ({
        work: false,
        timeLeft: 5 * 60,
      }))
      // TODO: This is a sort of hack to make it work. Change it later.
      setTimeout(this.animate, 50)
    }
    return
  }

  pause = () => {
    clearInterval(this.state.timer)
    this.toggleStartButton(false)
  }

  switchTimers = () => {
    this.setState((prevState) => ({
      work: !prevState.work,
    }))
    // Increment once session is switched.
    if (this.state.work) {
      this.incrementSessionCount()
    }
    this.refillTimer()
    // ERR: This can't be called earlier because of the same reason as mentions above.
    this.animate()
  }

  refillTimer = () => {
    this.setState({
      timeLeft: this.state.work ? this.state.workTimer : this.state.breakTimer,
    })
  }

  updateTimer = () => {
    if (this.state.timeLeft <= 0) {
      this.switchTimers()
    } else {
      this.setState({ timeLeft: this.state.timeLeft - 1 })
    }
  }

  incrementSessionCount = () => {
    this.setState((prevState) => ({ numSessions: prevState.numSessions + 1 }))
  }

  startTimer = () => {
    this.setState({ showMessage: false })
    // Reset numSessions to 0
    this.setState((prevState) => ({ numSessions: 0 }))
    // Increment numSessions once at first.
    this.incrementSessionCount()

    this.setState({ timer: setInterval(this.updateTimer, 1000) })
    this.toggleStartButton(true)
  }

  toggleStartButton = (value) => {
    this.setState((prevState) => ({ disableStart: value }))
  }

  cancelTimer = () => {
    clearInterval(this.state.timer)
    this.setDefault()
    this.toggleStartButton(false)
  }

  setDefault = () => {
    this.setState(
      (prevState) => ({
        timeLeft: this.state.workTimer,
        timer: null,
        work: true,
      }),
      // Animates the labels back
      this.animate
    )
  }

  endTask = () => {
    this.setState({ showMessage: true })
    this.cancelTimer()
  }

  render() {
    return (
      <div className="flex col">
        {/* <h1>Pomodoro Timer</h1> */}
        <div id="status" className="item flex">
          <span id="break">
            <h1>Break Time</h1>
          </span>
          <span id="work">
            <h1>Work</h1>
          </span>
        </div>
        <div id="timer" className="item">
          {Math.floor(this.state.timeLeft / 60)}:
          {this.state.timeLeft % 60 < 10
            ? '0' + (this.state.timeLeft % 60)
            : this.state.timeLeft % 60}
        </div>
        <div className="flex row">
          <button
            className="item"
            onClick={this.startTimer}
            disabled={this.state.disableStart}>
            Start
          </button>
          {/* <button className="item" onClick={this.cancelTimer}>
            Cancel
          </button> */}
          <button className="item" onClick={this.pause}>
            Pause
          </button>
        </div>
        <div className="flex row">
          <button className="item" onClick={this.takeBreak}>
            Take a break
          </button>
          <button onClick={this.endTask} className="item btn-danger">
            End Task
          </button>
        </div>
        {this.state.showMessage && (
          <p>This task took you: {this.state.numSessions} work session(s)</p>
        )}
        {/* {this.state.timer} <br /> {this.state.work + ''} */}
      </div>
    )
  }
}
