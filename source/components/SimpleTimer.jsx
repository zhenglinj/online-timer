import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { ProgressBar, Modal, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Sound from 'react-sound';
const path = require('path');

const MAX_TIMEOUT_SECONDS = 120; // 2min

function zerofloor(x) {
  let ret = Math.abs(x);
  ret = Math.floor(ret);
  ret = x > 0 ? ret : -ret;
  return ret;
}

function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}

function sec2time(sec) {
  let h = zerofloor(sec / 3600);
  let m = zerofloor((sec - 3600 * h) / 60);
  let s = zerofloor(sec - 3600 * h - 60 * m);
  h = h > 0 ? h : -h;
  m = m > 0 ? m : -m;
  s = s > 0 ? s : -s;
  return (
    { h: pad(h, 2), m: pad(m, 2), s: pad(s, 2) }
  )
}

export default class SimpleTimer extends React.Component {
  constructor(props) {
    super(props);

    this.tick = this.tick.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.submitEditModal = this.submitEditModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.removeTimer = this.removeTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.resumeTimer = this.resumeTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);

    let leftSeconds = props.leftSeconds ? props.leftSeconds : props.totalSeconds;

    this.state = {
      name: props.name,
      showEditModal: false,
      showTimer: true,
      isStoped: false,
      startTimestamp: 0,
      totalSeconds: props.totalSeconds,
      leftSeconds: leftSeconds,
      spButton: (() => {
        if (props.totalSeconds === 0)
          return (
            <Button bsStyle="info" onClick={this.startTimer} disabled>
              <span className="glyphicon glyphicon-triangle-right"></span>
            </Button>);
        else
          return (
            <Button bsStyle="info" onClick={this.startTimer}>
              <span className="glyphicon glyphicon-triangle-right"></span>
            </Button>);
      })(),
      rButton: (
        <Button onClick={this.resetTimer} disabled>
          <span className="glyphicon glyphicon-repeat"></span>
        </Button>)
    };
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidUpdate() {
    if (!this.state.isStoped && this.state.leftSeconds <= - MAX_TIMEOUT_SECONDS)
      this.stopTimer();
  }

  tick() {
    let now = new Date().getTime();
    this.setState({ leftSeconds: (this.state.startTimestamp + this.state.totalSeconds - parseInt(now / 1000)) });
  }

  closeEditModal() {
    this.setState({ showEditModal: false });
  }

  submitEditModal() {
    let newTotalSeconds = 3600 * parseInt(ReactDOM.findDOMNode(this.refs.hourInput).value) +
      60 * parseInt(ReactDOM.findDOMNode(this.refs.minuteInput).value) +
      parseInt(ReactDOM.findDOMNode(this.refs.secondInput).value);
    let newName = ReactDOM.findDOMNode(this.refs.timerNameInput).value;

    this.setState({
      name: newName,
      totalSeconds: newTotalSeconds,
      leftSeconds: newTotalSeconds,
      showEditModal: false,
      spButton: (
        <Button bsStyle="info" onClick={this.startTimer}>
          <span className="glyphicon glyphicon-triangle-right"></span>
        </Button>),
      rButton: (
        <Button onClick={this.resetTimer} disabled>
          <span className="glyphicon glyphicon-repeat"></span>
        </Button>)
    });

    this.props.onEdit({ name: newName, totalSeconds: newTotalSeconds });

    clearInterval(this.timer);
  }

  openEditModal() {
    this.setState({ showEditModal: true });
  }

  removeTimer() {
    this.setState({ showTimer: false });

    this.props.onRemove();

    clearInterval(this.timer);
  }

  startTimer() {
    let now = new Date().getTime();
    this.setState({
      startTimestamp: (parseInt(now / 1000)),
      spButton: (
        <Button bsStyle="primary" onClick={this.pauseTimer}>
          <span className="glyphicon glyphicon-pause"></span>
        </Button>),
      rButton: (
        <Button onClick={this.resetTimer} disabled>
          <span className="glyphicon glyphicon-repeat"></span>
        </Button>)
    });
    clearInterval(this.timer);
    this.timer = setInterval(this.tick, 1000);
  }

  resumeTimer() {
    let now = new Date().getTime();
    this.setState({
      startTimestamp: (parseInt(now / 1000)) - this.state.totalSeconds + this.state.leftSeconds,
      spButton: (
        <Button bsStyle="primary" onClick={this.pauseTimer}>
          <span className="glyphicon glyphicon-pause"></span>
        </Button>),
      rButton: (
        <Button onClick={this.resetTimer} disabled>
          <span className="glyphicon glyphicon-repeat"></span>
        </Button>)
    });
    clearInterval(this.timer);
    this.timer = setInterval(this.tick, 1000);
  }

  pauseTimer() {
    this.setState({
      spButton: (
        <Button bsStyle="info" onClick={this.resumeTimer}>
          <span className="glyphicon glyphicon-step-forward"></span>
        </Button>),
      rButton: (
        <Button onClick={this.resetTimer}>
          <span className="glyphicon glyphicon-repeat"></span>
        </Button>)
    });
    clearInterval(this.timer);
  }

  resetTimer() {
    this.setState({
      leftSeconds: (this.state.totalSeconds),
      spButton: (
        <Button bsStyle="info" onClick={this.startTimer}>
          <span className="glyphicon glyphicon-triangle-right"></span>
        </Button>),
      rButton: (
        <Button onClick={this.resetTimer} disabled>
          <span className="glyphicon glyphicon-repeat"></span>
        </Button>)
    });
    clearInterval(this.timer);
  }

