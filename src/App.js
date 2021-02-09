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
    this.selectedZone = null;
  }
  componentDidMount() {
    var $ = window.$
    $('#picker').timezonePicker({
      hoverText: function (e, data) {
        return (data.timezone + " (" + data.zonename + ")");
      },
      defaultValue: { value: "IN", attribute: "country" }
    });
    var self = this;
    $('#picker').on("map:value:changed", function () {
      var value = $('#picker').data('timezonePicker').getValue();
      if (value[0]) value = value[0]
      if (value == null) return;

      self.selectedZone = value
      self.onTimezoneSelected(value.timezone)
    });

    var list = Storage.getStorage('zoneList') || [];
    this.setState({ list: list })
    setInterval(() => {
      var { list } = this.state;
      var now = new Date();

      list = list.map(item => {
        try {
          var time = moment(new Date(now)).tz(item.timezone).format('HH:mm:ss')
          item.time = time;
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
        <div className="align-content-center">
          {list.map((item, i) => {
            return <div className="card p-2 mb-2" key={i}>
              <div className="d-flex justify-content-between align-items-center ">
                <span>{item.country}</span>
                <span>{item.timezone}</span>
                <div className="d-flex align-items-center">
                  <span className="me-3 fs-1">{item.time}</span>
                  <button className="btn btn-danger btn-sm" onClick={() => this.onDeleteClicked(i)} style={{ height: '40px' }}>X</button>
                </div>
              </div>
            </div>

          })}
          <div>
            <button className="btn btn-success btn-sm" onClick={this.onAddClicked} disabled={this.state.newTimeZone.length == 0}>+</button>
            <div id="picker"></div>
            {/* <TimezonePicker
              value="Asia/Yerevan"
              onChange={this.onTimezoneSelected}
              inputProps={{
                placeholder: 'Select Timezone...',
                name: 'timezone',
              }}
            /> */}

          </div>
        </div>
      </div>
    );
  }
}

export default App;
