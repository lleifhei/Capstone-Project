import React, { useState } from 'react';
import { Camera, Edit, Mail, Globe, MapPin, Calendar, Music, Star, Headphones, Clock } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Rivera',
    title: 'Music Critic & Audio Enthusiast',
    email: 'alex.rivera@musicreview.com',
    website: 'alexreviews.com',
    location: 'Nashville, TN',
    joinDate: 'March 2022',
    bio: 'Passionate music critic with over 8 years of experience reviewing everything from indie rock to experimental jazz. I believe every album tells a story, and I love helping people discover their next favorite sound.',
    favoriteGenres: ['Indie Rock', 'Jazz Fusion', 'Electronic', 'Post-Punk', 'Neo-Soul', 'Math Rock'],
    recentReviews: [
      {
        album: 'Midnight Reverie',
        artist: 'Luna Echo',
        rating: 4.5,
        date: '2025-05-25',
        genre: 'Dream Pop',
        snippet: 'A haunting collection that perfectly captures the essence of late-night introspection...'
      },
      {
        album: 'Broken Frequencies',
        artist: 'Static Void',
        rating: 3.8,
        date: '2025-05-20',
        genre: 'Electronic',
        snippet: 'Ambitious but uneven, with moments of brilliance scattered throughout...'
      },
      {
        album: 'Heritage Sessions',
        artist: 'The Folklore Collective',
        rating: 4.2,
        date: '2025-05-15',
        genre: 'Folk',
        snippet: 'Raw, authentic storytelling backed by masterful acoustic arrangements...'
      }
    ],
    stats: {
      totalReviews: 247,
      averageRating: 3.7,
      hoursListened: 1840,
      followersCount: 2156
    },
    achievements: [
      'Top Reviewer 2024 - Music Discovery Awards',
      'Featured in Rolling Stone\'s "Critics to Watch"',
      'Album of the Year Pick featured on Spotify Editorial',
      '1M+ combined reads across all reviews'
    ],
    topArtists: ['Radiohead', 'Björk', 'Aphex Twin', 'Kendrick Lamar', 'Joni Mitchell'],
    reviewingStyle: 'Technical Analysis & Emotional Impact'
  });

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} className="fill-yellow-400 text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-4 left-6 text-white">
              <Music size={32} className="opacity-80" />
            </div>
          </div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center -mt-20 sm:-mt-16">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
                  <Music size={40} />
                </div>
                <button className="absolute bottom-2 right-2 bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-colors shadow-md">
                  <Camera size={16} />
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-3xl font-bold text-gray-900 border-b-2 border-purple-500 bg-transparent focus:outline-none"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                    )}
                    
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="text-lg text-purple-600 border-b border-gray-300 bg-transparent focus:outline-none mt-1"
                      />
                    ) : (
                      <p className="text-lg text-purple-600 font-medium">{profile.title}</p>
                    )}
                    
                    <p className="text-gray-500 text-sm mt-1">
                      Reviewing Style: {profile.reviewingStyle}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-4 sm:mt-0 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center shadow-md"
                  >
                    <Edit size={16} className="mr-2" />
                    {isEditing ? 'Save Profile' : 'Edit Profile'}
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail size={18} className="mr-3 text-purple-500" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="flex-1 border-b border-gray-300 bg-transparent focus:outline-none"
                    />
                  ) : (
                    <span className="text-sm">{profile.email}</span>
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe size={18} className="mr-3 text-purple-500" />
                  {isEditing ? (
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="flex-1 border-b border-gray-300 bg-transparent focus:outline-none"
                    />
                  ) : (
                    <span className="text-sm text-purple-600 hover:underline cursor-pointer">{profile.website}</span>
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-3 text-purple-500" />
                  <span className="text-sm">{profile.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={18} className="mr-3 text-purple-500" />
                  <span className="text-sm">Member since {profile.joinDate}</span>
                </div>
              </div>
            </div>

           

            

            

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  placeholder="Tell us about your music journey..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              )}
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Headphones size={20} className="mr-2 text-purple-500" />
                Recent Reviews
              </h2>
              <div className="space-y-4">
                {profile.recentReviews.map((review, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 py-2 hover:bg-gray-50 transition-colors rounded-r-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.album}</h3>
                        <p className="text-purple-600 font-medium">{review.artist}</p>
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mt-1">
                          {review.genre}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm font-semibold text-gray-700">{review.rating}</span>
                        </div>
                        <p className="text-gray-500 text-xs flex items-center">
                          <Clock size={12} className="mr-1" />
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm italic">"{review.snippet}"</p>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-purple-600 hover:text-purple-800 font-medium text-sm">
                View All Reviews →
              </button>
            </div>

           
          </div>
        </div>
      </div>
    </div>
    );
    }

export default ProfilePage;