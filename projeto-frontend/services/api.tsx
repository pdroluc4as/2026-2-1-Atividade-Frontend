import axios from "axios";

const api = axios.create({
    baseURL: "https://dummyjson.com/",
    headers: {
        'Content-Type': 'application/json',
    },
});

interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}


const userAuth = async (username:string, password:string): Promise<AuthResponse> => {
    try {
        const resposta = await api.post<AuthResponse>("/auth/login",{username:username, password:password})
        console.log("Resposta da API:", resposta.data); 

        return resposta.data;
    }
    catch(error) {
        console.error("Erro no envio:", error);
        throw error;
    }
}

export default api;
export { userAuth };