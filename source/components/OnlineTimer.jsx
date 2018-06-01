import React, { Component } from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import SimpleTimer from './SimpleTimer.jsx';

const defaultParams = [
  { name: "Reception", totalSeconds: 600 },
  { name: "Toastmaster and Host Introduciton", totalSeconds: 120 },
  { name: "Meeting Introduciton", totalSeconds: 120 },
  { name: "Introduce guests", totalSeconds: 300 },
  { name: "Warm-up", totalSeconds: 420 },

  { name: "General Evaluator", totalSeconds: 60 },
  { name: "Timer", totalSeconds: 60 },
  { name: "Ah counter", totalSeconds: 60 },
  { name: "Grammarian", totalSeconds: 120 },

  { name: "Table Topic", totalSeconds: 1200 },
  { name: "Table Topic Speaker", totalSeconds: 120 },

  { name: "Evaluator", totalSeconds: 30 },
  { name: "Prepared Speech", totalSeconds: 420 },
  { name: "Q&A", totalSeconds: 120 },

  { name: "Table Topic Evaluation", totalSeconds: 300 },
  { name: "Speech Evaluation", totalSeconds: 180 },

  { name: "General Evalution", totalSeconds: 420 },
  { name: "Timer", totalSeconds: 120 },
  { name: "Ah counter", totalSeconds: 120 },
  { name: "Grammarian", totalSeconds: 180 },

  { name: "Voting Time", totalSeconds: 60 },
  { name: "New Member / Let Guests Talk", totalSeconds: 420 },
  { name: "Reward", totalSeconds: 300 },
  { name: "Closing Remarks", totalSeconds: 60 },
];

const selfdefineParams = [
  { name: "Timer 1", totalSeconds: 120 }
];

export default class TmcTimer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      num: 0,
      pattern: "",
      selfdefineParams: Object.create(selfdefineParams),
      timerListParams: Object.create(defaultParams)
    };
  }

  addTimer() {
    let num = this.state.num + 1;
    let timerListParams = this.state.timerListParams;
    timerListParams.push({ name: "Timer " + num, totalSeconds: 120 });

    this.setState({
      num: num,
      timerListParams: timerListParams
    });
  }

  editTimer(index, newParam) {
    this.state.timerListParams[index] = newParam;
  }

  removeTimer(index) {
    if (index > -1) {
      this.state.timerListParams.splice(index, 1);
    }
  }

  render() {
    let timerList = [];
    let num = 0;
    let timerListParams = this.state.timerListParams;
    timerList.push(timerListParams.map((param, index) => {
      num = num + 1;
      return (<SimpleTimer key={param.name + num}
                           name={param.name}
                           totalSeconds={param.totalSeconds}
                           onEdit={this.editTimer.bind(this, index)}
                           onRemove={this.removeTimer.bind(this, index)} />)
    }));

    return (
      <Grid>
        <Row>
          <Col xs={12} xsOffset={0} md={10} mdOffset={1}>

            <PageHeader>Online Timer</PageHeader>

            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Firstly, Select Pattern</ControlLabel>
              <FormControl componentClass="select" placeholder="select"
                           onChange={(e) => {
                               if (this.state.pattern !== e.target.value) {
                                 this.state.pattern = e.target.value;
                                 if (this.state.pattern === "default")
                                   this.setState({ num: defaultParams.length, timerListParams: Object.create(defaultParams) });
                                 else if (this.state.pattern === "selfdefine")
                                   this.setState({ num: this.state.selfdefineParams.length, timerListParams: this.state.selfdefineParams });
                                 else
                                   alert("Error input!!!");
                               }
                             }}>
                <option defaultValue value="default">default, for ToastMaster</option>
                <option value="selfdefine">self-defined auto save</option>
              </FormControl>
            </FormGroup>

            {timerList}

            <Button bsStyle="link" onClick={this.addTimer.bind(this)}>+ Add another timer</Button>

          </Col>
        </Row>
      </Grid>
    );
  }
}
