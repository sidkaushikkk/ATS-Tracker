import { useNavigate } from "react-router-dom";
import "./Box.css";

function Box(){
    const navigate = useNavigate();
    return (
        <div className="Box">
            <div className="content">
                <h2>Does your Resume really stand out?</h2>
                <br/>


                <p>Over 75% of resumes are filtered out by Applicant Tracking Systems before reaching a recruiter.
                     Find out how your resume performs—and how to improve it.</p>

                <div className="box-buttons">

                    <button className="button">Generate Resume Analysis </button>
                    <a href = "/about-ats.html"><button className="button">About ATS</button></a>

                </div>

                <br/>
                <br/>
              <div className = "generate-resume">
                  <p>Don't have a resume ? <button onClick={() => navigate("/generate-resume")}>Generate Resume</button></p>  
                </div>
            </div>

            <div className="image">
                <img className = "ats-image" src="ats-image.png"></img>
            </div>
        </div>
    )
}

export default Box;
