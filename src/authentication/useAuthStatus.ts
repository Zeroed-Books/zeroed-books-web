import { useState } from "react"

const useAuthStatus = () => {
    const [isAuthenticated, setAuthenticated] = useState(true);

    return { isAuthenticated, setAuthenticated };
}

export default useAuthStatus;
