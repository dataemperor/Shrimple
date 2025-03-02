import MemberCard from "../components/MemberCard";

function Contact(){
    return (
        <>
            <div className="container text-center mt-5">
                <h1 className="mb-4">Contact Us!</h1>
            </div>
            <div className="row mt-5 d-flex justify-content-center g-4">
                <div className="col-md-6">
                    <MemberCard name="Maleesha Diunugala" email="maleesha.20232594@iit.ac.lk" contactNumber="+94 074 210 5104" linkedIn="https://www.linkedin.com/in/maleesha-diunugala-b78b052b3/"/>
                </div>
                <div className="col-md-6">
                    <MemberCard name="Chanmini Weerakoon" email="chanmini.20232676@iit.ac.lk" contactNumber="+94 070 778 6399" linkedIn="https://www.linkedin.com/in/chanminiweerakoon/"/>
                </div>

                <div className="col-md-6">
                    <MemberCard name="Shaithra Vilvarashah" email="shaithra.20232694@iit.ac.lk" contactNumber="+94 071 359 4060" linkedIn="https://www.linkedin.com/in/shaithra-vilvarashah-6388992b2/"/>
                </div>

                <div className="col-md-6">
                    <MemberCard name="Jayathu Fernando " email="jayathu.20220520@iit.ac.lk" contactNumber="+94 071 630 6373" linkedIn="www.linkedin.com/in/jayathu-fernando"/>
                </div>
            </div>
        </>
    );
}

export default Contact;