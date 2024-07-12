// client/src/components/ProfileForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileForm = ({ profileId, token }) => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState('');
  const [achievements, setAchievements] = useState('');
  const [picture, setPicture] = useState(null);

  useEffect(() => {
    if (!profileId) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/profiles/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setUsername(data.username);
        setBio(data.bio);
        setSkills(data.skills);
        setProjects(data.projects);
        setAchievements(data.achievements);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [profileId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    formData.append('skills', skills);
    formData.append('projects', projects);
    formData.append('achievements', achievements);
    if (picture) {
      formData.append('picture', picture);
    }

    try {
      const response = await axios.put(`/api/profiles/${profileId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <input
        type="text"
        placeholder="Skills"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <input
        type="text"
        placeholder="Projects"
        value={projects}
        onChange={(e) => setProjects(e.target.value)}
      />
      <input
        type="text"
        placeholder="Achievements"
        value={achievements}
        onChange={(e) => setAchievements(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setPicture(e.target.files[0])}
      />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default ProfileForm;
