import { Link } from "react-router-dom";

export const Error = () => {
    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        textAlign: 'center'
    };

    const headingStyle = {
        fontSize: '4rem'
    };

    const leadStyle = {
        fontSize: '1.5rem'
    };

    return (
        <div style={containerStyle}>
            <div>
                <h1 style={headingStyle}><strong>¡Vaya, vaya, vaya! </strong></h1>
                <p style={leadStyle}>Parece que esta página se perdió en el ciberespacio. Pero no te preocupes, encontraremos el camino de
                    <Link className="text-decoration-none" to={`/`}><span>vuelta.</span></Link>
                </p>
            </div>
        </div>
    );
}
