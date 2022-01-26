import { useState } from "react"

const useAuthStatus = () => {
    const [isAuthenticated, setAuthenticated] = useState(false);

    return { isAuthenticated, setAuthenticated };
}

export default useAuthStatus;
