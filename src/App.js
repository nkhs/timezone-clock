import React, { Component } from 'react';

import TimezonePicker from 'react-timezone';
// import { TimezonePicker } from 'react-timezone-picker';
import Storage from './lib/storage';
import * as moment from 'moment-timezone'
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      list: [],
      newTimeZone: ''
    }
  }
  componentDidMount() {
    var list = Storage.getStorage('zoneList') || [];
    this.setState({ list: list })
    setInterval(() => {
      var { list } = this.state;
      var now = new Date();

      list = list.map(item => {
        var time = moment(new Date(now)).tz(item.tz).format('HH:mm:ss')
        item.time = time;
        return item
      })

      this.setState({ list: list })
    }, 1000)
  }

  onTimezoneSelected = (timezone) => {
    this.setState({ newTimeZone: timezone })
  }
  onDeleteClicked(index) {
    var { list } = this.state;
    list.splice(index, 1);
    this.setState({ list: list })
    var tmp = JSON.parse(JSON.stringify(list))

    Storage.setStorage('zoneList', tmp)
  }
  onAddClicked = () => {
    var { newTimeZone } = this.state;
    if (newTimeZone.length == 0) return

    var { list } = this.state;
    this.setState({ list: [...list, { tz: newTimeZone }] })
    var tmp = JSON.parse(JSON.stringify(list))
    tmp.push({ tz: newTimeZone })
    Storage.setStorage('zoneList', tmp)
  }

  render() {
    var { list } = this.state;
    return (
      <div className="container d-flex flex-column justify-content-center vh-100" >
        <div className="align-content-center">
          {list.map((item, i) => {
            return <div className="card p-2 mb-2" key={i}>
              <div className="d-flex justify-content-between align-items-center ">
                <span>{item.tz}</span>
                <div className="d-flex align-items-center">
                  <span className="me-3 fs-1">{item.time}</span>
                  <button className="btn btn-danger btn-sm" onClick={() => this.onDeleteClicked(i)} style={{ height: '40px' }}>X</button>
                </div>
              </div>
            </div>

          })}
          <div>
            <TimezonePicker
              // onChange={this.onTimezoneSelected}
              // defaultValue={'America/New_York'}
              // unselectLabel="No Timezone"
              // style={{
              //   borderRadius: '0.5rem',
              //   background: 'teal',
              //   color: 'white',
              // }}
              value="Asia/Yerevan"
              onChange={this.onTimezoneSelected}
              inputProps={{
                placeholder: 'Select Timezone...',
                name: 'timezone',
              }}
            />
            <button className="btn btn-success btn-sm" onClick={this.onAddClicked} disabled={this.state.newTimeZone.length == 0}>+</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
