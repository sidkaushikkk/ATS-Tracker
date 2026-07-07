import "./Box.css";

function Box(){
    return (
        <div className="Box">
            <div className="content">
                <h1>Is your Resume </h1>
                <br/>
                <br/>
                <h1>good enough?</h1>
                <br/>
                <br/>
                <br/>


                <p>Over 75% of resumes are filtered out by Applicant Tracking Systems before reaching a recruiter.
                     Find out how your resume performs—and how to improve it.</p>

                <br/>
                <br/>

                <div className="box-buttons">

                    <button className="button">Generate Resume Analysis </button>
                    <button className="button">About ATS</button>

                </div>

                <br/>
                <br/>
                <br/>
                <br/>

              <div className = "generate-resume">
                  <p>Don't have a resume ? <button>Generate Resume</button></p>  
                </div>
            </div>

            <div className="image">
                <img className = "ats-image" src="ats-image.png"></img>
            </div>
        </div>
    )
}

export default Box;
