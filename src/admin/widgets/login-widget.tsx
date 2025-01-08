import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { useState } from "react";
import DrawerComponent from "../components/drawer";
import axios from "axios";

import {
    Button,
    Container,
    Heading,
    Input,
    Label,
    Text
  } from "@medusajs/ui";

export let globalToken: string | null = null;

const LoginWidget = () => {
  const [username, setUsername] = useState<string>("apiuser.kadriye");
  const [password, setPassword] = useState<string>("9fd1356bfa0637e9571640d4fe25787c");
  const [division, setDivision] = useState<string>("1");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const formData = new URLSearchParams();
      formData.append("grant_type", "password");
      formData.append("username", username);
      formData.append("password", password);
  
      const response = await axios.post(
        "https://uat.faturaturka.com/im/v2/api/Integration/token",
        formData,
        {
          headers: {
            "division": division,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
  
      const data = response.data;
      globalToken = data.access_token;
      setToken(data.access_token);
  
    } catch (error: any) {
      setError(error.response?.data?.message || "Token could not be received! Please check your information.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <p className="text-center mt-4">
        Your account doesn't have a token? {" "}
        <DrawerComponent title="Get Token" content={
           <Container className="p-8 max-w-md mx-auto">
             <Heading level="h2" className="mb-2">
                New Integration Token
            </Heading>
            <Text className="mb-6">
                Enter your token information
            </Text>
            <form className="space-y-6">
                <div>
                <Label htmlFor="username">Username</Label>
                <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                />
            </div>
            <div>
                <Label htmlFor="division">Division</Label>
                <Input
                id="division"
                type="text"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                placeholder="Enter your division"
                />
            </div>
                <Button onClick={handleLogin} disabled={loading} className="w-full mt-5">
                    {loading ? "Token is being received, please wait..." : "Get Token"}
                </Button>
                {error && <p className="error-text">{error}</p>}
                {token && <p className="success-text">Token received successfully.</p>}
            </form>
            </Container>
            } 
        />
      </p>
    </div> 
  );
};

export const config = defineWidgetConfig({
  zone: "login.after",
});

export default LoginWidget;
