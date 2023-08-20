import type { TweetModel } from 'commonTypesWithClient/models';
import { useAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import { BasicHeader } from '../@components/BasicHeader/BasicHeader';
import styles from './index.module.css';
interface ChatWindowProps {
  messages: string[];
  name: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages: initialMessages, name }) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [messagesList, setMessagesList] = useState<string[]>([]);

  const [user] = useAtom(userAtom);
  const [tweetBox, setTweetBox] = useState<TweetModel[] | undefined>();
  const [messages, setMessages] = useState<string[]>(initialMessages);

  const fetchTweet = async () => {
    try {
      setTweetBox(undefined);
      const res = await apiClient.trends.$get().catch(returnNull);
      if (res !== null) {
        const nweMessageList = res.map((tweet) => tweet.content);
        setMessagesList((prevList) => [...prevList, ...nweMessageList]);
      }
    } catch (error) {
      console.log('error', error);
      setTweetBox([]);
    }
  };
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // if (!user) return <Loading visible />;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      fetchTweet();
    }
  }, [user]);
  return (
    <>
      {user && <BasicHeader user={user} />}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button onClick={fetchTweet}>Tweets</button>
      </div>

      <div className={styles.chatWindow}>
        <div className={styles.header}>{name}</div>
        <div className={styles.messages}>
          {messages.map((message, index) => (
            <div key={index} className={styles.message}>
              {message}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.footer}>
          <input className={styles.inputField} placeholder="Type a message..." />
        </div>
      </div>
    </>
  );
};

const LangChain = () => {
  // 3つの異なるメッセージリスト

  // const messagesList1 = ['FXを買いました。', 'FXを売りました。', 'FXを買いました。'];
  // const messagesList2 = ['FXを売りました。', 'FXを買いました。'];
  // const messagesList3 = [
  //   'FXを買いました。',
  //   'FXを売りました。',
  //   'FXを売りました。',
  //   'FXを買いました。',
  //   'FXを買いました。',
  //   'FXを売りました。',
  //   'FXを売りました。',
  //   'FXを買いました。',
  //   'FXを買いました。',
  //   'FXを売りました。',
  //   'FXを売りました。',
  //   'FXを買いました。',
  // ];
  // 将来このListをuseStateにしてバックエンドから情報を持ってきてListに入れる。
  // オセロのLINE画面と同じ仕組み

  return (
    <div className={styles.container}>
      {/* <ChatWindow name="A" messages={messagesList} /> */}
      {/* <ChatWindow name="B" messages={messagesList2} />
      <ChatWindow name="C" messages={messagesList3} /> */}
    </div>
  );
};
export default LangChain;
