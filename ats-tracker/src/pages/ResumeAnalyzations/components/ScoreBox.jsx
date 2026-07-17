import "./ScoreBox.css" ;
import Gauge from "./Gauge";

export default function ScoreBox(){

    return(
        <>
        <h1 className="landing-text">Welcome to ATS Score Analyzer. </h1>

        <div className="ats-score-box">
            <h1>Your ATS Score is  </h1>
            <Gauge/>
        </div>

        <div className = "resume-box">

        </div>
        </>
    )
}