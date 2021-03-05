import React, { Component } from 'react';
import * as moment from 'moment-timezone'

class Clock extends Component {
    constructor(props) {
        super(props)

        this.selectedZone = null;
        this.ref = React.createRef()
        this.ctx;
        this.radius = 10
    }

    componentWillReceiveProps(nextProps) {
        if (this.ctx == null) return
        this.drawFace(this.ctx, this.radius);
        this.drawNumbers(this.ctx, this.radius);
        this.drawTime(this.ctx, this.radius);
    }

    componentDidMount() {
        var canvas = this.ref.current
        this.ctx = canvas.getContext("2d");
        var ctx = this.ctx;
        var radius = canvas.height / 2;

        ctx.translate(radius, radius);
        ctx.imageSmoothingEnabled = true;
        radius = radius * 0.90
        this.radius = radius
        this.drawFace(ctx, radius);
        this.drawNumbers(ctx, radius);
        this.drawTime(ctx, radius);

    }

    drawFace = (ctx, radius) => {
        var bgColor = this.props.isNight ? '#333' : 'lightgray'
        var grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
        grad.addColorStop(0, bgColor);
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, bgColor);
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius * 0.1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    }

    drawNumbers = (ctx, radius) => {
        var ang;
        var num;
        ctx.font = radius * 0.15 + "px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        // var tz = self.props.tz;
        // var today = new Date()
        // var now = moment(new Date(today)).tz(tz).toDate();//.format('HH:mm:ss')
        // var mmObj = moment(new Date(today)).tz(tz)
        // var kk = moment(new Date(today)).tz(tz).format('HH:mm:ss')

        // var now = new Date();
        var hour = this.props.hh;
        var after12 = hour >= 12
        var ADD = 0
        if (after12) ADD = 12;
        for (num = ADD + 1; num < ADD + 13; num++) {
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText((num % 24).toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }
    }

    drawTime = (ctx, radius) => {
        var tz = this.props.tz;

        var today = new Date()

        var mmObj = moment(new Date(today)).tz(tz)

        var hour = this.props.hh;

        var minute = this.props.mm;
        var second = this.props.ss;
        //hour
        hour = hour % 12;
        hour = (hour * Math.PI / 6) +
            (minute * Math.PI / (6 * 60)) +
            (second * Math.PI / (360 * 60));
        this.drawHand(ctx, hour, radius * 0.5, radius * 0.07);
        //minute
        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        this.drawHand(ctx, minute, radius * 0.8, radius * 0.07);
        // second
        second = (second * Math.PI / 30);
        this.drawHand(ctx, second, radius * 0.9, radius * 0.02);
    }

    drawHand = (ctx, pos, length, width) => {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }
    render() {
        return <>
            <canvas ref={this.ref} width="140" height="140" style={{ backgroundColor: this.props.isNight ? '#333' : 'lightgray', display: 'block' }} className='d-block' />
        </>
    }
}

export default Clock