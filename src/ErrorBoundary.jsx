import { useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
    const error = useRouteError();
    console.error("Error caught by ErrorBoundary:", error);

    return (
        <div className="text-center mt-20">
            <h1 className="text-red-500 text-3xl font-bold">Oops! Something went wrong.</h1>
            <p className="text-gray-700">{error.statusText || error.message}</p>
            <a href="/" className="text-blue-500">Go Back Home</a>
        </div>
    );
};

export default ErrorBoundary;
