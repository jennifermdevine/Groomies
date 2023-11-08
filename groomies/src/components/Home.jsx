import { Helmet } from "react-helmet-async";

export default function Home() {
    return (
        <div className="Home">
            <Helmet>
                <title>Home | Groomies</title>
            </Helmet>
            <h1>Home</h1>
        </div>
    );
}