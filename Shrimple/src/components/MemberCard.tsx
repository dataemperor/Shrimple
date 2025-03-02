const MemberCard = (
    {name, contactNumber, email, linkedIn}: 
    {name:string, contactNumber:string, email:String, linkedIn:string}) => {
    return (
        <div className="card p-3">
            <h5>{name}</h5>
            <p>Number: {contactNumber}</p>
            <p>Email: {email}</p>
            <p>LinkedIn:{" "}
            <a href={linkedIn} target="_blank" rel="noopener noreferrer">
                {linkedIn}
                </a></p>
        </div>
    )
}

export default MemberCard;