import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'

interface RandomUser {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string | number;
  };
  email: string;
  login: {
    uuid: string;
  };
  dob: {
    date: string;
    age: number;
  };
  phone: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

const RandomUserList = () => {
  const [users, setUsers] = useState<RandomUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedUserIds, setExpandedUserIds] = useState<string[]>([]);

  const fetchRandomUsers = async () => {
    try {
      const response = await axios.get<{ results: RandomUser[] }>('https://randomuser.me/api/', {
        params: {
          results: 10,
        },
      });
      setUsers(response.data.results);
    } catch (error) {
      setError('Error loading users.');
    }
  };

  useEffect(() => {
    fetchRandomUsers();
  }, []);

  const toggleExpand = (uuid: string) => {
    if (expandedUserIds.includes(uuid)) {
      setExpandedUserIds(expandedUserIds.filter((id) => id !== uuid));
    } else {
      setExpandedUserIds([...expandedUserIds, uuid]);
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>List of Random Users</h2>
      <div className="user-grid">
        {users.map((user) => (
          <div key={user.login.uuid} className="user-grid--card">
            <img src={user.picture.large} alt={`${user.name.first}'s avatar`} />          
            <p className='user-name'>{`${user.name.title} ${user.name.first}  ${user.name.last}`}</p>
            <p>{user.email}</p>

            <button onClick={() => toggleExpand(user.login.uuid)}>
              {expandedUserIds.includes(user.login.uuid) ? '-' : '+'}
            </button>
            
            {expandedUserIds.includes(user.login.uuid) && (
              <div className="user-grid--card-toExpand">
                <p>📍 {`${user.location.street.number} ${user.location.street.name}`}</p>
                <p>{`${user.location.city}, ${user.location.country}`}</p>
                <p>☎️ {`${user.phone}`}</p>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default RandomUserList;
