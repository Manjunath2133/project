// client/src/components/ProfileDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileDetail = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    picture: '',
    bio: '',
    skills: '',
    projects: '',
    achievements: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/profiles/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleEdit = () => {
    setEditing(true);
    setFormData({
      picture: profile.picture,
      bio: profile.bio,
      skills: profile.skills.join(', '),
      projects: profile.projects.join(', '),
      achievements: profile.achievements.join(', '),
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/profiles/${userId}`, formData);
      setEditing(false);
      // Optionally, fetch updated profile data after submission
      const response = await axios.get(`/api/profiles/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Profile Details</h2>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
            placeholder="Profile Picture URL"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
          />
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Skills (comma-separated)"
          />
          <input
            type="text"
            name="projects"
            value={formData.projects}
            onChange={handleChange}
            placeholder="Projects (comma-separated)"
          />
          <input
            type="text"
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            placeholder="Achievements (comma-separated)"
          />
          <button type="submit">Update Profile</button>
        </form>
      ) : (
        <div>
          <img src={profile.picture} alt="Profile" />
          <p>Bio: {profile.bio}</p>
          <p>Skills: {profile.skills.join(', ')}</p>
          <p>Projects: {profile.projects.join(', ')}</p>
          <p>Achievements: {profile.achievements.join(', ')}</p>
          <button onClick={handleEdit}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;
