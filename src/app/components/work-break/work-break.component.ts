import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-work-break',
  templateUrl: './work-break.component.html',
  styleUrls: ['./work-break.component.scss']
})

export class WorkBreakComponent implements OnInit {

  @ViewChild('audioOption')
  audioPlayerRef!: ElementRef;
  
  breakTime = 900;
  interval: any;
  
  minutes: number = 15;
  seconds: number = 0;

  minutesToShow: string = "15";
  secondsToShow: string = "00";

  pauseStarted: boolean = false;
  paused: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  startTimer() {
    this.pauseStarted = true;
    this.paused = false;

    this.interval = setInterval(() => {
      if(this.breakTime > 0 && this.paused == false) {
        this.breakTime--;
        this.minutes =  Math.floor(this.breakTime / 60);
        this.seconds = this.breakTime % 60;
        this.convertNumbersToShow();
      } else if (this.breakTime == 0) {
        this.makeNoise();
      }
    }, 1000)
  }

  pauseTimer() {
    this.paused = true;
  }

  resumeTimer() {
    this.paused = false;
  }

  stopTimer() {
    this.pauseStarted = false;
    this.breakTime = 900;
    this.minutesToShow = "15";
    this.secondsToShow = "00";
    clearInterval(this.interval);
  }

  convertNumbersToShow() {
    this.minutesToShow = this.minutes.toString();
    this.secondsToShow = this.seconds.toString();

    if (this.seconds < 10) {
      this.secondsToShow = "0" + this.secondsToShow;
    }
  }

  makeNoise() {
    this.audioPlayerRef.nativeElement.play();
    this.pauseStarted = false;
    this.breakTime = 900;
    this.stopTimer();
  }

}
