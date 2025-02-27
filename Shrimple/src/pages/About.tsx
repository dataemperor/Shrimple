
function About() {
    return <>
    <div className="container text-center mt-5">
        <h1 className="mb-4">Shrimple</h1> 
    </div>

    <div className="container">
        <p>
            Shrimple is an Aquaculture Management Application created for gathering information on whether 
            the parameters of a selected environment are suitable for the growth of shrimp. 
            This project was developed by a four person team from the Informatics Institute of Technology for
            the Data Science Group Project.
        </p>

        <p>
            Our aim is to increase the profitability of the Shrimp Aquaculture business through industry related
            predictions that can be used to make better decisions.  
        </p>

        <div className="text-center mt-4">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3270.062302862376!2d79.8598505!3d6.8652714999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25ba4e617b3d9%3A0xd5a3b0418f1cf497!2sInformatics%20Institute%20of%20Technology%20(IIT)!5e1!3m2!1sen!2slk!4v1740682490643!5m2!1sen!2slk" 
            width="600" 
            height="450"
            style={{border:0}} 
            title="IIT"
            loading="lazy"></iframe>
        </div>
    </div>
    </>
}

export default About;