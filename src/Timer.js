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
  }

  componentDidMount() {
    this.setState({ timeLeft: this.state.workTimer })
  }

  switchTimers = () => {
    this.setState((prevState) => ({
      work: !prevState.work,
    }))
    this.refillTimer()
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

  startTimer = () => {
    this.setState({ timer: setInterval(this.updateTimer, 1000) })
    this.toggleStartButton()
  }

  toggleStartButton = () => {
    this.setState((prevState) => ({ disableStart: !prevState.disableStart }))
  }

  cancelTimer = () => {
    clearInterval(this.state.timer)
    this.setDefault()
    this.toggleStartButton()
  }

  setDefault = () => {
    this.setState({ timeLeft: this.state.workTimer })
  }

  render() {
    return (
      <div className="row">
        <h1>Pomodoro Timer</h1>

        <div id="status" className="item">
          {this.state.work ? <h4>Work</h4> : <h4>Break Time</h4>}
        </div>
        <div id="timer" className="item">
          {Math.floor(this.state.timeLeft / 60)}:
          {this.state.timeLeft % 60 < 10
            ? '0' + (this.state.timeLeft % 60)
            : this.state.timeLeft % 60}
        </div>
        <button
          className="item"
          onClick={this.startTimer}
          disabled={this.state.disableStart}>
          Start
        </button>
        <button className="item" onClick={this.cancelTimer}>
          Cancel
        </button>
      </div>
    )
  }
}
