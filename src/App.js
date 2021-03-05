import React, { Component } from 'react';

import Storage from './lib/storage';
import * as moment from 'moment-timezone'
import './App.css';
import Clock from './Clock'
import TimezonePicker from './TimezonePicker'
class App extends Component {
  constructor() {
    super()
    this.state = {
      list: [],
      newTimeZone: ''
    }
    this.selectedZone = null;
  }
  componentDidMount() {
    var list = Storage.getStorage('zoneList') || [];
    this.setState({ list: list })

    setInterval(() => {
      var { list } = this.state;
      var now = new Date();

      list = list.map(item => {
        try {
          var momentObj = moment(new Date(now)).tz(item.timezone);

          item.time = momentObj.format('HH:mm:ss');
          item.hh = momentObj.hour();
          item.mm = momentObj.minute();
          item.ss = momentObj.second();

        } catch (e) { }
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
    this.setState({ list: [...list, this.selectedZone] })
    var tmp = JSON.parse(JSON.stringify(list))
    tmp.push(this.selectedZone)
    Storage.setStorage('zoneList', tmp)
  }

  render() {
    var { list } = this.state;
    return (
      <div className="container d-flex flex-column justify-content-center vh-100" >
        <div className="align-content-center mt-5">
          {list.map((item, i) => {

            var format = 'hh:mm:ss'
            var now = new Date()
            var timeStr = moment(new Date(now)).tz(item.timezone).format('HH:mm:ss')
            var time = moment(timeStr, format)

            var beforeTime = moment('00:00:00', format);
            var afterTime = moment('08:00:00', format);
            var isNight = time.isBetween(beforeTime, afterTime)

            return <div className="card p-2 mb-2" key={i}>
              <div className="d-flex justify-content-between align-items-center ">
                <span className="w-25">{item.country}</span>
                <span className="w-25">{item.timezone}</span>
                <Clock tz={item.timezone} isNight={isNight} className={''} hh={item.hh} mm={item.mm} ss={item.ss} />
                {/* <div style={{ width: '100px', height: '100px', background: 'red' }}></div> */}
                <div className="d-flex align-items-center">
                  <span className="me-3 fs-1">
                    {item.time}
                  </span>
                  <button className="btn btn-danger btn-sm" onClick={() => this.onDeleteClicked(i)} style={{ height: '40px' }}>X</button>
                </div>
              </div>
            </div>

          })}
          <div>
            <button className="btn btn-success btn-sm" onClick={this.onAddClicked} disabled={this.state.newTimeZone.length == 0}>+</button>
            <TimezonePicker onTimezoneSelected={e => this.onTimezoneSelected(e)} />

          </div>
        </div>
      </div>
    );
  }
}

export default App;
