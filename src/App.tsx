import { useState, useEffect, useCallback } from "react";
import "./App.css";

import { Login } from "@microsoft/mgt-react";
import { Providers, ProviderState } from "@microsoft/mgt-element";
import { Chat, NewChat } from "@microsoft/mgt-chat";
import { Chat as GraphChat } from "@microsoft/microsoft-graph-types";

function useIsSignedIn(): [boolean] {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const updateState = () => {
      const provider = Providers.globalProvider;
      setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
    };

    Providers.onProviderUpdated(updateState);
    updateState();

    return () => {
      Providers.removeProviderUpdatedListener(updateState);
    };
  }, []);

  return [isSignedIn];
}

function App() {
  const [isSignedIn] = useIsSignedIn();
  const [chatId, setChatId] = useState<string>();

  const [showNewChat, setShowNewChat] = useState<boolean>(false);
  const onChatCreated = useCallback((chat: GraphChat) => {
    setChatId(chat.id);
    setShowNewChat(false);
  }, []);

  return (
    <div className="app">
      <header>
        <Login />
      </header>
      <div className="column">
        {isSignedIn && (
          <>
            <button onClick={() => setShowNewChat(true)}>New Chat</button>
            {showNewChat && (
              <NewChat
                onChatCreated={onChatCreated}
                onCancelClicked={() => setShowNewChat(false)}
                mode="auto"
              />
            )}

            {chatId && <Chat chatId={chatId} />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
