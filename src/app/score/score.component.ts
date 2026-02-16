import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {

  runs = 0;
  wickets = 0;
  overs = 0;
  balls = 0;

  maxOvers: number | null = null;
  matchStarted = false;

  overWiseBalls: string[][] = [];
  currentOverBalls: string[] = [];

  history: any[] = [];

  /* ---------- LOAD DATA ON REFRESH ---------- */
  ngOnInit() {
    const saved = localStorage.getItem('bccricket_score');
    if (saved) {
      const data = JSON.parse(saved);
      Object.assign(this, data);
    }
  }

  /* ---------- SAVE DATA ---------- */
  saveData() {
    localStorage.setItem(
      'bccricket_score',
      JSON.stringify({
        runs: this.runs,
        wickets: this.wickets,
        overs: this.overs,
        balls: this.balls,
        maxOvers: this.maxOvers,
        matchStarted: this.matchStarted,
        overWiseBalls: this.overWiseBalls,
        currentOverBalls: this.currentOverBalls,
        history: this.history
      })
    );
  }

  /* ---------- MATCH ---------- */
  startMatch() {
    if (!this.maxOvers) return;
    this.matchStarted = true;
    this.saveData();
  }

  /* ---------- HISTORY ---------- */
  saveHistory() {
    this.history.push(JSON.stringify({
      runs: this.runs,
      wickets: this.wickets,
      overs: this.overs,
      balls: this.balls,
      overWiseBalls: JSON.parse(JSON.stringify(this.overWiseBalls)),
      currentOverBalls: [...this.currentOverBalls]
    }));
  }

  undoLastBall() {
    if (this.history.length === 0) return;
    const last = JSON.parse(this.history.pop());
    Object.assign(this, last);
    this.saveData();
  }

  /* ---------- SCORING ---------- */
  addRun(run: number) {
    if (!this.canPlay()) return;
    this.saveHistory();
    this.runs += run;
    this.currentOverBalls.push(run.toString());
    this.addBall();
    this.saveData();
  }

  dotBall() {
    if (!this.canPlay()) return;
    this.saveHistory();
    this.currentOverBalls.push('0');
    this.addBall();
    this.saveData();
  }

  wideBall() {
    if (!this.canPlay()) return;
    this.saveHistory();
    this.runs += 0;
    this.currentOverBalls.push('WD');
    this.saveData();
  }

  noBall(extraRuns: number = 1) {
  if (!this.canPlay()) return;

  this.saveHistory();

  // 1 run for no ball compulsory
  this.runs += 0;

  // If batsman also scored runs (like 2,4,6)
  this.runs += extraRuns;

  // Ball count increment cheyyakudadhu ❌
  // this.balls++  <-- THIS SHOULD NOT BE HERE

  this.currentOverBalls.push('NB');

  this.saveData();
}
runOutAfterRun(runCompleted: number) {
  if (!this.canPlay()) return;

  this.saveHistory();

  // Completed runs add avvali
  this.runs += runCompleted;

  // Wicket increase
  this.wickets++;

  this.currentOverBalls.push(runCompleted + 'RO');

  // Proper ball count logic
  this.addBall();   // ✅ IMPORTANT

  this.saveData();
}



  addWicket() {
    if (!this.canPlay()) return;
    this.saveHistory();
    this.wickets++;
    this.currentOverBalls.push('W');
    this.addBall();
    this.saveData();
  }

  addBall() {
    this.balls++;
    if (this.balls === 6) {
      this.overWiseBalls.push([...this.currentOverBalls]);
      this.currentOverBalls = [];
      this.overs++;
      this.balls = 0;
    }
  }

  canPlay(): boolean {
    return (
      this.matchStarted &&
      this.wickets < 10 &&
      (this.maxOvers === null || this.overs < this.maxOvers)
    );
  }

  /* ---------- RESET ---------- */
  resetMatch() {
    localStorage.removeItem('bccricket_score');
    this.runs = this.wickets = this.overs = this.balls = 0;
    this.maxOvers = null;
    this.matchStarted = false;
    this.overWiseBalls = [];
    this.currentOverBalls = [];
    this.history = [];
  }
}