  stopTimer() {
    this.setState({
      isStoped: true,
      spButton: (
        <Button bsStyle="info" onClick={this.startTimer} disabled>
          <span className="glyphicon glyphicon-triangle-right"></span>
        </Button>),
      rButton: (
        <Button onClick={this.resetTimer}>
          <span className="glyphicon glyphicon-repeat"></span>
        </Button>)
    });
    clearInterval(this.timer);
  }

  render() {
    if (this.state.showTimer) {
      let totalTime = sec2time(this.state.totalSeconds);
      let leftTime = sec2time(this.state.leftSeconds);
      let maxTimeoutTime = sec2time(MAX_TIMEOUT_SECONDS);

      let progressBar;
      let soundBar;
      let leftSeconds = this.state.leftSeconds;
      let totalSeconds = this.state.totalSeconds;

      let now = parseInt(leftSeconds >= 0 ? (100 * leftSeconds / totalSeconds).toFixed(0) : 0);
      if (totalSeconds <= 180) {
        if (leftSeconds >= 60) {
          progressBar = (<ProgressBar bsStyle="info" now={now} />)
        } else if (leftSeconds >= 30) {
          progressBar = (<ProgressBar bsStyle="success" now={now} />)
        } else if (leftSeconds >= 10) {
          progressBar = (<ProgressBar bsStyle="warning" now={now} />)
        } else {
          progressBar = (<ProgressBar bsStyle="danger" now={now} />)
        }
      } else {
        if (leftSeconds >= 120) {
          progressBar = (<ProgressBar bsStyle="info" now={now} />)
        } else if (leftSeconds >= 60) {
          progressBar = (<ProgressBar bsStyle="success" now={now} />)
        } else if (leftSeconds >= 30) {
          progressBar = (<ProgressBar bsStyle="warning" now={now} />)
        } else {
          progressBar = (<ProgressBar bsStyle="danger" now={now} />)
        }
      }

      if (leftSeconds == 0) {
        soundBar = (<Sound url={path.join("media", "alarm-clock-1-m.mp3")}
          playStatus={Sound.status.PLAYING}
          playFromPosition={0}
        />)
      } else if (leftSeconds == -MAX_TIMEOUT_SECONDS) {
        soundBar = (<Sound url={path.join("media", "alarm-clock-1-m.mp3")}
          playStatus={Sound.status.PLAYING}
          playFromPosition={0}
        />)
      }

      let editModal = (
        <Modal show={this.state.showEditModal} onHide={this.closeEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Timer</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form inline>
              <FormGroup controlId="hourInput">
                {' '}
                <FormControl type="text" ref="hourInput" defaultValue={parseInt(totalTime.h)} />
              </FormGroup>{' '}
              <FormGroup controlId="minuteInput">
                {' '}
                <FormControl type="text" ref="minuteInput" defaultValue={parseInt(totalTime.m)} />
              </FormGroup>{' '}
              <FormGroup controlId="secondInput">
                {' '}
                <FormControl type="text" ref="secondInput" defaultValue={parseInt(totalTime.s)} />
              </FormGroup>{' '}

              <hr />

              <FormGroup controlId="formBasicText">
                <ControlLabel>Timer Name:</ControlLabel>{' '}
                <FormControl
                  type="text"
                  ref="timerNameInput"
                  defaultValue={this.state.name}
                  placeholder="Enter text"
                />
              </FormGroup>
            </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" onClick={this.removeTimer}>Remove</Button>
            <Button bsStyle="primary" onClick={this.submitEditModal}>Submit</Button>
          </Modal.Footer>
        </Modal>
      );

      let timeMonitor = () => {
        if (this.state.leftSeconds >= 0) {
          return (
            <h1 style={{ marginTop: "0px", marginBottom: "0px" }}>
              {" " + leftTime.h + ":" + leftTime.m + ":" + leftTime.s}
            </h1>
          );
        } else if (this.state.leftSeconds >= - MAX_TIMEOUT_SECONDS) {
          return (
            <h1 style={{ marginTop: "0px", marginBottom: "0px", background: "lightpink", color: "gray" }}>
              {"-" + leftTime.h + ":" + leftTime.m + ":" + leftTime.s}
            </h1>
          );
        } else {
          return (
            <h1 style={{ marginTop: "0px", marginBottom: "0px", background: "lightpink", color: "gray" }}>
              {"> -" + maxTimeoutTime.h + ":" + maxTimeoutTime.m + ":" + maxTimeoutTime.s}
            </h1>
          );
        }
      };

      return (
        <div>
          <Row>
            <Col xs={8} md={8}>
              {timeMonitor()}
              <p>
                {this.state.name}
                {" ("}
                {totalTime.h + ":" + totalTime.m + ":" + totalTime.s}
                {")  "}
                <Button bsStyle="link" bsSize="small" onClick={this.openEditModal}>
                  <span className="glyphicon glyphicon-time"></span>Edit
                </Button>
              </p>
            </Col>
            <Col xs={4} md={4}>
              <div>

                {this.state.spButton}
                {" "}
                {this.state.rButton}

              </div>
            </Col>
          </Row>

          {progressBar}

          {soundBar}

          {editModal}

        </div>
      )
    } else {
      return (
        <div>
        </div>
      )
    }
  }
}
