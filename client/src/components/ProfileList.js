// client/src/components/ProfileList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('/api/profiles');
        setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div>
      <h2>Profiles</h2>
      <ul>
        {profiles.map(profile => (
          <li key={profile._id}>
            <Link to={`/profiles/${profile._id}`}>{profile.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileList;
