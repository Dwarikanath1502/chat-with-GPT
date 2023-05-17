import React, { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

const API_KEY = "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"


const App = () => {

  const [messages, setMessages] = useState([
    {
      message: "I am developed by Dwarikanath. Ask me anything I'll happy to help",
      sender: "ChatGPT",
      // sentTime: "just now"
    }
  ])
  const [typing, setTyping] = useState(false)

  const handleSend = async (message) => {
    const newMessage = {
      message,
      sender: "user",
      direction: "outgoing"
    };

    const newMessages = [...messages, newMessage] //all old msg + new msg

    // update message state
    setMessages(newMessages);

    // set typing indicator
    setTyping(true);

    // process message tof chatGPT
    await processMessageToChatGPT(newMessages);


  }

  async function processMessageToChatGPT(chatMessages) {
    //  chatMessages {sender: "user" or "chatGPT", messaege: "The message content here"}
    // apiMessages{ role: "user" or "assistant", content: "The message is here"}

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant"
      } else {
        role = "user"
      }
      return { role: role, content: messageObject.message }
    })

    // role : "user" -> msg from user, "assistant"-> response from chatGPT
    // "system"-> generally one initial message defining how we want to talk to chatGPT

    const systemMessage = {
      role: "system",
      content: "Expalin all concepts like I am 10 year old."
    }



    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages //[this is our msg fom chat with chatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      // console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages, {
          // message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]
      )
      setTyping(false);
    })
  }

  return (
    <div className='App'>
      <div style={{ position: 'relative', height: '100vh' }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator={typing ? <TypingIndicator content='Dwarikanath is typing...' /> : null}
              scrollBehavior='smooth'
            >
              {messages.map((message, index) => {
                return <Message key={index} model={message} />
              })}
            </MessageList>
            <MessageInput
              placeholder='Type here...'
              onSend={handleSend}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App