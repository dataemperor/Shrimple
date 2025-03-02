const Form = () => {
    return(
        <form>
            <div className="mb-3">
                <label className="form-label" htmlFor="inputName">Name</label>
                <input type="name" className="form-control" id="inputName"/>
            </div>

            <div className="mb-3">
                <label className="form-label" htmlFor="inputEmail">Email</label>
                <input type="email" className="form-control" id="inputEmail"/>
            </div>

            <div className="mb-3">
                <label className="form-label" htmlFor="inputMessage">Message</label>
                <input type="message" className="form-control" id="inputMessage"/>
            </div>
        </form>
    );
}

export default Form;