import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { ProgressBar, Modal } from 'react-bootstrap';

export default class SimpleTimer extends React.Component {
  constructor (props) {
    super(props);

    this.tick = this.tick.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.submitEditModal = this.submitEditModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.removeTimer = this.removeTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);

    let leftSeconds = props.leftSeconds ? props.leftSeconds : props.totalSeconds;

    this.state = {
      name: props.name,
      showEditModal: false,
      showTimer: true,
      isStoped: false,
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

  componentWillUnmount () {
    clearInterval(this.timer);
  }

  componentDidUpdate () {
    if (!this.state.isStoped && this.state.leftSeconds <= -30)
      this.stopTimer();
  }

  tick () {
    this.setState({leftSeconds: (this.state.leftSeconds - 1)});
  }

  closeEditModal () {
    this.setState({showEditModal: false});
  }

  submitEditModal () {
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

  openEditModal () {
    this.setState({showEditModal: true});
  }

  removeTimer () {
    this.setState({showTimer: false});

    this.props.onRemove();

    clearInterval(this.timer);
  }

  startTimer () {
    this.setState({
      spButton: (
        <Button bsStyle="primary" onClick={this.pauseTimer}>
          <span className="glyphicon glyphicon-pause"></span>
        </Button>),
      rButton: (
        <Button onClick={this.resetTimer}>
          <span className="glyphicon glyphicon-repeat"></span>
        </Button>)
    });
    clearInterval(this.timer);
    this.timer = setInterval(this.tick, 1000);
  }

  pauseTimer () {
    this.setState({
      spButton: (
        <Button bsStyle="info" onClick={this.startTimer}>
          <span className="glyphicon glyphicon-triangle-right"></span>
        </Button>)
    });
    clearInterval(this.timer);
  }

  resetTimer () {
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

  stopTimer () {
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

  render () {
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
        { h: pad(h, 2), m: pad(m, 2), s: pad(s, 2)}
      )
    }

    if (this.state.showTimer) {
      let totalTime = sec2time(this.state.totalSeconds);
      let leftTime = sec2time(this.state.leftSeconds);

      let progressBar;
      let leftSeconds = this.state.leftSeconds;
      let totalSeconds = this.state.totalSeconds;

      let now = parseInt(leftSeconds >= 0 ? (100 * leftSeconds / totalSeconds).toFixed(0) : 0);
      if (totalSeconds <= 180) {
        if (leftSeconds >= 60)
          progressBar = (<ProgressBar bsStyle="info" now={now} />)
        else if (leftSeconds >= 30)
          progressBar = (<ProgressBar bsStyle="success" now={now} />)
        else if (leftSeconds >= 10)
          progressBar = (<ProgressBar bsStyle="warning" now={now} />)
        else
          progressBar = (<ProgressBar bsStyle="danger" now={now} />)
      } else {
        if (leftSeconds >= 120)
          progressBar = (<ProgressBar bsStyle="info" now={now} />)
        else if (leftSeconds >= 60)
          progressBar = (<ProgressBar bsStyle="success" now={now} />)
        else if (leftSeconds >= 30)
          progressBar = (<ProgressBar bsStyle="warning" now={now} />)
        else
          progressBar = (<ProgressBar bsStyle="danger" now={now} />)
      }

      let editModal = (
        <Modal show={this.state.showEditModal} onHide={this.closeEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Timer:</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <input ref="hourInput" type="text" defaultValue={parseInt(totalTime.h)} />
            {" : "}
            <input ref="minuteInput" type="text" defaultValue={parseInt(totalTime.m)} />
            {" : "}
            <input ref="secondInput" type="text" defaultValue={parseInt(totalTime.s)} />

            <hr />

            <label>Timer Name:</label>
            <input ref="timerNameInput" type="text" defaultValue={this.state.name} />

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.submitEditModal}>Submit</Button>
          </Modal.Footer>
        </Modal>
      );

      return (
        <div>
          <Row>
            <Col xs={8} md={8}>
              {
                (this.state.leftSeconds >= 0) ?
                <h1 style={{marginTop: "0px", marginBottom: "0px"}}>
                  {" " + leftTime.h + ":" + leftTime.m + ":" + leftTime.s}
                </h1>
                :
                <h1 style={{marginTop: "0px", marginBottom: "0px", background: "lightpink", color: "gray"}}>
                  {"-" + leftTime.h + ":" + leftTime.m + ":" + leftTime.s}
                </h1>
              }
          <p>
            {this.state.name}
            {" ("}
            {totalTime.h + ":" + totalTime.m + ":" + totalTime.s}
            {")  "}
            <Button bsStyle="link" bsSize="small" onClick={this.openEditModal}>
              <span className="glyphicon glyphicon-time"></span>Edit
            </Button>
            {" | "}
            <Button bsStyle="link" bsSize="small" onClick={this.removeTimer}>Remove</Button>
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
