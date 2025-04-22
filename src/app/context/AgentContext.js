"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import getAuthCurrentUser from "../utilites/getAuthCurrentUser";

// Create AgentContext
const AgentContext = createContext();

// Custom hook to use the AgentContext
export const useAgent = () => useContext(AgentContext);

// Provider component
export const AgentProvider = ({ children }) => {
  const [agentId, setAgentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasCheckedAgent = useRef(false); // Prevents multiple executions

  // Function to check if the agent exists or needs to be created
  const checkAgentStatus = async () => {
    if (hasCheckedAgent.current) return; // Guard clause to prevent multiple calls
    hasCheckedAgent.current = true; // Mark as checked

    try {
      const currentUser = await getAuthCurrentUser();
      if (!currentUser) {
        console.warn("No current user found");
        setIsLoading(false);
        return;
      }

      console.log("Current User:", currentUser);

      // Check if the agent exists
      const checkResponse = await fetch(
        `/api/checkAgent?awsId=${currentUser.userId}`
      );
      const checkData = await checkResponse.json();
      console.log("Check Agent Response:", checkData);

      if (checkResponse.ok && checkData.code === 1 && checkData.user?.AgentID) {
        setAgentId(checkData.user.AgentID);
        console.log("Agent ID Found:", checkData.user.AgentID);
      } else {
        // If agent doesn't exist, create a new one
        const createResponse = await fetch(`/api/createAgent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ awsId: currentUser.userId }),
        });

        const createData = await createResponse.json();
        console.log("Create Agent Response:", createData);

        if (createResponse.ok && createData.user?.AgentID) {
          setAgentId(createData.user.AgentID);
          console.log("New Agent ID Created:", createData.user.AgentID);
        } else {
          console.error(
            "Failed to create agent:",
            createData.error || "Unknown error"
          );
        }
      }
    } catch (error) {
      console.error("Error in AgentContext:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run the check when the component mounts
  useEffect(() => {
    checkAgentStatus();
  }, []);

  return (
    <AgentContext.Provider value={agentId}>
      {isLoading ? <p>Loading...</p> : children}
    </AgentContext.Provider>
  );
};
