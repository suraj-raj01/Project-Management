import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

type User = {
    name: string;
    email: string;
    _id: string;
    role: string;
} | null;

type AuthContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
};

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const AuthProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [user, setUser] = useState<User>(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within an AuthProvider"
        );
    }
    return context;
};